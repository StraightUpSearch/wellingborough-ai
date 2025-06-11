import { PrismaClient } from '@prisma/client'
import EventsClient from './events-client'

const prisma = new PrismaClient()

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            name: true,
            email: true
          }
        },
        business: {
          select: {
            name: true,
            address: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { startDate: 'asc' }
      ]
    })

    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function EventsPage() {
  const events = await getEvents()
  
  return <EventsClient events={events} />
} 