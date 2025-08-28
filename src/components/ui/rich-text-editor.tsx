"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
  Unlink,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeStyles, setActiveStyles] = useState<Record<string, boolean>>({});

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  // Update active styles when selection changes
  const updateActiveStyles = () => {
    if (!document) return;

    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateActiveStyles();
    }
  };

  // Execute command on the document
  const execCommand = (command: string, value = "") => {
    // Ensure the editor has focus before executing commands
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }

    // Execute the command
    document.execCommand(command, false, value);

    // Update content and active styles
    handleContentChange();

    // Keep focus on the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  // Process selected image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const imageUrl = readerEvent.target?.result as string;
        execCommand("insertImage", imageUrl);

        // Reset the input
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle heading formatting
  const formatHeading = (level: string) => {
    if (level === "p") {
      execCommand("formatBlock", "<p>");
    } else {
      execCommand("formatBlock", `<${level}>`);
    }
  };

  // Get current heading level
  const getCurrentHeadingLevel = (): string => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "p";

    const parentElement = selection.getRangeAt(0)
      .commonAncestorContainer as HTMLElement;
    const element =
      parentElement.nodeType === 3
        ? parentElement.parentElement
        : parentElement;

    if (!element) return "p";

    const tagName = element.tagName.toLowerCase();
    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
      return tagName;
    }

    // Check parent elements for heading tags
    let parent = element.parentElement;
    while (parent && parent !== editorRef.current) {
      const parentTag = parent.tagName.toLowerCase();
      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(parentTag)) {
        return parentTag;
      }
      parent = parent.parentElement;
    }

    return "p";
  };

  // Insert link
  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  // Remove link
  const removeLink = () => {
    execCommand("unlink");
  };

  // Handle paste to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Update active styles
    updateActiveStyles();

    // Handle keyboard shortcuts
    if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (e.shiftKey) {
        execCommand("redo");
      } else {
        execCommand("undo");
      }
    } else if (
      (e.key === "y" && (e.ctrlKey || e.metaKey)) ||
      (e.key === "Z" && e.ctrlKey && e.shiftKey)
    ) {
      e.preventDefault();
      execCommand("redo");
    }
  };

  return (
    <div className={ ` border border-[#B6B6B6] focus:border-none focus:ring-0 focus-visible:border-none rounded-md overflow-scroll `}>
      <div className="rich-text-toolbar sticky top-0 z-20 overflow-x-auto">
        <div className="rich-text-toolbar-group">
          <select
            onChange={(e) => formatHeading(e.target.value)}
            className="rich-text-toolbar-select dark:text-black"
            value={getCurrentHeadingLevel()}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={() => execCommand("bold")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.bold ? "is-active" : ""
            }`}
            title="Bold"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("italic")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.italic ? "is-active" : ""
            }`}
            title="Italic"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("underline")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.underline ? "is-active" : ""
            }`}
            title="Underline"
            type="button"
          >
            <Underline className="h-4 w-4" />
          </button>
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={() => execCommand("justifyLeft")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.justifyLeft ? "is-active" : ""
            }`}
            title="Align left"
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("justifyCenter")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.justifyCenter ? "is-active" : ""
            }`}
            title="Align center"
            type="button"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("justifyRight")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.justifyRight ? "is-active" : ""
            }`}
            title="Align right"
            type="button"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("justifyFull")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.justifyFull ? "is-active" : ""
            }`}
            title="Justify"
            type="button"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={() => execCommand("insertUnorderedList")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.insertUnorderedList ? "is-active" : ""
            }`}
            title="Bullet list"
            type="button"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("insertOrderedList")}
            className={`rich-text-toolbar-button dark:text-black ${
              activeStyles.insertOrderedList ? "is-active" : ""
            }`}
            title="Ordered list"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        <div className="rich-text-toolbar-group ">
          <button
            onClick={insertLink}
            className="rich-text-toolbar-button dark:text-black"
            title="Insert link"
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            onClick={removeLink}
            className="rich-text-toolbar-button dark:text-black"
            title="Remove link"
            type="button"
          >
            <Unlink className="h-4 w-4" />
          </button>
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={() => execCommand("formatBlock", "<pre>")}
            className="rich-text-toolbar-button dark:text-black"
            title="Code block"
            type="button"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={handleImageUpload}
            className="rich-text-toolbar-button dark:text-black"
            title="Add image"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="rich-text-toolbar-group">
          <button
            onClick={() => execCommand("undo")}
            className="rich-text-toolbar-button dark:text-black"
            title="Undo (Ctrl+Z)"
            type="button"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand("redo")}
            className="rich-text-toolbar-button dark:text-black"
            title="Redo (Ctrl+Y)"
            type="button"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className={`rich-text-content dark:text-black ${
          !content && !isFocused ? "empty" : ""
        }`}
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyUp={updateActiveStyles}
        onKeyDown={handleKeyDown}
        onMouseUp={updateActiveStyles}
        onPaste={handlePaste}
        data-placeholder={placeholder}
      />
    </div>
  );
}
