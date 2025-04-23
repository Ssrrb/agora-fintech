import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left column - Sign in */}
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#2E2A47]">
                Bienvenido!
              </h1>
              <p className="mt-2 text-base text-[#7E8CA0]">
                Inicia sesión o regístrate para continuar
              </p>
            </div>
            <div className="mt-8">
              <ClerkLoaded>
                <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
              </ClerkLoaded>
              <ClerkLoading>
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </ClerkLoading>
            </div>
          </div>
        </div>

        {/* Right column - Logo */}
        <div className="hidden lg:block">
          <div className="flex h-full items-center justify-center bg-blue-500">
            <Image
              src="/logo.svg"
              height={100}
              width={100}
              alt="Logo"
              className="w-32 h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}