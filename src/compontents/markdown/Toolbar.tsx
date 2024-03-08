import React, { useState } from 'react';
import { EditorRef, commandsCtx } from '@milkdown/react';

const Toolbar = ({ editorRef }: { editorRef: EditorRef }) => {
  const [view, setView] = useState<'editor' | 'preview'>('editor');

  const executeCommand = (command: (commands: ReturnType<typeof commandsCtx['get']>) => void) => {
    const commands = editorRef.current?.action(commandsCtx);
    if (commands) {
      command(commands);
    }
  };

  const headingLevels = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      <button onClick={() => executeCommand((commands) => commands.toggleBold())}>Bold</button>
      <button onClick={() => executeCommand((commands) => commands.toggleItalic())}>Italic</button>
      <button onClick={() => executeCommand((commands) => commands.toggleUnderline())}>Underline</button>
      
      <select onChange={(e) => executeCommand((commands) => commands.toggleHeading({ level: parseInt(e.target.value) }))}>
        <option value="">Normal</option>
        {headingLevels.map((level) => (
          <option key={level} value={level}>{`Heading ${level}`}</option>
        ))}
      </select>

      <button onClick={() => executeCommand((commands) => commands.toggleBulletList())}>Bullets</button>
      <button onClick={() => executeCommand((commands) => commands.toggleOrderedList())}>Numbers</button>

      <button onClick={() => setView(view === 'editor' ? 'preview' : 'editor')}>
        {view === 'editor' ? 'Show Preview' : 'Edit Markdown'}
      </button>
    </div>
  );
};
