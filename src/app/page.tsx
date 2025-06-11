'use client'

import Link from 'next/link'
import { BusinessSignupCTA } from '@/components/BusinessSignupCTA'
import { PrismaClient } from '@prisma/client'
import { 
  MagnifyingGlassIcon,
  StarIcon,
  MapPinIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const prisma = new PrismaClient()

async function getFeaturedBusinesses() {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        featured: true
      },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      take: 6
    })
    return businesses
  } catch (error) {
    console.error('Error fetching featured businesses:', error)
    return []
  }
}

async function getStats() {
  try {
    const [businessCount, reviewCount] = await Promise.all([
      prisma.business.count({ where: { status: 'ACTIVE' } }),
      prisma.review.count()
    ])
    return { businessCount, reviewCount }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { businessCount: 0, reviewCount: 0 }
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIconSolid
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const [featuredBusinesses, stats] = await Promise.all([
    getFeaturedBusinesses(),
    getStats()
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&q=80"
            alt="Wellingborough town center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Amazing Local
              <span className="block text-yellow-400">Businesses in Wellingborough</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your AI-powered gateway to the best local businesses, services, and experiences. 
              Connect with your community like never before.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for restaurants, services, shops..."
                  className="block w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl bg-white shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-center mb-2">
                  <BuildingOfficeIcon className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.businessCount}+</div>
                <div className="text-blue-100">Local Businesses</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-center mb-2">
                  <StarIcon className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">{stats.reviewCount}+</div>
                <div className="text-blue-100">Customer Reviews</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-center mb-2">
                  <UsersIcon className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-blue-100">Local Focus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for in Wellingborough
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Food & Drink', icon: '🍽️', count: '25+' },
              { name: 'Health & Beauty', icon: '💄', count: '18+' },
              { name: 'Professional Services', icon: '💼', count: '30+' },
              { name: 'Technology', icon: '💻', count: '15+' },
              { name: 'Sports & Fitness', icon: '🏃', count: '12+' },
              { name: 'Retail', icon: '🛍️', count: '20+' }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/businesses?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} businesses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Discover top-rated local businesses in Wellingborough
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/businesses/${business.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={business.coverImage || business.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80'}
                    alt={business.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {business.category}
                    </span>
                    {business.verified && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                    {business.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <StarRating rating={business.rating} />
                    <span className="ml-2 text-sm text-gray-600">
                      {business.rating.toFixed(1)} ({business.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="truncate">{business.address}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/businesses"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Wellingborough.ai?
            </h2>
            <p className="text-xl text-gray-600">
              The smartest way to discover and connect with local businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Businesses</h3>
              <p className="text-gray-600">
                All businesses are verified and regularly updated to ensure accuracy and reliability.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real Reviews</h3>
              <p className="text-gray-600">
                Authentic customer reviews from real people in the Wellingborough community.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hyper-Local Focus</h3>
              <p className="text-gray-600">
                Exclusively focused on Wellingborough and surrounding areas for the best local experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Signup CTA */}
      <BusinessSignupCTA />
    </div>
  )
} 