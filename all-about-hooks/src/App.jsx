import FilteredList from './components/FilteredList'
import NoteList from './components/NoteList'
import Counter from './components/Counter'
import LeftRightButtons from './components/LeftRightButtons'
import NameBirthHeight from './components/NameBirthHeight'
import LocalStorage from './components/LocalStorage'

import { useState, useCallback } from 'react';

const App = () => {

  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  // useCallback prevents a new instantiation of handleDelete with each new render
  // 
  // Without useCallback, typing in the input 
  // would create a new handleDelete function each render, 
  // causing NoteList to re-render even though its notes had not changed.
  const handleDelete = useCallback((id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }, []) // no external dependencies: this function never needs to change

  const handleAdd = () => {
    setNotes(notes => [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }

  return (
    <div>
      <h1>Part 7 Sub a. Guided Code</h1>
      <Counter/>
      <LeftRightButtons/>
      <LocalStorage/>
      <NameBirthHeight/>
      <br/>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <NoteList notes={notes} onDelete={handleDelete} />
      <FilteredList />
    </div>
  )
}

export default App