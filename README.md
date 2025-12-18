# Netflix Clone - Full Stack Streaming Platform 🎬

> A sophisticated, high-performance streaming application clone built to demonstrate mastery of the Next.js ecosystem, complex data modeling, and modern UI/UX principles.

## 📋 What is this?

**Netflix Clone** is a fully functional Single Page Application (SPA) that simulates a premium video streaming service. It allows users to authenticate, browse a vast library of movies and TV shows, manage a personal watchlist, and experience seamless video playback.

Unlike simple UI clones, this project implements a **robust backend** capable of distinguishing between standalone Movies and multi-episode TV Series, featuring a smart hybrid video player.

## 🔗 Live Demo

Access the deployed application here:
👉 **[https://netflix-clone-eta-inky-53.vercel.app/]**

## 🚀 Tech Stack

This project leverages the bleeding edge of the React ecosystem:

- **Framework:** Next.js 15 (App Router & Server Components)
- **Language:** TypeScript
- **Styling:** TailwindCSS (Responsive & Dark Mode)
- **Database:** MongoDB (via Prisma ORM)
- **Authentication:** Clerk
- **State Management:** Jotai (Atomic state for Modals)
- **Icons:** Lucide React
- **Deployment:** Vercel

## ✨ Key Features

### 🎥 Immersive Viewing Experience
- **Smart Hero Section:** Randomly features a top-rated Movie or Series on refresh, playing the trailer automatically in the background (Youtube Embed or MP4).
- **Hybrid Player:** A custom video player logic that handles both direct video files (MP4) and YouTube IDs, ensuring content availability.
- **Episode Selector:** Dynamic modal for TV Shows allowing users to browse and select specific episodes within a season.

### 👤 User Personalization
- **"My List" System:** Users can add/remove content to their personal watchlist with instant database persistence.
- **Smart Navigation:** Remembering the navigation history to ensure the "Back" button returns to the correct context (Home or Category).

### ⚡ Performance & UX
- **Server-Side Rendering (SSR):** Heavy data fetching happens on the server for optimal SEO and initial load speed.
- **Optimistic UI:** Instant feedback on user interactions (Like/Add to List).
- **Responsive Design:** A fully adaptive layout that works flawlessly from large 4K screens to mobile devices.

## 🎯 Project Ambition

This project serves as a **Professional Portfolio Piece**.
It aims to bridge the gap between a visually stunning frontend and a complex, relational backend. It demonstrates the ability to handle:
1.  **Complex Data Relationships:** Managing `Movies`, `Seasons`, and `Episodes` in a NoSQL environment.
2.  **State Synchronization:** Keeping the UI in sync with the server state (Favorites/Likes).
3.  **Third-Party Integrations:** Seamlessly embedding external media players.

## 🧠 Architectural Decisions & Technical Strategy

### 1. Hybrid Rendering (Server vs. Client)
**Decision:** Heavy use of React Server Components (RSC) for the main dashboard and Client Components only for interactivity (Modals, Player).
**Reasoning:**
- **Performance:** Fetching the movie catalog directly on the server reduces the client bundle size and eliminates "waterfall" requests.
- **Interactivity:** The `InfoModal` and `VideoPlayer` require browser APIs (window, history), necessitating Client Components.

### 2. Database Schema: Relational Logic in NoSQL
**Decision:** Using Prisma with MongoDB to enforce relations between `Movie` (Parent) and `Episode` (Children).
**Reasoning:**
- While MongoDB is document-based, streaming data is inherently relational (A TV Show *has many* Episodes). Prisma allows us to enforce this structure strictly while enjoying MongoDB's scalability.

### 3. Atomic State Management (Jotai)
**Decision:** Adopted Jotai over Context API for the Global Modal state.
**Reasoning:**
- To avoid "Provider Hell" and unnecessary re-renders. The `InfoModal` needs to be triggered from anywhere in the app (Hero, Rows, Search Results). Jotai allows us to open the modal with a simple atom update without re-rendering the entire component tree.

### 4. Hybrid Video Strategy
**Decision:** The backend supports both raw URLs and YouTube IDs.
**Reasoning:**
- To create a realistic portfolio without hosting terabytes of video files, the system intelligently detects the video source. If it's a YouTube ID, it renders a custom-styled Iframe that mimics a native player (hiding controls, autoplaying). If it's a file, it uses the HTML5 Video tag.

## 🔧 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/netflix-clone.git](https://github.com/YOUR_GITHUB_USERNAME/netflix-clone.git)  
   ```
  
2. **Install dependencies:**

    ```bash
   npm install
    ```

3. **Configure Environment Variables: Create a .env file in the root directory and add the following keys (you need your own API keys):**

    ```bash
    DATABASE_URL="your_mongodb_connection_string"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
    CLERK_SECRET_KEY="your_clerk_secret"
     ```

4. **Database Setup & Seeding: This project includes a robust seed script to populate your database with Movies, Series and Episodes.**
      ```bash
      npx prisma db push
      npx prisma db seed
      ```
5. **Run the development server:**
      ```bash
        npm run dev
      ```
6. **Open:**
    ```bash
    http://localhost:3000
    ```

## 🧪 Testing & Quality Assurance

- ESLint: Enforces code quality and catches errors early.
- Mobile Responsiveness: Tested on multiple screen sizes (Mobile, Tablet, Desktop).
- Error Handling: Robust try/catch blocks in API routes and visual feedback (Toasts) for users.

## 📦 Deployment

This project is deployed on Vercel with automatic CI/CD pipelines connected to the main branch. Database hosted on MongoDB Atlas.

## Author

Developed by Paulo. Full Stack Developer focused on building scalable, high-performance web applications.