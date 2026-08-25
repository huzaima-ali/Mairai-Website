"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const EDITOR_CONTENT_CLASS = [
  "max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-foreground text-[15px] leading-relaxed",
  "[&_p]:my-3",
  "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-medium",
  "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-foreground/50",
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:marker:text-foreground/50",
  "[&_li]:my-1.5 [&_li]:pl-1",
  "[&_li>p]:my-0",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_a]:text-accent [&_a]:underline",
  "[&_hr]:my-6 [&_hr]:border-black/10",
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_pre]:text-sm",
  "[&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm",
  "[&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl",
].join(" ");

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
  const lastEmitted = useRef(value || "");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: EDITOR_CONTENT_CLASS,
      },
      transformPastedHTML(html) {
        // Keep common list/paragraph structure from Word/Google Docs paste
        return html
          .replace(/<\/?o:p[^>]*>/gi, "")
          .replace(/<span[^>]*mso-[^>]*>/gi, "")
          .replace(/<\/span>/gi, "");
      },
    },
  });

  // Only sync from parent when content changed externally (load article), not on every keystroke
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    if (editor.isFocused) return;
    const next = value || "";
    lastEmitted.current = next;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;

  const tools = [
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
    { label: "HR", action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
    {
      label: "Link",
      action: () => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const href = window.prompt("URL", prev || "https://");
        if (href === null) return;
        if (href === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      },
      active: editor.isActive("link"),
    },
    {
      label: "Image",
      action: () => {
        const src = window.prompt("Image URL");
        if (!src) return;
        editor.chain().focus().setImage({ src }).run();
      },
      active: false,
    },
  ];

  return (
    <div className={cn("rounded-xl border border-black/10 bg-white", className)}>
      <div className="sticky top-0 z-20 flex flex-wrap gap-1 rounded-t-xl border-b border-black/8 bg-[#faf9f7]/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-[#faf9f7]/85">
        {tools.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={btn.action}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors",
              btn.active ? "bg-ink text-white" : "text-foreground/70 hover:bg-black/[0.05]",
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
