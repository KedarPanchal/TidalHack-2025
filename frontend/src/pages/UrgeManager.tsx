import ChatInterface from '../components/ChatInterface';

export default function UrgeManager() {
  return (
    <div className="h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Urge Manager</h1>
        <p className="text-muted-foreground">Get support and strategies for managing urges</p>
      </div>
      <div className="h-[calc(100vh-200px)]">
        <ChatInterface 
          persona="urges"
          placeholder="Describe what you're experiencing. I'm here to help you work through it."
        />
      </div>
    </div>
  );
}
