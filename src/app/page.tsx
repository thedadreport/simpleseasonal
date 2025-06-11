'use client';

import React, { useState } from 'react';
import { 
  ChefHat, Leaf, Clock, Users, CheckCircle, Star, 
  Sparkles, Calendar, ShoppingCart, Timer, DollarSign, Award, List 
} from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    adults: '',
    children: '',
    dietaryRestrictions: [],
    budget: '',
    cookingTime: '',
    cuisinePreferences: [],
    skillLevel: ''
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

  const handleGeneratePlan = () => {
    if (!formData.adults || !formData.cookingTime || !formData.budget) {
      alert('Please fill out family size, cooking time, and budget to continue');
      return;
    }
    setShowEmailCapture(true);
  };

  const handleFinalGenerate = () => {
    if (!email) {
      alert('Please enter your email to see your custom meal plan');
      return;
    }
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      alert('🎉 Your 5-day meal plan has been generated! Check your email for the complete meal plan with recipes and shopping list.');
    }, 3000);
  };

  const isFormValid = formData.adults && formData.cookingTime && formData.budget;

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
              <span className="font-semibold">Join 2,847+ families</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6" 
               style={{backgroundColor: '#e8ede9', color: '#5d6b63'}}>
            <Calendar className="w-4 h-4" />
            <span>Complete 5-day meal planning in 30 seconds</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6" 
              style={{fontFamily: 'Playfair Display, serif'}}>
            Never ask
            <br />
            <span style={{color: '#94a89a'}}>"What's for dinner?"</span>
            <br />
            again
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Get a <strong>complete 5-day meal plan</strong> with recipes and organized shopping list. 
            Tailored to your family's preferences, dietary needs, and budget. <strong>Done in 30 seconds.</strong>
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <Calendar className="w-8 h-8 mx-auto mb-3" style={{color: '#94a89a'}} />
              <div className="font-bold text-gray-900 mb-2">5 complete dinners</div>
              <div className="text-sm text-gray-600">Monday through Friday planned</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <ShoppingCart className="w-8 h-8 mx-auto mb-3" style={{color: '#dd9a7c'}} />
              <div className="font-bold text-gray-900 mb-2">Organized shopping list</div>
              <div className="text-sm text-gray-600">Grouped by store section</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{borderColor: '#d1ddd3'}}>
              <DollarSign className="w-8 h-8 mx-auto mb-3" style={{color: '#e8b64c'}} />
              <div className="font-bold text-gray-900 mb-2">Budget-friendly</div>
              <div className="text-sm text-gray-600">Fits your grocery budget</div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{borderColor: '#d1ddd3'}}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Get your 5-day meal plan now
              </h2>
              <p className="text-gray-600">Tell us about your family and we'll plan your entire week</p>
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

              {/* Budget */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What's your weekly grocery budget? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Under $75', '$75-$125', '$125-$200', '$200+'].map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => handleFormUpdate('budget', budget)}
                      className={`p-4 rounded-lg border-2 font-semibold text-center transition-colors ${
                        formData.budget === budget 
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={formData.budget === budget ? 
                        {backgroundColor: '#e8b64c', borderColor: '#e8b64c'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      <DollarSign className="w-5 h-5 mx-auto mb-1" />
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking Time */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How much time do you have for weeknight cooking? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['15 minutes or less', '15-30 minutes', '30-60 minutes'].map((time) => (
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

              {/* Cuisine Preferences */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What cuisines does your family enjoy? (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['American', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'French', 'Comfort Food'].map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleArrayField('cuisinePreferences', cuisine)}
                      className={`p-3 rounded-lg border-2 font-medium text-center transition-colors ${
                        (formData.cuisinePreferences as string[]).includes(cuisine)
                          ? 'text-white' 
                          : 'border-gray-300 hover:border-sage-400 text-gray-700'
                      }`}
                      style={(formData.cuisinePreferences as string[]).includes(cuisine) ? 
                        {backgroundColor: '#dd9a7c', borderColor: '#dd9a7c'} : 
                        {borderColor: '#d1ddd3'}}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
                {(formData.cuisinePreferences as string[]).length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {(formData.cuisinePreferences as string[]).join(', ')}
                  </p>
                )}
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
                  How would you describe your cooking skills?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Beginner (keep it simple)', 'Intermediate (comfortable with basics)', 'Advanced (bring on the challenge)'].map((skill) => (
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
                  onClick={handleGeneratePlan}
                  disabled={!isFormValid}
                  className={`px-12 py-4 rounded-xl font-bold text-xl transition-all transform ${
                    isFormValid 
                      ? 'text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={isFormValid ? {backgroundColor: '#94a89a'} : {}}
                >
                  {isFormValid ? '📅 Generate My 5-Day Plan' : 'Please fill required fields (*)'}
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Get 5 complete dinner recipes plus organized shopping list
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
              Your complete meal planning solution
            </h2>
            <p className="text-lg text-gray-600">Everything you need for a stress-free week of family dinners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#94a89a'}}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">5 Complete Recipes</h3>
              <p className="text-gray-600">Monday through Friday dinner recipes with ingredients, instructions, and cook times</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#dd9a7c'}}>
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Organized Shopping List</h3>
              <p className="text-gray-600">All ingredients organized by store section (produce, dairy, meat, etc.) for efficient shopping</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#e8b64c'}}>
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Budget Breakdown</h3>
              <p className="text-gray-600">Estimated cost per meal and total weekly grocery budget to stay on track</p>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Plus these bonus features:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Prep Time Breakdown</h4>
                  <p className="text-gray-600">Exact prep and cook times for each recipe</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Leftover Ideas</h4>
                  <p className="text-gray-600">Smart suggestions for using extra ingredients</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Kid-Friendly Modifications</h4>
                  <p className="text-gray-600">Simple tweaks to make meals picky-eater approved</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Seasonal Ingredients</h4>
                  <p className="text-gray-600">Fresh, in-season produce for better taste and prices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16" style={{backgroundColor: '#f8f5f0'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Families are saving hours every week
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
                "This meal plan saved my sanity! Having the whole week planned out means no more 5 PM panic. My kids actually love all the recipes."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">Working mom of 3, Denver CO</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "The shopping list is brilliant - organized by store section and stays under our $150 budget. Grocery shopping is finally stress-free!"
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Michael Chen</div>
                <div className="text-gray-600">Dad of 2, Portland OR</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">
                "As someone with multiple food allergies, having a meal plan that actually works for our dietary restrictions is life-changing."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Jennifer Rodriguez</div>
                <div className="text-gray-600">Teacher & mom, Austin TX</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12" style={{fontFamily: 'Playfair Display, serif'}}>
            From stressed to sorted in 3 simple steps
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative" 
                   style={{backgroundColor: '#94a89a'}}>
                <Users className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                     style={{backgroundColor: '#dd9a7c'}}>
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
                Tell Us About Your Family
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your family size, budget, dietary needs, and cuisine preferences. 
                Takes just 2 minutes to customize everything perfectly.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative" 
                   style={{backgroundColor: '#dd9a7c'}}>
                <Sparkles className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                     style={{backgroundColor: '#e8b64c'}}>
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
                AI Creates Your Perfect Week
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI considers your budget, preferences, and seasonal ingredients 
                to create 5 family-approved dinner recipes in 30 seconds.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative" 
                   style={{backgroundColor: '#e8b64c'}}>
                <CheckCircle className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                     style={{backgroundColor: '#94a89a'}}>
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
                Shop, Cook & Enjoy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Use your organized shopping list for one efficient grocery trip, 
                then cook with confidence knowing your family will love every meal.
              </p>
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
                   style={{backgroundColor: '#94a89a'}}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                Your 5-day meal plan is ready!
              </h3>
              <p className="text-gray-600">
                Enter your email to get your personalized meal plan with recipes and organized shopping list.
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
                style={{backgroundColor: '#94a89a'}}
              >
                {isGenerating ? 'Creating your meal plan...' : 'Send My Meal Plan →'}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailCapture(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Back to form
              </button>
              <p className="text-xs text-gray-500 text-center">
                We'll email you the complete meal plan. No spam, unsubscribe anytime.
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
          <p className="text-gray-600 mb-4">AI-powered meal planning that brings families together around the dinner table</p>
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