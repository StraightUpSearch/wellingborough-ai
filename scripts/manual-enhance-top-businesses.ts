import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const businessEnhancements = [
  {
    name: "The Boot Inn",
    description: "A traditional Wellingborough pub offering real ales, hearty home-cooked meals, and a warm community atmosphere. The Boot Inn has been serving locals for generations with quality food, friendly service, and the perfect spot for catching up with friends over a pint.",
    shortDescription: "Traditional Wellingborough pub serving real ales and home-cooked meals in a warm community atmosphere."
  },
  {
    name: "Market Square Cafe", 
    description: "Located in the heart of Wellingborough's Market Square, this family-run cafe serves freshly made sandwiches, hot meals, and specialty coffee. Perfect for shoppers and workers looking for quality food in a convenient location with friendly service.",
    shortDescription: "Family-run cafe in Market Square serving fresh sandwiches, hot meals, and specialty coffee."
  },
  {
    name: "Swanspool Garages",
    description: "Full-service garage on London Road offering MOTs, servicing, and repairs for all vehicle makes. With experienced mechanics and competitive prices, Swanspool Garages provides reliable automotive services you can trust for your car's maintenance needs.",
    shortDescription: "Full-service garage offering MOTs, servicing, and repairs for all vehicle makes on London Road."
  },
  {
    name: "Wellingborough Hair Studio",
    description: "Professional hair salon on Sheep Street offering cuts, colors, and treatments. Our experienced stylists provide personalized service in a relaxed environment, helping you achieve the perfect look for any occasion.",
    shortDescription: "Professional hair salon offering cuts, colors, and treatments in Wellingborough town center."
  },
  {
    name: "Redwell Fitness Centre",
    description: "Modern fitness center on Redwell Road featuring gym equipment, group classes, and swimming pool. Whether you're starting your fitness journey or training for goals, we provide the facilities and support you need.",
    shortDescription: "Modern fitness center with gym equipment, group classes, and swimming pool on Redwell Road."
  },
  {
    name: "Alberto's at the Chequers",
    description: "Authentic Italian dining experience in Wellingborough, offering fresh pasta, stone-baked pizzas, and traditional dishes. Alberto's combines genuine Italian flavors with warm hospitality in a cozy restaurant setting.",
    shortDescription: "Authentic Italian restaurant offering fresh pasta, stone-baked pizzas, and traditional dishes."
  },
  {
    name: "Casa Picanta Mexican Grill",
    description: "Vibrant Mexican restaurant bringing authentic flavors to Wellingborough. From sizzling fajitas to fresh guacamole, Casa Picanta offers a taste of Mexico with quality ingredients and lively atmosphere.",
    shortDescription: "Vibrant Mexican restaurant offering authentic flavors with sizzling fajitas and fresh guacamole."
  },
  {
    name: "Coach and Horses Pub",
    description: "Traditional British pub serving quality ales, pub classics, and hosting community events. The Coach and Horses provides a welcoming atmosphere for locals to gather, enjoy good food, and watch sports.",
    shortDescription: "Traditional British pub serving quality ales, pub classics, and hosting community events."
  }
]

async function enhanceTopBusinesses() {
  console.log('🔧 Manually enhancing top businesses...')
  
  for (const enhancement of businessEnhancements) {
    try {
      const business = await prisma.business.findFirst({
        where: {
          name: {
            contains: enhancement.name
          }
        }
      })
      
      if (business) {
        await prisma.business.update({
          where: { id: business.id },
          data: {
            description: enhancement.description,
            shortDescription: enhancement.shortDescription,
            lastAiUpdate: new Date()
          }
        })
        console.log(`✅ Enhanced: ${enhancement.name}`)
      } else {
        console.log(`⚠️  Business not found: ${enhancement.name}`)
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${enhancement.name}:`, error)
    }
  }
  
  console.log('🎉 Manual enhancement completed!')
}

enhanceTopBusinesses()
  .catch((e) => {
    console.error('❌ Enhancement failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 