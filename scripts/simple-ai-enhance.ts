import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function enhanceBusinessDescriptions() {
  console.log('🤖 Starting AI content enhancement...')
  
  // Get businesses that need descriptions
  const businesses = await prisma.business.findMany({
    where: {
      OR: [
        { description: null },
        { description: '' },
        { shortDescription: null },
        { shortDescription: '' }
      ]
    },
    take: 10 // Start with first 10 businesses
  })

  console.log(`📊 Found ${businesses.length} businesses to enhance`)

  for (const business of businesses) {
    console.log(`🔄 Enhancing: ${business.name}`)
    
    try {
      const prompt = `Write a compelling 2-3 sentence business description for "${business.name}", a ${business.category.toLowerCase()} business in Wellingborough, Northamptonshire. 

Business details:
- Name: ${business.name}
- Category: ${business.category}
- Address: ${business.address}
${business.phone ? `- Phone: ${business.phone}` : ''}
${business.website ? `- Website: ${business.website}` : ''}

Write in a professional, welcoming tone that highlights what makes this local business special for Wellingborough residents. Focus on local community value and quality service.`

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      })

      const aiDescription = completion.choices[0]?.message?.content?.trim()
      const shortDescription = aiDescription?.slice(0, 120) + (aiDescription && aiDescription.length > 120 ? '...' : '')

      if (aiDescription) {
        await prisma.business.update({
          where: { id: business.id },
          data: {
            description: aiDescription,
            shortDescription: shortDescription,
            lastAiUpdate: new Date()
          }
        })
        
        console.log(`✅ Enhanced: ${business.name}`)
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`❌ Error enhancing ${business.name}:`, error)
    }
  }

  console.log('🎉 AI enhancement completed!')
}

enhanceBusinessDescriptions()
  .catch((e) => {
    console.error('❌ Enhancement failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 