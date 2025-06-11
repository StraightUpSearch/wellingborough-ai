import { PrismaClient } from '@prisma/client'
import BusinessesClient from './businesses-client'

const prisma = new PrismaClient()

async function getBusinesses() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3 // Get latest 3 reviews for preview
        }
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export default async function BusinessesPage() {
  const businesses = await getBusinesses()
  
  return <BusinessesClient businesses={businesses} />
} 