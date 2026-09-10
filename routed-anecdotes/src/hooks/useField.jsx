import { useState } from 'react'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const clearFields = () => {
        setValue('')
    }

    return {
        inputProps: {
            type,
            value,
            onChange,
        },
        clearFields,
    }
}

export default useField