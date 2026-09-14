import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import commentService from '../services/comments'

import { setNotification } from '../stores/notificationStore'

const commentStore = create(
  devtools((set) => ({
    comments: [],
    actions: {
      initialize: async (blogID) => {
        try {
          const comments = await commentService.getBlogComments(blogID)
          set(() => ({ comments }))
        } catch (error) {
          setNotification(`ERROR: ${error.message}`, 5, 'error')
        }
      },
      createComment: async (blogID, newComment) => {
        try {
          const comment = await commentService.addBlogComment(
            blogID,
            newComment,
          )
          set((state) => ({ comments: [comment, ...state.comments] }))
          setNotification(`Comment added: ${newComment.content}`, 5, 'success')
          return true
        } catch (error) {
          setNotification(`ERROR: ${error.message}`, 5, 'error')
          return false
        }
      },
      remove: async (id) => {
        try {
          await commentService.removeComment(id)
          set((state) => ({
            comments: state.comments.filter((c) => c.id !== id),
          }))

          setNotification('Comment removed!', 5, 'success')
        } catch (error) {
          setNotification(`ERROR: ${error.message}`, 5, 'error')
        }
      },
    },
  })),
)

export const useComments = () => {
  const comments = commentStore((state) => state.comments)
  return comments
}

export const useCommentActions = () => commentStore((state) => state.actions)

export default commentStore
