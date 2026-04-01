import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Supplier data
const suppliers = [
  {
    email: 'supplier.uae@timberlink.com',
    password: 'Supplier123!',
    name: 'Ahmed Al-Rashid',
    company: 'Emirates Timber Trading LLC',
    country: 'United Arab Emirates',
    description: 'Leading timber importer and distributor in the UAE, serving construction and furniture industries across the GCC. We specialize in premium hardwoods from sustainable sources and offer custom cutting services.',
    certifications: ['ISO 9001', 'Dubai Chamber of Commerce', 'Green Building Council'],
    website: 'https://emiratestimber.ae'
  },
  {
    email: 'supplier.saudi@timberlink.com',
    password: 'Supplier123!',
    name: 'Khalid bin Mohammed',
    company: 'Al-Madinah Wood Industries',
    country: 'Saudi Arabia',
    description: 'Premier wood products manufacturer in Saudi Arabia with state-of-the-art facilities in Jeddah. Specializing in engineered wood products, MDF panels, and custom architectural millwork for mega projects.',
    certifications: ['SASO Certified', 'ISO 14001', 'Saudi Contractor Authority'],
    website: 'https://madinahwood.sa'
  },
  {
    email: 'supplier.malaysia@timberlink.com',
    password: 'Supplier123!',
    name: 'Tan Wei Ming',
    company: 'Borneo Tropical Hardwoods Sdn Bhd',
    country: 'Malaysia',
    description: 'Established in 1985, we are one of Malaysia\'s largest exporters of tropical hardwoods including Meranti, Keruing, and Merbau. All products sourced from legally certified Malaysian forests with full documentation.',
    certifications: ['MTCC Certified', 'PEFC', 'Malaysian Timber Council'],
    website: 'https://borneohardwoods.my'
  },
  {
    email: 'supplier.brazil@timberlink.com',
    password: 'Supplier123!',
    name: 'Carlos Eduardo Santos',
    company: 'Madeiras do Sul Exportadora',
    country: 'Brazil',
    description: 'Family-owned Brazilian timber exporter since 1962. Specializing in premium tropical hardwoods including Ipe, Cumaru, Jatoba, and Tigerwood. Full chain of custody documentation and sustainable harvesting practices.',
    certifications: ['FSC', 'IBAMA DOF', 'Rainforest Alliance', 'CERFLOR'],
    website: 'https://madeirasul.com.br'
  },
  {
    email: 'supplier.finland@timberlink.com',
    password: 'Supplier123!',
    name: 'Mikko Virtanen',
    company: 'Nordic Pine & Spruce Oy',
    country: 'Finland',
    description: 'Finnish timber producer specializing in slow-grown Nordic softwoods with exceptional density and grain quality. Our kiln-dried lumber meets the highest European standards for construction and joinery applications.',
    certifications: ['PEFC Finland', 'FSC', 'CE Marking', 'ISO 14001'],
    website: 'https://nordicpine.fi'
  }
]

// Listings data - 15 listings distributed across suppliers
const listings = [
  // UAE Supplier listings (3)
  {
    supplierIndex: 0,
    listing_type: 'timber',
    title: 'Premium Teak Lumber - Kiln Dried Grade A',
    description: 'Imported premium Burmese Teak, kiln dried to 10-12% moisture content. Ideal for luxury furniture, yacht building, and high-end interior applications. Golden brown color with excellent natural oils for durability.',
    wood_type: 'Teak',
    category: 'Hardwood',
    price: 3200,
    currency: 'USD',
    quantity: 50,
    unit: 'm³',
    country_origin: 'Myanmar',
    grade: 'A'
  },
  {
    supplierIndex: 0,
    listing_type: 'wood_product',
    title: 'White Oak Flooring Planks - Engineered',
    description: 'Premium engineered white oak flooring with 4mm wear layer. UV-cured finish for durability. Tongue and groove installation. Perfect for residential and commercial projects in the GCC region.',
    wood_type: 'Oak',
    category: 'Flooring',
    price: 85,
    currency: 'USD',
    quantity: 5000,
    unit: 'sqm',
    country_origin: 'Germany',
    grade: 'Select'
  },
  {
    supplierIndex: 0,
    listing_type: 'timber',
    title: 'African Padauk Timber Logs',
    description: 'Vibrant red-orange African Padauk timber, freshly imported. Excellent for decorative woodworking, musical instruments, and statement furniture pieces. Air dried, ready for processing.',
    wood_type: 'Padauk',
    category: 'Hardwood',
    price: 1800,
    currency: 'USD',
    quantity: 30,
    unit: 'm³',
    country_origin: 'Cameroon',
    grade: 'Premium'
  },

  // Saudi Arabia Supplier listings (3)
  {
    supplierIndex: 1,
    listing_type: 'wood_product',
    title: 'MDF Panels - Moisture Resistant E1',
    description: 'High-density moisture-resistant MDF panels manufactured to European E1 emission standards. 18mm thickness, ideal for kitchen cabinets, bathroom vanities, and interior millwork in humid climates.',
    wood_type: 'MDF',
    category: 'Panels',
    price: 32,
    currency: 'USD',
    quantity: 10000,
    unit: 'piece',
    country_origin: 'Saudi Arabia',
    grade: 'E1'
  },
  {
    supplierIndex: 1,
    listing_type: 'wood_product',
    title: 'Laminated Veneer Lumber (LVL) Beams',
    description: 'Structural LVL beams for construction applications. High strength-to-weight ratio, consistent quality without natural defects. Available in standard and custom lengths up to 24 meters.',
    wood_type: 'Pine',
    category: 'Engineered',
    price: 580,
    currency: 'USD',
    quantity: 200,
    unit: 'm³',
    country_origin: 'Finland',
    grade: 'Structural'
  },
  {
    supplierIndex: 1,
    listing_type: 'wood_product',
    title: 'Walnut Wood Veneer Sheets',
    description: 'Premium American Black Walnut veneer sheets. 0.6mm thickness, backed for easy application. Rich chocolate brown color with distinctive grain patterns. Perfect for luxury furniture and wall paneling.',
    wood_type: 'Walnut',
    category: 'Veneer',
    price: 65,
    currency: 'USD',
    quantity: 3000,
    unit: 'sqm',
    country_origin: 'United States',
    grade: 'AA'
  },

  // Malaysia Supplier listings (3)
  {
    supplierIndex: 2,
    listing_type: 'timber',
    title: 'Meranti Red Lumber - Sawn Timber',
    description: 'Dark Red Meranti sawn timber, one of Southeast Asia\'s most popular hardwoods. Excellent workability, moderate durability. Ideal for furniture, doors, windows, and general construction. MTCC certified sustainable.',
    wood_type: 'Meranti',
    category: 'Hardwood',
    price: 420,
    currency: 'USD',
    quantity: 300,
    unit: 'm³',
    country_origin: 'Malaysia',
    grade: 'Standard & Better'
  },
  {
    supplierIndex: 2,
    listing_type: 'timber',
    title: 'Merbau Decking Boards - Pre-Grooved',
    description: 'Premium Merbau decking boards with anti-slip grooves. Naturally durable Class 1 hardwood with rich reddish-brown color. Perfect for outdoor decks, pool surrounds, and commercial walkways.',
    wood_type: 'Merbau',
    category: 'Decking',
    price: 1450,
    currency: 'USD',
    quantity: 80,
    unit: 'm³',
    country_origin: 'Malaysia',
    grade: 'Select'
  },
  {
    supplierIndex: 2,
    listing_type: 'timber',
    title: 'Keruing Heavy Construction Timber',
    description: 'Dense Keruing hardwood for heavy-duty construction applications. Excellent for marine work, truck beds, container flooring, and industrial applications. High mechanical strength and natural durability.',
    wood_type: 'Keruing',
    category: 'Hardwood',
    price: 380,
    currency: 'USD',
    quantity: 500,
    unit: 'm³',
    country_origin: 'Malaysia',
    grade: 'Utility'
  },

  // Brazil Supplier listings (3)
  {
    supplierIndex: 3,
    listing_type: 'timber',
    title: 'Brazilian Ipe Hardwood - Decking Grade',
    description: 'Genuine Brazilian Ipe, the ultimate decking hardwood. Janka hardness 3680, naturally resistant to rot, decay, and insects. Will last 40+ years outdoors without treatment. FSC certified sustainable harvest.',
    wood_type: 'Ipe',
    category: 'Hardwood',
    price: 3500,
    currency: 'USD',
    quantity: 100,
    unit: 'm³',
    country_origin: 'Brazil',
    grade: 'Premium'
  },
  {
    supplierIndex: 3,
    listing_type: 'timber',
    title: 'Cumaru Golden Teak Alternative',
    description: 'Brazilian Cumaru, often called "Brazilian Teak" for its similar appearance at a fraction of the cost. Excellent durability, beautiful golden-brown color. Perfect for decking and outdoor furniture.',
    wood_type: 'Cumaru',
    category: 'Hardwood',
    price: 1850,
    currency: 'USD',
    quantity: 150,
    unit: 'm³',
    country_origin: 'Brazil',
    grade: 'Select'
  },
  {
    supplierIndex: 3,
    listing_type: 'timber',
    title: 'Jatoba Cherry Flooring Blanks',
    description: 'Brazilian Cherry (Jatoba) flooring blanks ready for milling. Rich reddish-brown color that deepens with age. Extremely hard and durable. Ideal for high-traffic residential and commercial flooring.',
    wood_type: 'Jatoba',
    category: 'Hardwood',
    price: 1200,
    currency: 'USD',
    quantity: 200,
    unit: 'm³',
    country_origin: 'Brazil',
    grade: 'Clear'
  },

  // Finland Supplier listings (3)
  {
    supplierIndex: 4,
    listing_type: 'timber',
    title: 'Finnish Spruce Structural Timber C24',
    description: 'Slow-grown Finnish spruce, strength graded C24 to EN 14081. Kiln dried to 18% MC. Excellent dimensional stability and workability. Perfect for timber frame construction, roof trusses, and general building.',
    wood_type: 'Spruce',
    category: 'Softwood',
    price: 320,
    currency: 'USD',
    quantity: 1000,
    unit: 'm³',
    country_origin: 'Finland',
    grade: 'C24'
  },
  {
    supplierIndex: 4,
    listing_type: 'timber',
    title: 'Nordic Redwood Pine - Joinery Grade',
    description: 'Premium Finnish Redwood pine selected for joinery applications. Minimal knots, straight grain, excellent finish quality. Kiln dried to 12% MC. Ideal for windows, doors, and interior trim.',
    wood_type: 'Pine',
    category: 'Softwood',
    price: 480,
    currency: 'USD',
    quantity: 400,
    unit: 'm³',
    country_origin: 'Finland',
    grade: 'Joinery'
  },
  {
    supplierIndex: 4,
    listing_type: 'wood_product',
    title: 'Birch Plywood Baltic Grade BB/BB',
    description: 'Premium Finnish birch plywood with BB/BB face grades. 15-ply cross-laminated construction for superior strength and stability. Perfect for furniture, cabinetry, CNC machining, and architectural applications.',
    wood_type: 'Birch',
    category: 'Plywood',
    price: 95,
    currency: 'USD',
    quantity: 3000,
    unit: 'piece',
    country_origin: 'Finland',
    grade: 'BB/BB'
  }
]

async function seedDatabase() {
  console.log('🌲 Starting TimberLink seed data import...\n')

  const userIds: string[] = []
  const supplierIds: string[] = []

  // Step 1: Create users and get their IDs
  console.log('📧 Creating supplier user accounts...')
  for (const supplier of suppliers) {
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const existing = existingUser?.users.find(u => u.email === supplier.email)

    if (existing) {
      console.log(`  ✓ User ${supplier.email} already exists`)
      userIds.push(existing.id)
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: supplier.email,
        password: supplier.password,
        email_confirm: true,
        user_metadata: {
          name: supplier.name,
          role: 'seller'
        }
      })

      if (authError) {
        console.error(`  ✗ Failed to create user ${supplier.email}:`, authError.message)
        continue
      }

      console.log(`  ✓ Created user: ${supplier.email} (${authData.user.id})`)
      userIds.push(authData.user.id)
    }
  }

  console.log(`\n✅ ${userIds.length} user accounts ready\n`)

  // Step 2: Create supplier profiles
  console.log('🏢 Creating supplier profiles...')
  for (let i = 0; i < suppliers.length; i++) {
    if (!userIds[i]) continue

    const supplier = suppliers[i]
    const { data: supplierData, error: supplierError } = await supabase
      .from('suppliers')
      .upsert({
        user_id: userIds[i],
        company_name: supplier.company,
        description: supplier.description,
        country: supplier.country,
        certifications: supplier.certifications,
        website: supplier.website
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (supplierError) {
      console.error(`  ✗ Failed to create supplier ${supplier.company}:`, supplierError.message)
      continue
    }

    console.log(`  ✓ Created supplier: ${supplier.company} (${supplier.country})`)
    supplierIds.push(supplierData.id)
  }

  console.log(`\n✅ ${supplierIds.length} supplier profiles created\n`)

  // Step 3: Create listings
  console.log('📦 Creating product listings...')
  let listingsCreated = 0

  for (const listing of listings) {
    const sellerId = userIds[listing.supplierIndex]
    if (!sellerId) {
      console.error(`  ✗ No seller ID for listing: ${listing.title}`)
      continue
    }

    const { error: listingError } = await supabase
      .from('listings')
      .upsert({
        seller_id: sellerId,
        listing_type: listing.listing_type,
        title: listing.title,
        description: listing.description,
        wood_type: listing.wood_type,
        category: listing.category,
        price: listing.price,
        currency: listing.currency,
        quantity: listing.quantity,
        unit: listing.unit,
        country_origin: listing.country_origin,
        grade: listing.grade,
        status: 'active',
        images: []
      }, { onConflict: 'id', ignoreDuplicates: false })

    if (listingError) {
      console.error(`  ✗ Failed to create listing "${listing.title}":`, listingError.message)
      continue
    }

    console.log(`  ✓ ${listing.title}`)
    listingsCreated++
  }

  console.log(`\n✅ ${listingsCreated} listings created\n`)

  // Summary
  console.log('═══════════════════════════════════════════')
  console.log('📊 SEED DATA SUMMARY')
  console.log('═══════════════════════════════════════════')
  console.log(`   Users created:     ${userIds.length}`)
  console.log(`   Suppliers created: ${supplierIds.length}`)
  console.log(`   Listings created:  ${listingsCreated}`)
  console.log('═══════════════════════════════════════════')
  console.log('\n🎉 Seed data import complete!')
}

// Run the seed function
seedDatabase().catch(console.error)
