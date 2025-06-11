import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white border-b border-sage-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-sage-green font-playfair">
            Seasonally Simple
          </h1>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link 
            href="/" 
            className={`font-medium ${pathname === '/' ? 'text-terracotta' : 'text-gray-600 hover:text-terracotta'}`}
          >
            Meal Plan
          </Link>
          <Link 
            href="/recipe" 
            className={`font-medium ${pathname === '/recipe' ? 'text-terracotta' : 'text-gray-600 hover:text-terracotta'}`}
          >
            Single Recipe
          </Link>
          <Link 
            href="/auth/signin" 
            className="btn-primary"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;