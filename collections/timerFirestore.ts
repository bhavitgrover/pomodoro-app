import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Timer from "../models/Timer";

export const addTimer = async (timerData: Timer, userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const timerCollection = collection(userRef, "timers");

    const docRef = await addDoc(timerCollection, {
      ...timerData,
      createdAt: Timestamp.fromDate(new Date()),
    });
    return {
      message: `Timer of ${Math.round(
        timerData.duration / 60
      )} minutes created successfully`,
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding timer: ", error);
    throw error;
  }
};

export const getTimersByUser = async (userId: string): Promise<Timer[]> => {
  try {
    const userRef = doc(db, "users", userId);
    const timerCollection = collection(userRef, "timers");
    const querySnapshot = await getDocs(timerCollection);
    const timers: Timer[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Timer;
      timers.push({
        ...data,
      });
    });
    return timers;
  } catch (error) {
    console.error("Error getting timers: ", error);
    throw error;
  }
};

export const getSpecificTimer = async (
  userId: string,
  timerId: string
): Promise<Timer> => {
  try {
    const userRef = doc(db, "users", userId);
    const timerCollection = collection(userRef, "timers");
    const querySnapshot = await getDocs(timerCollection);
    const timer = {} as Timer;
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Timer;
      if (doc.id === timerId) {
        Object.assign(timer, data);
      }
    });
    return timer;
  } catch (error) {
    console.error("Error getting timer: ", error);
    throw error;
  }
};

export const updateTimer = async (
  userId: string,
  timerId: string,
  timerData: Timer
) => {
  try {
    const userRef = doc(db, "users", userId);
    const timerCollection = collection(userRef, "timers");
    const timerDocRef = doc(timerCollection, timerId);

    await updateDoc(timerDocRef, {
      ...timerData,
      updatedAt: Timestamp.fromDate(new Date()),
    });
    return {
      message: `Timer updated successfully`,
      success: true,
    };
  } catch (error) {
    console.error("Error updating timer: ", error);
    throw error;
  }
};
