"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content…",
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-foreground",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-black/10 bg-white", className)}>
      <div className="flex flex-wrap gap-1 border-b border-black/8 bg-[#faf9f7] px-2 py-1.5">
        {[
          { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
          { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
          { label: "B", action: () => editor.chain().focus().toggleBold().run() },
          { label: "I", action: () => editor.chain().focus().toggleItalic().run() },
          { label: "• List", action: () => editor.chain().focus().toggleBulletList().run() },
          { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run() },
          { label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run() },
          { label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run() },
          { label: "HR", action: () => editor.chain().focus().setHorizontalRule().run() },
          {
            label: "Link",
            action: () => {
              const href = window.prompt("URL");
              if (!href) return;
              editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
            },
          },
          {
            label: "Image",
            action: () => {
              const src = window.prompt("Image URL");
              if (!src) return;
              editor.chain().focus().setImage({ src }).run();
            },
          },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className="rounded-md px-2 py-1 text-xs font-medium text-foreground/70 hover:bg-black/[0.05]"
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
