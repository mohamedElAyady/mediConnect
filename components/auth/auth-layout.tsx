"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/sign-in", "/sign-up", "/onboarding"];
const doctorRoutes = ["/doctor"];
const patientRoutes = ["/patient"];
const adminRoutes = ["/admin"];

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getUser,
    isSignedIn ? { clerkId: user?.id || "" } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;

    const checkAccess = async () => {
      // Check if current path is a public route
      const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      // If public route, allow access
      if (isPublicRoute) {
        // If user is signed in and trying to access sign-in or sign-up, redirect to dashboard
        if (
          isSignedIn &&
          (pathname === "/sign-in" || pathname === "/sign-up")
        ) {
          redirectBasedOnRole();
          return;
        }

        setCanAccess(true);
        setIsChecking(false);
        return;
      }

      // If not public route and not signed in, redirect to sign-in
      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }

      // Get user role from Clerk metadata or Convex
      const clerkRole = user?.unsafeMetadata.role as string | undefined;
      const convexRole = convexUser?.role;
      const userRole = clerkRole || convexRole;

      // If no role, redirect to onboarding
      if (!userRole) {
        router.push("/onboarding");
        return;
      }

      // Check if user has permission for the current route
      const hasPermission = checkRoutePermission(pathname, userRole);

      if (!hasPermission) {
        redirectBasedOnRole(userRole);
        return;
      }

      // User has permission, allow access
      setCanAccess(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [isLoaded, isSignedIn, pathname, user, convexUser, router]);

  // Helper function to check route permission
  const checkRoutePermission = (path: string, role: string) => {
    if (path.startsWith("/doctor/") && role !== "doctor") return false;
    if (path.startsWith("/patient/") && role !== "patient") return false;
    if (path.startsWith("/admin/") && role !== "admin") return false;
    return true;
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role?: string) => {
    const userRole = role || (user?.unsafeMetadata.role as string);
console.log("role  : ",userRole)
    if (userRole === "doctor") {
      router.push("/doctor/dashboard");
    } else if (userRole === "patient") {
      router.push("/patient/dashboard");
    } else if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/onboarding");
    }
  };

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render children if user can access the route
  return canAccess ? <>{children}</> : null;
}
