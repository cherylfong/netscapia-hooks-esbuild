import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  type: 'info', // error, success, info, warning
  setNotification: (message, seconds, type) => {
    set({ type })
    set({ message })
    setTimeout(() => set({ message: null, type: 'info' }), seconds * 1000)
  },
}))

export const useNotificationMessage = () =>
  useNotificationStore((state) => state.message)

export const useNotificationType = () =>
  useNotificationStore((state) => state.type)

export const useNotificationActions = () =>
  useNotificationStore((state) => state.setNotification)

export const setNotification = (...args) =>
  useNotificationStore.getState().setNotification(...args)

