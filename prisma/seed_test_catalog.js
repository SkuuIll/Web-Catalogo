const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const categories = [
  { name: 'Zapatillas', slug: 'zapatillas', description: 'Calzado deportivo y urbano', sortOrder: 1 },
  { name: 'Indumentaria', slug: 'indumentaria', description: 'Ropa, abrigos y básicos para todos los días', sortOrder: 2 },
  { name: 'Accesorios', slug: 'accesorios', description: 'Complementos, mochilas, gorras y bolsos', sortOrder: 3 },
  { name: 'Electrónica', slug: 'electronica', description: 'Celulares, audio y gadgets útiles', sortOrder: 4 },
  { name: 'PC y Gaming', slug: 'pc-gaming', description: 'Periféricos, notebooks, monitores y setups', sortOrder: 5 },
  { name: 'Herramientas', slug: 'herramientas', description: 'Herramientas para casa, taller y trabajo', sortOrder: 6 },
  { name: 'Hogar', slug: 'hogar', description: 'Artículos prácticos para cocina, orden y decoración', sortOrder: 7 },
  { name: 'Uso Diario', slug: 'uso-diario', description: 'Productos simples para resolver el día a día', sortOrder: 8 },
];

const imagePools = {
  zapatillas: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85',
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=85',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=85',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=85',
  ],
  indumentaria: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=85',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85',
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&q=85',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=85',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=85',
  ],
  electronica: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=85',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=85',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=85',
  ],
  'pc-gaming': [
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=85',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=85',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=85',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=85',
  ],
  herramientas: [
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85',
    'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=1200&q=85',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=85',
    'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=1200&q=85',
  ],
  hogar: [
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=85',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&q=85',
  ],
  'uso-diario': [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=85',
    'https://images.unsplash.com/photo-1585386959984-a41552231658?w=1200&q=85',
    'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=1200&q=85',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=85',
  ],
};

const productTemplates = [
  ['zapatillas', 'Nike Air Pulse', 'Nike', ['39', '40', '41', '42'], ['Rojo', 'Negro'], 118000],
  ['zapatillas', 'Adidas Street Runner', 'Adidas', ['38', '40', '42', '44'], ['Blanco', 'Azul'], 132000],
  ['zapatillas', 'Puma Urban Flex', 'Puma', ['39', '41', '43'], ['Negro', 'Gris'], 98000],
  ['zapatillas', 'New Balance Daily', 'New Balance', ['37', '38', '40'], ['Crema', 'Verde'], 125000],
  ['indumentaria', 'Remera Oversize Lisa', 'JR Basics', ['S', 'M', 'L', 'XL'], ['Blanco', 'Negro'], 24000],
  ['indumentaria', 'Buzo Canguro Premium', 'JR Urban', ['M', 'L', 'XL'], ['Negro', 'Azul'], 52000],
  ['indumentaria', 'Campera Rompeviento', 'North Mode', ['S', 'M', 'L'], ['Verde', 'Gris'], 78000],
  ['indumentaria', 'Jean Cargo Relax', 'Denim Lab', ['40', '42', '44'], ['Azul', 'Negro'], 63000],
  ['accesorios', 'Gorra Trucker Bordada', 'JR Caps', ['Único'], ['Negro', 'Rojo'], 18000],
  ['accesorios', 'Mochila Urbana 25L', 'MovePack', ['Único'], ['Negro', 'Gris'], 57000],
  ['accesorios', 'Reloj Casual Steel', 'Time Pro', ['Único'], ['Plateado'], 69000],
  ['accesorios', 'Bolso Crossbody', 'CarryOn', ['Único'], ['Negro', 'Camel'], 31000],
  ['electronica', 'Auriculares Bluetooth Pro', 'Soundix', ['Único'], ['Negro', 'Blanco'], 46000],
  ['electronica', 'Smartwatch Fit Plus', 'FitGo', ['Único'], ['Negro', 'Rosa'], 83000],
  ['electronica', 'Parlante Portátil Mini', 'Wave', ['Único'], ['Azul', 'Negro'], 38000],
  ['electronica', 'Power Bank 20000 mAh', 'Voltix', ['Único'], ['Negro'], 42000],
  ['pc-gaming', 'Teclado Mecánico RGB', 'KeyStorm', ['Switch Red'], ['Negro'], 72000],
  ['pc-gaming', 'Mouse Gamer 12000 DPI', 'AimPro', ['Único'], ['Negro'], 36000],
  ['pc-gaming', 'Monitor 27 IPS 165Hz', 'ViewMax', ['27 pulgadas'], ['Negro'], 315000],
  ['pc-gaming', 'Notebook Gaming RTX', 'NovaTech', ['16GB RAM'], ['Gris'], 1850000],
  ['herramientas', 'Taladro Percutor 650W', 'Bosch', ['650W'], ['Azul'], 119000],
  ['herramientas', 'Set Herramientas 120 piezas', 'ToolPro', ['120 piezas'], ['Rojo'], 89000],
  ['herramientas', 'Amoladora Angular 900W', 'BlackTools', ['900W'], ['Verde'], 76000],
  ['herramientas', 'Caja Organizadora Reforzada', 'WorkBox', ['Grande'], ['Negro'], 44000],
  ['hogar', 'Organizador Cocina Modular', 'CasaMix', ['Mediano'], ['Blanco'], 29000],
  ['hogar', 'Lámpara Mesa Nórdica', 'Lumiere', ['Único'], ['Madera'], 34000],
  ['hogar', 'Set Frascos Herméticos', 'KitchenPro', ['6 piezas'], ['Transparente'], 22000],
  ['hogar', 'Alfombra Texturada', 'DecoHome', ['120x180'], ['Gris'], 65000],
  ['uso-diario', 'Termo Acero 1L', 'SteelMate', ['1L'], ['Verde', 'Negro'], 54000],
  ['uso-diario', 'Botella Deportiva 750ml', 'Hydro', ['750ml'], ['Azul'], 16000],
  ['uso-diario', 'Neceser Viaje Compacto', 'TravelKit', ['Único'], ['Negro'], 19000],
  ['uso-diario', 'Agenda Semanal Premium', 'PaperLab', ['A5'], ['Marrón'], 21000],
];

async function main() {
  const categoryBySlug = {};
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryBySlug[category.slug] = saved;
  }

  let createdOrUpdated = 0;

  for (let round = 1; round <= 3; round++) {
    for (let index = 0; index < productTemplates.length; index++) {
      const [categorySlug, baseName, brand, sizes, colors, basePrice] = productTemplates[index];
      const variantName = round === 1 ? baseName : `${baseName} Edición ${round}`;
      const slug = slugify(`demo-${variantName}`);
      const category = categoryBySlug[categorySlug];
      const price = Math.round((basePrice + round * 3500 + index * 900) / 100) * 100;
      const compareAtPrice = index % 4 === 0 ? Math.round(price * 1.18 / 100) * 100 : null;
      const stock = index % 9 === 0 ? 0 : 4 + ((index + round) % 38);
      const images = imagePools[categorySlug];
      const firstImage = images[index % images.length];
      const secondImage = images[(index + round) % images.length];

      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          name: variantName,
          price,
          compareAtPrice,
          stock,
          active: true,
          status: 'PUBLISHED',
          categoryId: category.id,
          brand,
          sizes: sizes.join(', '),
          colors: colors.join(', '),
        },
        create: {
          name: variantName,
          slug,
          description: `${variantName} de ${brand}. Producto demo para probar grillas, filtros, tablas, stock, precios y fichas del catálogo.`,
          shortDescription: `${brand} · ${category.name}`,
          brand,
          sizes: sizes.join(', '),
          colors: colors.join(', '),
          specs: `Categoría: ${category.name}\nMarca: ${brand}\nVariantes: ${sizes.join(', ')}\nColores: ${colors.join(', ')}`,
          price,
          compareAtPrice,
          status: 'PUBLISHED',
          categoryId: category.id,
          featured: index % 11 === 0,
          active: true,
          stock,
          metaTitle: variantName,
          metaDescription: `${variantName} disponible en catálogo demo.`,
        },
      });

      await prisma.productImage.deleteMany({
        where: { productId: product.id, sourceType: 'URL' },
      });

      await prisma.productImage.createMany({
        data: [
          { productId: product.id, url: firstImage, altText: variantName, sourceType: 'URL', isPrimary: true, sortOrder: 0 },
          { productId: product.id, url: secondImage, altText: `${variantName} detalle`, sourceType: 'URL', isPrimary: false, sortOrder: 1 },
        ],
      });

      createdOrUpdated++;
    }
  }

  const total = await prisma.product.count({ where: { active: true, status: 'PUBLISHED' } });
  console.log(`Productos demo creados/actualizados: ${createdOrUpdated}`);
  console.log(`Total publicado activo: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
