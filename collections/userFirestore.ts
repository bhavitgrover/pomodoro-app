import { db } from "../lib/firebase";
import User from "../models/User";
import { collection, doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export const userCollection = collection(db, "users");

export const saveUser = async (userData: User) => {
  try {
    const userRef = doc(userCollection, userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.fromDate(new Date()),
    }, {merge: true});
    return true;
  } catch (error) {
    console.error("Error saving user: ", error);
    throw error;
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data() as User;
      } else {
        return null;
      }
  } catch (error) {
    console.error("Error getting user: ", error);
    throw error;
  }
};

export const updateUser = async (uid: string, updatedData: Partial<User>) => {
  try {
    const userRef = doc(userCollection, uid);
    await updateDoc(userRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
};
