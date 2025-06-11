import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: hashedPassword,
      isBusinessOwner: false,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2b9?w=150&h=150&fit=crop&crop=face',
      bio: 'Local resident and community enthusiast',
      phone: '01933 123456',
      location: 'Wellingborough'
    }
  })

  const businessOwner1 = await prisma.user.create({
    data: {
      name: 'Mike Thompson',
      email: 'mike@castleinn.co.uk',
      password: hashedPassword,
      isBusinessOwner: true,
      role: 'BUSINESS_OWNER',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Owner of The Castle Inn - serving Wellingborough since 1995',
      phone: '01933 234567',
      location: 'Wellingborough'
    }
  })

  const businessOwner2 = await prisma.user.create({
    data: {
      name: 'Emma Davis',
      email: 'emma@techsolutions.co.uk',
      password: hashedPassword,
      isBusinessOwner: true,
      role: 'BUSINESS_OWNER',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech entrepreneur helping local businesses digitize',
      phone: '01933 345678',
      location: 'Wellingborough'
    }
  })

  // Create sample businesses
  const business1 = await prisma.business.create({
    data: {
      name: 'The Castle Inn',
      slug: 'the-castle-inn',
      description: 'Traditional British pub in the heart of Wellingborough, serving fresh local cuisine and fine ales. Family-friendly atmosphere with a rich history dating back to the 18th century.',
      shortDescription: 'Traditional British pub with fresh local cuisine and fine ales',
      category: 'Food & Drink',
      subcategory: 'Pub',
      address: '25 Castle Street',
      city: 'Wellingborough',
      postcode: 'NN8 1AE',
      county: 'Northamptonshire',
      phone: '01933 234567',
      email: 'info@castleinn.co.uk',
      website: 'https://castleinn.co.uk',
      logo: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=400&fit=crop'
      ]),
      openingHours: JSON.stringify({
        monday: { open: '12:00', close: '23:00' },
        tuesday: { open: '12:00', close: '23:00' },
        wednesday: { open: '12:00', close: '23:00' },
        thursday: { open: '12:00', close: '23:00' },
        friday: { open: '12:00', close: '00:00' },
        saturday: { open: '12:00', close: '00:00' },
        sunday: { open: '12:00', close: '22:00' }
      }),
      services: JSON.stringify(['Restaurant', 'Bar', 'Private Events', 'Beer Garden', 'Live Music']),
      specialties: JSON.stringify(['Real Ales', 'Sunday Roasts', 'Local Produce', 'Historic Venue']),
      yearEstablished: 1995,
      numberOfEmployees: '11-20',
      status: 'ACTIVE',
      featured: true,
      verified: true,
      verificationDate: new Date(),
      claimedAt: new Date(),
      rating: 4.5,
      reviewCount: 23,
      viewCount: 156,
      clickCount: 89,
      latitude: 52.3026,
      longitude: -0.6849,
      accessibility: JSON.stringify(['Wheelchair Access', 'Disabled Parking', 'Accessible Toilets']),
      paymentMethods: JSON.stringify(['Cash', 'Card', 'Contactless', 'Apple Pay', 'Google Pay']),
      languages: JSON.stringify(['English']),
      priceRange: 'MODERATE',
      facebookUrl: 'https://facebook.com/castleinn',
      instagramUrl: 'https://instagram.com/castleinn',
      metaTitle: 'The Castle Inn - Traditional British Pub in Wellingborough',
      metaDescription: 'Experience traditional British hospitality at The Castle Inn. Fresh local cuisine, fine ales, and warm atmosphere in the heart of Wellingborough.',
      keywords: JSON.stringify(['pub', 'restaurant', 'wellingborough', 'local food', 'real ales', 'traditional']),
      ownerId: businessOwner1.id
    }
  })

  const business2 = await prisma.business.create({
    data: {
      name: 'Tech Solutions Wellingborough',
      slug: 'tech-solutions-wellingborough',
      description: 'Leading technology consultancy helping local businesses embrace digital transformation. We specialize in website development, digital marketing, and IT support tailored for Wellingborough businesses.',
      shortDescription: 'Technology consultancy specializing in digital transformation for local businesses',
      category: 'Technology',
      subcategory: 'IT Services',
      address: '42 High Street',
      city: 'Wellingborough',
      postcode: 'NN8 4HR',
      county: 'Northamptonshire',
      phone: '01933 345678',
      email: 'hello@techsolutions.co.uk',
      website: 'https://techsolutions.co.uk',
      logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop'
      ]),
      openingHours: JSON.stringify({
        monday: { open: '09:00', close: '17:30' },
        tuesday: { open: '09:00', close: '17:30' },
        wednesday: { open: '09:00', close: '17:30' },
        thursday: { open: '09:00', close: '17:30' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { closed: true },
        sunday: { closed: true }
      }),
      services: JSON.stringify(['Web Development', 'Digital Marketing', 'IT Support', 'Cloud Solutions', 'Training']),
      specialties: JSON.stringify(['Small Business Focus', 'Local SEO', 'E-commerce', 'WordPress']),
      yearEstablished: 2018,
      numberOfEmployees: '6-10',
      status: 'ACTIVE',
      featured: true,
      verified: true,
      verificationDate: new Date(),
      claimedAt: new Date(),
      rating: 4.8,
      reviewCount: 15,
      viewCount: 203,
      clickCount: 145,
      latitude: 52.3021,
      longitude: -0.6831,
      accessibility: JSON.stringify(['Wheelchair Access', 'Lift Access', 'Accessible Toilets']),
      paymentMethods: JSON.stringify(['Bank Transfer', 'Card', 'PayPal', 'Direct Debit']),
      languages: JSON.stringify(['English']),
      priceRange: 'MODERATE',
      linkedinUrl: 'https://linkedin.com/company/techsolutions-wellingborough',
      twitterUrl: 'https://twitter.com/techsolswell',
      metaTitle: 'Tech Solutions Wellingborough - Digital Transformation Experts',
      metaDescription: 'Expert technology consultancy in Wellingborough. Web development, digital marketing & IT support for local businesses.',
      keywords: JSON.stringify(['technology', 'web development', 'digital marketing', 'wellingborough', 'IT support']),
      ownerId: businessOwner2.id
    }
  })

  // Create sample reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Absolutely love The Castle Inn! Great atmosphere, fantastic food, and the staff are so friendly. The Sunday roast is legendary - definitely coming back!',
      userId: user1.id,
      businessId: business1.id
    }
  })

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Emma and her team at Tech Solutions transformed our business website. Professional service and they really understand local businesses. Highly recommended!',
      userId: businessOwner1.id,
      businessId: business2.id
    }
  })

  // Create a sample event
  await prisma.event.create({
    data: {
      title: 'Wellingborough Summer Festival',
      description: 'Join us for a fantastic day of music, food, and fun at the annual Wellingborough Summer Festival. Local businesses, live entertainment, and activities for all the family.',
      location: 'Croyland Park',
      address: 'Croyland Park, Wellingborough NN8 1LW',
      startDate: new Date('2024-07-15T10:00:00Z'),
      endDate: new Date('2024-07-15T18:00:00Z'),
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
      price: 0,
      category: 'Community',
      featured: true,
      attendeeCount: 150,
      maxAttendees: 500,
      organizerId: user1.id
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created ${await prisma.user.count()} users`)
  console.log(`🏢 Created ${await prisma.business.count()} businesses`)
  console.log(`⭐ Created ${await prisma.review.count()} reviews`)
  console.log(`📅 Created ${await prisma.event.count()} events`)
  
  console.log('\n🔐 Test Accounts:')
  console.log('📧 sarah@example.com (User) - password: password123')
  console.log('📧 mike@castleinn.co.uk (Business Owner) - password: password123')
  console.log('📧 emma@techsolutions.co.uk (Business Owner) - password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 