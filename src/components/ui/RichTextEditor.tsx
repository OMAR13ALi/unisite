
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from './button';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Quote } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose p-4 focus:outline-none min-h-[200px] max-w-none',
      },
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        >
          <Heading1 size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          <Heading2 size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
        >
          <Code size={16} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote size={16} />
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
};

export default RichTextEditor;
