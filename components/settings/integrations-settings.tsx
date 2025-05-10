"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar, Mail, Check, X, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function IntegrationsSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useUser();
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id as string });
  const integrations = useQuery(api.integrations.getUserIntegrations, { 
    userId: convexUser?._id as any 
  });
  const deleteIntegration = useMutation(api.integrations.deleteIntegration);

  useEffect(() => {
    // Check for OAuth callback status
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (error) {
      toast({
        title: "Connection failed",
        description: error === 'storage_failed' 
          ? "Failed to save integration data. Please try again."
          : "Failed to connect to Google. Please try again.",
        variant: "destructive",
      });
    } else if (success) {
      toast({
        title: "Connected successfully",
        description: "Your Google account has been connected successfully.",
      });
      setIsConnected(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (integrations) {
      setIsConnected(integrations.some(integration => integration.type === "google"));
    }
  }, [integrations]);

  const handleGoogleAuth = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your Google account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch("/api/google/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate OAuth flow");
      }

      if (!data.url) {
        throw new Error("No OAuth URL received from server");
      }

      window.location.href = data.url;

    } catch (error) {
      console.error("Connection Error:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !convexUser) return;
    
    try {
      setIsLoading(true);
      await deleteIntegration({ userId: convexUser._id as any, type: "google" });
      setIsConnected(false);
      toast({
        title: "Disconnected successfully",
        description: "Your Google account has been disconnected.",
      });
    } catch (error) {
      toast({
        title: "Disconnection failed",
        description: "Failed to disconnect your Google account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              <Mail className="h-6 w-6 text-red-500" />
            </div>
            Google Integration
          </CardTitle>
          <CardDescription>
            Connect your Google account to enable calendar synchronization and email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What you get with Google integration</AlertTitle>
              <AlertDescription className="mt-2">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Automatic calendar synchronization for appointments</li>
                  <li>Email notifications for appointment reminders</li>
                  <li>Real-time availability updates</li>
                  <li>Seamless scheduling experience</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-muted/50 rounded-lg">
              {isConnected ? (
                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Connected to Google</span>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <Button
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Disconnect Google Account
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Connect with Google
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground text-center">
              By connecting your Google account, you agree to our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
