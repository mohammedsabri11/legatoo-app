"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { useTranslation } from "@/hooks/useTranslation";
import { normalizeContractContent } from "@/utils/contractFormatting";

const RTL_LOCALE_PREFIXES = [
  "ar",
  "fa",
  "he",
  "ku",
  "ps",
  "ur",
  "sd",
  "dv",
];
const RTL_CHAR_PATTERN = /[\u0590-\u08FF]/;

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
  const normalizedLocale = (locale ?? "").toLowerCase();
  const localeIsRTL = RTL_LOCALE_PREFIXES.some((prefix) =>
    normalizedLocale.startsWith(prefix)
  );
  const localeIsRTLRef = useRef(localeIsRTL);

  const containsRtlChars = (value: string): boolean => {
    const text = value.replace(/<[^>]*>/g, " ");
    return RTL_CHAR_PATTERN.test(text);
  };

  const initialIsRTL = localeIsRTL || containsRtlChars(initialContent);
  const [isRTL, setIsRTL] = useState<boolean>(initialIsRTL);
  const isRTLRef = useRef<boolean>(initialIsRTL);

  const idleSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);
  const sanitizeHtml = (value: string): string =>
    DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "span",
      ],
      ALLOWED_ATTR: ["dir", "class"],
    }) as string;

  const initialHtml = useMemo(
    () => sanitizeHtml(normalizeContractContent(initialContent)),
    [initialContent]
  );

  const contentRef = useRef<string>(initialHtml);
  const updateRtlDirection = (textSample: string) => {
    const shouldUseRTL =
      localeIsRTLRef.current || containsRtlChars(textSample);
    if (shouldUseRTL !== isRTLRef.current) {
      isRTLRef.current = shouldUseRTL;
      setIsRTL(shouldUseRTL);
    }
  };

  useEffect(() => {
    localeIsRTLRef.current = localeIsRTL;
  }, [localeIsRTL]);

  useEffect(() => {
    updateRtlDirection(initialContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeIsRTL, initialContent]);

  useEffect(() => {
    isRTLRef.current = isRTL;
  }, [isRTL]);
  
  // Save after 5 minutes of inactivity (no typing)
  const IDLE_SAVE_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    contentRef.current = initialHtml;
  }, [initialHtml]);

  // Create TipTap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml,
    immediatelyRender: false, // Fix SSR hydration issues in Next.js
    editable: true,
    editorProps: {
      attributes: {
        class: 'contract-editor-content',
        dir: isRTL ? 'rtl' : 'ltr',
        style: isRTL
          ? 'font-family: var(--font-cairo), "Cairo", "Arial", sans-serif; text-align: right; direction: rtl; line-height: 1.8; font-size: 16px;'
          : 'font-family: "Arial", sans-serif; text-align: left; direction: ltr; line-height: 1.8; font-size: 16px;',
      },
      handleDOMEvents: {
        // Allow normal text selection behavior
        mousedown: (_view, _event) => false,
        click: (_view, _event) => false,
      },
    },
    onUpdate: ({ editor }) => {
      const newHtml = sanitizeHtml(editor.getHTML());
      contentRef.current = newHtml;

      const textSample = editor.getText();
      updateRtlDirection(textSample);

      if (onChange) {
        onChange(newHtml);
      }

      // Reset idle save timer - save after 5 minutes of inactivity
      if (onSave) {
        // Clear existing timer
        if (idleSaveTimeoutRef.current) {
          clearTimeout(idleSaveTimeoutRef.current);
        }

        // Set new timer - save after 5 minutes of no typing
        idleSaveTimeoutRef.current = setTimeout(() => {
          if (onSave) {
            onSave(newHtml);
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
      if (initialHtml !== editor.getHTML()) {
        editor.commands.setContent(initialHtml, { emitUpdate: false });
      }
      return;
    }

    // Only update if content changed externally (not from user typing)
    const currentContent = editor.getHTML();
    if (initialHtml !== currentContent) {
      editor.commands.setContent(initialHtml, { emitUpdate: false });
    }
  }, [initialHtml, editor]);

  // Update RTL direction when locale changes
  useEffect(() => {
    if (!editor) return;
    editor.view.dom.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    editor.view.dom.style.direction = isRTL ? 'rtl' : 'ltr';
    editor.view.dom.style.textAlign = isRTL ? 'right' : 'left';
    editor.view.dom.style.fontFamily = isRTL
      ? 'var(--font-cairo), "Cairo", "Arial", sans-serif'
      : '"Arial", sans-serif';
  }, [isRTL, editor]);

  const handleSave = () => {
    if (!editor) return;
    const contentToSave = sanitizeHtml(editor.getHTML());
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
      <div className="w-full min-h-[600px] px-4 py-3 border border-gray-300 rounded-lg bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  const currentContent = editor.getText();

  return (
    <div className="space-y-4">
      <div className="relative border border-gray-300 rounded-lg bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''} hover:bg-gray-100`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        {/* Editor Content */}
        <div className="contract-editor-wrapper min-h-[600px] bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
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
