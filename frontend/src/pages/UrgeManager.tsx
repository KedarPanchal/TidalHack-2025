import ChatInterface from '../components/ChatInterface';
import { handleRelapseDetection } from '../lib/sobrietyUtils';

export default function UrgeManager() {
  return (
    <div className="h-full">
      <div className="p-3 sm:p-4 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold">Urge Manager</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Get support and strategies for managing urges</p>
      </div>
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface 
          persona="urges"
          placeholder="What are you experiencing? I'm here to help."
          onRelapse={handleRelapseDetection}
        />
      </div>
    </div>
  );
}
