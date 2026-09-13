import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import blogService from '../services/blogs'

import { useNotificationActions } from '../stores/notificationStore'

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const setNotification = useNotificationActions()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: async (newBlog) => {
      await queryClient.invalidateQueries({ queryKey: ['blogs'] })

      setNotification(`Blog item titled "${newBlog.title}" added`, 5, 'success')
    },
    onError: (error) => {
      if (error.response.status === 400) {
        setNotification('Fill in all fields', 5, 'warning')
      } else {
        setNotification(`ERROR: status ${error.response.status}`, 5, 'error')
      }
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ blogId, blogObject }) =>
      blogService.update(blogId, blogObject),

    onSuccess: (blogObject) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      setNotification(
        `Blog item titled "${blogObject.title}" updated with ${blogObject.likes} 👍`,
        5,
        'success',
      )
    },

    onError: (error) => {
      setNotification(`ERROR: ${error.message}`, 5, 'error')
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: ({ blogId }) => blogService.remove(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      setNotification('Blog item removed!', 5, 'success')
    },
    onError: (error) => {
      setNotification(`ERROR: ${error.message}`, 5, 'error')
    },
  })

  return {
    blogs: result.data ?? [],
    isLoading: result.isLoading,
    isError: result.isError,
    addBlog: (content) => newBlogMutation.mutate(content),
    updateBlogLikes: (blogId, blogObject) =>
      updateBlogMutation.mutate({ blogId, blogObject }),
    deleteBlog: (blogId) => removeBlogMutation.mutateAsync({ blogId }),
  }
}
