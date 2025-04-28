// components/header-logo.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo({ className = "" }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className}`.trim()}
    >
      {/* 👉 scalable icon */}
      <Image
        src="/logowhite.svg"
        alt="Agora logo"
        priority            /* pre-loads the brand asset */
        width={50} height={50}
        className="w-12 sm:w-12 md:w-14 lg:w-16 xl:w-18 h-auto"
      />

      {/* 👉 text shows from md upward only */}
      <span className="hidden md:inline text-xl md:text-2xl font-semibold whitespace-nowrap">
        Agora
      </span>
    </Link>
  );
}
