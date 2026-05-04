const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding edge cases...');
  
  const cat = await prisma.category.findFirst();

  // Out of stock product
  await prisma.product.create({
    data: {
      name: 'Buzo Canguro Sin Stock',
      slug: 'buzo-canguro-sin-stock',
      description: 'Buzo que actualmente no tiene stock.',
      shortDescription: 'Buzo sin stock',
      price: 35000,
      categoryId: cat.id,
      featured: false,
      stock: 0,
    }
  });

  // No image product
  await prisma.product.create({
    data: {
      name: 'Medias Invisibles',
      slug: 'medias-invisibles',
      description: 'Pack de medias (sin foto).',
      shortDescription: 'Medias pack x3',
      price: 5000,
      categoryId: cat.id,
      featured: false,
      stock: 100,
    }
  });

  console.log('Edge cases added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
