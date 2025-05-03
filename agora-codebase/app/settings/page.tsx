
import { Header } from "@/components/header";
import KYCForm from "@/components/kyc/KYCForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <Header />
        <KYCForm />
    <main className = "flex items-center justify-center min-h-screen">
      <main className = "flex items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-gray-800">
        Agora
      </h1>
      </main>
      </main>
    </div>

  
  );
}