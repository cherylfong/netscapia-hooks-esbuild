import { useContext } from 'react'

import { TextField, Button } from '@mui/material'

import useField from '../hooks/useField'

import UserContext from '../UserContext'

const LoginForm = ({ handleLogin }) => {
  const { user } = useContext(UserContext)

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
      <Button
        type="submit"
        variant="contained"
        style={{ marginTop: 10, display: user ? 'none' : '' }}
      >
        login
      </Button>

      <Button
        type="submit"
        variant="contained"
        style={{ marginTop: 10, display: user ? '' : 'none' }}
      >
        logout
      </Button>
    </form>
  )
}

export default LoginForm
