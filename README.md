# Stock PWA

A Progressive Web Application (PWA) built with Vite and React, designed to provide stock market insights and updates. This application is optimized for performance, leveraging modern web technologies like service workers and responsive design.

---

## Features

- **Progressive Web Application**: Installable and works offline with caching strategies.
- **Material UI Integration**: Provides a responsive and visually appealing user interface.
- **Real-time Data**: Fetches and displays real-time stock market data.
- **Chart Integration**: Visualizes data using Chart.js and React Chart.js 2.
- **Theming**: Supports custom themes using Material UI's theming capabilities.
- **Notifications**: Leverages browser notifications to alert users.

---

## Technical Overview

This PWA is built using the following technologies:

- **Vite**: A modern frontend build tool for fast development and optimized production builds.
- **React**: A library for building user interfaces.
- **Vite PWA Plugin**: Provides support for PWA features, including service workers and a web manifest.
- **Material UI**: A React-based component library for building accessible and elegant UI components.
- **Chart.js**: A JavaScript/Typescript library for creating interactive charts.
- **React useWebSocket**: A React hook for managing WebSocket connections.


### PWA Configuration

The service worker and caching strategies are handled by the Vite PWA plugin. Key configurations include:

- `registerType: 'autoUpdate'` ensures the service worker is updated automatically.
- `runtimeCaching` for API requests (e.g., `https://finnhub.io/api/v1/`).
- Custom icons and theming via the manifest:
  - `theme_color: '#003366'`
  - Icons: `192x192` and `512x512` PNGs.

---

## Default Stocks

The application can be configured to add default stocks upon initialization.

To enable this feature, set the `VITE_USE_DEFAULT_STOCKS` environment variable to `true`.

To add custom stocks, set the `VITE_DEFAULT_STOCK_SYMBOLS` environment variable to a comma-separated list of stock symbols.

---

## Folder Structure

```plaintext
.
├── dist/                 # Production build output
├── public/               # Static assets (icons, manifest, etc.)
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── providers/        # Context providers (e.g., StocksProvider)
│   ├── services/         # API and service worker configurations
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
├── vite.config.ts        # Vite configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
```

---

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

- Node.js (v16 or later)
- npm or yarn package manager

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/AgustinH09/stock-pwa.git
    cd stock-pwa
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Copy the [`.env.sample`](./.env.sample) file to `.env` and update the environment variables as needed.

    ```bash
    cp .env.sample .env
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

Access the app at [http://localhost:5173](http://localhost:5173).

### Building for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
### Linting

To run the linter:

```bash
npm run lint
```

---

## Deployment

The application can be deployed to any static hosting service (e.g., Netlify, Vercel). The production files are located in the `dist/` folder after running the build script.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
