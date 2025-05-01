"use client";
import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="py-4">
      <h2 className="text-2xl lg:text-4xl font-medium mb-4 items-center">
        Bienvenido de vuelta!
      </h2>

      {/* Solo muestra el saludo una vez que Clerk haya cargado
           y exista un usuario autenticado */}
      {isLoaded && user && (
        <p className="text-sm text-white">Hola, {user.firstName}!</p>
      )}
    </div>
  );
};
