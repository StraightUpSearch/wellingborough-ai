'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TicketIcon,
  HeartIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

type Event = {
  id: string
  title: string
  description: string | null
  location: string
  address: string | null
  startDate: Date
  endDate: Date | null
  image: string | null
  price: number | null
  category: string
  featured: boolean
  attendeeCount: number
  maxAttendees: number | null
  createdAt: Date
  updatedAt: Date
  organizerId: string | null
  businessId: string | null
  organizer: {
    name: string | null
    email: string
  } | null
  business: {
    name: string
    address: string
  } | null
}

const eventCategories = [
  "All Categories",
  "Community",
  "Food & Drink",
  "Health & Fitness",
  "Business",
  "Arts & Culture",
  "Entertainment",
  "Sports"
]

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDaysUntilEvent(date: Date) {
  const eventDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)
  
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays > 0) return `In ${diffDays} days`
  if (diffDays === -1) return "Yesterday"
  return `${Math.abs(diffDays)} days ago`
}

function EventCard({ event, onToggleLike, isLiked }: { 
  event: Event
  onToggleLike: (id: string) => void
  isLiked: boolean
}) {
  const attendancePercentage = event.maxAttendees 
    ? (event.attendeeCount / event.maxAttendees) * 100 
    : 0

  const defaultImage = `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&q=80`
  
  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return 'Free'
    return `£${price.toFixed(2)}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {event.featured && (
        <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1">
          ⭐ Featured Event
        </div>
      )}
      
      <div className="relative">
        <img
          src={event.image || defaultImage}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onToggleLike(event.id)}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
            {event.title}
          </h3>
          <span className="text-sm text-blue-600 font-medium ml-2">
            {getDaysUntilEvent(event.startDate)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description || 'No description available.'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {formatTime(event.startDate)}
              {event.endDate && ` - ${formatTime(event.endDate)}`}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {event.business ? event.business.name : event.location}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TicketIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatPrice(event.price)}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>by {event.organizer.name}</span>
            </div>
          )}
        </div>

        {event.maxAttendees && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                {event.attendeeCount} attending
              </span>
              <span className="text-sm text-gray-500">
                {event.maxAttendees} capacity
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Interested
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EventsClient({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set())

  const handleToggleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All Categories' || event.category === selectedCategory
    
    const eventDate = new Date(event.startDate)
    const today = new Date()
    const isUpcoming = eventDate >= today
    const matchesUpcoming = !showUpcomingOnly || isUpcoming

    return matchesSearch && matchesCategory && matchesUpcoming
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Discover Events in Wellingborough
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Find exciting events, activities, and gatherings happening in your local community
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
                placeholder="Search events, venues, or keywords..."
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
                {eventCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showUpcomingOnly}
                  onChange={(e) => setShowUpcomingOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Upcoming events only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
          </h2>
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Create Event
          </Link>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onToggleLike={handleToggleLike}
                isLiked={likedEvents.has(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or browse all categories.
            </p>
            {events.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  It looks like no events have been added yet. Be the first to create an event!
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
              Organize an Event in Wellingborough?
            </h2>
            <p className="mt-4 text-blue-100">
              Reach more people and build community connections by listing your event on our platform.
            </p>
            <Link
              href="/events/create"
              className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Create Your Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 