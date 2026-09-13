import { createContext, useState } from 'react'

const UserContext = createContext()

export default UserContext

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}
