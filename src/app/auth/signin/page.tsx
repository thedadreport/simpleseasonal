import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In - Seasonally Simple',
  description: 'Sign in to your Seasonally Simple account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-sage-green">Seasonally Simple</h1>
          </Link>
          <p className="text-gray-600 mt-2">
            AI-powered meal planning for busy families
          </p>
        </div>
        
        <SignInForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-sage-green hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-sage-green hover:underline">
              Privacy Policy
            </Link>
          </p>
          
          <p className="text-sm text-gray-600 mt-4">
            New to Seasonally Simple?{' '}
            <Link href="/#features" className="text-sage-green hover:underline">
              Learn more about our features
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}