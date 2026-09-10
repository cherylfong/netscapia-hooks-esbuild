import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

const useAnecdotes = () => {

    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then(data => setAnecdotes(data))
    }, [anecdotes])

    const addAnecdote = async (anecdote) => {

        await anecdoteService.createNew(anecdote).then(data =>
            setAnecdotes(anecdotes.concat(data))
        )
    }

    const deleteAnecdote = async (id) => {

        await anecdoteService.remove(id).then( 
            setAnecdotes(anecdotes.filter(a => a.id !== id) )
        )

    }

    return {
        anecdotes,
        addAnecdote, 
        deleteAnecdote
    }

}

export default useAnecdotes