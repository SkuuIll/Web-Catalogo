import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/api-utils';

type GeneratedProductCopy = {
  shortDescription: string;
  description: string;
  whatsappMessage: string;
};

function buildPrompt({
  name,
  categoryName,
  price,
  stock,
  brand,
  model,
  sizes,
  colors,
  specs,
}: {
  name: string;
  categoryName?: string;
  price?: string | number;
  stock?: string | number;
  brand?: string;
  model?: string;
  sizes?: string;
  colors?: string;
  specs?: string;
}) {
  return `Actúa como especialista senior en ecommerce, ventas por WhatsApp y SEO para Argentina.

Objetivo:
Crear una publicación lista para vender, clara y confiable, usando SOLO datos razonables a partir de la información recibida.

Datos disponibles:
- Producto: "${name}"
- Categoría: "${categoryName || 'Sin categoría especificada'}"
- Marca: "${brand || 'Sin marca especificada'}"
- Modelo: "${model || 'Sin modelo especificado'}"
- Precio: "${price || 'Sin precio especificado'}"
- Stock: "${stock || 'Sin stock especificado'}"
- Talles / variantes: "${sizes || 'Sin talles especificados'}"
- Colores: "${colors || 'Sin colores especificados'}"
- Detalles técnicos / materiales / medidas: "${specs || 'Sin detalles extra'}"

Reglas obligatorias:
- Escribí en español rioplatense natural, profesional y directo.
- Extraé del nombre datos útiles como marca, modelo, capacidad, material, tamaño o uso si aparecen explícitamente.
- No inventes especificaciones técnicas, garantía, envío, cuotas, origen, compatibilidad ni materiales si no están en los datos.
- Si faltan detalles, vendé por beneficios generales y recomendá consultar disponibilidad.
- No uses emojis.
- No uses markdown.
- Mantené un tono comercial, no exagerado.
- El mensaje de WhatsApp debe usar exactamente las variables {productName} y {price}, para que luego la app las reemplace.
- Devolvé únicamente JSON válido, sin texto antes ni después.

Formato exacto:
{
  "shortDescription": "Texto vendedor de máximo 120 caracteres.",
  "description": "Descripción completa de 2 a 4 párrafos cortos. Debe explicar qué es, para quién sirve, beneficios y cierre con consulta.",
  "whatsappMessage": "Mensaje breve para WhatsApp usando {productName} y {price}."
}`;
}

function normalizeGeneratedCopy(parsed: any): GeneratedProductCopy {
  return {
    shortDescription: String(parsed?.shortDescription || '').slice(0, 160),
    description: String(parsed?.description || ''),
    whatsappMessage: String(parsed?.whatsappMessage || ''),
  };
}

function parseJsonText(rawText: string) {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

async function readError(response: Response) {
  const text = await response.text().catch(() => '');
  return text ? ` (${text.slice(0, 240)})` : '';
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { name, categoryName, price, stock, brand, model, sizes, colors, specs } = await request.json();
    if (!name) return NextResponse.json({ error: 'Nombre del producto requerido' }, { status: 400 });

    const config = await prisma.siteConfig.findFirst();
    if (!config?.aiApiKey) {
      return NextResponse.json({ error: 'La API Key de IA no está configurada en el panel' }, { status: 400 });
    }

    const provider = config.aiProvider || 'GEMINI';
    const apiKey = config.aiApiKey;

    const prompt = buildPrompt({ name, categoryName, price, stock, brand, model, sizes, colors, specs });
    let generated: GeneratedProductCopy | null = null;

    if (provider === 'GEMINI') {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.55,
          },
        })
      });

      if (!response.ok) throw new Error(`Error al conectar con Gemini API${await readError(response)}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Respuesta de Gemini vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawText));

    } else if (provider === 'OPENAI') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.55,
        })
      });

      if (!response.ok) throw new Error(`Error al conectar con OpenAI API${await readError(response)}`);
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error('Respuesta de OpenAI vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawContent));

    } else if (provider === 'ANTHROPIC') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 900,
          temperature: 0.55,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`Error al conectar con Anthropic API${await readError(response)}`);
      const data = await response.json();
      const rawText = data.content?.find((part: any) => part.type === 'text')?.text;
      if (!rawText) throw new Error('Respuesta de Anthropic vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawText));

    } else if (provider === 'GROQ') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.55,
        }),
      });

      if (!response.ok) throw new Error(`Error al conectar con Groq API${await readError(response)}`);
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error('Respuesta de Groq vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawContent));

    } else if (provider === 'MISTRAL') {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.55,
        }),
      });

      if (!response.ok) throw new Error(`Error al conectar con Mistral API${await readError(response)}`);
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error('Respuesta de Mistral vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawContent));

    } else if (provider === 'OPENROUTER') {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': new URL(request.url).origin,
          'X-Title': 'SHOWROOM JR',
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.55,
        }),
      });

      if (!response.ok) throw new Error(`Error al conectar con OpenRouter API${await readError(response)}`);
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error('Respuesta de OpenRouter vacía');
      generated = normalizeGeneratedCopy(parseJsonText(rawContent));

    } else {
      return NextResponse.json({ error: 'Proveedor de IA no soportado' }, { status: 400 });
    }

    return NextResponse.json(generated);
  } catch (error: any) {
    console.error('Error in AI generation:', error);
    return NextResponse.json({ error: 'Error al generar la descripción con IA' }, { status: 500 });
  }
}
