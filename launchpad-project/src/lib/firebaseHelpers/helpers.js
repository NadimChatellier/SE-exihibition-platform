import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createNewCollection = async (uid, title) => {
  const colRef = collection(db, "users", uid, "collections");
  await addDoc(colRef, {
    title,
    createdAt: serverTimestamp(),
  });
};