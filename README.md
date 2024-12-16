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
- **Persistent Storage**: Stock data is saved in local storage, ensuring data persists across sessions when using the same browser.

---

## Folder Structure

A high-level overview of the project organization:

```plaintext
.
├── dist/                 # Production build output
├── public/               # Static assets (icons, manifest, etc.)
├── src/                  # Application source code
│   ├── components/       # Reusable UI components
│   ├── providers/        # Context providers (e.g., StocksProvider)
│   ├── context/          # Contexts (e.g., StocksContext)
│   ├── hooks/            # Reusable hooks (e.g., useStocks)
|   ├── types/            # Type definitions
|   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
├── .env                  # Environment variables
├── .env.sample           # Sample environment variables
├── vite.config.ts        # Vite configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
```

---

## Technologies Used

This PWA is built using the following technologies:

- **Vite**: Ultra-fast development build tool.
- **React**: Component-based library for building UIs.
- **Material UI**: Responsive, accessible, and customizable components.
- **Chart.js**: Dynamic charting for stock price visualization.
- **WebSocket API**: Real-time data streaming for stock updates.
- **Vite PWA Plugin**: Provides support for PWA features.

## Implementation of Challenges

This project successfully implements both challenges:

### The Easy One

1. **Real-time Stock Data**:
   - The application fetches stock data in real-time using WebSockets API, ensuring up-to-date information is displayed.
2. **Components**:
   - **Left Form**: A form with a dropdown to select a stock to watch and an input for setting a price alert.
   - **Top Cards**: Displays stock name, value, and margin change as a percentage. Cards turn red if the value is below the alert value and green if above.
   - **Graph**: Plots the value of all added stocks in dollar value using Chart.js.

### The Real Challenge

1. **PWA Implementation**:
   - The app is fully installable and works offline, leveraging service workers for caching and background operations.
2. **WebSocket Management in Background**:
   - The WebSocket connection is managed in the background to continuously fetch and update stock data, even when the app is not actively in use.
3. **Local Storage**:
   - Stock data is saved in local storage, allowing the app to quickly retrieve and plot data upon reopening, enhancing the user experience.
4. **Web Push Notifications**:
   - The app sends web push notifications when the stock price goes below the alert level, keeping users informed in real time.

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

### Development

To start the development server:

```bash
npm run dev
```

Access the app at [http://localhost:5173](http://localhost:5173).

### Build for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

To run the linter:

```bash
npm run lint
```

---

## Default Stocks

The application can be configured to add default stocks upon initialization.

To enable this feature, set the `VITE_USE_DEFAULT_STOCKS` environment variable to `true`.

To add custom stocks, set the `VITE_DEFAULT_STOCK_SYMBOLS` environment variable to a comma-separated list of stock symbols.

---

## Deployment

The application can be deployed to any static hosting service (e.g., Netlify, Vercel). The production files are located in the `dist/` folder after running the build script.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
