import { useState } from 'react';
import ChatInterface from './ChatInterface';

/**
 * Example component demonstrating how to use ChatInterface with different configurations
 * This file can be used as a reference for implementing ChatInterface in your pages
 */
export default function ChatInterfaceExample() {
  const [enableRAG, setEnableRAG] = useState(false);
  const [context, setContext] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold mb-4">ChatInterface Examples</h1>
        
        {/* Configuration Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enableRAG}
                onChange={(e) => setEnableRAG(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Enable RAG (Retrieval-Augmented Generation)</span>
            </label>
          </div>
          
          {enableRAG && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Context for RAG:
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter context information that will be provided to the AI..."
                className="w-full p-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface
          persona="checkin"
          enableRAG={enableRAG}
          context={context}
          placeholder={enableRAG ? "Ask a question with context..." : "How are you feeling today?"}
        />
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * 1. Basic Chat Interface:
 * ```tsx
 * <ChatInterface persona="checkin" />
 * ```
 * 
 * 2. Chat Interface with Custom Placeholder:
 * ```tsx
 * <ChatInterface 
 *   persona="urges" 
 *   placeholder="Describe what you're experiencing..." 
 * />
 * ```
 * 
 * 3. RAG-enabled Chat Interface:
 * ```tsx
 * <ChatInterface 
 *   persona="checkin" 
 *   enableRAG={true}
 *   context="User has been feeling anxious about work deadlines"
 * />
 * ```
 * 
 * 4. Full Height Chat Interface:
 * ```tsx
 * <div className="h-full">
 *   <ChatInterface persona="urges" />
 * </div>
 * ```
 * 
 * 5. Chat Interface with Custom Styling:
 * ```tsx
 * <ChatInterface 
 *   persona="checkin" 
 *   className="border-2 border-primary rounded-lg"
 * />
 * ```
 */
