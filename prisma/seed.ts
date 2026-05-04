import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('JR_admin_8Vn1q$P', 12)

  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@showroom.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@showroom.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'SHOWROOM JR',
      heroTitle: 'Tu Tienda Premium',
      heroSubtitle: 'Descubrí nuestra increíble selección de productos',
    },
  })

  // Crear categorías
  const categoriasData = [
    { name: 'Electrónica', slug: 'electronica', description: 'Smartphones y gadgets.' },
    { name: 'PC y Gaming', slug: 'pc-gaming', description: 'Laptops, componentes y periféricos.' },
    { name: 'Ropa', slug: 'ropa', description: 'Indumentaria de moda y accesorios.' },
    { name: 'Herramientas', slug: 'herramientas', description: 'Herramientas para hogar y profesionales.' },
    { name: 'Uso Diario', slug: 'uso-diario', description: 'Artículos esenciales para el día a día.' },
  ];

  const categorias: Record<string, string> = {};
  for (const cat of categoriasData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categorias[cat.slug] = c.id;
  }

  // Crear productos demo
  const productosData = [
    { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', description: 'El iPhone más potente.', shortDescription: 'Apple Smartphone 128GB', price: 1200000, categoryId: categorias['electronica'], featured: true, stock: 10 },
    { name: 'Samsung Galaxy S24 Ultra', slug: 's24-ultra', description: 'Potencia con IA.', shortDescription: 'Samsung Smartphone 256GB', price: 1350000, categoryId: categorias['electronica'], featured: true, stock: 5 },
    
    { name: 'Notebook ASUS ROG Zephyrus', slug: 'asus-rog', description: 'Laptop gaming extrema.', shortDescription: 'RTX 4070, 32GB RAM', price: 2100000, categoryId: categorias['pc-gaming'], featured: true, stock: 3 },
    { name: 'Monitor LG UltraGear 27"', slug: 'lg-ultragear', description: 'Monitor 144Hz 1ms.', shortDescription: 'Gaming Monitor IPS', price: 350000, categoryId: categorias['pc-gaming'], featured: false, stock: 15 },
    
    { name: 'Campera de Cuero Premium', slug: 'campera-cuero', description: 'Campera 100% cuero vacuno.', shortDescription: 'Estilo y durabilidad', price: 150000, categoryId: categorias['ropa'], featured: true, stock: 20 },
    { name: 'Zapatillas Urbanas', slug: 'zapatillas-urbanas', description: 'Comodidad para todo el día.', shortDescription: 'Calzado moderno', price: 85000, categoryId: categorias['ropa'], featured: false, stock: 30 },
    
    { name: 'Taladro Percutor Bosch', slug: 'taladro-bosch', description: 'Taladro profesional 650W.', shortDescription: 'Herramienta eléctrica', price: 120000, categoryId: categorias['herramientas'], featured: true, stock: 8 },
    { name: 'Caja de Herramientas 120 piezas', slug: 'caja-herramientas', description: 'Set completo para el hogar.', shortDescription: 'Kit de herramientas', price: 75000, categoryId: categorias['herramientas'], featured: false, stock: 12 },
    
    { name: 'Termo Stanley Classic 1L', slug: 'termo-stanley', description: 'Mantiene caliente por 24hs.', shortDescription: 'Termo de acero', price: 85000, categoryId: categorias['uso-diario'], featured: true, stock: 50 },
    { name: 'Mochila Urbana Resistente', slug: 'mochila-urbana', description: 'Mochila con porta laptop.', shortDescription: 'Capacidad 25L', price: 45000, categoryId: categorias['uso-diario'], featured: false, stock: 25 },
  ];

  for (const prod of productosData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: { ...prod, active: true },
    });
  }

  console.log('Seed finalizado con múltiples productos y categorías.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
