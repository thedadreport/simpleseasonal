'use client';

import SimpleTest from '../../components/ui/SimpleTest';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f8f5f0' }}>
      <h1 className="text-4xl font-bold mb-4" style={{ color: '#94a89a' }}>Tailwind Test Page</h1>
      <p className="text-lg mb-6" style={{ color: '#4b5563' }}>This is a simple test page to see if Tailwind CSS is working.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #d1ddd3'
        }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#dd9a7c' }}>Card Example</h2>
          <p className="mb-4">This is an example card using inline styles instead of Tailwind.</p>
          <button style={{ 
            backgroundColor: '#94a89a', 
            color: 'white', 
            fontWeight: '500', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.375rem', 
            transition: 'all 0.2s' 
          }}>
            Primary Button
          </button>
        </div>
        
        <SimpleTest />
      </div>
    </div>
  );
}