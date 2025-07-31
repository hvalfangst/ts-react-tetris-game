# Tetris Game

A web-based Tetris implementation using React and TypeScript. Features include particle effects, sound, and smooth animations.

[Play the game here](https://hvalfangst.github.io/tetris/)

## What's included

- All 7 classic Tetris pieces with proper rotation
- Ghost piece preview showing where your piece will land
- Line clearing with particle effects and screen shake
- Progressive difficulty (speed increases with level)
- Sound effects for moves, drops, and line clears
- Responsive design that works on mobile

## Controls

- Arrow keys or WASD to move and rotate
- Space bar for hard drop
- P to pause

## Running locally

```bash
git clone https://github.com/hvalfangst/tetris.git
cd tetris
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Technical details

Built with React 19 and TypeScript, using Vite for the build system. Game logic is separated into custom hooks for state management, keyboard controls, and the main game loop. Sound effects use the Web Audio API.

## Deployment

Automatically deploys to GitHub Pages via GitHub Actions when pushing to main branch.
