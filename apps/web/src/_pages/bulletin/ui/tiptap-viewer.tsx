"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapViewerProps {
  content: string;
}

function parseContent(json: string): object | null {
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function TiptapViewer({ content }: TiptapViewerProps) {
  const parsed = parseContent(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: parsed ?? undefined,
    editable: false,
    immediatelyRender: false,
  });

  if (!parsed) {
    return (
      <div className="min-h-[200px] whitespace-pre-wrap text-[15px] text-neutral-800 leading-relaxed">{content}</div>
    );
  }

  return (
    <EditorContent
      editor={editor}
      className="prose prose-sm max-w-none text-[15px] text-neutral-800 leading-relaxed [&_.tiptap]:outline-none"
    />
  );
}
