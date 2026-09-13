import { Alert } from '@mui/material'
import { useNotificationMessage, useNotificationType } from '../stores/notificationStore'

// notify object has the fields
// 1. type - determines the color of the notification
// The types are success (the default), info, warning, and error
// 2. text - the notification message
const Notify = () => {

  const messageNotification = useNotificationMessage()
  const typeNotification = useNotificationType()

  if(!messageNotification) return null

  const style = {
    marginTop: 10,
    marginBottom: 10,
    padding: 10
  }

  return (
    <Alert style={style} severity={typeNotification}>
      {messageNotification}
    </Alert>
  )
}

export default Notify
