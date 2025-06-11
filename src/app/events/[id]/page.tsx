'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TicketIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const event = {
  id: 1,
  title: "Wellingborough Christmas Market",
  description: "Traditional Christmas market with local vendors, festive food, and family entertainment.",
  longDescription: "The annual Wellingborough Christmas Market returns to Market Square for another festive celebration! This year's market features over 40 local vendors selling handmade crafts, seasonal treats, and unique gifts perfect for Christmas shopping.",
  category: "Community",
  date: "2024-12-15",
  time: "10:00 AM - 4:00 PM",
  location: "Market Square, Wellingborough NN8 1AT",
  venue: "Market Square",
  image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
  ],
  price: "Free",
  organizer: {
    name: "Wellingborough Town Council",
    contact: "events@wellingborough-tc.gov.uk",
    phone: "01933 229777"
  },
  attendees: 450,
  maxAttendees: 1000,
  tags: ["Christmas", "Market", "Family", "Free"],
  featured: true,
  accessibility: ["Wheelchair accessible", "Baby changing facilities", "Family friendly"],
  schedule: [
    { time: "10:00 AM", activity: "Market opens - Welcome & ribbon cutting" },
    { time: "11:00 AM", activity: "Children's choir performance" },
    { time: "12:00 PM", activity: "Santa's grotto opens" },
    { time: "1:00 PM", activity: "Local brass band performance" },
    { time: "4:00 PM", activity: "Market closes" }
  ]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getDaysUntilEvent(dateString: string) {
  const eventDate = new Date(dateString)
  const today = new Date()
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays > 0) return `In ${diffDays} days`
  return "Past event"
}

export default function EventDetailPage() {
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInterested, setIsInterested] = useState(false)

  const attendancePercentage = (event.attendees / event.maxAttendees) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/events" className="ml-4 text-gray-400 hover:text-gray-500">Events</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-500">{event.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {event.featured && (
                <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-2">
                  ⭐ Featured Event
                </div>
              )}
              
              <div className="relative">
                <img
                  src={event.images[selectedImage]}
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    {isLiked ? (
                      <HeartIconSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    <ShareIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-w-4 aspect-h-3 rounded-md overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${event.title} thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                    <p className="text-lg text-blue-600 font-medium">
                      Organized by {event.organizer.name}
                    </p>
                  </div>
                  <span className="text-lg text-blue-600 font-medium">
                    {getDaysUntilEvent(event.date)}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <TagIcon className="h-4 w-4 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About Event */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-6">{event.longDescription}</p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Accessibility</h3>
              <div className="grid grid-cols-1 gap-2">
                {event.accessibility.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Schedule</h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-20">
                      <span className="text-sm font-medium text-blue-600">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{event.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{event.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <TicketIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{event.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {event.attendees} attending
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

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setIsInterested(!isInterested)}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    isInterested 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isInterested ? '✓ You\'re Interested' : 'I\'m Interested'}
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Share Event
                </button>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Email: {event.organizer.contact}</p>
                  <p>Phone: {event.organizer.phone}</p>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Contact Organizer
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add to Calendar
                </button>
                <button className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 