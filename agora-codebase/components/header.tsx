import HeaderLogo from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "./welcome-msg";

export const Header = () => (
  <header className="bg-gradient-to-b from-blue-700 to-blue-500 text-white px-4 sm:px-8 lg:px-14 py-6">
    <div className="mx-auto max-w-screen-xl flex items-center justify-between">
      <HeaderLogo />
      <Navigation />
    </div>
    <div className="mx-auto max-w-screen-xl">
      <WelcomeMsg />
    </div>

  </header>
);
