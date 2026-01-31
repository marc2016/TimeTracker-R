# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Material UI Integration**:
    - Installed `@mui/material`, `@emotion/react`, `@emotion/styled`.
    - Added `@fontsource/roboto` for typography.
    - Configured `CssBaseline`.
- **Navigation**:
    - Implemented a persistent "Mini Drawer" sidebar.
    - Added toggle functionality with transition effects.
    - Custom header with `AccessTime` icon and "TimeTracker-R" title.
    - Added visual cues for open/closed states.
- **Layout**:
    - Established a main layout structure with a sticky sidebar and dynamic main content area.
    - Cleared initial demo content to prepare for feature implementation.

### Changed

- Replaced the initial Vite/Tauri starter template content with the new Material UI layout.
