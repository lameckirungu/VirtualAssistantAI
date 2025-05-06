import { db } from '../db';
import { products, insertProductSchema, type InsertProduct } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function addProducts() {
  const kenyaProducts: InsertProduct[] = [
    {
      name: "Samsung Galaxy A14",
      sku: "SAM-GA14-KE",
      description: "6.6-inch display, 50MP camera, 5000mAh battery, 4GB RAM",
      price: "19999.99",
      priceKsh: "19999.99",
      quantity: 25,
      status: "in_stock",
      category: "smartphones",
      reorderPoint: 5,
      imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/africa_en/sm-a145fzgdafa/gallery/africa-en-galaxy-a14-sm-a145-sm-a145fzgdafa-536046564",
      isPopular: true
    },
    {
      name: "Tecno Spark 10C",
      sku: "TEC-SP10C-KE",
      description: "6.6-inch HD+ display, 5000mAh battery, 4GB RAM, 128GB storage",
      price: "15999.00",
      priceKsh: "15999.00",
      quantity: 30,
      status: "in_stock",
      category: "smartphones",
      reorderPoint: 7,
      imageUrl: "https://www.tecno-mobile.com/storage/images/product/list/SPARK-10-Pro.png",
      isPopular: true
    },
    {
      name: "Xiaomi Redmi 12",
      sku: "XMI-RD12-KE",
      description: "6.79-inch FHD+ display, 50MP camera, 5000mAh battery, 8GB RAM",
      price: "22499.00",
      priceKsh: "22499.00",
      quantity: 15,
      status: "in_stock",
      category: "smartphones",
      reorderPoint: 3,
      imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-12-1.jpg",
      isPopular: false
    },
    {
      name: "OPPO A58",
      sku: "OPPO-A58-KE",
      description: "6.72-inch FHD+ display, 50MP camera, 5000mAh battery",
      price: "24999.00",
      priceKsh: "24999.00",
      quantity: 18,
      status: "in_stock",
      category: "smartphones",
      reorderPoint: 4,
      imageUrl: "https://www.oppo.com/content/dam/oppo/common/mkt/v2-3/a58/navigation/A58-navigation-blue-v2.png",
      isPopular: false
    },
    {
      name: "Infinix Hot 40i",
      sku: "INF-H40I-KE",
      description: "6.6-inch HD+ display, 50MP camera, 5000mAh battery, 4GB RAM",
      price: "16499.00",
      priceKsh: "16499.00",
      quantity: 22,
      status: "in_stock",
      category: "smartphones",
      reorderPoint: 5,
      imageUrl: "https://fdn2.gsmarena.com/vv/pics/infinix/infinix-hot40i-1.jpg",
      isPopular: true
    },
    {
      name: "LG 43\" Smart TV",
      sku: "LG-43SM-KE",
      description: "43-inch Full HD Smart TV with webOS, HDR10, and virtual surround sound",
      price: "34999.00",
      priceKsh: "34999.00",
      quantity: 10,
      status: "in_stock",
      category: "televisions",
      reorderPoint: 2,
      imageUrl: "https://www.lg.com/africa/images/tvs/md07537539/gallery/DZ-01.jpg",
      isPopular: true
    },
    {
      name: "Hisense 32\" HD TV",
      sku: "HIS-32HD-KE",
      description: "32-inch HD TV with USB multimedia playback and multiple HDMI inputs",
      price: "15999.00",
      priceKsh: "15999.00",
      quantity: 15,
      status: "in_stock",
      category: "televisions",
      reorderPoint: 3,
      imageUrl: "https://ke.hisense.com/uploads/product/gallery/FHD_A4K_PRO.jpg",
      isPopular: true
    },
    {
      name: "Samsung 50\" Crystal UHD 4K TV",
      sku: "SAM-50UHD-KE",
      description: "50-inch 4K UHD Smart TV with HDR, PurColor, and Crystal Processor 4K",
      price: "55999.00",
      priceKsh: "55999.00",
      quantity: 8,
      status: "in_stock",
      category: "televisions",
      reorderPoint: 2,
      imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/africa_en/ua50cu7000uxly/gallery/africa-en-crystal-uhd-cu7000-ua50cu7000uxly-536141267",
      isPopular: false
    },
    {
      name: "Von Hotpoint Refrigerator 200L",
      sku: "VON-RF2L-KE",
      description: "200L Double Door Refrigerator with Energy Saving Technology",
      price: "32999.00",
      priceKsh: "32999.00",
      quantity: 7,
      status: "in_stock",
      category: "appliances",
      reorderPoint: 2,
      imageUrl: "https://vonproducts.co.ke/wp-content/uploads/2021/03/VARV-20DDS-scaled.jpg",
      isPopular: false
    },
    {
      name: "Ramtons 6KG Washing Machine",
      sku: "RAM-WM6K-KE",
      description: "6KG Top Load Automatic Washing Machine with Multiple Wash Programs",
      price: "24999.00",
      priceKsh: "24999.00",
      quantity: 9,
      status: "in_stock",
      category: "appliances",
      reorderPoint: 2,
      imageUrl: "https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/29/3666911/1.jpg",
      isPopular: false
    },
    {
      name: "Sony PlayStation 5",
      sku: "SNY-PS5-KE",
      description: "PlayStation 5 Console with Ultra-High Speed SSD and 4K Gaming",
      price: "89999.00",
      priceKsh: "89999.00",
      quantity: 5,
      status: "in_stock",
      category: "gaming",
      reorderPoint: 2,
      imageUrl: "https://www.playstation.com/en-us/ps5/",
      isPopular: true
    },
    {
      name: "Lenovo IdeaPad Slim 3",
      sku: "LEN-IPS3-KE",
      description: "15.6-inch FHD Laptop, 8GB RAM, 512GB SSD, Intel Core i5",
      price: "65999.00",
      priceKsh: "65999.00",
      quantity: 12,
      status: "in_stock",
      category: "computers",
      reorderPoint: 3,
      imageUrl: "https://p1-ofp.static.pub/fes/cms/2022/11/22/xkoy83kc4q1hjf3rr2fhfa2wekj7na046648.png",
      isPopular: true
    },
    {
      name: "HP Pavilion x360",
      sku: "HP-PX360-KE",
      description: "14-inch FHD Touchscreen 2-in-1 Laptop, 16GB RAM, 512GB SSD",
      price: "79999.00",
      priceKsh: "79999.00",
      quantity: 7,
      status: "in_stock",
      category: "computers",
      reorderPoint: 2,
      imageUrl: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08164796.png",
      isPopular: false
    },
    {
      name: "Dell Inspiron 15",
      sku: "DEL-IN15-KE",
      description: "15.6-inch FHD Laptop, 8GB RAM, 256GB SSD, Intel Core i3",
      price: "49999.00",
      priceKsh: "49999.00",
      quantity: 14,
      status: "in_stock",
      category: "computers",
      reorderPoint: 3,
      imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/black/notebook-inspiron-15-3520-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=573&qlt=100,1&resMode=sharp2&size=573,402&chrss=full",
      isPopular: false
    },
    {
      name: "Apple MacBook Air M2",
      sku: "APL-MBA2-KE",
      description: "13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD",
      price: "159999.00",
      priceKsh: "159999.00",
      quantity: 6,
      status: "in_stock",
      category: "computers",
      reorderPoint: 2,
      imageUrl: "https://www.apple.com/v/macbook-air-m2/c/images/overview/hero/macbook_air_m2_midnight__frtoc27yygqe_large.jpg",
      isPopular: true
    },
    {
      name: "JBL Flip 6 Bluetooth Speaker",
      sku: "JBL-FL6-KE",
      description: "Portable Bluetooth Speaker with 12 Hours of Playtime, Waterproof",
      price: "13999.00",
      priceKsh: "13999.00",
      quantity: 20,
      status: "in_stock",
      category: "audio",
      reorderPoint: 5,
      imageUrl: "https://ke.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw48867cd4/JBL_Flip6_Hero_Red.png",
      isPopular: true
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      sku: "SNY-WHX5-KE",
      description: "Wireless Noise Cancelling Headphones with 30-hour Battery Life",
      price: "44999.00",
      priceKsh: "44999.00",
      quantity: 8,
      status: "in_stock", 
      category: "audio",
      reorderPoint: 2,
      imageUrl: "https://www.sony.com/image/a240c45a89ed00ba0c0e71a330487b4d?fmt=png-alpha&wid=660&hei=660",
      isPopular: false
    },
    {
      name: "Canon EOS 1500D DSLR Camera",
      sku: "CAN-1500D-KE",
      description: "24.1MP DSLR Camera with 18-55mm Lens, Full HD Video Recording",
      price: "59999.00",
      priceKsh: "59999.00",
      quantity: 6,
      status: "in_stock",
      category: "cameras",
      reorderPoint: 2,
      imageUrl: "https://in.canon/media/image/2018/05/03/642e7bbeae5741e3b872e082626c0151_EOS+1500D+Black+Beauty.png",
      isPopular: false
    },
    {
      name: "Anker PowerCore 20000mAh Power Bank",
      sku: "ANK-PC20K-KE",
      description: "20000mAh Portable Charger with Fast Charging Technology",
      price: "5999.00",
      priceKsh: "5999.00",
      quantity: 25,
      status: "in_stock",
      category: "accessories",
      reorderPoint: 7,
      imageUrl: "https://m.media-amazon.com/images/I/71UKkL5pk-L._AC_UF1000,1000_QL80_.jpg",
      isPopular: true
    },
    {
      name: "TP-Link Archer C6 Wi-Fi Router",
      sku: "TPL-AC6-KE",
      description: "AC1200 Dual Band Wi-Fi Router with 4 External Antennas",
      price: "5499.00",
      priceKsh: "5499.00",
      quantity: 15,
      status: "in_stock",
      category: "networking",
      reorderPoint: 4,
      imageUrl: "https://static.tp-link.com/upload/product-overview/2021/202106/20210625/20210625_5f28a15de4c44e71835d3d18_400.png",
      isPopular: false
    }
  ];

  // Add all products to the database
  try {
    for (const product of kenyaProducts) {
      // Validate the product data
      const validatedProduct = insertProductSchema.parse(product);
      
      // Check if product with same SKU already exists
      const existingProduct = await db.select().from(products).where(eq(products.sku, product.sku)).limit(1);
      
      if (existingProduct.length === 0) {
        // Insert the product
        await db.insert(products).values(validatedProduct);
        console.log(`Added product: ${product.name}`);
      } else {
        console.log(`Product with SKU ${product.sku} already exists, skipping`);
      }
    }
    
    console.log('All products have been added successfully!');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the function
addProducts();