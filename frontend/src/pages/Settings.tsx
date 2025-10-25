import { useState } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  return (
    <div className="flex flex-col items-center justify-start h-full p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {/* Appearance Section */}
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-6">
        <h2 className="text-xl font-semibold">Appearance</h2>

        {/* Theme toggle */}
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="rounded-lg border-gray-300 px-3 py-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Font size toggle */}
        <div className="flex items-center justify-between">
          <span>Font Size</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
            className="rounded-lg border-gray-300 px-3 py-2"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Version display */}
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          Version: 0.0.1
        </div>

        {/* Terms & Services */}
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          By using this app, you agree to our{' '}
          <a href="#" className="underline hover:text-blue-500">
            Terms & Services
          </a>.
        </div>
      </div>
    </div>
  );
}
