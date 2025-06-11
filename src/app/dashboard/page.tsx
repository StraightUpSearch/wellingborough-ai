'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  UserCircleIcon, 
  HeartIcon, 
  CalendarDaysIcon, 
  BuildingStorefrontIcon,
  ChartBarIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Sample favorite businesses and events - in production this would come from an API
  const favoriteBusinesses = [
    { id: '1', name: 'The Castle Inn', category: 'Pub & Restaurant', image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=100&h=100&fit=crop', rating: 4.5 },
    { id: '3', name: 'Bloom & Blossom Florist', category: 'Retail', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=100&h=100&fit=crop', rating: 4.8 }
  ]

  const interestedEvents = [
    { id: '1', name: 'Wellingborough Christmas Market', date: '2024-12-15', attendees: 247 },
    { id: '6', name: 'The Acoustic Sessions', date: '2024-12-20', attendees: 89 }
  ]

  const recentActivity = [
    { type: 'business', action: 'Favorited', item: 'The Castle Inn', time: '2 hours ago' },
    { type: 'event', action: 'Showed interest in', item: 'Christmas Market', time: '1 day ago' },
    { type: 'business', action: 'Visited', item: 'Bloom & Blossom Florist', time: '2 days ago' }
  ]

  const quickStats = [
    { label: 'Favorite Businesses', value: favoriteBusinesses.length, icon: HeartSolidIcon, color: 'text-red-600 bg-red-100' },
    { label: 'Events Interested', value: interestedEvents.length, icon: CalendarDaysIcon, color: 'text-blue-600 bg-blue-100' },
    { label: 'Profile Views', value: user.role === 'business' ? '45' : '12', icon: ChartBarIcon, color: 'text-green-600 bg-green-100' },
    { label: 'Member Since', value: new Date(user.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), icon: ClockIcon, color: 'text-purple-600 bg-purple-100' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <UserCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                {user.role === 'business' ? 'Business Owner' : 'Community Member'}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                Member since {new Date(user.joinedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                        <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Favorite Businesses */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Favorite Businesses</h2>
                <Link 
                  href="/businesses"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {favoriteBusinesses.length > 0 ? (
                <div className="space-y-4">
                  {favoriteBusinesses.map((business) => (
                    <div key={business.id} className="flex items-center space-x-3">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/businesses/${business.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {business.name}
                        </Link>
                        <p className="text-sm text-gray-500">{business.category}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">★ {business.rating}</span>
                        <HeartSolidIcon className="ml-2 h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No favorites yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start exploring businesses to save your favorites.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/businesses"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                      Explore Businesses
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interested Events */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Interested Events</h2>
                <Link 
                  href="/events"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              {interestedEvents.length > 0 ? (
                <div className="space-y-4">
                  {interestedEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/events/${event.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {event.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.attendees} interested
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No events yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Discover upcoming events in Wellingborough.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/events"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                      Browse Events
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                      activity.type === 'business' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.action} <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <Link
                  href="/businesses"
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <BuildingStorefrontIcon className="h-5 w-5 text-blue-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Find Businesses</span>
                </Link>
                <Link
                  href="/events"
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Browse Events</span>
                </Link>
                {user.role === 'business' && (
                  <Link
                    href="/business/manage"
                    className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ChartBarIcon className="h-5 w-5 text-purple-600" />
                    <span className="ml-3 text-sm font-medium text-gray-900">Manage Business</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 text-orange-600" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 