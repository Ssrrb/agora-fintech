import { UserButton } from "@clerk/nextjs";
import { Header } from "@/components/header";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <Header />
      <UserButton />
      <main className = "flex items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-800">
        Agora
      </h1>
      <h3 className="text-2xl font-semibold text-gray-600">
        This is a protected page!
      </h3>
      </main>
    </div>

  
  );
}