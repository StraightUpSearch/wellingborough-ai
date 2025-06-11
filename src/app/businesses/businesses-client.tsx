'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TagIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

type Business = {
  id: string
  name: string
  description: string | null
  category: string
  address: string
  phone: string | null
  email: string | null
  website: string | null
  logo: string | null
  coverImage: string | null
  images: string | null
  openingHours: string | null
  featured: boolean
  verified: boolean
  rating: number
  reviewCount: number
  status: string
  createdAt: Date
  updatedAt: Date
  ownerId: string
  owner: {
    name: string | null
    email: string
  }
  reviews: Array<{
    rating: number
    comment: string | null
    user: {
      name: string | null
    }
  }>
}

const categories = [
  "All Categories",
  "Food & Drink",
  "Technology",
  "Health & Fitness",
  "Home & Garden",
  "Healthcare",
  "Beauty & Wellness",
  "Professional Services"
]

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

function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 group">
      {/* Business Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.coverImage || business.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80'}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {business.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
          {business.verified && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {/* Business Info */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {business.category}
          </span>
          <div className="flex items-center">
            <StarRating rating={business.rating} />
            <span className="ml-1 text-sm text-gray-600">({business.reviewCount})</span>
          </div>
        </div>

        {/* Business Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {business.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {business.description || 'Professional local business serving the Wellingborough community.'}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{business.address}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/businesses/${business.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Call"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BusinessesClient({ businesses }: { businesses: Business[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All Categories' || business.category === selectedCategory
    const matchesFeatured = !showFeaturedOnly || business.featured

    return matchesSearch && matchesCategory && matchesFeatured
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Discover Local Businesses in Wellingborough
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Find the best local businesses, read reviews, and connect with your community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search businesses, services, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured businesses only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredBusinesses.length} Business{filteredBusinesses.length !== 1 ? 'es' : ''} Found
          </h2>
          <Link
            href="/business/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + List Your Business
          </Link>
        </div>

        {/* Business Grid */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or browse all categories.
            </p>
            {businesses.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  It looks like no businesses have been added yet. Be the first to list your business!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Own a Business in Wellingborough?
            </h2>
            <p className="mt-4 text-blue-100">
              Join our growing community of local businesses and reach more customers with AI-powered visibility.
            </p>
            <Link
              href="/business/register"
              className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              List Your Business Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 