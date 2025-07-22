// src/lib/firestore.ts
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { Movie } from './types';
import { allMovies } from './movie-data'; // Using this as a temporary mock movie database

// Helper to get a movie by its ID from our mock data
const getMovieById = (id: number): Movie | undefined => {
    return allMovies.find(movie => movie.id === id);
};

// --- User Movie List Management ---

// Function to get a user's movie list (e.g., 'favorites', 'watched')
export const getUserMovieList = async (userId: string, listName: 'favorites' | 'watched'): Promise<Movie[]> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const movieIds = userData[listName] || [];
            
            // In a real scenario, you might fetch details for each movie ID.
            // For this example, we'll get them from our mock data.
            const movies = movieIds.map(getMovieById).filter((m): m is Movie => !!m);
            return movies;
        }
        return [];
    } catch (error) {
        console.error(`Error getting user ${listName} list:`, error);
        return [];
    }
};

// Function to add a movie to a user's list
export const addMovieToList = async (userId: string, listName: 'favorites' | 'watched', movieId: number) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            await updateDoc(userDocRef, {
                [listName]: arrayUnion(movieId)
            });
        } else {
            // If the user document doesn't exist, create it
            await setDoc(userDocRef, {
                [listName]: [movieId]
            });
        }
    } catch (error) {
        console.error(`Error adding movie to ${listName}:`, error);
        throw error; // Re-throw to handle in the component
    }
};

// Function to remove a movie from a user's list
export const removeMovieFromList = async (userId: string, listName: 'favorites' | 'watched', movieId: number) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            [listName]: arrayRemove(movieId)
        });
    } catch (error) {
        console.error(`Error removing movie from ${listName}:`, error);
        throw error; // Re-throw to handle in the component
    }
};


// Function to check if a movie is in a user's list
export const isMovieInList = async (userId: string, listName: 'favorites' | 'watched', movieId: number): Promise<boolean> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const list = userData[listName] || [];
            return list.includes(movieId);
        }
        return false;
    } catch (error) {
        console.error(`Error checking movie in ${listName}:`, error);
        return false;
    }
};
