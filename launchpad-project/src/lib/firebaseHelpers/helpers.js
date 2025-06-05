import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createNewCollection = async (uid, title, initialArtwork = null) => {
    const colRef = collection(db, "users", uid, "collections");
    const data = {
      title,
      createdAt: serverTimestamp(),
    };
  
    if (initialArtwork) {
      data.artworks = [initialArtwork]; // Start with one artwork
    }
  
    await addDoc(colRef, data);
  };
  

export const addArtworkToCollection = async (uid, collectionId, artwork) => {
    const collectionDocRef = doc(db, "users", uid, "collections", collectionId);
    await updateDoc(collectionDocRef, {
      artworks: arrayUnion(artwork)
    });
  };