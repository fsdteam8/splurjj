"use client";
import { useSession } from "next-auth/react";

interface AuthData {
  token: string | null;
  role: string | null;
  id: string | null;
  email: string | null;
}

const useAuthToken = (): AuthData => {
  const { data: session } = useSession();

  return {
    token: session?.user?.token || null,
    role: session?.user?.role || null,
    id: session?.user?.id || null,
    email: session?.user?.email || null,
  };
};

export default useAuthToken;