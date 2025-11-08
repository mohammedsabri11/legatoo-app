"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTranslation } from "@/hooks/useTranslation";

interface ContractEditorProps {
  content: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export function ContractEditor({
  content: initialContent,
  onChange,
  onSave,
}: ContractEditorProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const idleSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);
  const contentRef = useRef<string>(initialContent);
  
  // Save after 5 minutes of inactivity (no typing)
  const IDLE_SAVE_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Create TipTap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false, // Fix SSR hydration issues in Next.js
    editable: true,
    editorProps: {
      attributes: {
        class: 'contract-editor-content',
        dir: isRTL ? 'rtl' : 'ltr',
        style: isRTL ? 'font-family: var(--font-cairo), "Cairo", "Arial", sans-serif;' : 'font-family: "Arial", sans-serif;',
      },
      handleDOMEvents: {
        // Allow normal text selection behavior
        mousedown: (view, event) => {
          // Don't prevent default - allow normal selection
          return false;
        },
        click: (view, event) => {
          // Allow normal click behavior for selection
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      // Get plain text content (or HTML if needed)
      const newContent = editor.getText();
      contentRef.current = newContent;

      // Reset idle save timer - save after 5 minutes of inactivity
      // No onChange calls here to prevent refreshes - only save after 5 min idle or manual save
      if (onSave) {
        // Clear existing timer
        if (idleSaveTimeoutRef.current) {
          clearTimeout(idleSaveTimeoutRef.current);
        }

        // Set new timer - save after 5 minutes of no typing
        idleSaveTimeoutRef.current = setTimeout(() => {
          if (onSave) {
            onSave(newContent);
          }
        }, IDLE_SAVE_DELAY);
      }
    },
  });

  // Sync initial content from props (only when content changes externally)
  useEffect(() => {
    if (!editor) return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (initialContent !== editor.getText()) {
        editor.commands.setContent(initialContent);
      }
      return;
    }

    // Only update if content changed externally (not from user typing)
    const currentContent = editor.getText();
    if (initialContent !== currentContent && initialContent !== undefined) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  // Update RTL direction when locale changes
  useEffect(() => {
    if (!editor) return;
    editor.view.dom.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL, editor]);

  const handleSave = () => {
    if (!editor) return;
    const contentToSave = editor.getText();
    contentRef.current = contentToSave;

    // Clear idle save timer since we're saving manually
    if (idleSaveTimeoutRef.current) {
      clearTimeout(idleSaveTimeoutRef.current);
      idleSaveTimeoutRef.current = null;
    }

    // Pass current content to onSave callback
    if (onSave) {
      onSave(contentToSave);
    }
  };

  useEffect(() => {
    return () => {
      if (idleSaveTimeoutRef.current) {
        clearTimeout(idleSaveTimeoutRef.current);
      }
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[600px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  const currentContent = editor.getText();

  return (
    <div className="space-y-4">
      <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Editor Content */}
        <div className="contract-editor-wrapper min-h-[600px] bg-white dark:bg-gray-800">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{currentContent.length} {t("contracts.edit.characters")}</span>
        <div className="flex gap-2">
          {onSave && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg "
            >
              {t("contracts.edit.saveChanges")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
