# ChatInterface Component

A reusable chat interface component that communicates with the backend using the API hooks defined in `useapihelpers.ts`.

## Features

- **Persona-based routing**: Specify which backend persona to use (`checkin` or `urges`)
- **RAG support**: Optional Retrieval-Augmented Generation with context
- **Real-time messaging**: Send and receive messages with the backend
- **Loading states**: Visual feedback during API requests
- **Error handling**: Graceful error display and recovery
- **Responsive design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `persona` | `ChatPersona` | ✅ | - | Which backend persona to use (`'checkin'` or `'urges'`) |
| `enableRAG` | `boolean` | ❌ | `false` | Enable RAG functionality with context |
| `context` | `string` | ❌ | `''` | Context string for RAG requests |
| `placeholder` | `string` | ❌ | `"Type your message..."` | Input placeholder text |
| `className` | `string` | ❌ | `""` | Additional CSS classes |

## Usage Examples

### Basic Chat Interface
```tsx
import ChatInterface from '../components/ChatInterface';

function MyPage() {
  return (
    <div className="h-full">
      <ChatInterface persona="checkin" />
    </div>
  );
}
```

### Chat Interface with Custom Placeholder
```tsx
<ChatInterface 
  persona="urges" 
  placeholder="Describe what you're experiencing..." 
/>
```

### RAG-enabled Chat Interface
```tsx
<ChatInterface 
  persona="checkin" 
  enableRAG={true}
  context="User has been feeling anxious about work deadlines"
/>
```

### Full Height Implementation
```tsx
<div className="h-full">
  <div className="p-4 border-b border-border">
    <h1 className="text-2xl font-bold">Daily Check-In</h1>
    <p className="text-muted-foreground">Share how you're feeling</p>
  </div>
  <div className="h-[calc(100vh-200px)]">
    <ChatInterface 
      persona="checkin"
      placeholder="How are you feeling today?"
    />
  </div>
</div>
```

## API Integration

The component automatically uses the appropriate API hook based on the `enableRAG` prop:

- **Regular chat**: Uses `useChatRequest()` hook
- **RAG chat**: Uses `useRAGRequest()` hook

Both hooks are imported from `../hooks/useapihelpers.ts` and handle:
- API request management
- Loading states
- Error handling
- Response processing

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Uses CSS variables for theming (`--background`, `--foreground`, etc.)
- Responsive design with proper spacing
- Consistent with other UI components
- Dark/light mode support

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in input
- **Escape**: Clear input (if implemented)

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus management

## Error Handling

The component handles various error scenarios:
- Network errors
- API errors
- Invalid responses
- Timeout errors

Errors are displayed in a user-friendly format and don't break the chat flow.

## Performance

- Messages are stored in component state
- Automatic scroll to bottom on new messages
- Efficient re-renders with React hooks
- Debounced input handling
- Memory cleanup on unmount
