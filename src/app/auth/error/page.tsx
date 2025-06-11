import Link from 'next/link';

export const metadata = {
  title: 'Authentication Error - Seasonally Simple',
  description: 'Something went wrong with your sign-in attempt',
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-sage-border">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-sage-green">Seasonally Simple</h1>
          </Link>
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Authentication Error</h2>
          
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-red-700 font-medium">Something went wrong</p>
            <p className="mt-2 text-gray-600">
              We couldn't complete your sign-in request.
            </p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              This could be due to:
            </p>
            <ul className="list-disc list-inside">
              <li>An expired or invalid sign-in link</li>
              <li>A network or server error</li>
              <li>An issue with your email provider</li>
            </ul>
          </div>
          
          <div className="pt-4 space-y-2">
            <Link 
              href="/auth/signin" 
              className="btn-primary inline-block px-6"
            >
              Try Again
            </Link>
            
            <p className="text-sm text-gray-500 mt-4">
              Need help? <Link href="/contact" className="text-sage-green hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}