import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for business signup
const businessSignupSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessType: z.string().min(1, 'Business type is required'),
  address: z.string().min(5, 'Business address is required'),
  website: z.string().optional(),
  currentMarketing: z.array(z.string()).default([]),
  monthlyMarketingBudget: z.string().optional(),
  primaryGoals: z.array(z.string()).default([]),
  preferredTier: z.enum(['premium', 'professional', 'enterprise']),
  additionalRequirements: z.string().optional(),
  hearAboutUs: z.string().optional(),
})

type BusinessSignupData = z.infer<typeof businessSignupSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the data
    const validatedData = businessSignupSchema.parse(body)
    
    // Here you can integrate with your preferred email service
    // Examples: SendGrid, Mailgun, AWS SES, or simple SMTP
    
    // For now, we'll log the data and simulate success
    console.log('New business signup:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    })
    
    // Send notification email to your team
    await sendNotificationEmail(validatedData)
    
    // Send welcome email to business owner
    await sendWelcomeEmail(validatedData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application received successfully' 
    })
    
  } catch (error) {
    console.error('Business signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid form data',
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

async function sendNotificationEmail(data: BusinessSignupData) {
  // This is where you'd integrate with your email service
  // For development, we'll just log it
  
  const emailContent = `
New Business Signup - Wellingborough.ai

Business Details:
- Name: ${data.businessName}
- Contact: ${data.contactName}
- Email: ${data.email}
- Phone: ${data.phone}
- Type: ${data.businessType}
- Address: ${data.address}
- Website: ${data.website || 'Not provided'}

Marketing Information:
- Current Marketing: ${data.currentMarketing.join(', ') || 'None specified'}
- Monthly Budget: ${data.monthlyMarketingBudget || 'Not specified'}
- Primary Goals: ${data.primaryGoals.join(', ') || 'None specified'}
- Preferred Tier: ${data.preferredTier}
- How they heard about us: ${data.hearAboutUs || 'Not specified'}

Additional Requirements:
${data.additionalRequirements || 'None provided'}

Follow-up Action Required:
1. Call within 24 hours to discuss their needs
2. Prepare a custom proposal based on their tier preference
3. Set up their premium business profile
4. Plan their first leaflet campaign if applicable

Tier Recommendations:
${data.preferredTier === 'premium' ? '✓ Premium (£25/month) - Basic digital presence' : ''}
${data.preferredTier === 'professional' ? '✓ Professional (£65/month) - Digital + Leaflet campaigns' : ''}
${data.preferredTier === 'enterprise' ? '✓ Enterprise (£150/month) - Full service solution' : ''}
  `
  
  console.log('EMAIL TO TEAM:', emailContent)
  
  // TODO: Replace with actual email service integration
  // Example with SendGrid:
  // const msg = {
  //   to: 'sales@wellingborough.ai',
  //   from: 'noreply@wellingborough.ai',
  //   subject: `New Business Signup: ${data.businessName}`,
  //   text: emailContent,
  // }
  // await sgMail.send(msg)
}

async function sendWelcomeEmail(data: BusinessSignupData) {
  const welcomeContent = `
Subject: Welcome to Wellingborough.ai - We'll Call You Within 24 Hours!

Hi ${data.contactName},

Thank you for your interest in Wellingborough.ai! We're excited to help ${data.businessName} grow with our premium digital listing and leaflet campaign services.

What happens next:
1. 📞 Our team will call you within 24 hours to discuss your specific needs
2. 🎨 We'll set up your premium business profile with AI-enhanced content
3. 📬 Design your first leaflet campaign (Professional tier and above)
4. 📈 Launch and start tracking your results with real-time analytics

Your Selected Package: ${data.preferredTier.charAt(0).toUpperCase() + data.preferredTier.slice(1)}

Why businesses choose us over LiveLocalAds:
✓ 50% lower cost (£25/month vs £50/month)
✓ Real-time analytics instead of print-only
✓ AI-powered content that gets results
✓ No long-term contracts
✓ 22% savings on leaflet distribution

Questions before we call? 
Reply to this email or call us directly at 01933 XXX XXX

Best regards,
The Wellingborough.ai Team

P.S. We're local too! We understand what works in Wellingborough because we're part of the community.
  `
  
  console.log('EMAIL TO CUSTOMER:', welcomeContent)
  
  // TODO: Replace with actual email service integration
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
} 