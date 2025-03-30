import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import Timer from "../models/Timer";

export const timerCollection = collection(db, "timers");

export const addTimer = async (timerData: Timer) => {
  try {
    const docRef = await addDoc(timerCollection, {
      ...timerData,
      createdAt: Timestamp.fromDate(new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding timer: ", error);
    throw error;
  }
};

export const getTimersByUser = async (uid: string): Promise<Timer[]> => {
  try {
    const querySnapshot = await getDocs(timerCollection)
    const timers: Timer[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Timer;
      if (data.uid === uid) {
        timers.push({
          ...data,
          id: doc.id,
        });
      }
    });
    return timers;
  } catch (error) {
    console.error("Error getting timers: ", error);
    throw error;
  }
};

