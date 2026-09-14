import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { useContext, useEffect } from 'react'
import UserContext from '../UserContext'

import { useCommentActions, useComments } from '../stores/commentStore'

import useField from '../hooks/useField'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ddae140c',
  ...theme.typography.body2,
  fontSize: '15px',
  padding: theme.spacing(1),
  textAlign: 'left',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#0a71e8',
  }),
}))

// parse the ISO string and format it for the user’s local timezone
const formatCreatedAt = (createdAt) =>
  new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(createdAt))

export default function BasicStack({ blog }) {
  const blogID = blog.id
  const { user } = useContext(UserContext)

  const { initialize, createComment, remove } = useCommentActions()
  const comments = useComments()

  const newCommentContent = useField('comment-textfield', 'comment', 'text', '')

  useEffect(() => {
    initialize(blogID)
  }, [blogID, initialize])

  let loggedInUserID = null

  if (user) {
    loggedInUserID = user.id
  }

  const addComment = async (event) => {
    event.preventDefault()
    const content = { content: newCommentContent.value }
    const created = await createComment(blogID, content)
    if (created) newCommentContent.reset()
  }

  const removeComment = async (commentID) => {
    confirm('🚨 Remove comment??')
    await remove(commentID)
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <form
          onSubmit={addComment}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 15,
          }}
        >
          <TextField
            fullWidth
            {...newCommentContent}
            placeholder="What's on your mind?"
            sx={{ flex: 1 }}
          />
          <Button
            style={{ fontSize: '12px' }}
            variant="contained"
            size="small"
            color="secondary"
            type="submit"
          >
            ADD COMMENT
          </Button>
        </form>
        <Stack spacing={2}>
          {comments.map((comment, idx) => (
            <Item id={`comment-${idx}`}>{comment.content}</Item>
          ))}
        </Stack>
      </Box>
    </>
  )
}
