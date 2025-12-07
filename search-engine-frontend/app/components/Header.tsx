import Link from 'next/link';
import { Plane } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-brand-primary to-brand-blue p-2 rounded-lg shadow-sm">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-brand-primary tracking-tight">
                Deal Engine
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-600 hover:text-brand-primary font-bold transition-colors">
              Flights
            </Link>
            <Link href="#" className="text-gray-600 hover:text-brand-primary font-bold transition-colors">
              Hotels
            </Link>
            <Link href="#" className="text-gray-600 hover:text-brand-primary font-bold transition-colors">
              Packages
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-brand-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
              Sign In
            </button>
            <button className="bg-brand-teal text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#3bcbc1] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
