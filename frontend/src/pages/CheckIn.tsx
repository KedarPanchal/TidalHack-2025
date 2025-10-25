import ChatInterface from '../components/ChatInterface';

export default function CheckIn() {
  return (
    <div className="h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Daily Check-In</h1>
        <p className="text-muted-foreground">Share how you're feeling and get personalized insights</p>
      </div>
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface 
          persona="checkin"
          placeholder="How are you feeling today? What's on your mind?"
        />
      </div>
    </div>
  );
}
