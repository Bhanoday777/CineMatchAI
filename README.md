# CineMatch AI 🎬🤖

Welcome to CineMatch AI, a modern web application that uses artificial intelligence to provide personalized movie recommendations. Discover new films based on your mood, a descriptive prompt, or your unique viewing history.

![CineMatch AI Screenshot](https://placehold.co/800x400.png) 
*Note: Replace with a real screenshot of the app.*

## ✨ Key Features

- **AI Movie Oracle**: Get movie suggestions in three powerful ways:
    - **Describe a Movie**: Type a prompt like "a mind-bending sci-fi with a twist" and let the AI find a match.
    - **Pick a Mood**: Choose a mood like "Happy," "Scary," or "Thought-provoking."
    - **For You**: Get personalized recommendations based on your favorite movies and watch history.
- **Explore & Filter**: Browse the entire movie collection with advanced search and filtering by genre, release year, and rating.
- **User Authentication**: Secure sign-up and login with email/password or Google, powered by Firebase Authentication.
- **Personalized Profiles**: Each user has a profile page displaying their favorite movies and watch history.
- **Movie Lists**: Easily add movies to your "Favorites" or "Watched" lists from any movie's detail page.
- **Sleek, Modern UI**: A beautiful, responsive interface built with Tailwind CSS and Shadcn/ui, featuring a futuristic dark theme.
- **Detailed Movie Pages**: View comprehensive details for each movie, including cast, overview, runtime, rating, and embedded trailers.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bhanoday777/CineMatchAI.git
   cd CineMatchAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

This project requires a connection to Firebase for authentication, database, and AI features.

1. Create a `.env.local` file in the root of your project:
   ```bash
   touch .env.local
   ```

2. Add your Firebase project configuration to the file. You can get these from your Firebase project settings.
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...

   # This is your Google AI Studio API key for Genkit
   GEMINI_API_KEY=AIza...
   ```

### Running the Development Server

Once the setup is complete, you can run the application locally.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
