import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from './LoadingSpinner';
import { Recipe, MealPlan } from '@/lib/claude';

interface EmailCaptureFormData {
  email: string;
  firstName: string;
}

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadType: 'recipe' | 'meal_plan';
  pdfUrl: string;
  recipe?: Recipe;
  mealPlan?: MealPlan;
  seasonalFocus?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

const EmailCaptureModal = ({
  isOpen,
  onClose,
  downloadType,
  pdfUrl,
  recipe,
  mealPlan,
  seasonalFocus,
  title = downloadType === 'recipe' ? 'Get your recipe' : 'Save your meal plan',
  description = downloadType === 'recipe' 
    ? 'Enter your info to get this recipe sent to your inbox.' 
    : 'Enter your info to save this meal plan and get more seasonal cooking ideas.',
  onSuccess
}: EmailCaptureModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<EmailCaptureFormData>();

  const submitHandler = async (data: EmailCaptureFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate required data based on download type
      if (downloadType === 'recipe' && !recipe) {
        throw new Error('Recipe data is missing.');
      }
      
      if (downloadType === 'meal_plan' && (!mealPlan || !seasonalFocus)) {
        throw new Error('Meal plan data is missing.');
      }
      
      // Submit email to the API
      const response = await fetch('/api/email/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          downloadType,
          recipe,
          mealPlan,
          seasonalFocus,
          pdfUrl,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process your request.');
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
      
    } catch (error: any) {
      console.error('Error submitting email:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-playfair">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-4">
            <input
              {...register('firstName', { 
                required: 'First name is required',
              })}
              type="text"
              placeholder="Your first name"
              className="input mb-3"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
            
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="Your email address"
              className="input"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="sm" color="text-white" /> : 'Send to My Inbox'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          We respect your privacy and will never share your email. You'll receive your {downloadType === 'recipe' ? 'recipe' : 'meal plan'} 
          immediately, plus occasional cooking tips. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default EmailCaptureModal;