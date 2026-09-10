This is [part 7 of the fullstack open course](https://fullstackopen.com/en/part7) by <https://studies.cs.helsinki.fi>

### Github Actions Test Status

<details>
<summary>part7-a</summary>

[![routed anecdotes tests](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml/badge.svg?branch=part7-a)](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml)

</details>

<details>
<summary>part7-b</summary>

</details>

<details>
<summary>part7-c</summary>

</details>

### Part 7 sub a. | React Hooks

Some React hooks encountered so far from earlier parts:

[React's built-in hooks](https://react.dev/reference/react/hooks)

- [`useState`](https://react.dev/reference/react/useState)
- [`useEffect`](https://react.dev/reference/react/useEffect)
- [`useRef`](https://react.dev/reference/react/useRef)
- [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle)
- [`useContext`](https://react.dev/reference/react/useContext)

Hooks have become the standard way for libraries to expose their APIs.

[Zustand](https://zustand-demo.pmnd.rs/)

- `useStore` for global state.

[React Router](https://reactrouter.com/)

- `useNavigate` for programmatic navigation.
- `useParams` URL parameter access.

[`React Query`](https://tanstack.com/query/latest)

- `useQuery` and `useMutation` for server state management.

#### React Hooks rules

- ✅ Call them at the top level in the body of a function component.
- ✅ Call them at the top level in the body of a custom Hook.

It’s not supported to call Hooks (functions starting with use), in these following situations:

    🔴 Do not call Hooks inside conditions or loops.
    🔴 Do not call Hooks after a conditional return statement.
    🔴 Do not call Hooks in event handlers.
    🔴 Do not call Hooks in class components.
    🔴 Do not call Hooks inside functions passed to useMemo, useReducer, or useEffect.

Source: <https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks>

This [ESlint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) can help verify that an application uses hooks correctly.

#### `useMemo`, `React.memo`, and `useCallback` | Hooks to optimise performance

##### [`useMemo`](https://react.dev/reference/react/useMemo)

_Caches results of calculations defined within its function hook. Re-runs calculations when its dependencies changes._

Referring to `./all-about-hooks/src/components/FilteredList.jsx`

Clicking dark mode button would cause the component to re-render and then triggering the `expensiveCalculation()` to run again. However, nesting this function call within the `useMemo` hook helps cache the computation and would only re-run if there are changed to `[filter]` which is declared as its dependency.

`useMemo` can also be used to memoize objects and arrays passed as props, preventing unnecessary re-renders of child components that use reference equality.

```javascript
const App = () => {
const [filter, setFilter] = useState('')

// Without useMemo, 'options' is a new object on every render even if filter hasn't changed
const options = useMemo(() => ({ caseSensitive: false, filter }), [filter])

return <SearchResults options={options} />
}
```

##### React.memo

_Caches the entire component output. Not a hook but a higer-order component._

Re-rendering does not occur if props have not changed since the last render.

**Only checks props. It does not concern context values or state.**

```javascript
const MyComponent = React.memo(({ value }) => {
console.log('rendered')
return <div>{value}</div>
})
```

##### `useCallback`

_Caches functions between renders, and returns the same function object if dependencies do not change._

Functions defined inside a component are recreated as new objects on every render.

- A child component wrapped in `React.memo` receives the function as a prop. Because the function is a new object each time, the child always sees a changed prop and re-renders anyway, defeating the purpose of memoisation.

- If a function is listed as a dependency of useEffect or useMemo, then a newly created function on every render means the effect or memo re-runs on every render.

It has the same function signature as `useMemo`.

##### The difference between `useCallback` and `useMemo`

`useCallback` **memoizes a function.**

It returns the same function reference between renders until its dependencies change.

Use `useCallback` when function identity matters, commonly when passing a callback to a `React.memo` component.

```javascript
const handleDelete = useCallback((id) => {
  setNotes(notes => notes.filter(note => note.id !== id))
}, [])
```

`useMemo` **memoizes a computed value**.

It returns the cached result until its dependencies change.

Use `useMemo` when an expensive calculation should not run unnecessarily.

```javascript
const visibleNotes = useMemo(() => {
  return notes.filter(note => note.content.includes(searchTerm))
}, [notes, searchTerm])
```

Neither should be added automatically; both add complexity and are useful only when avoiding meaningful work or preserving references matters.

```javascript
useCallback(fn, dependencies)
// equivalent idea:
useMemo(() => fn, dependencies)
```

#### Custom Hooks

[To extract component logic into reusable functions](https://react.dev/learn/reusing-logic-with-custom-hooks) so code can be broken down into modular parts.

Requirments:

- Must follow [React Hook rules](#react-hooks-rules)
- Naming must begin with the word `use`

##### When to create a custom hook?

Whever any stateful logic you find yourself duplicating across components is a candidate for extraction into a custom hook.

Each call to the same hook creates an independent piece of state. This is what distinguishes a custom hook from a plain utility function.

For example, see `./src/hooks/useField.jsx`

> To keep the state of the form synchronized with the data provided by the user, it is necessary to register an appropriate `onChange` handler for each of the input elements. The pattern is identical for every field, only the state variable name differs. This is exactly the kind of repetition that custom hooks are designed to eliminate.

Another commonly defined custom hook is using `localStorage` in the browser. An example can be found in `./src/hooks/useLocalStorage.jsx`.

##### When do custom hooks cause components to re-render?

All state and effects defined within a hook belong to the component that calls the hook.

Components re-render whenever the following changes take place:

1. managed state inside the hook
1. context value that is subscribed by the hook
1. any nested hooks dedined within a hook that has properties 1. and 2. change

A custom hook can be a way to organize code and is not a boundary that React has special treatment for.

```javascript
const useCounter = () => {
  const [count, setCount] = useState(0) // this state belongs to the calling component
  return { count, increment: () => setCount(c => c + 1) }
}

const MyComponent = () => {
  const { count, increment } = useCounter()
  // re-renders whenever the count state inside the hook is updated
}
```

Futher exploration of Custom Hooks:

- https://usehooks.com/
- https://github.com/rehooks/awesome-react-hooks  
