import { useState } from 'react'
const useField = (id, label, type = 'text', initialState = '') => {
  const [value, setValue] = useState(initialState)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue(initialState)
  }

  return {
    id,
    label,
    type,
    value,
    onChange,
    reset,
  }
}

export default useField