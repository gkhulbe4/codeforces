"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { Button } from "./button";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code2,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({
  value,
  onChange,
  placeholder = "Write your content...",
  className = "",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editorToMarkdown(editor.getHTML());
      onChange(markdown);
    },
  });

  useEffect(() => {
    if (editor && value !== editorToMarkdown(editor.getHTML())) {
      const html = markdownToHTML(value);
      editor.commands.setContent(html);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={`border border-gray-300 rounded-md min-h-[300px] ${className}`}
      >
        <div className="p-4 text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`h-8 w-8 p-0 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`h-8 w-8 p-0 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`h-8 w-8 p-0 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("code") ? "bg-gray-200" : ""
          }`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("codeBlock") ? "bg-gray-200" : ""
          }`}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive("blockquote") ? "bg-gray-200" : ""
          }`}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

// Helper function to convert TipTap HTML to Markdown
function editorToMarkdown(html: string): string {
  let markdown = html;

  // Remove wrapper paragraphs
  markdown = markdown.replace(/<p><\/p>/g, "\n");

  // Headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, "# $1\n");
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, "## $1\n");
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, "### $1\n");

  // Bold and Italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, "**$1**");
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, "*$1*");

  // Code
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, "`$1`");
  markdown = markdown.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    "```\n$1\n```\n",
  );

  // Lists
  markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, content) => {
    return content.replace(/<li>(.*?)<\/li>/g, "- $1\n");
  });
  markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, content) => {
    let counter = 1;
    return content.replace(/<li>(.*?)<\/li>/g, () => {
      return `${counter++}. $1\n`;
    });
  });

  // Blockquotes
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n");

  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, "$1\n\n");

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/g, "\n");

  // Clean up extra newlines
  markdown = markdown.replace(/\n{3,}/g, "\n\n");
  markdown = markdown.trim();

  return markdown;
}

// Helper function to convert Markdown to HTML for TipTap
function markdownToHTML(markdown: string): string {
  let html = markdown;

  // Code blocks (must be before inline code)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Headings
  html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Inline Code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Blockquotes
  html = html.replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>");

  // Lists
  html = html.replace(/^- (.*$)/gm, "<ul><li>$1</li></ul>");
  html = html.replace(/^\d+\. (.*$)/gm, "<ol><li>$1</li></ol>");

  // Merge consecutive list items
  html = html.replace(/<\/ul>\n<ul>/g, "");
  html = html.replace(/<\/ol>\n<ol>/g, "");

  // Paragraphs (anything not already wrapped)
  html = html.replace(/^(?!<[huo]|<pre|<blockquote)(.*$)/gm, "<p>$1</p>");

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}
