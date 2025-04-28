import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  href: string;
  label: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export const NavButton = ({ 
  href, 
  label, 
  isActive, 
  icon 
}: NavButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
        "text-sm sm:text-base",
        "hover:bg-blue-600",
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-gray-100 hover:text-white"
      )}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};