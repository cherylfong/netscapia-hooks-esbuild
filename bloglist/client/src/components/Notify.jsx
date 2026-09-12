import { Alert } from '@mui/material'

// notify object has the fields
// 1. type - determines the color of the notification
// The types are success (the default), info, warning, and error
// 2. text - the notification message
const Notify = ({ notify }) => {
  if (notify === null) {
    return null
  }

  return (

    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notify.type}>
      {notify.text}
    </Alert>
  )
}

export default Notify