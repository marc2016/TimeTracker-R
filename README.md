# TimeTracker-R

A Time Tracking application built with Tauri, React, and Material UI.

## Features

- **Desktop Integration**: Built with [Tauri v2](https://tauri.app) for a lightweight and secure desktop experience.
- **Material UI**: Utilizes [MUI](https://mui.com) for a modern, responsive, and accessible design system.
- **Mini Drawer Navigation**: A sleek side navigation bar that can be toggled between icon-only and expanded views.
- **Custom Header**: Unique clock-icon based toggle for the navigation drawer.

## Tech Stack

- **Framework**: [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev)
- **UI Library**: [Material UI (MUI)](https://mui.com)
- **Icons**: [MUI Icons](https://mui.com/material-ui/material-icons/)

## Getting Started

### Prerequisites

- Node.js (and npm/pnpm/yarn)
- Rust (for Tauri development) -> [Prerequisites Guide](https://tauri.app/start/prerequisites/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/TimeTracker-R.git
    cd TimeTracker-R
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server with hot-reload:

```bash
npm run tauri dev
```

### Building for Production

Build the application bundle:

```bash
npm run tauri build
```
