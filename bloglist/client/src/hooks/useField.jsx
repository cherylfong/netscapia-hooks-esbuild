import { useState } from 'react'
const useField = (id, label, type = 'text', initialState = '') => {
  const [value, setValue] = useState(initialState)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    id,
    label,
    type,
    value,
    onChange
  }
}

export default useField