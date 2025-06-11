import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

interface BusinessEnhancement {
  description?: string;
  shortDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  services?: string[];
  specialties?: string[];
}

export class AIContentEnhancer {
  private openai: OpenAI;
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Enhance all businesses in the database
   */
  async enhanceAllBusinesses(): Promise<void> {
    console.log('🤖 Starting AI content enhancement for all businesses...');
    
    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { aiGenerated: false },
          { aiGenerated: null },
          { description: null },
          { description: { equals: '' } }
        ]
      },
      take: 50 // Process in batches to avoid rate limits
    });

    console.log(`📊 Found ${businesses.length} businesses to enhance`);

    for (const business of businesses) {
      try {
        console.log(`🔧 Enhancing: ${business.name}`);
        
        const enhancement = await this.enhanceBusiness(business);
        
        await prisma.business.update({
          where: { id: business.id },
          data: {
            description: enhancement.description || business.description,
            shortDescription: enhancement.shortDescription,
            metaTitle: enhancement.metaTitle,
            metaDescription: enhancement.metaDescription,
            keywords: enhancement.keywords ? JSON.stringify(enhancement.keywords) : null,
            services: enhancement.services ? JSON.stringify(enhancement.services) : business.services,
            specialties: enhancement.specialties ? JSON.stringify(enhancement.specialties) : business.specialties,
            aiGenerated: true,
            lastAiUpdate: new Date()
          }
        });

        console.log(`✅ Enhanced: ${business.name}`);
        
        // Rate limiting
        await this.delay(1000);
      } catch (error: any) {
        console.error(`❌ Error enhancing ${business.name}:`, error.message);
      }
    }

    console.log('🎉 AI content enhancement completed!');
  }

  /**
   * Enhance a single business
   */
  private async enhanceBusiness(business: any): Promise<BusinessEnhancement> {
    const prompt = this.createEnhancementPrompt(business);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert local business content writer specializing in creating engaging, SEO-optimized content for businesses in Wellingborough, Northamptonshire. Always maintain factual accuracy while making content more engaging."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(response);
    } catch (error: any) {
      console.error('Error calling OpenAI:', error.message);
      return this.createFallbackEnhancement(business);
    }
  }

  /**
   * Create enhancement prompt for AI
   */
  private createEnhancementPrompt(business: any): string {
    return `
Please enhance the following local business information for a business directory in Wellingborough, Northamptonshire, UK.

Business Details:
- Name: ${business.name}
- Category: ${business.category}
- Current Description: ${business.description || 'No description available'}
- Address: ${business.address}
- Phone: ${business.phone || 'Not provided'}
- Website: ${business.website || 'Not provided'}

Please provide the following in JSON format:
{
  "description": "A engaging 150-200 word description that highlights what makes this business special, their services, and why local customers should choose them. Include local references to Wellingborough where appropriate.",
  "shortDescription": "A concise 50-60 word summary perfect for search results and listings",
  "metaTitle": "SEO-optimized title (60 characters max) including business name and location",
  "metaDescription": "SEO meta description (150-160 characters) that encourages clicks",
  "keywords": ["5-8 relevant keywords for local SEO"],
  "services": ["List 3-5 main services offered"],
  "specialties": ["List 2-3 unique selling points or specialties"]
}

Requirements:
- Keep all information factual and professional
- Include "Wellingborough" in the description naturally
- Make content engaging and customer-focused
- Optimize for local search
- Use British English spelling
- Ensure all text is unique and not copied from other sources
`;
  }

  /**
   * Parse AI response into structured data
   */
  private parseAIResponse(response: string): BusinessEnhancement {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        description: parsed.description?.trim(),
        shortDescription: parsed.shortDescription?.trim(),
        metaTitle: parsed.metaTitle?.trim(),
        metaDescription: parsed.metaDescription?.trim(),
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        services: Array.isArray(parsed.services) ? parsed.services : [],
        specialties: Array.isArray(parsed.specialties) ? parsed.specialties : []
      };
    } catch (error) {
      console.warn('Error parsing AI response, using fallback');
      return {};
    }
  }

  /**
   * Create fallback enhancement when AI fails
   */
  private createFallbackEnhancement(business: any): BusinessEnhancement {
    const businessType = business.category?.toLowerCase() || 'business';
    
    return {
      description: `${business.name} is a trusted ${businessType} serving the Wellingborough community. Located at ${business.address}, we are committed to providing excellent service to our local customers. Contact us today to learn more about our services.`,
      shortDescription: `Professional ${businessType} services in Wellingborough`,
      metaTitle: `${business.name} - ${business.category} in Wellingborough`,
      metaDescription: `${business.name} provides professional ${businessType} services in Wellingborough. Contact us today for excellent local service.`,
      keywords: [business.category, 'Wellingborough', 'local business', business.name.toLowerCase()],
      services: [`${business.category} Services`],
      specialties: ['Local Service', 'Professional Quality']
    };
  }

  /**
   * Generate local SEO content for businesses
   */
  async generateLocalSEOContent(businessId: string): Promise<void> {
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      throw new Error('Business not found');
    }

    const seoPrompt = `
Create local SEO content for ${business.name}, a ${business.category} business in Wellingborough, Northamptonshire.

Generate:
1. 5 blog post title ideas related to their services
2. Local landmark references that could be included in content
3. Seasonal content ideas for Wellingborough
4. Community event connections
5. Local competition analysis keywords

Format as JSON with keys: blogTitles, landmarks, seasonalContent, communityEvents, competitorKeywords
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a local SEO expert specializing in Wellingborough, Northamptonshire content strategy."
          },
          {
            role: "user",
            content: seoPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      });

      const response = completion.choices[0]?.message?.content;
      console.log('SEO Content Ideas:', response);
    } catch (error: any) {
      console.error('Error generating SEO content:', error.message);
    }
  }

  /**
   * Batch update business categories based on enhanced descriptions
   */
  async improveBusinessCategorization(): Promise<void> {
    console.log('📊 Improving business categorization...');

    const businesses = await prisma.business.findMany({
      where: {
        category: 'Professional Services' // Often the default/fallback category
      }
    });

    for (const business of businesses) {
      try {
        const categoryPrompt = `
Based on this business information, suggest the most accurate category:

Business: ${business.name}
Description: ${business.description}
Current Category: ${business.category}

Available categories:
- Food & Drink
- Retail  
- Health & Beauty
- Professional Services
- Home & Garden
- Automotive
- Entertainment
- Education
- Technology
- Property
- Sports & Fitness
- Charity & Community

Respond with just the category name that best fits.
`;

        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system", 
              content: "You are a business categorization expert. Analyze the business and suggest the most accurate category."
            },
            {
              role: "user",
              content: categoryPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 50
        });

        const suggestedCategory = completion.choices[0]?.message?.content?.trim();
        
        if (suggestedCategory && suggestedCategory !== business.category) {
          await prisma.business.update({
            where: { id: business.id },
            data: { category: suggestedCategory }
          });
          
          console.log(`📝 Updated ${business.name}: ${business.category} → ${suggestedCategory}`);
        }

        await this.delay(500);
      } catch (error: any) {
        console.error(`Error categorizing ${business.name}:`, error.message);
      }
    }
  }

  /**
   * Generate review response templates for businesses
   */
  async generateReviewResponseTemplates(): Promise<void> {
    console.log('💬 Generating review response templates...');

    const templates = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Create professional review response templates for local businesses in Wellingborough."
        },
        {
          role: "user",
          content: `
Create 5 different response templates for:
1. Positive 5-star reviews
2. Neutral 3-star reviews  
3. Negative 1-2 star reviews
4. Reviews mentioning specific issues
5. First-time customer reviews

Each template should:
- Thank the customer
- Be professional and friendly
- Include invitation to return
- Mention Wellingborough community when appropriate
- Be 50-100 words

Format as JSON with keys: positive, neutral, negative, issues, firstTime
`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const templates_content = templates.choices[0]?.message?.content;
    
    // Save templates to a file for businesses to use
    const fs = require('fs').promises;
    await fs.writeFile(
      'data/review-response-templates.json',
      templates_content || '{}',
      'utf8'
    );

    console.log('✅ Review response templates saved to data/review-response-templates.json');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
if (require.main === module) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable required');
    process.exit(1);
  }

  const enhancer = new AIContentEnhancer(apiKey);
  const args = process.argv.slice(2);
  const action = args[0] || 'enhance';

  switch (action) {
    case 'enhance':
      enhancer.enhanceAllBusinesses()
        .then(() => console.log('✅ Enhancement completed!'))
        .catch(console.error)
        .finally(() => prisma.$disconnect());
      break;

    case 'categorize':
      enhancer.improveBusinessCategorization()
        .then(() => console.log('✅ Categorization completed!'))
        .catch(console.error)
        .finally(() => prisma.$disconnect());
      break;

    case 'templates':
      enhancer.generateReviewResponseTemplates()
        .then(() => console.log('✅ Templates generated!'))
        .catch(console.error)
        .finally(() => prisma.$disconnect());
      break;

    case 'seo':
      const businessId = args[1];
      if (!businessId) {
        console.error('❌ Business ID required for SEO content generation');
        process.exit(1);
      }
      
      enhancer.generateLocalSEOContent(businessId)
        .then(() => console.log('✅ SEO content generated!'))
        .catch(console.error)
        .finally(() => prisma.$disconnect());
      break;

    default:
      console.log('Usage: npm run ai:[enhance|categorize|templates|seo]');
  }
}
