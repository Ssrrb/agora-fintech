import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <UserButton />

      <h1 className="text-6xl font-bold text-gray-800">
        Dashboard
      </h1>
      <h3 className="text-2xl font-semibold text-gray-600">
        Hellooo
      </h3>
    </main>
  
  );
}