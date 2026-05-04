# SHOWROOM JR - Catalogo Web

Catalogo online profesional para mostrar productos, administrar publicaciones desde un panel privado y recibir consultas por WhatsApp. Esta pensado para vender productos de todo tipo: indumentaria, gorras, zapatillas, herramientas, tecnologia, accesorios y articulos de uso diario.

El proyecto usa Next.js, Prisma, SQLite, NextAuth, Tailwind CSS y generacion de contenido con IA.

## Funciones principales

- Tienda publica responsive para mobile y PC.
- Catalogo con busqueda, categorias, ordenamiento y filtros avanzados.
- Filtros por marca, talle/variante, color, rango de precio y stock.
- Ficha de producto con imagenes, precio, stock, atributos, WhatsApp y productos relacionados.
- Panel admin protegido con login.
- Alta, edicion, duplicado, ocultado y borrado definitivo de productos.
- Imagen principal por producto.
- Gestion de categorias, banners, imagenes y precios.
- Edicion masiva de precios.
- Configuracion global editable desde admin.
- Paginas legales e institucionales editables desde admin.
- Modo mantenimiento activable desde admin.
- PWA instalable en Android y iPhone.
- Generacion de publicaciones con IA.
- Soporte para Google Gemini, OpenAI, Anthropic, Groq, Mistral AI y OpenRouter.
- Pantallas profesionales de error, carga, 404, mantenimiento y confirmacion.
- Toasts de exito, error y advertencia.

## Stack tecnico

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- NextAuth
- bcrypt
- lucide-react
- sharp

## Requisitos

- Node.js 18 o superior recomendado
- npm
- Windows, Linux o macOS

## Instalacion

```bash
npm install
```

Crear o revisar el archivo `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="showroomjr-secret-key-for-nextauth"
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE_MB="10"
```

Sincronizar la base de datos y generar Prisma Client:

```bash
npx prisma db push
```

Opcional: cargar datos demo y usuario admin:

```bash
npx ts-node prisma/seed.ts
```

## Desarrollo

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Panel admin:

```text
http://localhost:3000/admin/login
```

Credenciales demo del seed:

```text
Email: admin@showroom.com
Password: admin123
```

## Comandos utiles

```bash
npm run dev
```

Levanta el entorno de desarrollo.

```bash
npm run build
```

Compila la app para produccion y valida TypeScript.

```bash
npm run lint
```

Ejecuta ESLint.

```bash
npx prisma db push
```

Sincroniza el esquema Prisma con SQLite.

```bash
npx prisma generate
```

Regenera Prisma Client.

```bash
npx prisma studio
```

Abre una interfaz visual para inspeccionar la base de datos.

## Estructura del proyecto

```text
app/
  (public)/              Tienda publica
  (admin)/               Panel de administracion
  api/                   Endpoints internos
components/
  admin/                 Componentes del panel admin
  shop/                  Componentes de la tienda publica
  ui/                    Toasts, confirmaciones y UI compartida
lib/
  auth.ts                Configuracion de NextAuth
  prisma.ts              Cliente Prisma
  whatsapp.ts            Generacion de mensajes WhatsApp
  price-formatter.ts     Formato de precios ARS
prisma/
  schema.prisma          Modelos de base de datos
  dev.db                 Base SQLite local
  seed.ts                Datos iniciales
public/
  uploads/               Imagenes subidas
  sw.js                  Service worker PWA
```

## Rutas publicas

- `/` inicio
- `/catalogo` catalogo con filtros
- `/categorias` listado de categorias
- `/categorias/[slug]` productos por categoria
- `/producto/[slug]` ficha de producto
- `/tabla-productos` lista rapida de productos
- `/terminos` terminos y condiciones
- `/privacidad` politica de privacidad
- `/preguntas-frecuentes` FAQ
- `/sobre-nosotros` pagina institucional
- `/contacto` contacto

## Rutas admin

- `/admin` dashboard
- `/admin/productos` gestion de productos
- `/admin/productos/nuevo` crear producto
- `/admin/productos/[id]/editar` editar producto e imagenes
- `/admin/categorias` categorias
- `/admin/precios` precios y actualizacion masiva
- `/admin/imagenes` gestor de imagenes
- `/admin/banners` banners promocionales
- `/admin/configuracion` configuracion global

## Configuracion desde el admin

En `Admin > Configuracion` se puede editar:

- Nombre de la tienda
- Slogan
- Logo y favicon
- Hero principal
- Colores
- WhatsApp
- Redes sociales
- Badges de confianza
- SEO
- Paginas legales e institucionales
- Footer
- Proveedor de IA
- API Key de IA
- Modo mantenimiento

## Modo mantenimiento

El modo mantenimiento se activa desde:

```text
Admin > Configuracion > General
```

Cuando esta activo:

- La tienda publica muestra una pantalla de mantenimiento.
- El admin sigue disponible.
- El login admin sigue disponible.
- Se puede editar el titulo y mensaje de mantenimiento.
- Si hay WhatsApp configurado, se muestra un boton de contacto.

## Productos

Cada producto puede tener:

- Nombre
- Slug
- Precio
- Precio anterior
- Categoria
- Stock
- Estado activo/inactivo
- Destacado
- Marca
- Modelo o linea
- Talles o variantes
- Colores
- Detalles tecnicos, medidas o material
- Descripcion corta
- Descripcion completa
- Mensaje WhatsApp personalizado
- Imagenes
- Imagen principal

El admin permite:

- Crear productos
- Editar productos
- Duplicar como borrador
- Ocultar productos
- Borrar definitivamente
- Subir imagenes
- Importar imagenes por URL
- Marcar imagen principal

## IA para publicaciones

La IA ayuda a generar:

- Descripcion corta
- Descripcion completa
- Mensaje personalizado de WhatsApp

Usa los datos cargados del producto:

- nombre
- categoria
- precio
- stock
- marca
- modelo
- talles
- colores
- detalles tecnicos

Proveedores disponibles:

- Google Gemini
- OpenAI
- Anthropic Claude
- Groq
- Mistral AI
- OpenRouter

Configurar desde:

```text
Admin > Configuracion > IA
```

## WhatsApp

El sistema genera links directos a WhatsApp usando:

- numero global de WhatsApp
- mensaje global
- mensaje personalizado por producto
- variables `{productName}` y `{price}`

Ejemplo:

```text
Hola! Me interesa {productName}, precio {price}. Me pasas mas info?
```

## PWA

La app incluye:

- `manifest.webmanifest`
- service worker
- iconos PWA
- soporte para instalar en Android
- soporte para instalar en iPhone desde Safari con "Agregar a pantalla de inicio"

## Seguridad y acceso

- El admin esta protegido con NextAuth.
- Las APIs de administracion requieren sesion.
- Las contrasenas se guardan con bcrypt.
- El modo mantenimiento no bloquea el panel admin.

Recomendado antes de publicar:

- Cambiar `NEXTAUTH_SECRET`.
- Cambiar la contrasena del usuario admin.
- No publicar `.env`.
- Usar HTTPS en produccion.
- Revisar textos legales antes de operar comercialmente.

## Validacion

Antes de publicar o entregar cambios:

```bash
npm run lint
npm run build
```

Ambos comandos deben pasar sin errores.

## Produccion

Para generar build:

```bash
npm run build
```

Para correr produccion localmente:

```bash
npm run start
```

Si se despliega en Vercel u otro hosting:

- configurar variables de entorno
- usar una base persistente si no se quiere perder informacion
- asegurarse de que uploads tenga estrategia persistente

SQLite y `public/uploads` son comodos para desarrollo local. Para produccion seria recomendable migrar a una base administrada y storage persistente si el volumen crece.
