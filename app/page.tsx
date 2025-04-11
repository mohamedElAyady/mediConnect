"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowRight, Calendar, MessageSquare, UserRound } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const convexUser = useQuery(
    api.users.getUser,
    isSignedIn ? { clerkId: user?.id || "" } : "skip"
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">MediConnect</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                {convexUser && (
                  <Link href={`/${convexUser.role || "onboarding"}/dashboard`}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Modern Healthcare Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Streamline appointments, communications, and patient care with our
              all-in-one platform for healthcare professionals and patients.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-up?role=doctor">
                <Button size="lg" className="gap-2">
                  For Doctors <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/sign-up?role=patient">
                <Button size="lg" variant="outline" className="gap-2">
                  For Patients <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Appointment Management",
                  icon: <Calendar className="text-primary h-6 w-6" />,
                  desc: "Easily schedule, reschedule, and manage appointments with an intuitive calendar interface.",
                },
                {
                  title: "Real-time Messaging",
                  icon: <MessageSquare className="text-primary h-6 w-6" />,
                  desc: "Communicate securely with patients or doctors through our integrated messaging platform.",
                },
                {
                  title: "Electronic Health Records",
                  icon: <UserRound className="text-primary h-6 w-6" />,
                  desc: "Access and manage patient medical history securely in one centralized location.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-lg shadow-sm border"
                >
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 MediConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
