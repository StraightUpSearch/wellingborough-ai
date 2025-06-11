'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
  PlusIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid,
  MapPinIcon as PinIconSolid 
} from '@heroicons/react/24/solid'

type ForumPost = {
  id: string
  title: string
  content: string
  category: string
  pinned: boolean
  locked: boolean
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    name: string | null
    avatar: string | null
  }
  comments: Array<{
    id: string
    content: string
    likes: number
    createdAt: Date
    authorId: string
    author: {
      name: string | null
      avatar: string | null
    }
  }>
}

const forumCategories = [
  "All Categories",
  "General Discussion",
  "Local News",
  "Recommendations",
  "Events",
  "Business",
  "Community",
  "Food & Drink",
  "Sports & Recreation",
  "Help & Support"
]

function timeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric'
  })
}

function ForumPostCard({ post, onToggleLike, isLiked }: {
  post: ForumPost
  onToggleLike: (id: string) => void
  isLiked: boolean
}) {
  const [showComments, setShowComments] = useState(false)
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              {post.author.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {post.author.name || 'Anonymous User'}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>{timeAgo(post.createdAt)}</span>
                <span>•</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
          
          {post.pinned && (
            <div className="flex items-center text-amber-600">
              <PinIconSolid className="h-5 w-5" />
              <span className="ml-1 text-sm font-medium">Pinned</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </h3>
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleLike(post.id)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showComments ? 'Hide' : 'Show'} Comments
            </button>
            
            <Link
              href={`/forum/${post.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Read More
            </Link>
          </div>
        </div>

        {/* Comments Preview */}
        {showComments && post.comments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Recent Comments ({post.comments.length})
            </h4>
            <div className="space-y-4">
              {post.comments.slice(0, 3).map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {comment.author.avatar ? (
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.name || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.author.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              {post.comments.length > 3 && (
                <Link
                  href={`/forum/${post.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all {post.comments.length} comments →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ForumClient({ posts }: { posts: ForumPost[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const handleToggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author.name && post.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const pinnedPosts = filteredPosts.filter(post => post.pinned)
  const regularPosts = filteredPosts.filter(post => !post.pinned)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Community Forum
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Connect with your neighbors, share local knowledge, and discuss what matters to Wellingborough
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
                placeholder="Search discussions, topics, or users..."
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
                {forumCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <Link
                href="/forum/create"
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Discussion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredPosts.length} Discussion{filteredPosts.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="text-sm text-gray-500">
            Sorted by most recent
          </div>
        </div>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📌 Pinned Discussions</h3>
            <div className="space-y-4">
              {pinnedPosts.map(post => (
                <ForumPostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  isLiked={likedPosts.has(post.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 ? (
          <div className="space-y-4">
            {regularPosts.map(post => (
              <ForumPostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                isLiked={likedPosts.has(post.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or start a new discussion.
            </p>
            {posts.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No discussions yet. Be the first to start a conversation!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Community Guidelines */}
      <div className="bg-blue-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900">
              Community Guidelines
            </h2>
            <p className="mt-4 text-blue-800">
              Be respectful, stay on topic, and help make Wellingborough a better place for everyone.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>
                <h3 className="font-semibold">Be Kind</h3>
                <p>Treat others with respect and courtesy</p>
              </div>
              <div>
                <h3 className="font-semibold">Stay Local</h3>
                <p>Keep discussions relevant to Wellingborough</p>
              </div>
              <div>
                <h3 className="font-semibold">Help Others</h3>
                <p>Share knowledge and support your neighbors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 