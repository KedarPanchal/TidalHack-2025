import { useState } from 'react';

type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

interface SettingsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

export default function Settings({ theme, setTheme, fontSize, setFontSize }: SettingsProps) {
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
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
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
            onChange={(e) => setFontSize(e.target.value as FontSize)}
            className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
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
