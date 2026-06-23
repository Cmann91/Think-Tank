# Think Tank

A personal project management app for tracking ideas from concept to completion.

## What it does

Think Tank lets you create and manage projects, each with a status, priority, description, notes, tags, tasks, and features. Projects live in your browser via localStorage — no account or backend needed.

- **Home view** — card grid of all your projects, filterable by status, with a light/dark mode toggle
- **Project cards** — show title, priority, status badge, description, and tags at a glance. Expand a card with the arrow to see tasks and check them off without opening the project
- **Project editor** — full edit view with a local draft system: changes aren't committed until you hit Save, so you can freely discard edits
- **Tasks** — add, complete, and delete tasks per project
- **Features** — track individual features with their own status (planned → in progress → testing → built)

## Tech

- React 19 + Vite 8
- Inline styles throughout, CSS custom properties for light/dark theming
- localStorage for persistence
- No external UI libraries or backend
