import { TextField, Button } from '@mui/material'

import useField from '../hooks/useField'

const LoginForm = ({ handleLogin }) => {
  const username = useField('outlined-required', 'username', 'text', '')
  const password = useField(
    'outlined-password-input',
    'password',
    'password',
    '',
  )

  const login = (event) => {
    event.preventDefault()

    handleLogin(username.value, password.value)
  }

  return (
    <form onSubmit={login} style={{ margin: 20 }}>
      <div>
        <TextField required {...username} variant="standard" />
      </div>
      <div>
        <TextField {...password} variant="standard" />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm
