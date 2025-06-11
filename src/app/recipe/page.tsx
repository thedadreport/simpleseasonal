'use client';

import React, { useState } from 'react';
import { 
  ChefHat, Leaf, Clock, Users, CheckCircle, Star, 
  Sparkles, Timer 
} from 'lucide-react';

export default function RecipePage() {
  const [formData, setFormData] = useState({
    adults: '',
    children: '',
    dietaryRestrictions: [],
    cookingTime: '',
    cuisinePreference: '',
    skillLevel: '',
    mealType: ''
  });
  
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFormUpdate = (field: string, value: any) => {
    setFormData({...formData, [field]: value});
  };

  const toggleArrayField = (field: string, value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      setFormData({...formData, [field]: current.filter(item => item !== value)});
    } else {
      setFormData({...formData, [field]: [...current, value]});
    }
  };

  const handleGenerateRecipe = () => {
    if (!formData.adults || !formData.cookingTime || !formData.mealType) {
      alert('Please fill out family size, cooking time, and meal type to continue');
      return;
    }
    setShowEmailCapture(true);
  };

  const handleFinalGenerate = () => {
    if (!email) {
      alert('Please enter your email to see your custom recipe');
      return;
    }
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      alert('🎉 Your custom recipe has been generated! Check your email for the complete recipe with ingredients, instructions, and pro tips.');
    }, 3000);
  };

  const isFormValid = formData.adults && formData.cookingTime && formData.mealType;

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8f5f0'}}>
      {/* Header */}
      <header className="px-6 py-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#94a89a'}}>
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>
              Seasonally Simple
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1" style={{color: '#94a89a'}}>
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">2,847+ families love our recipes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6" 
               style={{backgroundColor: '#e8ede9', color: '#5d6b63'}}>
            <Sparkles className="w-4 h-4" />
            <span>AI-powered recipe creation in 30 seconds</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6" 
              style={{fontFamily: 'Playfair Display, serif'}}>
            Stop the 5PM
            <br />
            <span style={{color: '#dd9a7c'}}>dinner panic</span>
            <br />
            forever
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Get a <strong>complete recipe</strong> tailored to your family's preferences and dietary needs. 
            Includes ingredients, step-by-step instructions, and pro tips. <strong>Your family will actually eat this.</strong>
          </p>

          {/* Social Proof Numbers */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <div className="text-3xl font-bold mb-2" style={{color: '#94a89a'}}>2,847+</div>
              <div className="text-sm text-gray-600">Families fed happily</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <div className="text-3xl font-bold mb-2" style={{color: '#dd9a7c'}}>30 sec</div>
              <div className="text-sm text-gray-600">Recipe generation time</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <div className="text-3xl font-bold mb-2" style={{color: '#e8b64c'}}>4.9★</div>
              <div className="text-sm text-gray-600">Family satisfaction</div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{borderColor: '#d1ddd3'}}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Get your perfect recipe now
              </h2>
              <p className="text-gray-600">Tell us about your family and we'll create a recipe they'll love</p>
            </div>

            <div className="space-y-8">
              {/* Family Size */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How many people are you feeding? *
                </label>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.adults || ''}
                      onChange={(e) => handleFormUpdate('adults', e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 text-center text-lg font-semibold focus:outline-none transition-colors"
                      style={{borderColor: '#d1ddd3'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.children || ''}
                      onChange={(e) => handleFormUpdate('children', e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 text-center text-lg font-semibold focus:outline-none transition-colors"
                      style={{borderColor: '#d1ddd3'}}
                    />
                  </div>
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What type of meal do you need? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((meal) => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => handleFormUpdate('mealType', meal)}
                      className={`p-4 rounded-lg border-2 font-semibold text-center transition-colors ${
                        formData.mealType === meal 
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={formData.mealType === meal ? 
                        {backgroundColor: '#dd9a7c', borderColor: '#dd9a7c'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Time */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How much time do you have? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {['10 minutes', '15 minutes', '30 minutes', '45+ minutes'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleFormUpdate('cookingTime', time)}
                      className={`p-4 rounded-lg border-2 font-semibold text-center transition-colors ${
                        formData.cookingTime === time 
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={formData.cookingTime === time ? 
                        {backgroundColor: '#94a89a', borderColor: '#94a89a'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      <Timer className="w-5 h-5 mx-auto mb-1" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Preference */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What type of cuisine sounds good?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['American', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'Comfort Food', 'Healthy'].map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => handleFormUpdate('cuisinePreference', cuisine)}
                      className={`p-3 rounded-lg border-2 font-medium text-center transition-colors ${
                        formData.cuisinePreference === cuisine
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={formData.cuisinePreference === cuisine ? 
                        {backgroundColor: '#e8b64c', borderColor: '#e8b64c'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Any dietary preferences or restrictions?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Paleo', 'Nut allergies'].map((restriction) => (
                    <button
                      key={restriction}
                      type="button"
                      onClick={() => toggleArrayField('dietaryRestrictions', restriction)}
                      className={`p-3 rounded-lg border-2 font-medium text-sm text-center transition-colors ${
                        (formData.dietaryRestrictions as string[]).includes(restriction)
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={(formData.dietaryRestrictions as string[]).includes(restriction) ? 
                        {backgroundColor: '#94a89a', borderColor: '#94a89a'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Skill */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Your cooking experience?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Beginner (simple steps)', 'Intermediate (comfortable)', 'Advanced (bring the challenge)'].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleFormUpdate('skillLevel', skill)}
                      className={`p-4 rounded-lg border-2 font-medium text-center transition-colors ${
                        formData.skillLevel === skill 
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={formData.skillLevel === skill ? 
                        {backgroundColor: '#94a89a', borderColor: '#94a89a'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center pt-6">
                <button
                  type="button"
                  onClick={handleGenerateRecipe}
                  disabled={!isFormValid}
                  className={`px-12 py-4 rounded-xl font-bold text-xl transition-all transform ${
                    isFormValid 
                      ? 'text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={isFormValid ? {backgroundColor: '#dd9a7c'} : {}}
                >
                  {isFormValid ? '🍽️ Get My Perfect Recipe' : 'Please fill required fields (*)'}
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Includes ingredients, step-by-step instructions, and pro cooking tips
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Here's exactly what you'll get in 30 seconds
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#94a89a'}}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Recipe</h3>
              <p className="text-gray-600">Detailed ingredients list with exact measurements, prep and cook times, difficulty level</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#dd9a7c'}}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Step-by-Step Instructions</h3>
              <p className="text-gray-600">Clear, easy-to-follow cooking directions that anyone can master</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#e8b64c'}}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pro Tips & Variations</h3>
              <p className="text-gray-600">Expert cooking tips, ingredient substitutions, and family-friendly modifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16" style={{backgroundColor: '#f8f5f0'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Real families, real results
            </h2>
            <div className="flex items-center justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current text-yellow-400" />
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-900">4.9/5 from 2,847+ families</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "Finally found a recipe my picky 8-year-old actually asked for seconds! The AI somehow knew exactly what would work for our family."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Maria Santos</div>
                <div className="text-gray-600">Mom of 2, Chicago IL</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "I'm not much of a cook, but the step-by-step instructions made it so easy. My husband was shocked I made something this good!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Jessica Chen</div>
                <div className="text-gray-600">Working mom, Seattle WA</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "The recipe was perfect for our gluten-free needs and ready in exactly 20 minutes like it promised. This is life-changing!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">David Rodriguez</div>
                <div className="text-gray-600">Dad of 3, Austin TX</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                   style={{backgroundColor: '#dd9a7c'}}>
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Your perfect recipe is ready!
              </h3>
              <p className="text-gray-600">
                Enter your email to get your personalized recipe with complete ingredients, instructions, and pro tips.
              </p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 rounded-lg border-2 text-gray-900 focus:outline-none"
                style={{borderColor: '#d1ddd3'}}
              />
              <button 
                type="button"
                onClick={handleFinalGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                style={{backgroundColor: '#dd9a7c'}}
              >
                {isGenerating ? 'Generating your recipe...' : 'Send My Recipe →'}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailCapture(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Back to form
              </button>
              <p className="text-xs text-gray-500 text-center">
                We'll email you the recipe instantly. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#94a89a'}}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>
              Seasonally Simple
            </span>
          </div>
          <p className="text-gray-600 mb-4">AI-powered recipes that bring families together around the dinner table</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>© 2025 Seasonally Simple</span>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}