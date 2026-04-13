"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
  initialContent?: string;
  onChange: (json: string, isEmpty: boolean) => void;
  disabled?: boolean;
}

function parseContent(json?: string): object | undefined {
  if (!json) return undefined;
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function TiptapEditor({ initialContent, onChange, disabled }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "내용을 자유롭게 작성하세요" })],
    content: parseContent(initialContent),
    editable: !disabled,
    immediatelyRender: false,
    onUpdate({ editor: e }) {
      onChange(JSON.stringify(e.getJSON()), e.isEmpty);
    },
  });

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 border-border border-b px-3 py-2">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold") ?? false}
          disabled={disabled}
          label="B"
          className="font-bold"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic") ?? false}
          disabled={disabled}
          label="I"
          className="italic"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike") ?? false}
          disabled={disabled}
          label="S"
          className="line-through"
        />
        <div className="mx-1 w-px self-stretch bg-border" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive("heading", { level: 1 }) ?? false}
          disabled={disabled}
          label="H1"
          className="text-xs"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive("heading", { level: 2 }) ?? false}
          disabled={disabled}
          label="H2"
          className="text-xs"
        />
        <div className="mx-1 w-px self-stretch bg-border" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList") ?? false}
          disabled={disabled}
          label="• 목록"
          className="text-xs"
        />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList") ?? false}
          disabled={disabled}
          label="1. 목록"
          className="text-xs"
        />
        <div className="mx-1 w-px self-stretch bg-border" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code") ?? false}
          disabled={disabled}
          label="코드"
          className="font-mono text-xs"
        />
      </div>

      <div className="h-[400px] overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none px-4 py-3 text-[15px] text-foreground leading-relaxed focus-within:outline-none [&_.tiptap]:min-h-[376px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-neutral-400 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
  label: string;
  className?: string;
}

function ToolbarButton({ onClick, active, disabled, label, className }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`rounded px-2 py-1 text-sm transition-colors disabled:opacity-40 ${className ?? ""} ${
        active ? "bg-primary text-primary-foreground" : "text-neutral-600 hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
