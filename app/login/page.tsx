'use client'
import { useEffect, useState } from "react";
import { auth, provider, signInWithGoogle, signOutFromFirebase } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getUser, saveUser } from "../../collections/userFirestore";


export default function Login() {
  const [user, setUser] = useState<User | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const firebaseUser = userCredential.user;

      const existingUser = await getUser(userCredential.user.uid);
      console.log("existingUser", existingUser);
      if (!existingUser) {
        await saveUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date(),
          timers: [],
        });        
      }

      setUser(firebaseUser);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutFromFirebase();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login with Google</h1>
      {!user ? (
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </button>
      ) : (
        <div className="mt-4">
          <h2>Welcome, {user.displayName}</h2>
          <p>Email: {user.email}</p>
          <img
            src={user?.photoURL || ""}
            alt={user?.displayName || ""}
            className="rounded-full mt-2"
          />
        </div>
      )}
      {user && (
        <button onClick={handleSignOut}>Sign out</button>
      )}
    </div>
  );
}
