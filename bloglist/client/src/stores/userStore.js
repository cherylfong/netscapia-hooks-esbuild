import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import userService from '../services/users'

const userStore = create(
  devtools((set, get) => ({
    users: [],
    actions: {
      initialize: async () => {
        const users = await userService.getUsers()
        set(() => ({ users }))
      },
    },
  })),
)

export const useUsers = () => {
  const users = userStore((state) => state.users)
  return users
}

export const useUserActions = () => userStore((state) => state.actions)

export default userStore
