import { PrismaClient } from '@prisma/client'
import ForumClient from './forum-client'

const prisma = new PrismaClient()

async function getForumPosts() {
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return posts
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return []
  }
}

export default async function ForumPage() {
  const posts = await getForumPosts()
  
  return <ForumClient posts={posts} />
} 