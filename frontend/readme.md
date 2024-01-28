# Code style

These rules should be kept in mind when reviewing
Pull Requests.

## Contribution guidelines

- Code should be functional in style rather than Object Orientated or Imperative
  unless there are no clean alternatives.

  - Use pure functions where possible to make them testable and modular.
  - Avoid mutating variables and the `let` keyword.
  - Prefer functional & immutable array methods .ie
    `map`/`filter`/`reduce`/`some`/`every` over any types of mutable `for` loop.
  - Prefer "return early" coding style, more about it
    [here](https://medium.com/@matryer/line-of-sight-in-code-186dd7cdea88).
  - Avoid classes and stateful modules where possible.
  - Don't Repeat Yourself. Make extensive use of the constants and utils files
    for re-usable strings and methods.
  - Don't obsess over performance of code, obsess over making it clear.
  - The above rules can be relaxed for test scripts.

- React components should be simple and composable and cater to real life UI
  design problems:

  - **Simplicity**: Strive to keep the component API fairly simple and show
    real-world scenarios of using the component.
  - **Representational**: React components should be templates, free of logic,
    and purely presentational. It aims to make our components shareable and easy
    to test.

  - **Composition**: Break down components into smaller parts with minimal props
    to keep complexity low, and compose them together. This will ensure that the
    styles and functionality are flexible and extensible.

  - **Accessibility**: When creating a component, keep accessibility top of
    mind. This includes keyboard navigation, focus management, color contrast,
    voice over, and the correct aria-\* attributes.

  - **Naming Props**: We all know naming is the hardest thing in this industry.
    Generally, ensure a prop name is indicative of what it does. Boolean props
    should be named using auxiliary verbs such as does, has, is and should. For
    example, Button uses `isDisabled`, `isLoading`, etc.

- When doing styling, strive to use `tailwindcss` classes for consistency and
  painless maintenance.

  - Avoid hard coding colors. All colors from the design guideline should be
    pre-defined in [`tailwind.js`](../tailwind.config.js). Please use them with
    respect.

  - Try to avoid injecting styles via `style` attribute because it's impossible
    to build responsiveness with inline styles. Strive to only use Tailwind
    classes for sizing, spacing, and building grid layouts.

    ```jsx
    // Don't
    <div style={{marginLeft: '8px'}}></div

    // Do
    <div className="ml-2"></div

    // Grid layout
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2"></div>
      <div className="col-span-1"></div>
    </div>
    ```

- Maintain the separation of concerns in the folder structure laid out in the
  initial scaffold:

  - `constants/` contains shared variables used across the app.
  - `components/` contains shared ui components used across the app.
  - `utils/` contains shared functions used across the app.
  - `hooks/` contains shared hooks used across the app.
  - `types/` contains common `TypeScript` types or interfaces.

- When adding third party libraries to the project consider carefully the
  following;

  - Is this a trivial package we can easily write in-house? If so, take the time
    to roll your own.
  - Is this library well supported, under active development and widely used in
    the community? If not, do not use it.
  - Do we use a similar but different library for the same task elsewhere in the
    company? If so, use this library for developer familiarity and consistency.
  - Will this library impact significantly performance or bundle size eg
    `Lodash` or `Moment`? If so, consider carefully if it is necessary or if
    there is a better alternative.

- TypeScript helps write code better but should be used with care to not lose
  its strengths:

  - Avoid using `any` when possible. Using `any` is sometimes valid, but should
    rearely be used, even if to make quicker progress. Even `Unknown` is better
    than using `any` if you aren't sure of an input parameter.
  - Pay attention when using the non-null assertion operator `!`. Only use if
    you know that a variable cannot be null right now rather than blindly using
    it to pass the validation step.

- File naming should be `PascalCase` for all React components files and
  `kebab-case` for the rest.

- Exports from files can be either as variable or default exports, but please
  stick to naming the object before using `export default` to avoid anonymous
  module names in stack traces and React dev tools.

- Your app should be fast but also remember "Premature optimization is the root
  of all evil". **If you think it’s slow, prove it with a benchmark.**, the
  profiler of
  [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
  (Chrome extension) is your friend! Once you find the root cause, try to follow
  the suggestions to fix it:
  - Use `useMemo` mostly just for expensive calculations.
  - Use `React.memo`, `useMemo`, and `useCallback` for reducing re-renders, they
    shouldn't have many dependencies and the dependencies should be mostly
    primitive types.
  - Make sure your `React.memo`, `useCallback` or `useMemo` is doing what you
    think it's doing (is it really preventing rerendering?).
  - Stop punching yourself every time you blink (fix slow renders before fixing
    rerenders).
  - Putting your state as close as possible to where it's being used will not
    only make your code so much easier to read but It would also make your app
    faster (state colocation).
  - `Context` should be logically separated, do not add to many values in one
    context provider. If any of the values of your context changes, all
    components consuming that context also rerenders even if those components
    don't use the specific value that was actually changed.
  - You can optimize `context` by separating the `state` and the `dispatch`
    function.
  - Know the terms
    [`lazy loading`](https://nextjs.org/docs/advanced-features/dynamic-import)
    and [`bundle/code splitting`](https://reactjs.org/docs/code-splitting.html)
  - Window large lists (with
    [`tannerlinsley/react-virtual`](https://github.com/tannerlinsley/react-virtual)
    or similar).
  - A smaller bundle size usually also means a faster app. You can visualize the
    code bundles you've generated with
    [`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer).

# Frameworks/Libraries

### React Context

We don't advocate for any state management library at the moment. One of the
reasons libraries like Redux were so successful is because they solved the
problem of [prop drilling](https://kentcdodds.com/blog/prop-drilling). However,
the born of [Context API](https://reactjs.org/docs/context.html) made it easy to
pass data through the component tree without having to pass props down manually
at every level. More importantly, we think most applications don't need a
complicated global state, and Context API is more than enough to solve that
uncomplex problem. Our philosophy in React state management is simple: try to
keep state as local as possible and use React context when prop drilling becomes
a worry.

### TypeScript

We are adopting TypeScript to our codebase. Forcing to write strongly-typed
syntax while you are familiar with dynamic/multi-paradigm scripting language
like JavaScript is sometimes annoying, even for experienced developers. However,
the drawback can be outweighed by the following benefits when coming to write a
medium to large sized applications:

- [x] Catching your bugs at compile-time as you type them.
- [x] Coding confidently with autocompletion, definition jumping and source
      documentation.
- [x] Syncing API Interfaces between backend and frontend via Swagger json doc.
- [x] Relieve the pain of refactoring/renaming .

### SWR

We use [SWR](https://swr.vercel.app/) as the caching layer for the backend data
to ensure the UI will be always fast and reactive. The strategy is to first
return the data from cache (stale), then send the fetch request (revalidate),
and finally, come with the up-to-date data. The data can be dynamic and
self-updated overtime. It features:

- [x] Transport and protocol agnostic data fetching
- [x] Fast page navigation
- [x] Revalidation on focus
- [x] Interval polling
- [x] Request deduplication
- [x] Local mutation

### React Hook Forms

If you are going to use a package for your forms, we recommend
[react-hook-forms](https://github.com/react-hook-form/react-hook-form). It is a
great balance of good performance and good developer experience.

### TailwindCSS

We are using `tailwind` to do styling and it scales pretty well when combining
headless components and hooks to build the presentation layer. The choice was
made because it helps avoid common CSS frustrations to keep a neat codebase and
moving quickly, regardless of experience levels:

- [x] **Consistency**: utility classes help you work within the constraints of a
      system instead of littering your stylesheets with arbitrary values.
- [x] **Naming is hard**: you don't even need to use complicated namespacing
      techniques like BEM.
- [x] **Tiny production build**: automatically removes all unused CSS when
      building for production, which means your final CSS bundle is the smallest
      it could possibly be.
- [x] **Mobile-first**: throw a screen size in front of literally any utility
      class and watch it magically apply at a specific breakpoint.
- [x] **Customization**: although Tailwind includes an expertly crafted set of
      defaults out-of-the-box, but literally everything can be customized via
      JIT or `tailwind.config.js`.

# Editor

## VS Code

There are a couple of plugins that we recommend you install to speed up your
development workflow:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode):
  Opinionated code formatter enforces a consistent styles.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint):
  Statically analyzes JavaScript code to quickly find problems.
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss):
  Intelligent [Tailwind CSS](https://tailwindcss.com/) tooling.

# Project Structure
I recommend following the link below for complete App Router guidelines:
https://betterprogramming.pub/how-to-structure-your-next-js-app-with-the-new-app-router-61bf2bf5a20d
