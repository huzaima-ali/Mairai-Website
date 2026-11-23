"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { canOpenCmsHref, CMS_LINK_OPTIONS, normalizeCmsHref } from "@/lib/cms/rich-text-link";
import {
  TABLE_LINE_COLOR_PRESETS,
  TABLE_LINE_MODES,
  normalizeTableLineColor,
  normalizeTableLines,
  type TableLineMode,
} from "@/lib/cms/rich-text-table";
import { cmsTableExtensions } from "@/components/admin/cms-table-extension";

const EDITOR_CONTENT_CLASS = [
  "prose-mirai max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-foreground text-[15px] leading-relaxed",
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

const TABLE_KINDS = [
  { id: "header-row", label: "Header row" },
  { id: "header-both", label: "Header row and column" },
  { id: "plain", label: "No headers" },
] as const;

type TableKind = (typeof TABLE_KINDS)[number]["id"];

const PICKER_ROWS = 6;
const PICKER_COLS = 8;
const CUSTOM_MAX_ROWS = 20;
const CUSTOM_MAX_COLS = 12;

function currentHref(editor: Editor) {
  return normalizeCmsHref(String(editor.getAttributes("link").href || ""));
}

function setOrEditLink(editor: Editor) {
  const href = window.prompt("URL", currentHref(editor) || "https://");
  if (href === null) return;

  const next = normalizeCmsHref(href);
  if (!next) {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
}

function unlink(editor: Editor) {
  editor.chain().focus().extendMarkRange("link").unsetLink().run();
}

function openLink(editor: Editor) {
  const href = currentHref(editor);
  if (!canOpenCmsHref(href)) return;
  window.open(href, "_blank", "noopener,noreferrer");
}

function clampTableSize(rows: number, cols: number) {
  return {
    rows: Math.min(CUSTOM_MAX_ROWS, Math.max(1, rows)),
    cols: Math.min(CUSTOM_MAX_COLS, Math.max(1, cols)),
  };
}

function insertCmsTable(editor: Editor, rows: number, cols: number, kind: TableKind) {
  const size = clampTableSize(rows, cols);
  const chain = editor
    .chain()
    .focus()
    .insertTable({ rows: size.rows, cols: size.cols, withHeaderRow: kind !== "plain" });

  if (kind === "header-both") {
    chain.toggleHeaderColumn();
  }

  chain.run();
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-ink text-white" : "text-foreground/70 hover:bg-black/[0.05]",
      )}
    >
      {label}
    </button>
  );
}

function TableInsertMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TableKind>("header-row");
  const [hover, setHover] = useState({ rows: 3, cols: 3 });
  const [customRows, setCustomRows] = useState("3");
  const [customCols, setCustomCols] = useState("4");
  const rootRef = useRef<HTMLDivElement>(null);
  const inTable = editor.isActive("table");

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function insert(rows: number, cols: number) {
    insertCmsTable(editor, rows, cols, kind);
    setOpen(false);
  }

  return (
    <div className="relative" ref={rootRef}>
      <ToolbarButton label="Table" active={open || inTable} onClick={() => setOpen((value) => !value)} />
      {open ? (
        <div className="absolute left-0 top-full z-30 mt-1 w-[232px] rounded-xl border border-black/10 bg-white p-3 shadow-lg">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/45">Table type</p>
          <div className="mt-1.5 flex flex-col gap-0.5">
            {TABLE_KINDS.map((option) => (
              <button
                key={option.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setKind(option.id)}
                className={cn(
                  "rounded-md px-2 py-1 text-left text-xs font-medium",
                  kind === option.id ? "bg-ink text-white" : "text-foreground/70 hover:bg-black/[0.05]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/45">
            Size · {hover.rows} × {hover.cols}
          </p>
          <div
            className="mt-1.5 grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${PICKER_COLS}, minmax(0, 1fr))` }}
            onMouseLeave={() => setHover({ rows: 3, cols: 3 })}
          >
            {Array.from({ length: PICKER_ROWS * PICKER_COLS }, (_, index) => {
              const rows = Math.floor(index / PICKER_COLS) + 1;
              const cols = (index % PICKER_COLS) + 1;
              const on = rows <= hover.rows && cols <= hover.cols;
              return (
                <button
                  key={`${rows}-${cols}`}
                  type="button"
                  aria-label={`${rows} by ${cols} table`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHover({ rows, cols })}
                  onClick={() => insert(rows, cols)}
                  className={cn(
                    "h-4 rounded-[3px] border",
                    on ? "border-accent bg-accent/20" : "border-black/10 bg-black/[0.03]",
                  )}
                />
              );
            })}
          </div>

          <div className="mt-3 flex items-end gap-2">
            <label className="min-w-0 flex-1 text-[11px] text-foreground/55">
              Rows
              <input
                type="number"
                min={1}
                max={CUSTOM_MAX_ROWS}
                value={customRows}
                onChange={(event) => setCustomRows(event.target.value)}
                className="mt-0.5 w-full rounded-md border border-black/10 px-2 py-1 text-xs text-foreground"
              />
            </label>
            <label className="min-w-0 flex-1 text-[11px] text-foreground/55">
              Columns
              <input
                type="number"
                min={1}
                max={CUSTOM_MAX_COLS}
                value={customCols}
                onChange={(event) => setCustomCols(event.target.value)}
                className="mt-0.5 w-full rounded-md border border-black/10 px-2 py-1 text-xs text-foreground"
              />
            </label>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => insert(Number(customRows) || 1, Number(customCols) || 1)}
              className="rounded-md bg-ink px-2 py-1 text-xs font-medium text-white"
            >
              Insert
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const LINE_MODE_LABELS: Record<TableLineMode, string> = {
  off: "Hide lines",
  rows: "Row lines",
  grid: "All lines",
};

function TableEditTools({ editor }: { editor: Editor }) {
  if (!editor.isActive("table")) return null;

  const tableAttrs = editor.getAttributes("table");
  const lines = normalizeTableLines(tableAttrs.lines) || "grid";
  const lineColor = normalizeTableLineColor(tableAttrs.lineColor);

  return (
    <div className="mt-1 space-y-1.5 border-t border-black/6 pt-1.5">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton label="+ Row" onClick={() => editor.chain().focus().addRowAfter().run()} />
        <ToolbarButton label="+ Column" onClick={() => editor.chain().focus().addColumnAfter().run()} />
        <ToolbarButton label="- Row" onClick={() => editor.chain().focus().deleteRow().run()} />
        <ToolbarButton label="- Column" onClick={() => editor.chain().focus().deleteColumn().run()} />
        <ToolbarButton label="Header row" onClick={() => editor.chain().focus().toggleHeaderRow().run()} />
        <ToolbarButton label="Header column" onClick={() => editor.chain().focus().toggleHeaderColumn().run()} />
        <ToolbarButton
          label="Merge"
          disabled={!editor.can().mergeCells()}
          onClick={() => editor.chain().focus().mergeCells().run()}
        />
        <ToolbarButton
          label="Split"
          disabled={!editor.can().splitCell()}
          onClick={() => editor.chain().focus().splitCell().run()}
        />
        <ToolbarButton label="Delete table" onClick={() => editor.chain().focus().deleteTable().run()} />
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {TABLE_LINE_MODES.map((mode) => (
          <ToolbarButton
            key={mode}
            label={LINE_MODE_LABELS[mode]}
            active={lines === mode}
            onClick={() => editor.chain().focus().updateAttributes("table", { lines: mode }).run()}
          />
        ))}
        <span className="ml-1 mr-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/45">
          Color
        </span>
        {TABLE_LINE_COLOR_PRESETS.map((preset) => {
          const active = preset.value === null ? !lineColor : lineColor === preset.value;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              aria-label={`${preset.label} line color`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor.chain().focus().updateAttributes("table", { lineColor: preset.value }).run()}
              className={cn(
                "h-5 w-5 rounded-full border",
                active ? "border-ink ring-1 ring-ink/30" : "border-black/15",
              )}
              style={{ backgroundColor: preset.swatch }}
            />
          );
        })}
        <label className="relative h-5 w-5 overflow-hidden rounded-full border border-black/15" title="Custom line color">
          <span className="sr-only">Custom line color</span>
          <input
            type="color"
            value={lineColor || "#c9c3b8"}
            onMouseDown={(event) => event.preventDefault()}
            onChange={(event) =>
              editor.chain().focus().updateAttributes("table", { lineColor: event.target.value }).run()
            }
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <span
            className="block h-full w-full"
            style={{
              background:
                "conic-gradient(#c7253e, #e6e1d8, #0a0a0a, #8a847a, #c9c3b8, #c7253e)",
            }}
          />
        </label>
      </div>
    </div>
  );
}

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
      Link.configure(CMS_LINK_OPTIONS),
      Image,
      Placeholder.configure({ placeholder }),
      ...cmsTableExtensions,
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
        // Keep common list/paragraph structure from Word/Google Docs paste.
        // Existing <a> tags are left intact; plain-text URLs are not wrapped
        // because linkOnPaste is disabled on the Link extension.
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

  const linkActive = editor.isActive("link");
  const href = currentHref(editor);

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
      label: linkActive ? "Edit Link" : "Link",
      action: () => setOrEditLink(editor),
      active: linkActive,
    },
    ...(linkActive
      ? [
          { label: "Unlink", action: () => unlink(editor), active: false },
          {
            label: "Open",
            action: () => openLink(editor),
            active: false,
            disabled: !canOpenCmsHref(href),
          },
        ]
      : []),
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
      <div className="sticky top-0 z-20 rounded-t-xl border-b border-black/8 bg-[#faf9f7]/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-[#faf9f7]/85">
        <div className="flex flex-wrap gap-1">
          {tools.map((btn) => (
            <ToolbarButton
              key={btn.label}
              label={btn.label}
              active={btn.active}
              disabled={"disabled" in btn ? Boolean(btn.disabled) : false}
              onClick={btn.action}
            />
          ))}
          <TableInsertMenu editor={editor} />
        </div>
        <TableEditTools editor={editor} />
        {linkActive && href ? (
          <p className="mt-1 truncate px-1 text-[11px] text-foreground/45" title={href}>
            {href}
          </p>
        ) : null}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
