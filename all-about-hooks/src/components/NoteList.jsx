import { memo } from 'react';

// React.memo makes this component skip re-rendering if its props haven't changed
const NoteList = memo(({ onDelete, notes }) => {
  console.log('NoteList rendered')
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content}
          <button onClick={() => onDelete(note.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
})

export default NoteList