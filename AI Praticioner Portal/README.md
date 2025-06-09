
# AI Practitioner Canvas

The AI Practitioner Canvas is a platform for building, testing, and deploying AI applications. It features a Python-first development philosophy with a TypeScript-based user interface, an AI-powered code generation assistant using the Gemini API, an agent builder, and a component library.

## Prerequisites

Before you begin, ensure you have the following:

1.  **A Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.
2.  **A Simple Local HTTP Server**:
    *   If you have Python installed, you can use its built-in HTTP server.
    *   If you have Node.js and npm installed, you can use `serve` via `npx`.

## API Key Setup (Google Gemini API)

The application utilizes the Google Gemini API for its AI-powered features, such as the Code Generator.

*   **Configuration**: The application is designed to obtain the Gemini API key from an environment variable named `process.env.API_KEY`. This is handled within `services/geminiService.ts`.
*   **Local Static Serving**: When you serve the `index.html` file directly using a simple local HTTP server (as described below), the `process.env.API_KEY` variable will be `undefined` in the browser's context.
*   **Impact**:
    *   The application will still run.
    *   However, features relying on the Gemini API (e.g., Code Generator, AI Search Assistant) will not function correctly. The application includes fallbacks and warnings in `services/geminiService.ts` that will indicate the API key is missing or not configured.
*   **For Full Functionality**: To use Gemini features during local development with this static setup, you would need to manually modify `services/geminiService.ts` to include your API key. However, **this is not recommended for code that will be committed or shared**, as API keys should be kept secret. Production or more advanced development setups would typically use a backend or a build process to manage API keys securely. The current AI guidelines prohibit generating UI or code for API key input, strictly relying on `process.env.API_KEY`.

## Running the Application

1.  **Download or Clone Files**: Ensure all project files (`index.html`, `index.tsx`, `App.tsx`, and all files in `pages/`, `components/`, `services/`, etc.) are in a single directory on your local machine.

2.  **Navigate to Project Directory**: Open your terminal or command prompt and change to the root directory where you saved the project files.
    ```bash
    cd path/to/your/ai-practitioner-canvas-files
    ```

3.  **Start a Local HTTP Server**:

    *   **Option 1: Using Python**
        If you have Python 3 installed:
        ```bash
        python3 -m http.server 8000
        ```
        If you have Python 2 installed (less common now):
        ```bash
        python -m SimpleHTTPServer 8000
        ```
        This will typically serve files on port `8000`.

    *   **Option 2: Using Node.js (with `serve`)**
        If you have Node.js and npm installed, you can use the `serve` package:
        ```bash
        npx serve .
        ```
        This command will download `serve` if you don't have it globally installed and then start serving the current directory. It will output the local address(es) it's using (e.g., `http://localhost:3000`).

4.  **Open in Browser**:
    Open your web browser and navigate to the address provided by your HTTP server.
    *   If you used the Python example: `http://localhost:8000`
    *   If you used `npx serve`, it will tell you the address (commonly `http://localhost:3000` or `http://localhost:5000`).

    You should see the AI Practitioner Canvas application load.

## Features

The application includes the following main sections accessible via the sidebar navigation:

*   **Dashboard**: View and manage your AI projects.
*   **Component Library**: Browse available AI components.
*   **Agent Builder**: Visually construct AI agent workflows.
*   **Code Generator**: Generate code snippets using AI (requires Gemini API setup).
*   **Deployment**: Manage deployment environments (mocked).

## File Structure Overview

*   `index.html`: The main HTML entry point. Includes Tailwind CSS, ReactFlow CSS, and the import map for ES module dependencies.
*   `index.tsx`: The main TypeScript entry point that renders the React application.
*   `App.tsx`: The root React component, handling routing and the main layout (sidebar, main content area).
*   `constants.ts`: Contains shared constants like navigation items and mock data.
*   `types.ts`: Defines TypeScript interfaces and types used throughout the application.
*   `metadata.json`: Contains metadata about the application.
*   `components/`: Directory for reusable React components.
    *   `common/`: Basic UI elements like Buttons, Inputs.
    *   Other specific components like `ProjectCard.tsx`, `ComponentCard.tsx`, `NodePanel.tsx`.
*   `pages/`: Directory for top-level page components corresponding to navigation items.
*   `services/`: Directory for service logic.
    *   `mockApiService.ts`: Simulates backend API calls with mock data.
    *   `geminiService.ts`: Handles interactions with the Google Gemini API.

## Development Notes

*   **ES Modules & Import Maps**: The application uses native ES modules directly in the browser, with dependencies managed via an `importmap` in `index.html`.
*   **CDN Dependencies**: Libraries like React, ReactFlow, Lucide-React, and Tailwind CSS are loaded from CDNs (`esm.sh`, `cdn.tailwindcss.com`).
*   **Styling**: Tailwind CSS is used for styling, included via its CDN script. Custom global styles and ReactFlow specific styles are in `index.html`.
*   **State Management**: Primarily uses React's built-in state management (`useState`, `useEffect`, `useCallback`). ReactFlow manages its internal node/edge state.
*   **Offline Functionality**: Basic offline functionality might be limited due to CDN dependencies. For true offline support, assets would need to be served locally or cached via a service worker (not currently implemented).

This README should help you get the application running on your desktop!
