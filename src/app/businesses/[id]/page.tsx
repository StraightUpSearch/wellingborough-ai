'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  TagIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

async function getBusiness(id: string) {
  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        events: {
          where: {
            startDate: {
              gte: new Date()
            }
          },
          orderBy: {
            startDate: 'asc'
          },
          take: 3
        }
      }
    })

    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIconSolid
          key={star}
          className={`${sizeClasses} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function BusinessGallery({ business }: { business: any }) {
  const images = business.images ? JSON.parse(business.images) : []
  const allImages = [business.coverImage, ...images].filter(Boolean)
  
  if (allImages.length === 0) return null
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="md:col-span-2">
        <img
          src={allImages[0]}
          alt={business.name}
          className="w-full h-64 md:h-80 object-cover rounded-lg"
        />
      </div>
      {allImages.length > 1 && (
        <div className="space-y-4">
          {allImages.slice(1, 3).map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`${business.name} ${index + 2}`}
              className="w-full h-[calc(50%-0.5rem)] md:h-[calc(50%-0.5rem)] object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  )
}

function OpeningHours({ openingHours }: { openingHours: string }) {
  try {
    const hours = JSON.parse(openingHours)
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return (
      <div className="space-y-2">
        {days.map((day, index) => {
          const dayInfo = hours[day]
          if (!dayInfo) return null
          
          return (
            <div key={day} className="flex justify-between text-sm">
              <span className="font-medium">{dayNames[index]}</span>
              <span className="text-gray-600">
                {dayInfo.closed ? 'Closed' : `${dayInfo.open} - ${dayInfo.close}`}
              </span>
            </div>
          )
        })}
      </div>
    )
  } catch {
    return <p className="text-sm text-gray-600">Hours not available</p>
  }
}

function ReviewSection({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start space-x-4">
            <img
              src={review.user.avatar || `https://ui-avatars.com/api/?name=${review.user.name}&background=3B82F6&color=fff`}
              alt={review.user.name || 'User'}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{review.user.name || 'Anonymous'}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="mt-2 text-gray-700">{review.comment}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
  const business = await getBusiness(params.id)
  
  if (!business) {
    notFound()
  }
  
  const services = business.services ? JSON.parse(business.services) : []
  const specialties = business.specialties ? JSON.parse(business.specialties) : []
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/businesses"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Businesses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Header */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {business.logo && (
                    <img
                      src={business.logo}
                      alt={`${business.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{business.name}</h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {business.category}
                      </span>
                      {business.verified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckBadgeIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                      {business.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <StarRating rating={business.rating} size="lg" />
                <span className="text-lg font-semibold">{business.rating.toFixed(1)}</span>
                <span className="text-gray-600">({business.reviewCount} reviews)</span>
              </div>
              
              {business.description && (
                <p className="text-gray-700 leading-relaxed">{business.description}</p>
              )}
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              <BusinessGallery business={business} />
            </div>

            {/* Services & Specialties */}
            {(services.length > 0 || specialties.length > 0) && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Services & Specialties</h2>
                {services.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {specialties.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((specialty: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
              <ReviewSection reviews={business.reviews} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{business.address}</span>
                </div>
                {business.phone && (
                  <div className="flex items-center text-gray-700">
                    <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${business.phone}`} className="text-sm hover:text-blue-600">
                      {business.phone}
                    </a>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center text-gray-700">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${business.email}`} className="text-sm hover:text-blue-600">
                      {business.email}
                    </a>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center text-gray-700">
                    <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-blue-600"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            {business.openingHours && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Opening Hours
                </h3>
                <OpeningHours openingHours={business.openingHours} />
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-blue-700 transition-colors block"
                  >
                    Call Now
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-gray-50 transition-colors block"
                  >
                    Send Email
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-center text-sm font-medium hover:bg-gray-50 transition-colors block"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <div className="space-y-2 text-sm">
                {business.yearEstablished && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Established</span>
                    <span className="font-medium">{business.yearEstablished}</span>
                  </div>
                )}
                {business.numberOfEmployees && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-medium">{business.numberOfEmployees} employees</span>
                  </div>
                )}
                {business.priceRange && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Range</span>
                    <span className="font-medium">{business.priceRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 