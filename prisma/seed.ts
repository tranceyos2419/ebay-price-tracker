import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

function generateUniqueEbayIds(count: number): string[] {
  const ids = new Set<string>();
  while (ids.size < count) {
    const id = Math.floor(
      100000000000 + Math.random() * 900000000000,
    ).toString();
    ids.add(id);
  }
  return Array.from(ids);
}

async function main() {
  // Generate enough IDs for 10 key pages and 3 tracking pages each (10*4 = 40 IDs)
  const ebayItemIds = generateUniqueEbayIds(40);

  // Create 10 key pages with their tracking pages
  const keyPagesData = Array.from({ length: 10 }, (_, i) => {
    const baseIndex = i * 4; // Each key page uses 4 IDs (1 key + 3 tracking)
    return {
      ebay_item_id: ebayItemIds[baseIndex],
      price: Math.floor(Math.random() * 1000) + 50,
      minimum_best_offer: Math.floor(Math.random() * 900) + 50,
      image_url:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: `Product ${i + 1}`,
      status: i % 2 === 0 ? Status.SUCCESS : Status.FAILED,
      message: i % 2 === 0 ? "Active listing" : "Inactive listing",
      last_updated_date: new Date(),
    };
  });

  // Create key pages
  await prisma.keyPage.createMany({
    data: keyPagesData,
    skipDuplicates: true,
  });

  // Create items for each key page
  await prisma.item.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      key_page_id: i + 1,
    })),
  });

  // Create tracking pages (3 for each key page)
  const trackingPagesData = [];
  for (let i = 0; i < 10; i++) {
    const baseIndex = i * 4;
    const keyPageId = i + 1;

    // Create 3 tracking pages for each key page
    for (let j = 1; j <= 3; j++) {
      trackingPagesData.push({
        ebay_item_id: ebayItemIds[baseIndex + j],
        price: keyPagesData[i].price - Math.floor(Math.random() * 50),
        image_url:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        store_name: `Store ${j} for Product ${i + 1}`,
        status: j % 2 === 0 ? Status.SUCCESS : Status.FAILED,
        message: j % 2 === 0 ? "Tracking active" : "Tracking inactive",
        last_updated_date: new Date(),
        key_page_id: keyPageId,
      });
    }
  }

  await prisma.trackingPage.createMany({
    data: trackingPagesData,
    skipDuplicates: true,
  });

  console.log("Seeded 10 key pages with 3 tracking pages each");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
