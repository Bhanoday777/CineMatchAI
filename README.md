# CineMatch AI 🎬

An AI movie recommendation web app. Describe what you're in the mood for, pick a mood, or let it learn from your favourites, and Gemini suggests what to watch next.

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28)
![Genkit](https://img.shields.io/badge/Genkit-Gemini_2.0_Flash-4285F4)

---

## Features

- **Three ways to get recommendations**, each a separate Genkit flow backed by Gemini 2.0 Flash:
  - **Describe a movie:** a free-text prompt, e.g. "a mind-bending sci-fi with a twist".
  - **Pick a mood:** Happy, Scary, Thought-provoking and more.
  - **For you:** personalised suggestions based on the user's favourites and watch history.
- **Explore and search:** browse the catalogue and filter by genre, release year and rating.
- **Authentication:** email/password and Google sign-in through Firebase Authentication.
- **Profiles and lists:** each user's Favorites and Watched lists are stored in Firestore and shown on their profile page.
- **Movie detail pages:** cast, overview, runtime, rating and an embedded YouTube trailer.
- **UI:** dark theme built with Tailwind CSS, shadcn/ui and Framer Motion.

> **Note:** the movie catalogue is currently a small local dataset (`src/lib/movie-data.ts`). Moving it to Firestore or the TMDB API is next on the roadmap.

## How recommendations work

```text
User input (prompt / mood / profile history)
        │
        ▼
Genkit flow (src/ai/flows/*)
  • prompt-ai-movie-suggestion.ts       → free-text prompt
  • generate-movie-recommendation.ts    → mood-based
  • get-personalized-recommendation.ts  → favourites + watch history
        │
        ▼
Gemini 2.0 Flash  →  structured suggestions  →  rendered as movie cards
```

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| AI | Firebase Genkit with the Google AI plugin (Gemini 2.0 Flash) |
| Backend | Firebase Authentication, Cloud Firestore |
| UI | Tailwind CSS, shadcn/ui, Framer Motion |
| Forms | React Hook Form, Zod |

## Getting started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication (Email/Password and Google) and Firestore enabled
- A Google AI Studio API key

### Setup

The app lives in the `studio-master/` folder.

```bash
git clone https://github.com/Bhanoday777/CineMatchAI.git
cd CineMatchAI/studio-master
npm install
```

Create `studio-master/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Google AI Studio key used by Genkit
GEMINI_API_KEY=...
```

Run the dev server:

```bash
npm run dev
```

The app runs at http://localhost:9002.

## Project structure

```text
studio-master/src/
├── ai/
│   ├── genkit.ts        # Genkit + Gemini configuration
│   └── flows/           # The three recommendation flows
├── app/                 # Routes: home, explore, search, movie/[id], profile, login, signup
├── components/          # Movie cards, carousels, recommendation panels, shadcn/ui
├── context/             # Auth context
└── lib/                 # Firebase setup, Firestore helpers, movie data
```

## Roadmap

- Replace the local catalogue with TMDB or Firestore
- Ratings and reviews
- Similar-movie suggestions on detail pages

## License

Released under the [MIT License](LICENSE).

## Author

**Bhanoday Kurma**, [GitHub](https://github.com/Bhanoday777)
