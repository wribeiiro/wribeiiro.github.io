# (wribeiiro) Portfolio Win98

A personal portfolio built as a Windows 98 desktop experience. Fully interactive with draggable windows, a taskbar, start menu, and easter eggs.

**Live:** [https://wribeiiro.github.io](https://wribeiiro.github.io)

<img width="1919" height="925" alt="image" src="https://github.com/user-attachments/assets/1368e9cb-a29c-4ac8-b099-3f5d0a63fd01" />


## Features

- Windows 98 desktop environment with draggable/resizable windows
- Start menu and taskbar with minimize/restore/close behavior
- About Me window with profile, tech stack, and personal sections
- Experience window (WordPad style) with full career timeline
- Contact window with social links
- Internet Explorer easter egg with a local Google 98 page
- Media Player with Spotify "Now Playing" integration
- Counter Strike 1.6 easter egg with intro video
- Shutdown simulation with safe-to-turn-off screen

## Tech Stack

- React 19 + Vite 8
- SCSS for Win98 styling
- Vercel Serverless Functions (Spotify API proxy)
- GitHub Pages (static hosting)

## Project Structure

```
src/
├── main.jsx                        # Entry point
├── App.jsx                         # Root layout
├── components/                     # Shared UI components
│   ├── Icon/                       #   Icon with semantic name map
│   └── Modal/                      #   Generic Win98 modal
├── features/
│   └── desktop/                    # Desktop feature
│       ├── components/             #   Desktop UI components
│       │   ├── Desktop/            #     Window container & renderer
│       │   ├── DesktopIcon/        #     Single desktop icon
│       │   ├── DesktopIcons/       #     Icon grid manager
│       │   ├── DesktopWindow/      #     Window chrome (titlebar, drag, resize)
│       │   ├── Start/              #     Start menu
│       │   ├── StartMenuItem/      #     Menu item
│       │   ├── Task/               #     Taskbar button
│       │   └── Taskbar/            #     Taskbar
│       ├── hooks/                  #   Desktop-specific hooks
│       │   ├── useDrag.js          #     Window drag behavior
│       │   └── useWindowManagement.js  # Window state (open/close/minimize)
│       └── windows/                #   Window content components
│           ├── AboutWindow/        #     Profile & skills
│           ├── ContactWindow/      #     Contact links
│           ├── CSWindow/           #     CS 1.6 video easter egg
│           ├── ExperienceWindow/   #     Career timeline (WordPad)
│           ├── IEWindow/           #     Internet Explorer easter egg
│           └── WMPWindow/          #     Media Player + Spotify
├── data/                           # Static data
│   ├── aboutSections.js            #   Focus, interests, personal facts
│   ├── contactInfo.js              #   Contact links
│   ├── experiences.js              #   Career history
│   ├── menuItems.js                #   Start menu entries
│   ├── personalInfo.js             #   Name, title, bio, links
│   └── skills.js                   #   Tech stack categories
├── hooks/                          # Global hooks
│   ├── useClock.js                 #   Taskbar clock
│   ├── useShutdownSound.js         #   Shutdown sound effect
│   └── useSpotify.js               #   Spotify Now Playing polling
└── styles/                         # SCSS
    ├── main.scss                   #   Entry (imports all partials)
    ├── _variables.scss             #   Colors, fonts, sizes
    ├── _reset.scss                 #   CSS reset
    ├── _window.scss                #   Window chrome styles
    ├── _taskbar.scss               #   Taskbar styles
    ├── _start-menu.scss            #   Start menu styles
    ├── _icons.scss                 #   Desktop icons styles
    └── _components.scss            #   Misc component styles
```

## Setup

```bash
npm install
npm run dev
```

## Spotify Integration

The Media Player shows your currently playing Spotify track. It requires a Vercel serverless function as proxy.

### Setup steps:

1. Create an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Add `https://oauth.pstmn.io/v1/callback` as Redirect URI
3. Generate a refresh token via OAuth flow (see `.env.example`)
4. Deploy the `/api/spotify.js` function to Vercel
5. Set environment variables in Vercel dashboard:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
6. Update `.env.production` with your Vercel URL

## Deployment

**GitHub Pages (frontend):**
```bash
npm run build
npm run deploy
```

**Vercel (Spotify API only):**
```bash
vercel --prod
```

## Disclaimer

This project is a personal portfolio inspired by the Windows 98 aesthetic. All trademarks belong to their respective owners. Not affiliated with Microsoft Corporation.
