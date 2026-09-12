import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')



  const login = (event) => {
    event.preventDefault()

    handleLogin(username, password, setUsername, setPassword)
  }


  return (
    <form onSubmit={login} style={{ margin:20 }}>
      <div>
        <TextField
          required
          id="outlined-required"
          label="username"
          type="text"
          value={username}
          onChange={event => setUsername(event.target.value)}
          variant="standard"
        />
      </div>
      <div>
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          variant="standard"
        />
      </div>
      <Button type="submit" variant='contained' style={{ marginTop: 10 }}>
        login
      </Button>
    </form >
  )
}

export default LoginForm
