import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="max-w-md w-full p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">MediConnect</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}

        />
      </div>
    </div>
  )
}

