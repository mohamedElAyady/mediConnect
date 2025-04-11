"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: "doctor" | "patient" | "admin";
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Get user from Convex
  const convexUser = useQuery(api.users.getUser, {
    clerkId: user?.id || "",
  });

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // User is not authenticated, redirect to sign-in
        router.push("/sign-in");
        return;
      }

      // Check role from Clerk metadata first
      const clerkRole = user.unsafeMetadata.role as string | undefined;

      // Check role from Convex as fallback
      const convexRole = convexUser?.role;

      // Use Clerk role if available, otherwise use Convex role
      const userRole = clerkRole || convexRole;

      if (!userRole) {
        // User has no role in either system, redirect to onboarding
        router.push("/onboarding");
      } else if (userRole !== allowedRole) {
        // User has wrong role, redirect to their dashboard
        if (userRole === "doctor") {
          router.push("/doctor/dashboard");
        } else if (userRole === "patient") {
          router.push("/patient/dashboard");
        } else if (userRole === "admin") {
          router.push("/admin/dashboard");
        }
      } else {
        // User has correct role, allow access
        setHasAccess(true);
      }

      setIsChecking(false);
    }
  }, [isLoaded, user, convexUser, router, allowedRole]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
}
