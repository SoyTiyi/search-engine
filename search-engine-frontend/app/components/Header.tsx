'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderLink } from '../lib/type';

const linkProperties: HeaderLink[] = [
  { href: '/', label: 'Flights', pathname: '/' },
  { href: '/history', label: 'History', pathname: '/history' }
]

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-primary tracking-tight">
                Deal Engine
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            {linkProperties.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-bold transition-colors ${
                  pathname === link.pathname
                    ? 'text-brand-primary'
                    : 'text-gray-600 hover:text-brand-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
