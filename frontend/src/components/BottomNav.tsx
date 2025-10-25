import { Home, Calendar, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: Home },
    { id: 'checkin', label: 'Check-In', icon: Calendar },
    { id: 'urge', label: 'Urge', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-14 sm:h-16 px-2 sm:px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1" />
              <span className="text-[10px] sm:text-xs font-medium leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
