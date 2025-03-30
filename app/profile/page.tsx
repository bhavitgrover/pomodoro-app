'use client'
import { useAuth } from "../../utils/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>
      <img src={user.photoURL || ""} alt={user.displayName || "Profile Image"} />
    </div>
  );
}
