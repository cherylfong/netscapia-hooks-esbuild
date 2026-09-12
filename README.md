This is [part 7 of the fullstack open course](https://fullstackopen.com/en/part7) by <https://studies.cs.helsinki.fi>

### Github Actions Test Status

<details>
<summary>part7-a</summary>

[![routed anecdotes tests](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml/badge.svg?branch=part7-a)](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml)

</details>
<br/>

<details>
<summary>part7-b</summary>
NONE 🪹
</details>
<br/>

<details>
<summary>part7-c</summary>
NONE 🪹
</details>
<br/>

<details>
<summary>part7-d</summary>

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

### Part 7 sub b. | Vite Internals and esbuild

#### Bundling

Even though ES6 modules are defined in the ECMAScript standard, not all execution environments handle module-based code automatically.

Modern browsers benefit from having dependencies pre-processed and optimized before delivery.

##### What is bundling?

Code that is divided into modules is bundled for production, This means that source code files are transformed and combined into an optimized set of files that the browser can efficiently load.

The index.html at the root loads the bundled JavaScript with a script tag. CSS is also bundled into a single file.

##### How is code bundled?

Bundling starts from an entry point, that is typically `main.jsx`.

Vite includes not only the code from the entry point but also everything it imports, recursively, until the full dependency graph has been resolved.

##### Bundlers

- [Create React App](https://github.com/facebookincubator/create-react-app)
  - Developed to eliminate development configuration overhead)
- [Vite](https://vitejs.dev/)
  - Uses esbuild
  - Vite is a French word for "fast"
- [esbuild](https://esbuild.github.io/)
  - Low level bundler
- Webpack
  - Dominant bundler for most of 2010s, however, not recommended for usage in 2026 and beyond.

##### Vite

**Development mode | `npm run dev`**

This mode does not bundle code all code.

Vite starts a dev server that serves your source files as native ES modules, letting the browser resolve imports directly

Third-party dependencies from `node_modules` are pre-bundled by esbuild before the server starts.

This helps with and allows subsequent starts to be near-instant:

- Converting and consolidating npm packages that are still in CommonJS format (which browsers can't consume natively)
- Caching some libraries that consist of hundreds of tiny internal files that would otherwise trigger hundreds of separate requests

**Production mode | `npm run build`**

Uses [Rollup](https://rollupjs.org/) for bundling with esbuild handling other tasks such as transpilation (JSX, TypeScript) and minification.

Rollup was designed from scratch for ES modules, which makes it **exceptionally good at tree-shaking**; a technique that statically analyzes which exports from each module are actually used and removes the rest from the final bundle.

>  esbuild is used for speed, Rollup for bundle quality. This is central to Vite's design.

##### esbuild

Using esbuild to bundle a simple React app.

With the following file and directory structure, begin the steps below:

```markdown
├── dist
│   └── index.html
├── src
│   ├── main.jsx
│   └── App.jsx
└── package.json
```

Contents of `package.json`, `dist/index.html`, `App.jsx` and `main.jsx` can be found in the `esbuild-example` project directory of this repository.

1. `npm install react react-dom`
1. `npm install --save-dev esbuild`
1. Edit `package.json`

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  },
  // ...
}
```

4. `npm run build`


```bash
npm run build

> esbuild-example@1.0.0 build
> esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic


  dist/main.js  1.2mb ⚠️

⚡ Done in 36ms
```

5. `npm run serve`

This command uses the [serve](https://www.npmjs.com/package/serve) package to start a local static file server for the `dist` directory.

```bash
npm run serve

> esbuild-example@1.0.0 serve
> npx serve dist

Need to install the following packages:
serve@14.2.6
Ok to proceed? (y) y

   ┌───────────────────────────────────────────┐
   │                                           │
   │   Serving!                                │
   │                                           │
   │   - Local:    http://localhost:3000       │
   │   - Network:  http://192.168.0.210:3000   │
   │                                           │
   │   Copied local address to clipboard!      │
   │                                           │
   └───────────────────────────────────────────┘
```

The production built website can be reached at the local or network URLs
e.g. http://192.168.0.210:3000/

6. Enable minification

esbuild supports minification through command-line flags.

[Minification](https://en.wikipedia.org/wiki/Minification_(programming)) removes whitespace and comments, shortens variable names, and applies other size optimizations.

The bundle will be notably large because it includes the full React library. Minification reduces its size significantly.

Make edits to `package.json`

```json
{
  "scripts": {

    "build": "esbuild src/main.jsx --bundle --minify --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist"
  }
}
```

7. Enable source mapping 

If the application throws a runtime error, the browser's developer tools will point to a line in the minified main.js which is **not human readable**.

The solution is a [source map](https://developer.mozilla.org/en-US/docs/Glossary/Source_map): companion file `dist/main.js.map` that records how every line of the minified bundle corresponds to the original source. With it enabled, a stack trace points to the exact line in `App.jsx` or `main.jsx` instead of somewhere inside an unreadable wall of minified code.

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",    
"serve": "npx serve dist"
  }
}
```

🚨 **Never include soure mapping in a production build!**

A source map contains all original source code, anyone who opens the browser's developer tools can read the unminified application logic.

###### Transpilation

esbuild performs another essential task: transpilation.

Transpilation converts source code written in one form of JavaScript into another form, typically from modern or extended syntax into plain JavaScript that browsers can execute.

**Browsers understand standard JavaScript, but JSX is not valid JavaScript**.

For example,

```jsx
const element = <App />

//must be converted to
const element = React.createElement(App, null)
```

With the `--jsx=automatic flag`, esbuild handles JSX without any external tool.

In the old Webpack-based workflow you had to install and configure Babel and related packages to transpile the JSX for the browser.

With esbuild, files ending in `.jsx` are transpiled out of the box.

###### esbuild for Development

Achieving using esbuild's built-in [development server](https://esbuild.github.io/api/#serve).

```json
{
  "scripts": {
    //...
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch"
  }
}
```

The `dev` command initiates the following:

- [`--watch`](https://esbuild.github.io/api/#watch) tells esbuild to watch all imported source files for changes and rebuild the bundle automatically whenever any of them is saved
- [`--servedir`](https://esbuild.github.io/api/#serve) starts a lightweight HTTP server that serves the contents of the dist directory, your index.html and the freshly built main.js at http://localhost:8000

`--servedir` is neccessary otherwise esbuild would only rebuild in watch mode but not serve anything. The server will always deliver the latest bundle so you only need to refresh the browser after saving a file.

Unlike Vite's dev server, **esbuild does not support hot module replacement**. Changes to your source code require a manual browser refresh to take effect.

##### Vite Configuration

esbuild consolidates all imports starting from an entry point to produce an optimized output.

Vite builds on top of esbuild by adding a dev server, hot module replacement, and sensible defaults for React projects.

`vite.config.js` is responsible for defining customized behavior.

A basic configuration can look like this:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**`@vitejs/plugin-react` plugin enables JSX transformation, fast refresh (hot module replacement that preserves component state), and other React-specific features**

###### Proxying API Requests

A React app typically runs on port 3000 while the backend runs on port 3001.

The browser's same-origin policy would normally block requests between them. Vite's proxy setting solves this without requiring CORS configuration on the backend:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

With this configuration, any request your React app makes to `/api/notes` is automatically forwarded to `http://localhost:3001/api/notes` by Vite's dev server. 

**Your frontend code never needs to include `localhost:3001` in its URLs during development.**

###### Environment Variables

Vite has built-in support for environment variables using `.env` files.

```bash
// .env
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

```bash
// .env.production
VITE_BACKEND_URL=https://myapp.fly.dev/api/notes
```

**All environment variables exposed to the browser must be prefixed with VITE_**.

Variables without this prefix will remain server-side only and are not included in the bundle.

This is a deliberate security measure to prevent accidentally leaking secrets.

Enviroment variables can be accessed like in the following example:

```javascript
const App = () => {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    <div>
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    </div>
  )
}
```

Vite automatically selects the correct `.env` file based on the mode:

|    `npm run dev`    |     `npm run build`    |
| ------ | ------ |
|    `.env`    |    `.env`    |
|    `.env.development`    |     `.env.production`    |

**Add `.env.production` to `.gitignore` if it contains sensitive values.**

**Use `.env.example` to document what variables are required.**

###### Vite Transpilation

During development, esbuild transpiles your TypeScript and JSX on demand.It is fast enough to do this per-file without a noticeable delay.

During production builds, Rollup handles the bundling while esbuild handles transpilation.

###### Vite Transpilation For Older Browsers

The default transpilation target in Vite is modern browsers that support native ES modules such as Chrome 87+, Firefox 78+, Safari 14+, Edge 88+.

Support for older browsers can be enabled via [Vite Plugins](#vite-plugins).

1. Run `npm install --save-dev @vitejs/plugin-legacy`

1. Make edits to `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

The legacy plugin automatically generates a separate bundle for older browsers using Babel.

###### Vite Handling of CSS

Vite handles CSS without any configuration. Simply import a CSS file from your JavaScript.

Vite also natively supports CSS Modules for scoped styles. Any file ending in .module.css is treated as a CSS Module:

```javascript
import styles from './App.module.css'

const App = () => (
  <div className={styles.container}>
    hello vite
  </div>
)
```

CSS preprocessors like [Sass](https://sass-lang.com/) can be added by simply installing the preprocessor, no plugin or configuration needed:

```bash
npm install --save-dev sass
```

After that, `.scss` files work automatically.

###### Vite Minification

Vite uses esbuild for JavaScript minification and a built-in CSS minifier for stylesheets.

See [step 6 of esbuild minification](#esbuild).

###### Vite Source Maps

In development, Vite generates source maps automatically.

For production builds, you can enable them explicitly in `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

🚨 Production source maps increase build time and expose your source code to anyone who looks at the network tab.

**In many cases it is better to upload source maps to an error monitoring service (such as Sentry) and keep them off the public server.**

###### Vite Plugins

Vite's [plugins](https://vite.dev/plugins/) extend functionality. For example:

- _`@vitejs/plugin-react`_ — React support (JSX, fast refresh)
- _`@vitejs/plugin-legacy`_ — legacy browser support
- _`vite-plugin-svgr`_ — import SVG files as React components
- _`rollup-plugin-visualizer`_ — bundle size analysis

Vite plugins follow the same interface as Rollup plugins, so many Rollup plugins also work with Vite.

###### Vite Polyfills

A polyfill is code that implements a feature for browsers that do not natively support.

Transpilation alone is not sufficient for features that are syntactically valid but unimplemented. For example, a browser might parse Promise correctly but have no implementation of it.

Polyfills are handled by the plugin _`@vitejs/plugin-legacy`_. It can automatically include the necessary polyfills based on your browser targets.

If a specific polyfill is needed without the legacy plugin, install it directly and import it at the top of the entry file.

Specific browser APIs can be referenced at https://caniuse.com or [Mozilla's MDN documentation](https://developer.mozilla.org/).

### Part 7 sub c. | Miscellaneous

#### Class Components

Hook functionality only appeared after version 16.8 of React. Component state had to be defined using Javascript [classes](https://reactjs.org/docs/state-and-lifecycle.html#converting-a-function-to-a-class) for earlier versions.

See `./class-example` for an example of using classes.

Class Components can only contain one state. So if the state is made up of multiple "parts", they should be stored as **properties** of the state.

The correct place to trigger the fetching of data from a server is inside the [lifecycle method](https://react.dev/reference/react/Component#adding-lifecycle-methods-to-a-class-component) [componentDidMount](https://react.dev/reference/react/Component#componentdidmount), which is executed once right after the first time a component renders.

Calling the method `setState()` will always trigger the rerender of the Class Component, i.e. calling the method `render()`.

```javascript
const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() =>{
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  },[])

  const handleClick = () => {
    setCurrent(Math.round(Math.random() * (anecdotes.length - 1)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}
```

The difference between class components and functional components are:

1. The state of a Class component is a single object, and that the state is updated using the method setState.

1. States in Functional components can consist of multiple different variables, with all of them having their own update function.

In 2026, **Class Components are largely a historical artifact**. The React documentation itself treats Class components as a legacy API.

#### Error Boundary

An [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) is a component that catches JavaScript errors anywhere in its child component tree and displays a fallback UI instead of crashing the whole application.

As of 2026, React has not yet introduced a hook-based alternative for this, so **error boundaries must still be implemented as Class components.**

An example of error boundary usage can be found in `./class-example/ErrorBoundary.jsx`.

The two key lifecycle methods are:

- `getDerivedStateFromError` - updates state so the next render shows the fallback UI.
- `componentDidCatch` - a place to log the error to an error reporting service.

Because this is the one remaining use case for Class components, many projects use the [react-error-boundary](https://github.com/bvaughn/react-error-boundary) library, which wraps the class-based machinery behind a convenient Functional component API.

**Don't never have to write a Class component for error boundary manually.**

#### Frontend and Backend in the same Repository

Keep Vite frontend in a client directory and the Express backend in a server directory, each with their own package.json.

The root of the repository gets a third package.json that acts as a convenience wrapper with scripts to run both together.

```markdown
app/
  package.json        (root, scripts only)
  client/
    package.json      (Vite + React)
    vite.config.js
    src/
      App.jsx
  server/
    package.json      (Express)
    index.js
```

The Express server in `server/index.js` serves the API and, in production, also serves the built frontend from the `client/dist` directory.

This is `server/index.js`:

```javascript
const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() })
})

// serve the built Vite frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
```

For development, the Vite dev server runs on its own port and needs to forward API requests to Express which isc onfigured in `client/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

The root `package.json` is responsible for launching the frontend and backend together:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

[`concurrently`](https://github.com/open-cli-tools/concurrently) in the `dev` script above can be installed via `npm i -D concurrently`

A small utility that runs multiple commands at the same time and merges their output into a single terminal stream. Without it you would have to open two separate terminals, one for the backend and one for the frontend.

`--prefix` flag tells npm which subdirectory to treat as the working directory.

Since each part of the project has its own package.json, the directory needs to be explicity when installing new packages. The same `--prefix` flag works for npm install as well:

```bash
npm install axios --prefix client     # add to the frontend
npm install mongoose --prefix server  # add to the backend
```

Alternatively, simply `cd` into the target directory and run `npm install` from there.

#### React Application Code Organization

Common covention used by [Next.js](https://nextjs.org/docs/pages/building-your-application/routing) and is described in the [React FAQ on file structure](https://legacy.reactjs.org/docs/faq-structure.html):

```bash
src/
  App.jsx
  pages/
    HomePage.jsx
    BlogPage.jsx
    UserPage.jsx
  components/
    Blog.jsx
    BlogList.jsx
    LoginForm.jsx
    Notification.jsx
  hooks/
    useField.js
  services/
    blogs.js
    users.js
  stores/
    blogStore.js
    notificationStore.js
```

A common response to solving the a feature that is scattered across different every directory this is to group files by feature instead. 

The[ Feature-Sliced Design methodology](https://feature-sliced.design/) formalises this approach, and the [bulletproof-react](https://github.com/alan2207/bulletproof-react) project is a widely-referenced example of applying it in practice.

**There is no single correct way to organize a large project. The right choice depends on the size and nature of the application.**

#### Reflecting Changes on the Frontend with the Backend

Solves, "How to keep the UI in sync with a server that changes independently?"

[Polling](https://en.wikipedia.org/wiki/Polling_(computer_science))

> The frontend asks the server for fresh data at a fixed interval. For example using `setInterval`.
> 
> Polling is easy to implement but wasteful, because most requests return nothing new.

[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

>  A persistent two-way connection between the browser and the server is formed. The server can then push updates to connected clients the moment something changes, without the client having to ask. 
>
> WebSockets are now supported by all modern browsers.


Alternatives to WebSockets:

- The [Socket.io](https://socket.io/) library wraps WebSockets with a higher-level API and adds automatic reconnection and other conveniences.

- GraphQL has a subscription mechanism that lets the server notify clients about data changes in a structured way.

#### React and Node Application Security

[SQL Injection](https://stackoverflow.com/questions/332365/how-does-the-sql-injection-from-the-bobby-tables-xkcd-comic-work) are prevented using [parameterized queries](https://security.stackexchange.com/questions/230211/why-are-stored-procedures-and-prepared-statements-the-preferred-modern-methods-f). This is where user input isn't mixed with the SQL query, but the database inserts the input values at placeholders in the query.

Injection attacks are also possible in NoSQL databases. [Mongoose prevents them by sanitizing the queries](https://web.archive.org/web/20220901024441/https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html).

Cross-site scripting (XSS) is an attack where it is possible to inject malicious JavaScript code into a legitimate web application. The malicious code would then be executed in the browser of the victim.

React [takes care of sanitizing data in variables](https://legacy.reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks). Some versions of React have been [vulnerable to XSS attacks](https://medium.com/dailyjs/exploiting-script-injection-flaws-in-reactjs-883fb1fe36c1). The security holes have of course been patched, but there is no guarantee that there couldn't be any more.

It is recommended to be vigilant on security updates for [Express](https://expressjs.com/en/advanced/security-updates.html) and [Node](https://nodejs.org/en/blog/vulnerability/).

##### Updating Dependencies

1. Check if dependies are out of date: `npm outdated --depth 0`
1. Update package.json: `npm install -g npm-check-updates` (global install)
1. Complete the update of package.json using `npm-check-updates` by executing `ncu -u`
1. Finally install the updated packages `npm install`

**`npm audit` compares the version numbers of the dependencies in an application to a list of the version numbers of dependencies containing known security threats in a centralized error database**

`npm audit fix` can resolve suggested security fixes after executing `npm audit`.

By default, `audit fix` does not update dependencies if their major version number has increased. Updating these dependencies could lead to the whole application breaking down.

_Supply chain attacks_ possible in when instead of attacking an application directly, an attacker compromises one of the dependencies that most applications rely on, and the malicious code then gets pulled into every project that installs that dependency.

#### Best Practices for Application Security

1. Keep dependencies reasonably small - every package added is additional attack surface
1. Git commit the package-lock.json file
1. Use `npm ci` instead of `npm install` in Continous Integration or Production environments (so exact previously verified dependecny versions and integrity hashes are used)
1. Run `npm audit` regularly
    1. Use equivalent [Socket](https://socket.dev/) or [Snyk](https://snyk.io/) regularly, and let tools such as [Dependabot](https://docs.github.com/en/code-security/dependabot) or [Renovate](https://docs.renovatebot.com/) open pull requests automatically when new versions are released.
1. Discern adding new dependencies.
    1. Check maintanence activity, authenticity, and projects that depend on it
1. Consider disabling the execution of install scripts for dependencies you don't fully trust, e.g. with `npm install --ignore-scripts`.
1. Avoid installing a package version the moment it is published. The minimum release age for a package can be enforced in the `.npmrc` settings.
1. Access control should be done both in the frontend and also on the backend.
1. **Never trust data from the browser, e.g., URL parameters, HTTP headers, cookies, user uploaded file. Always sanitize and assume the worst.**
1. Read [Mozila MDN's website security guide](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security)
1. Install the [Helmet](https://helmetjs.github.io/) package for the backend which includes middleware that elimates some vulnerabilities in Express
1. Read [Express's Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
1. Install [ESlint security plugin](https://github.com/nodesecurity/eslint-plugin-security)
