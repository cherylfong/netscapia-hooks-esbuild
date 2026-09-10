import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

const useAnecdotes = () => {

    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then(data => setAnecdotes(data))
    }, [])

    const addAnecdote = (anecdote) => {

        anecdoteService.createNew(anecdote).then(data =>
            setAnecdotes(anecdotes.concat(data))
        )
    }

    return {
        anecdotes,
        addAnecdote
    }

}

export default useAnecdotes