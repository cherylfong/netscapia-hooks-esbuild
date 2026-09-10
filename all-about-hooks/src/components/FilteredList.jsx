import { useState, useMemo } from 'react'

const expensiveCalculation = () => {
  let sum = 0
  for (let i = 0; i < 100000; i++) sum += i
  return sum
}

const ITEMS = Array.from({ length: 10000 }, (_, i) => `item ${i + 1}`)

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

 const filtered = useMemo(() => {    console
.log('filtering...')
    return ITEMS.filter(item => {
      expensiveCalculation()
      return item.includes(filter)
    })
  }, [filter])

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="filter items"
      />
      <button onClick={() => setDarkMode(!darkMode)}>toggle dark mode</button>
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default FilteredList