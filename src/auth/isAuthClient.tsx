"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
 
export const isAuth = (Component: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const { authenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !authenticated) {
        router.push("/signin");
      }
    }, [isLoading, authenticated, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};