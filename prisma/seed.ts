// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// function generateUniqueEbayIds(count: number): string[] {
//   const ids = new Set<string>();
//   while (ids.size < count) {
//     const id = Math.floor(
//       100000000000 + Math.random() * 900000000000,
//     ).toString();
//     ids.add(id);
//   }
//   return Array.from(ids);
// }

// async function main() {
//   const ebayItemIds = generateUniqueEbayIds(41);

//   await prisma.keyPage.createMany({
//     data: [
//       {
//         ebay_item_id: ebayItemIds[0],
//         price: 309.99,
//         minimum_best_offer: 288.99,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "TECH21 SansAmp Classic E",
//         status: "active",
//         message: "Key Page*",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[1],
//         price: 0.38,
//         minimum_best_offer: 0.3,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "itsonlinejp",
//         status: "inactive",
//         message: "some text",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[2],
//         price: 310.39,
//         minimum_best_offer: 300.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "spice-japan",
//         status: "active",
//         message: "some text",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[3],
//         price: 150.0,
//         minimum_best_offer: 140.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Vintage Camera",
//         status: "active",
//         message: "Great condition",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[4],
//         price: 75.5,
//         minimum_best_offer: 70.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Leather Jacket",
//         status: "inactive",
//         message: "Minor wear",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[5],
//         price: 200.0,
//         minimum_best_offer: 180.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Smartwatch",
//         status: "active",
//         message: "Brand new",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[6],
//         price: 50.0,
//         minimum_best_offer: 45.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Coffee Maker",
//         status: "inactive",
//         message: "Used, works well",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[7],
//         price: 120.0,
//         minimum_best_offer: 110.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Bluetooth Speaker",
//         status: "active",
//         message: "Excellent sound",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[8],
//         price: 90.0,
//         minimum_best_offer: 85.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Running Shoes",
//         status: "inactive",
//         message: "Size 10",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[9],
//         price: 300.0,
//         minimum_best_offer: 280.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Gaming Laptop",
//         status: "active",
//         message: "High performance",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[10],
//         price: 25.0,
//         minimum_best_offer: 20.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Desk Lamp",
//         status: "inactive",
//         message: "LED bulb",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[11],
//         price: 500.0,
//         minimum_best_offer: 480.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "DSLR Camera",
//         status: "active",
//         message: "With lens kit",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[12],
//         price: 60.0,
//         minimum_best_offer: 55.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Backpack",
//         status: "inactive",
//         message: "Waterproof",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[13],
//         price: 800.0,
//         minimum_best_offer: 750.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Smart TV",
//         status: "active",
//         message: "4K resolution",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[14],
//         price: 40.0,
//         minimum_best_offer: 35.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Wireless Mouse",
//         status: "inactive",
//         message: "Ergonomic design",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[15],
//         price: 1500.0,
//         minimum_best_offer: 1400.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Electric Bike",
//         status: "active",
//         message: "Eco-friendly",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[16],
//         price: 10.0,
//         minimum_best_offer: 8.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Notebook",
//         status: "inactive",
//         message: "200 pages",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[17],
//         price: 700.0,
//         minimum_best_offer: 650.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Drone",
//         status: "active",
//         message: "4K camera",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[18],
//         price: 100.0,
//         minimum_best_offer: 90.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Headphones",
//         status: "inactive",
//         message: "Noise-cancelling",
//         last_updated_date: new Date(),
//       },
//       {
//         ebay_item_id: ebayItemIds[19],
//         price: 250.0,
//         minimum_best_offer: 230.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         title: "Fitness Tracker",
//         status: "active",
//         message: "Heart rate monitor",
//         last_updated_date: new Date(),
//       },
//     ],
//     skipDuplicates: true,
//   });

//   // Then create items
//   await prisma.item.createMany({
//     data: Array.from({ length: 20 }, (_, i) => ({
//       key_page_id: i + 1,
//     })),
//   });

//   await prisma.trackingPage.createMany({
//     data: [
//       {
//         ebay_item_id: ebayItemIds[20],
//         price: 138.98,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "King Jim Pomeran",
//         status: "active",
//         message: "some text",
//         last_updated_date: new Date(),
//         key_page_id: 1,
//       },
//       {
//         ebay_item_id: ebayItemIds[21],
//         price: 149.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "maximaki-dream-japan",
//         status: "inactive",
//         message: "some text",
//         last_updated_date: new Date(),
//         key_page_id: 1,
//       },
//       {
//         ebay_item_id: ebayItemIds[22],
//         price: 0.38,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "itsonlinejp",
//         status: "inactive",
//         message: "some text",
//         last_updated_date: new Date(),
//         key_page_id: 2,
//       },
//       {
//         ebay_item_id: ebayItemIds[23],
//         price: 310.39,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "spice-japan",
//         status: "active",
//         message: "some text",
//         last_updated_date: new Date(),
//         key_page_id: 3,
//       },
//       {
//         ebay_item_id: ebayItemIds[24],
//         price: 140.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Camera World",
//         status: "active",
//         message: "Great deal",
//         last_updated_date: new Date(),
//         key_page_id: 4,
//       },
//       {
//         ebay_item_id: ebayItemIds[25],
//         price: 70.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Fashion Hub",
//         status: "inactive",
//         message: "Limited stock",
//         last_updated_date: new Date(),
//         key_page_id: 5,
//       },
//       {
//         ebay_item_id: ebayItemIds[26],
//         price: 180.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Tech Gadgets",
//         status: "active",
//         message: "New arrival",
//         last_updated_date: new Date(),
//         key_page_id: 6,
//       },
//       {
//         ebay_item_id: ebayItemIds[27],
//         price: 45.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Home Essentials",
//         status: "inactive",
//         message: "On sale",
//         last_updated_date: new Date(),
//         key_page_id: 7,
//       },
//       {
//         ebay_item_id: ebayItemIds[28],
//         price: 110.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Audio Store",
//         status: "active",
//         message: "High quality",
//         last_updated_date: new Date(),
//         key_page_id: 8,
//       },
//       {
//         ebay_item_id: ebayItemIds[29],
//         price: 85.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Sportswear",
//         status: "inactive",
//         message: "Last pair",
//         last_updated_date: new Date(),
//         key_page_id: 9,
//       },
//       {
//         ebay_item_id: ebayItemIds[30],
//         price: 280.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Gaming World",
//         status: "active",
//         message: "Top seller",
//         last_updated_date: new Date(),
//         key_page_id: 10,
//       },
//       {
//         ebay_item_id: ebayItemIds[31],
//         price: 20.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Home Decor",
//         status: "inactive",
//         message: "Eco-friendly",
//         last_updated_date: new Date(),
//         key_page_id: 11,
//       },
//       {
//         ebay_item_id: ebayItemIds[32],
//         price: 480.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Camera Store",
//         status: "active",
//         message: "Professional grade",
//         last_updated_date: new Date(),
//         key_page_id: 12,
//       },
//       {
//         ebay_item_id: ebayItemIds[33],
//         price: 55.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Outdoor Gear",
//         status: "inactive",
//         message: "Durable",
//         last_updated_date: new Date(),
//         key_page_id: 13,
//       },
//       {
//         ebay_item_id: ebayItemIds[34],
//         price: 750.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Electronics Hub",
//         status: "active",
//         message: "Smart features",
//         last_updated_date: new Date(),
//         key_page_id: 14,
//       },
//       {
//         ebay_item_id: ebayItemIds[35],
//         price: 35.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Tech Accessories",
//         status: "inactive",
//         message: "Compact design",
//         last_updated_date: new Date(),
//         key_page_id: 15,
//       },
//       {
//         ebay_item_id: ebayItemIds[36],
//         price: 1400.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Eco Rides",
//         status: "active",
//         message: "Sustainable",
//         last_updated_date: new Date(),
//         key_page_id: 16,
//       },
//       {
//         ebay_item_id: ebayItemIds[37],
//         price: 8.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Stationery Shop",
//         status: "inactive",
//         message: "Affordable",
//         last_updated_date: new Date(),
//         key_page_id: 17,
//       },
//       {
//         ebay_item_id: ebayItemIds[38],
//         price: 650.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Drone Zone",
//         status: "active",
//         message: "Advanced features",
//         last_updated_date: new Date(),
//         key_page_id: 18,
//       },
//       {
//         ebay_item_id: ebayItemIds[39],
//         price: 90.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Audio World",
//         status: "inactive",
//         message: "Comfortable",
//         last_updated_date: new Date(),
//         key_page_id: 19,
//       },
//       {
//         ebay_item_id: ebayItemIds[40],
//         price: 230.0,
//         image_url:
//           "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         store_name: "Fitness Gear",
//         status: "active",
//         message: "Accurate tracking",
//         last_updated_date: new Date(),
//         key_page_id: 20,
//       },
//     ],
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
