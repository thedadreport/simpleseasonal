import Link from 'next/link';

export const metadata = {
  title: 'Verify Email - Seasonally Simple',
  description: 'Check your email for a sign-in link',
};

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-sage-border">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-sage-green">Seasonally Simple</h1>
          </Link>
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Check your email</h2>
          
          <div className="bg-light-sage p-4 rounded-md">
            <p className="text-sage-green font-medium">We've sent you a sign-in link</p>
            <p className="mt-2 text-gray-600">
              Click the link in your email to sign in to your account.
            </p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              The link will expire in 24 hours.
            </p>
            <p>
              If you don't see the email, check your spam folder.
            </p>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/auth/signin" 
              className="text-sage-green hover:underline text-sm"
            >
              Use a different email address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}