import { useNavigate } from "react-router-dom"

import useField from '../hooks/useField'
import useAnecdotes from '../hooks/useAnecdotes'

const CreateNew = () => {

  const contentField = useField('text')
  const authorField = useField('text')
  const infoField = useField('text')

  const navigate = useNavigate()

  const { addAnecdote } = useAnecdotes()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: contentField.inputProps.value,
      author: authorField.inputProps.value,
      info: infoField.inputProps.value,
      votes: 0
    })
    navigate("/")
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            {...contentField.inputProps}
          />
        </div>
        <div>
          author
          <input
            {...authorField.inputProps}
          />
        </div>
        <div>
          url for more info
          <input
            {...infoField.inputProps}
          />
        </div>
        <button>create</button>
        <button onClick={(e) => {
          e.preventDefault()
          contentField.clearFields()
          authorField.clearFields()
          infoField.clearFields()
        }} >reset</button>
      </form>
    </div>
  )
}

export default CreateNew
