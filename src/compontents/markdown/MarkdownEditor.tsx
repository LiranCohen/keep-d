import React, { useState } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import  { listener, listenerCtx } from '@milkdown/plugin-listener'


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

const MilkdownEditor: React.FC<{
  content: string;
  setContent: (content: string) => void;
}> = ({ setContent, content }) => {
    useEditor((root) =>
      Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, content);
          const listener = ctx.get(listenerCtx);

          listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
            if (markdown !== prevMarkdown) {
              setContent(markdown);
            }
          })
        })
        .use(listener)
        .use(commonmark),
  );

  return <Milkdown />;
};

const MarkdownEditor: React.FC<{
  content: string;
  setContent: (content: string) => void;
}> = ({ setContent, content }) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor content={content} setContent={setContent} />
    </MilkdownProvider>
  );
};

export default MarkdownEditor;