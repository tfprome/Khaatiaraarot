import 'dotenv/config';
import { db, pool } from '../config/db';
import { categories, products, ratePlans, ratePlanDistricts, banners } from '../db/schema';

async function seed() {
  console.log('Seeding database...\n');

  // Categories
  console.log('Inserting categories...');
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Rice & Grains', nameBn: 'চাল ও শস্য', slug: 'rice-grains', sortOrder: 1 },
      { name: 'Oil & Ghee', nameBn: 'তেল ও ঘি', slug: 'oil-ghee', sortOrder: 2 },
      { name: 'Honey & Sweets', nameBn: 'মধু ও মিষ্টান্ন', slug: 'honey-sweets', sortOrder: 3 },
      { name: 'Spices & Herbs', nameBn: 'মশলা ও ভেষজ', slug: 'spices-herbs', sortOrder: 4 },
      { name: 'Fish & Seafood', nameBn: 'মাছ ও সামুদ্রিক খাবার', slug: 'fish-seafood', sortOrder: 5 },
      { name: 'Dairy & Eggs', nameBn: 'দুগ্ধজাত ও ডিম', slug: 'dairy-eggs', sortOrder: 6 },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`  ${insertedCategories.length} categories inserted.`);

  // Fetch all categories to get IDs (in case some already existed)
  const allCategories = await db.select().from(categories);
  const cat = Object.fromEntries(allCategories.map(c => [c.slug, c.id]));

  // Rate Plans
  console.log('Inserting rate plans...');
  const insertedPlans = await db
    .insert(ratePlans)
    .values([
      { name: 'Standard Delivery', description: 'Regular delivery, 3-5 business days' },
      { name: 'Express Delivery', description: 'Fast delivery, 1-2 business days' },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`  ${insertedPlans.length} rate plans inserted.`);

  const allPlans = await db.select().from(ratePlans);
  const standardPlan = allPlans.find(p => p.name === 'Standard Delivery');
  const expressPlan = allPlans.find(p => p.name === 'Express Delivery');

  if (standardPlan && expressPlan) {
    console.log('Inserting rate plan districts...');
    const bangladeshDistricts = [
      'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
      'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj',
      'Gazipur', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur',
      'Cox\'s Bazar', 'Noakhali', 'Faridpur', 'Pabna', 'Kushtia',
    ];

    const standardRates = bangladeshDistricts.map(district => ({
      planId: standardPlan.id,
      district,
      costPerUnit: district === 'Dhaka' || district === 'Gazipur' || district === 'Narayanganj'
        ? '60.00'
        : '100.00',
    }));

    const expressRates = bangladeshDistricts.map(district => ({
      planId: expressPlan.id,
      district,
      costPerUnit: district === 'Dhaka' || district === 'Gazipur' || district === 'Narayanganj'
        ? '120.00'
        : '180.00',
    }));

    const insertedDistricts = await db
      .insert(ratePlanDistricts)
      .values([...standardRates, ...expressRates])
      .onConflictDoNothing()
      .returning();

    console.log(`  ${insertedDistricts.length} rate plan districts inserted.`);
  }

  // Products
  console.log('Inserting products...');
  const productData = [
    // Rice & Grains
    {
      categoryId: cat['rice-grains'],
      name: 'Kataribhog Rice',
      slug: 'kataribhog-rice',
      description: 'Premium aromatic rice from Dinajpur, known for its distinct fragrance and soft texture.',
      unit: 'kg',
      sourceRegion: 'Dinajpur',
      price: '120.00',
      originalPrice: '140.00',
      stockQty: 500,
      isBestSelling: true,
    },
    {
      categoryId: cat['rice-grains'],
      name: 'Chinigura Rice',
      slug: 'chinigura-rice',
      description: 'Fine-grained aromatic rice, perfect for biryani and polao.',
      unit: 'kg',
      sourceRegion: 'Naogaon',
      price: '150.00',
      originalPrice: '170.00',
      stockQty: 300,
      isBestSelling: false,
    },
    {
      categoryId: cat['rice-grains'],
      name: 'Red Rice',
      slug: 'red-rice',
      description: 'Traditional red rice, rich in nutrients and fiber.',
      unit: 'kg',
      sourceRegion: 'Sylhet',
      price: '90.00',
      stockQty: 200,
      isBestSelling: false,
    },
    // Oil & Ghee
    {
      categoryId: cat['oil-ghee'],
      name: 'Pure Mustard Oil',
      slug: 'pure-mustard-oil',
      description: 'Cold-pressed pure mustard oil from local farms. No additives.',
      unit: 'liter',
      sourceRegion: 'Rajshahi',
      price: '280.00',
      originalPrice: '320.00',
      stockQty: 150,
      isBestSelling: true,
    },
    {
      categoryId: cat['oil-ghee'],
      name: 'Desi Ghee',
      slug: 'desi-ghee',
      description: 'Handcrafted pure cow ghee, made using traditional bilona method.',
      unit: '500g',
      sourceRegion: 'Pabna',
      price: '750.00',
      originalPrice: '850.00',
      stockQty: 80,
      isBestSelling: true,
    },
    {
      categoryId: cat['oil-ghee'],
      name: 'Coconut Oil',
      slug: 'coconut-oil',
      description: 'Pure cold-pressed virgin coconut oil.',
      unit: '500ml',
      sourceRegion: 'Barisal',
      price: '350.00',
      stockQty: 100,
      isBestSelling: false,
    },
    // Honey & Sweets
    {
      categoryId: cat['honey-sweets'],
      name: 'Sundarbans Wild Honey',
      slug: 'sundarbans-wild-honey',
      description: 'Raw, unprocessed honey collected from the Sundarbans mangrove forest by traditional mowaalis.',
      unit: '500g',
      sourceRegion: 'Sundarbans',
      price: '600.00',
      originalPrice: '700.00',
      stockQty: 60,
      isBestSelling: true,
    },
    {
      categoryId: cat['honey-sweets'],
      name: 'Litchi Honey',
      slug: 'litchi-honey',
      description: 'Delicate honey harvested during litchi bloom season.',
      unit: '500g',
      sourceRegion: 'Dinajpur',
      price: '500.00',
      stockQty: 40,
      isBestSelling: false,
    },
    {
      categoryId: cat['honey-sweets'],
      name: 'Nolen Gur (Date Palm Jaggery)',
      slug: 'nolen-gur',
      description: 'Seasonal raw date palm jaggery, harvested in winter. Rich, caramel-like sweetness.',
      unit: '500g',
      sourceRegion: 'Khulna',
      price: '250.00',
      originalPrice: '280.00',
      stockQty: 120,
      isBestSelling: true,
    },
    // Spices & Herbs
    {
      categoryId: cat['spices-herbs'],
      name: 'Black Cumin (Kalonji)',
      slug: 'black-cumin-kalonji',
      description: 'Premium quality black seed (nigella sativa), sourced directly from farmers.',
      unit: '200g',
      sourceRegion: 'Faridpur',
      price: '180.00',
      stockQty: 200,
      isBestSelling: false,
    },
    {
      categoryId: cat['spices-herbs'],
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      description: 'Pure turmeric powder, no fillers. High curcumin content.',
      unit: '200g',
      sourceRegion: 'Comilla',
      price: '120.00',
      stockQty: 250,
      isBestSelling: false,
    },
    {
      categoryId: cat['spices-herbs'],
      name: 'Dried Chili (Bogra)',
      slug: 'dried-chili-bogra',
      description: 'Sun-dried red chili from Bogra, medium-hot with deep color.',
      unit: '200g',
      sourceRegion: 'Bogra',
      price: '150.00',
      stockQty: 180,
      isBestSelling: false,
    },
    // Fish & Seafood
    {
      categoryId: cat['fish-seafood'],
      name: 'Dried Hilsa Fish (Shukna Ilish)',
      slug: 'shukna-ilish',
      description: 'Sun-dried hilsa fish, a traditional Bangladeshi delicacy.',
      unit: 'piece',
      sourceRegion: 'Chandpur',
      price: '450.00',
      originalPrice: '500.00',
      stockQty: 50,
      isBestSelling: true,
    },
    {
      categoryId: cat['fish-seafood'],
      name: 'Dried Shrimp (Chingri Shukna)',
      slug: 'chingri-shukna',
      description: 'Sun-dried small shrimp, full of umami flavor.',
      unit: '200g',
      sourceRegion: 'Cox\'s Bazar',
      price: '320.00',
      stockQty: 90,
      isBestSelling: false,
    },
    // Dairy & Eggs
    {
      categoryId: cat['dairy-eggs'],
      name: 'Bogra Doi (Yogurt)',
      slug: 'bogra-doi',
      description: 'Famous Bogra sweet yogurt — thick, creamy, mildly sweet. GI-tagged product.',
      unit: '500g',
      sourceRegion: 'Bogra',
      price: '180.00',
      stockQty: 70,
      isBestSelling: true,
    },
    {
      categoryId: cat['dairy-eggs'],
      name: 'Deshi Eggs (Farm Fresh)',
      slug: 'deshi-eggs',
      description: 'Free-range country chicken eggs. Rich yolk, natural feed.',
      unit: 'dozen',
      sourceRegion: 'Mymensingh',
      price: '200.00',
      stockQty: 150,
      isBestSelling: false,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ${insertedProducts.length} products inserted.`);

  // Banners
  console.log('Inserting banners...');
  const insertedBanners = await db
    .insert(banners)
    .values([
      {
        type: 'hero',
        title: 'খাঁটি পণ্য, সরাসরি কৃষক থেকে',
        subtitle: 'Authentic products delivered straight from the source to your doorstep',
        tagText: 'New Arrivals',
        ctaLabel: 'Shop Now',
        ctaHref: '/products',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'hero',
        title: 'সুন্দরবনের খাঁটি মধু',
        subtitle: 'Raw, unprocessed honey harvested by traditional Mowaalis',
        tagText: 'Best Seller',
        ctaLabel: 'Order Now',
        ctaHref: '/products/sundarbans-wild-honey',
        sortOrder: 2,
        isActive: true,
      },
      {
        type: 'side',
        title: 'দিনাজপুরের কাটারিভোগ চাল',
        subtitle: 'Premium aromatic rice',
        ctaLabel: 'Buy Now',
        ctaHref: '/products/kataribhog-rice',
        sortOrder: 1,
        isActive: true,
      },
      {
        type: 'promo',
        title: 'Free delivery on orders over ৳1500',
        ctaLabel: 'Shop Now',
        ctaHref: '/products',
        sortOrder: 1,
        isActive: true,
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`  ${insertedBanners.length} banners inserted.`);

  console.log('\nSeed complete.');
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => pool.end());
