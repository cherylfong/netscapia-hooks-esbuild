import { useImperativeHandle, useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(currentVisible => !currentVisible)
  }

  useImperativeHandle(props.ref, () => ({
    toggleVisibility
  }))

  return (
    <div>
      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>

      <div style={{ display: visible ? '' : 'none' }}>
        {props.children}
        <button onClick={toggleVisibility}>hide form</button>
      </div>
    </div>
  )
}

export default Togglable