"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface TinyMCEEditorProps {
  value?: string;
  onEditorChange?: (content: string) => void;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
}

export default function TinyMCEEditor({
  value = "",
  onEditorChange,
  height = 900,
  placeholder = "Write your content here...",
  disabled = false,
}: TinyMCEEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditorChange = (content: string) => {
    if (onEditorChange) {
      onEditorChange(content);
    }
  };

  // Simulate image upload function (replace with your actual API call)
  const handleImageUpload = (
    blobInfo: { blob: () => Blob; filename: () => string },
    progress: (percent: number) => void
  ): Promise<string> => {
    return new Promise((resolve) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      // Simulate upload with progress
      let progressTimer = 0;
      const interval = setInterval(() => {
        progressTimer += 10;
        progress(progressTimer);
        if (progressTimer >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // In a real app, this would be your image URL from the server
            resolve(`https://picsum.photos/800/400?random=${Math.random()}`);
          }, 500);
        }
      }, 100);
    });
  };

  return (
    <div className="w-full relative">
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 z-10 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading image...</span>
          </div>
        </div>
      )}

      <Editor
        apiKey="05dya1uu1pfcwfx39h8dlrx72jqywg9k0oc5016oayowiook"
        onInit={(_evt: unknown, editor: Editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
            "quickbars",
            "codesample",
            "hr",
            "colorpicker",
            "textcolor",
            "pagebreak",
            "directionality",
            "paste",
            "imagetools",
            "autoresize",
            "autosave",
            "contextmenu",
            "template",
            "toc",
          ],
          toolbar: [
            "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify",
            "bullist numlist outdent indent | link image media | table codesample | emoticons",
            "formatselect fontselect fontsizeselect | code fullscreen preview | help",
          ].join(" | "),
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
              font-size: 14px; 
              line-height: 1.6; 
              color: #000000;
            }
            h1, h2, h3, h4, h5, h6 { 
              margin-top: 1em; 
              margin-bottom: 0.5em; 
              font-weight: 700; 
            }
            p { margin-bottom: 1em; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            blockquote { 
              border-left: 4px solid #ddd; 
              padding-left: 1em; 
              color: #666; 
              font-style: italic; 
            }
            .mce-content-body:not([dir=rtl])[data-mce-placeholder]:not(.mce-visualblocks)::before {
              color: #999;
              font-style: italic;
            }
          `,
          placeholder: placeholder,
          branding: false,
          resize: true,
          statusbar: true,
          automatic_uploads: true,
          images_upload_handler: handleImageUpload,
          file_picker_types: "image media",
          image_advtab: true,
          image_title: true,
          image_caption: true,
          media_live_embeds: true,
          media_alt_source: false,
          media_poster: false,
          media_dimensions: false,
          paste_data_images: true,
          toolbar_mode: "sliding",
          contextmenu: "link image table",
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote",
          a11y_advanced_options: true,
          emoticons_database: "emojis",
          templates: [
            {
              title: "Article Template",
              description: "Simple article layout",
              content:
                "<h1>Article Title</h1><p>Introduction paragraph...</p><h2>Section Heading</h2><p>Content goes here...</p>",
            },
            {
              title: "Two Column Layout",
              description: "Content with two columns",
              content:
                '<div style="display: flex; gap: 20px;"><div style="flex: 1;"><h2>Left Column</h2><p>Content...</p></div><div style="flex: 1;"><h2>Right Column</h2><p>Content...</p></div></div>',
            },
          ],
          font_formats:
            "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
          textcolor_map: [
            "000000",
            "Black",
            "FFFFFF",
            "White",
            "FF0000",
            "Red",
            "00FF00",
            "Green",
            "0000FF",
            "Blue",
            "FFFF00",
            "Yellow",
            "FF00FF",
            "Magenta",
            "00FFFF",
            "Cyan",
            "FFA500",
            "Orange",
            "800080",
            "Purple",
            "008000",
            "Dark Green",
            "FF6347",
            "Tomato",
            "7FFFD4",
            "Aquamarine",
            "FFD700",
            "Gold",
          ],
          style_formats: [
            {
              title: "Headings",
              items: [
                { title: "Heading 1", format: "h1" },
                { title: "Heading 2", format: "h2" },
                { title: "Heading 3", format: "h3" },
                { title: "Heading 4", format: "h4" },
              ],
            },
            {
              title: "Inline",
              items: [
                { title: "Bold", icon: "bold", format: "bold" },
                { title: "Italic", icon: "italic", format: "italic" },
                { title: "Underline", icon: "underline", format: "underline" },
                {
                  title: "Strikethrough",
                  icon: "strikethrough",
                  format: "strikethrough",
                },
                {
                  title: "Superscript",
                  icon: "superscript",
                  format: "superscript",
                },
                { title: "Subscript", icon: "subscript", format: "subscript" },
                { title: "Code", icon: "code", format: "code" },
              ],
            },
            {
              title: "Blocks",
              items: [
                { title: "Paragraph", format: "p" },
                { title: "Blockquote", format: "blockquote" },
                { title: "Div", format: "div" },
                { title: "Pre", format: "pre" },
              ],
            },
            {
              title: "Alignment",
              items: [
                { title: "Left", icon: "alignleft", format: "alignleft" },
                { title: "Center", icon: "aligncenter", format: "aligncenter" },
                { title: "Right", icon: "alignright", format: "alignright" },
                {
                  title: "Justify",
                  icon: "alignjustify",
                  format: "alignjustify",
                },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
