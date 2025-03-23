-- CreateTable
CREATE TABLE "Item" (
    "item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key_page_id" INTEGER NOT NULL,
    CONSTRAINT "Item_key_page_id_fkey" FOREIGN KEY ("key_page_id") REFERENCES "KeyPage" ("key_page_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeyPage" (
    "key_page_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ebay_item_id" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "minimum_best_offer" REAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "last_updated_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrackingPage" (
    "tracking_page_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ebay_item_id" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "store_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "last_updated_date" DATETIME NOT NULL,
    "key_page_id" INTEGER NOT NULL,
    CONSTRAINT "TrackingPage_key_page_id_fkey" FOREIGN KEY ("key_page_id") REFERENCES "KeyPage" ("key_page_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
