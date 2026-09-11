This is [part 7 of the fullstack open course](https://fullstackopen.com/en/part7) by <https://studies.cs.helsinki.fi>

### Github Actions Test Status

<details>
<summary>part7-a</summary>

[![routed anecdotes tests](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml/badge.svg?branch=part7-a)](https://github.com/cherylfong/netscapia-hooks-esbuild/actions/workflows/routed-anecdotes.yml)

</details>

<details>
<summary>part7-b</summary>
NONE 🪹
</details>
<br/>

<details>
<summary>part7-c</summary>

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

If a specific polyfill is needed without the legacy plugin,install it directly and import it at the top of the entry file.

Specific browser APIs can be referenced at https://caniuse.com or [Mozilla's MDN documentation](https://developer.mozilla.org/).