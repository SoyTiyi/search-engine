import Link from 'next/link';
import { Header } from './components/Header';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Background elements similar to Home page */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-blue z-0"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-teal opacity-10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-teal opacity-10 rounded-full blur-3xl z-0"></div>
        
        <div className="relative z-10 max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <AlertCircle className="w-16 h-16 text-brand-teal" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
            
            <p className="text-blue-100 mb-8">
              Oops! The flight path you're looking for doesn't exist. Let's get you back on the radar.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-brand-navy font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
