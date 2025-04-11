import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="max-w-md w-full p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">MediConnect</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
            },
          }}
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  )
}

