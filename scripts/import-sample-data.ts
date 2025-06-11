import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface SampleBusiness {
  name: string
  category: string
  address: string
  phone: string
  email: string
  website: string
  source: string
  description: string
}

function parseCSV(csvContent: string): SampleBusiness[] {
  const lines = csvContent.split('\n')
  const header = lines[0].split(',').map(col => col.replace(/"/g, '').trim())
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      // Simple CSV parsing - handles quoted fields
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim()) // Add the last value
      
      return {
        name: values[0] || '',
        category: values[1] || 'General',
        address: values[2] || '',
        phone: values[3] || '',
        email: values[4] || '',
        website: values[5] || '',
        source: values[6] || '',
        description: values[7] || ''
      }
    })
    .filter(business => business.name) // Filter out empty entries
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractPostcode(address: string): string {
  const postcodeMatch = address.match(/([A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2})/i)
  return postcodeMatch ? postcodeMatch[1] : ''
}

async function getOrCreateBusinessOwner(email: string, name: string): Promise<string> {
  if (!email) {
    // Use default scraped business owner
    email = 'scraped-businesses@wellingborough.ai'
    name = 'Scraped Business Data'
  }
  
  let user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    const hashedPassword = await bcrypt.hash('temppassword123', 12)
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isBusinessOwner: true,
        role: 'BUSINESS_OWNER'
      }
    })
  }
  
  return user.id
}

async function importSampleBusinesses() {
  console.log('📊 Importing quality sample businesses...')
  
  try {
    const csvPath = path.join(process.cwd(), 'data', 'sample-quality-businesses.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')
    const businesses = parseCSV(csvContent)
    
    console.log(`📋 Found ${businesses.length} businesses to import`)
    
    for (const business of businesses) {
      try {
        // Check if business already exists
        const existing = await prisma.business.findFirst({
          where: {
            OR: [
              { name: business.name },
              { slug: generateSlug(business.name) }
            ]
          }
        })
        
        if (existing) {
          console.log(`⏭️  Skipping existing: ${business.name}`)
          continue
        }
        
        const ownerId = await getOrCreateBusinessOwner(business.email, business.name)
        const postcode = extractPostcode(business.address)
        
        await prisma.business.create({
          data: {
            name: business.name,
            slug: generateSlug(business.name),
            description: business.description || `${business.name} is a local business in ${business.category.toLowerCase()} located in Wellingborough.`,
            shortDescription: business.description ? business.description.substring(0, 60) + '...' : `Local ${business.category.toLowerCase()} business`,
            category: business.category,
            address: business.address,
            postcode,
            phone: business.phone || null,
            email: business.email || null,
            website: business.website || null,
            status: 'ACTIVE',
            verified: true,
            verificationDate: new Date(),
            rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
            reviewCount: Math.floor(Math.random() * 20) + 5, // Random reviews 5-25
            ownerId
          }
        })
        
        console.log(`✅ Imported: ${business.name}`)
      } catch (error: any) {
        console.error(`❌ Error importing ${business.name}:`, error.message)
      }
    }
    
    console.log('🎉 Sample business import completed!')
  } catch (error: any) {
    console.error('❌ Error importing businesses:', error.message)
  }
}

// Run the import
if (require.main === module) {
  importSampleBusinesses()
    .then(() => {
      console.log('✅ Import process completed!')
      return prisma.$disconnect()
    })
    .catch(console.error)
}

export { importSampleBusinesses } 