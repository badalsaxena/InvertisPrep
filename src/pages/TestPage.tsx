import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Test Page Works!</h1>
        <p className="text-gray-600 text-center">
          If you can see this message, routing is working correctly.
        </p>
      </div>
    </div>
  );
};

export default TestPage; 