import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  isBusinessOwner: z.boolean().optional().default(false),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
  phone: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email.toLowerCase()
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        isBusinessOwner: validatedData.isBusinessOwner,
        phone: validatedData.phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        isBusinessOwner: true,
        createdAt: true
      }
    })

    // If registering as business owner, create placeholder business
    if (validatedData.isBusinessOwner && validatedData.businessName) {
      const businessSlug = validatedData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      await prisma.business.create({
        data: {
          name: validatedData.businessName,
          slug: businessSlug,
          category: validatedData.businessCategory || 'General',
          address: 'Address to be updated',
          description: 'Description to be added',
          verified: false,
          featured: false,
          ownerId: user.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 