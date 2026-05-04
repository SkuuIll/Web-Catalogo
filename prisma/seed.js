const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Clear existing
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const cat1 = await prisma.category.create({
    data: { name: 'Zapatillas', slug: 'zapatillas', description: 'Calzado deportivo y urbano', sortOrder: 1 }
  });
  const cat2 = await prisma.category.create({
    data: { name: 'Indumentaria', slug: 'indumentaria', description: 'Ropa para toda ocasión', sortOrder: 2 }
  });
  const cat3 = await prisma.category.create({
    data: { name: 'Accesorios', slug: 'accesorios', description: 'Complementos y accesorios', sortOrder: 3 }
  });

  // Create Products
  const products = [
    {
      name: 'Zapatillas Nike Air Max',
      slug: 'zapatillas-nike-air-max',
      description: 'Zapatillas deportivas cómodas y modernas.',
      shortDescription: 'Zapatillas deportivas',
      price: 120000,
      compareAtPrice: 150000,
      categoryId: cat1.id,
      featured: true,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80']
    },
    {
      name: 'Zapatillas Adidas Ultraboost',
      slug: 'zapatillas-adidas-ultraboost',
      description: 'Zapatillas de running de alto rendimiento.',
      shortDescription: 'Running premium',
      price: 145000,
      categoryId: cat1.id,
      featured: false,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80']
    },
    {
      name: 'Remera Oversize Essential',
      slug: 'remera-oversize-essential',
      description: 'Remera 100% algodón corte oversize.',
      shortDescription: 'Remera básica',
      price: 25000,
      compareAtPrice: 30000,
      categoryId: cat2.id,
      featured: true,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80']
    },
    {
      name: 'Pantalón Cargo Urbano',
      slug: 'pantalon-cargo-urbano',
      description: 'Pantalón cargo de gabardina con múltiples bolsillos.',
      shortDescription: 'Pantalón cargo',
      price: 45000,
      categoryId: cat2.id,
      featured: false,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80']
    },
    {
      name: 'Gorra Vintage',
      slug: 'gorra-vintage',
      description: 'Gorra estilo vintage con logo bordado.',
      shortDescription: 'Gorra clásica',
      price: 15000,
      categoryId: cat3.id,
      featured: true,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80']
    },
    {
      name: 'Mochila Urbana',
      slug: 'mochila-urbana',
      description: 'Mochila resistente al agua con compartimento para notebook.',
      shortDescription: 'Mochila impermeable',
      price: 55000,
      categoryId: cat3.id,
      featured: false,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80']
    }
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    const createdProduct = await prisma.product.create({
      data: productData
    });
    
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: images[i],
          isPrimary: i === 0,
          sourceType: 'URL',
          sortOrder: i
        }
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
