import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getBlogComments = async (blogID) => {
  const response = await axios.get(`${baseUrl}/${blogID}/comments`)
  return response.data
}

const addBlogComment = async (blogID, newComment) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(
    `${baseUrl}/${blogID}/comments`,
    newComment,
    config,
  )
  return response.data
}

// id is comment's id
const removeComment = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`/api/comments/${id}`, config)
  return request.then((response) => response.data)
}

export default { getBlogComments, addBlogComment, setToken, removeComment }
