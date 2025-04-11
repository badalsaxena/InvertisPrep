import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ 
  defaultValue, 
  className = '', 
  children, 
  onValueChange 
}: { 
  defaultValue: string; 
  className?: string; 
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ 
  className = '', 
  children 
}: { 
  className?: string; 
  children: React.ReactNode 
}) {
  return (
    <div className={`inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  className = '', 
  children 
}: { 
  value: string; 
  className?: string; 
  children: React.ReactNode 
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const isActive = context.value === value;
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive 
          ? 'bg-white text-indigo-700 shadow-sm' 
          : 'text-gray-700 hover:text-indigo-700'
        } ${className}`}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ 
  value, 
  className = '', 
  children 
}: { 
  value: string; 
  className?: string; 
  children: React.ReactNode 
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  return context.value === value ? (
    <div className={className}>{children}</div>
  ) : null;
}
