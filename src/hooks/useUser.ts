import { useEffect, useCallback } from "react";
import { useUserStore } from "@/store/userStore";
import { useSession } from "next-auth/react";

export function useUser() {
  const { user, setUser, isLoading, error, setLoading, setError } = useUserStore();
  const { data: session, status } = useSession();

  const fetchUser = useCallback(async () => {
    if (session?.user?.id) {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?.id, setUser, setLoading, setError]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, fetchUser, setUser]);

  return {
    user,
    isLoading: isLoading || status === "loading",
    error,
    refetch: fetchUser,
  };
}