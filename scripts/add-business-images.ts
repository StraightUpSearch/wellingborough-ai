import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Professional business images by category
const businessImages = {
  'Food & Drink': {
    logo: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=400&fit=crop'
    ]
  },
  'Automotive': {
    logo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop'
    ]
  },
  'Health & Beauty': {
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop'
    ]
  },
  'Professional Services': {
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop'
    ]
  },
  'Technology': {
    logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop'
    ]
  },
  'Sports & Fitness': {
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=400&fit=crop'
    ]
  },
  'Retail': {
    logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop'
    ]
  },
  'Education': {
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop'
    ]
  },
  'Property': {
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=400&fit=crop'
    ]
  }
}

// Default fallback images
const defaultImages = {
  logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop'
  ]
}

async function addBusinessImages() {
  console.log('🖼️  Adding professional images to businesses...')
  
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        logo: true,
        coverImage: true,
        images: true
      }
    })
    
    console.log(`📊 Found ${businesses.length} businesses to update`)
    
    for (const business of businesses) {
      try {
        // Get appropriate images for this business category
        const categoryImages = businessImages[business.category as keyof typeof businessImages] || defaultImages
        
        // Only update if missing images
        const needsUpdate = !business.logo || !business.coverImage || !business.images
        
        if (needsUpdate) {
          await prisma.business.update({
            where: { id: business.id },
            data: {
              logo: business.logo || categoryImages.logo,
              coverImage: business.coverImage || categoryImages.coverImage,
              images: business.images || JSON.stringify(categoryImages.gallery)
            }
          })
          
          console.log(`✅ Updated images for: ${business.name}`)
        } else {
          console.log(`⏭️  ${business.name} already has images`)
        }
      } catch (error: any) {
        console.error(`❌ Error updating ${business.name}:`, error.message)
      }
    }
    
    console.log('🎉 Business image update completed!')
  } catch (error: any) {
    console.error('❌ Error updating business images:', error.message)
  }
}

// Run the update
if (require.main === module) {
  addBusinessImages()
    .then(() => {
      console.log('✅ Image update process completed!')
      return prisma.$disconnect()
    })
    .catch(console.error)
}

export { addBusinessImages } 