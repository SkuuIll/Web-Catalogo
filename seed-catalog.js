const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Creando catálogo predeterminado...");

  // Categorías
  const categoriesData = [
    { name: 'Smartphones y Celulares', slug: 'smartphones', sortOrder: 1 },
    { name: 'Computación y Notebooks', slug: 'computacion', sortOrder: 2 },
    { name: 'Indumentaria Masculina', slug: 'indumentaria-masculina', sortOrder: 3 },
    { name: 'Indumentaria Femenina', slug: 'indumentaria-femenina', sortOrder: 4 },
    { name: 'Calzado Deportivo y Urbano', slug: 'calzado', sortOrder: 5 },
    { name: 'Herramientas Eléctricas', slug: 'herramientas-electricas', sortOrder: 6 },
    { name: 'Herramientas Manuales', slug: 'herramientas-manuales', sortOrder: 7 },
    { name: 'Hogar, Muebles y Jardín', slug: 'hogar', sortOrder: 8 },
    { name: 'Accesorios y Relojes', slug: 'accesorios', sortOrder: 9 },
    { name: 'Deportes y Fitness', slug: 'deportes', sortOrder: 10 },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, description: `Todo lo mejor en ${cat.name}` }
    });
    categoryMap[cat.slug] = created.id;
  }

  // Productos de prueba
  const productsData = [
    { name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max', price: 1500000, stock: 10, categoryId: categoryMap['smartphones'], brand: 'Apple', shortDescription: 'El mejor iPhone hasta la fecha' },
    { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', price: 1400000, stock: 5, categoryId: categoryMap['smartphones'], brand: 'Samsung', shortDescription: 'Potencia e Inteligencia Artificial' },
    
    { name: 'Notebook ASUS ROG Zephyrus', slug: 'asus-rog', price: 2200000, stock: 3, categoryId: categoryMap['computacion'], brand: 'ASUS', shortDescription: 'Laptop gamer de alto rendimiento' },
    { name: 'MacBook Air M3', slug: 'macbook-air-m3', price: 1800000, stock: 8, categoryId: categoryMap['computacion'], brand: 'Apple', shortDescription: 'Liviana y ultra rápida' },

    { name: 'Remera Básica Oversize', slug: 'remera-oversize', price: 25000, stock: 50, categoryId: categoryMap['indumentaria-masculina'], brand: 'Generic', sizes: 'S, M, L, XL', colors: 'Blanco, Negro' },
    { name: 'Pantalón Cargo Urbano', slug: 'pantalon-cargo', price: 45000, stock: 30, categoryId: categoryMap['indumentaria-masculina'], sizes: '38, 40, 42, 44', colors: 'Beige, Negro' },

    { name: 'Vestido de Verano Floral', slug: 'vestido-floral', price: 35000, stock: 20, categoryId: categoryMap['indumentaria-femenina'], sizes: 'S, M, L' },
    { name: 'Top Deportivo Seamless', slug: 'top-deportivo', price: 18000, stock: 40, categoryId: categoryMap['indumentaria-femenina'], colors: 'Rosa, Negro, Azul' },

    { name: 'Zapatillas Nike Air Max', slug: 'nike-air-max', price: 125000, stock: 15, categoryId: categoryMap['calzado'], brand: 'Nike', sizes: '39, 40, 41, 42' },
    { name: 'Zapatillas Adidas Ultraboost', slug: 'adidas-ultraboost', price: 145000, stock: 12, categoryId: categoryMap['calzado'], brand: 'Adidas', sizes: '40, 41, 42, 43' },

    { name: 'Taladro Percutor Bosch 650W', slug: 'taladro-bosch', price: 85000, stock: 10, categoryId: categoryMap['herramientas-electricas'], brand: 'Bosch', specs: 'Potencia: 650W, Incluye maletín' },
    { name: 'Amoladora Angular Stanley', slug: 'amoladora-stanley', price: 65000, stock: 8, categoryId: categoryMap['herramientas-electricas'], brand: 'Stanley', specs: 'Potencia: 800W' },

    { name: 'Juego de Llaves Tubo 40 Piezas', slug: 'juego-tubos', price: 35000, stock: 25, categoryId: categoryMap['herramientas-manuales'], brand: 'Bahco', shortDescription: 'Set completo profesional' },
    
    { name: 'Termo Stanley Classic 1L', slug: 'termo-stanley', price: 95000, stock: 40, categoryId: categoryMap['hogar'], brand: 'Stanley', colors: 'Verde, Negro' },
    { name: 'Sillón Eames Moderno', slug: 'sillon-eames', price: 55000, stock: 10, categoryId: categoryMap['hogar'], colors: 'Blanco, Negro' },

    { name: 'Reloj Casio Vintage', slug: 'reloj-casio', price: 45000, stock: 20, categoryId: categoryMap['accesorios'], brand: 'Casio', colors: 'Dorado, Plateado' },
    { name: 'Gorra Trucker Premium', slug: 'gorra-trucker', price: 15000, stock: 60, categoryId: categoryMap['accesorios'], colors: 'Negro, Azul' },

    { name: 'Mancuernas Hexagonales 5kg', slug: 'mancuernas-5kg', price: 25000, stock: 30, categoryId: categoryMap['deportes'] },
    { name: 'Colchoneta Yoga Mat 6mm', slug: 'yoga-mat', price: 12000, stock: 50, categoryId: categoryMap['deportes'], colors: 'Violeta, Azul, Rosa' },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: { ...prod, status: 'PUBLISHED', active: true }
    });
  }

  console.log("Catálogo predeterminado generado con éxito!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
