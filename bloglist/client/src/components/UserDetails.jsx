import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useUserActions, useUsers } from '../stores/userStore'

const UserDetails = () => {
  const { id } = useParams()
  const users = useUsers()
  const { initialize } = useUserActions()

  useEffect(() => {
    if (users.length === 0) initialize()
  }, [initialize, users.length])

  const user = users.find((candidate) => candidate.id === id)

  if (!user) return <div>Loading...</div>

  console.log('USER', user)

  return (
    <div>
      <h3>{user.name}</h3>
      <h4>username: {user.username}</h4>
      <h4>Blogs Posted</h4>
      <ol>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <a href={`/${blog.id}`}>{blog.title}</a>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default UserDetails
