"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaSave } from "react-icons/fa";
import { useState } from "react";
import { saveBlog } from "@/app/actions/blog";
import { ConfirmSaveBlog } from "./blog/ConfirmSaveBlog";
import { JSONContent } from "@tiptap/react";

const TiptapEditor = () => {
  const defaultJsonContent:JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Log Your Thought! 🌎"
        }
      ]
    }
  ]
};
  const [htmlContent, setHtmlContent] = useState("<p>Log Your Thought! 🌎</p>");
  const [jsonContent, setJsonContent]= useState<JSONContent>(defaultJsonContent);
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML()); 
      setJsonContent(editor.getJSON());
    },
  });


  // state to open and close the confirm box
  const [open, setOpen] = useState(false);


  // state to submit the cofirm box
 async function handleConfirm(meta: {
  title: string;
  slug: string;
  category_id: string | null;
  tags?: string[];
}) {
    await saveBlog({
      ...meta,
      content_json: jsonContent,
      content_html: htmlContent,
    });

    console.log(meta);

    setOpen(false);
  }

  

  console.log("Markdown Content:" + htmlContent);

  return (
    <div className="w-full ">
      {/* Toolbar */}
      <div className="flex gap-2 bg-white  p-2 rounded-t-lg border">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            editor?.isActive("bold")
              ? "bg-blue-500 text-gray"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinejoin="round"
              d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            editor?.isActive("italic")
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            editor?.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            editor?.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </button>
        <button
         onClick={()=>setOpen(true)}
         className=" px-3 py-1   rounded-md hover:bg-gray-200 text-sm font-medium">
         <FaSave className="text-gray-500 text-2xl" />
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor + Preview Layout */}
      <div className="flex gap-4 h-[500px]">
        {/* Editor */}
        <div
          className={`flex-1 border border-gray-300 rounded-b-lg shadow-md overflow-hidden ${
            showPreview ? "hidden lg:block w-1/2" : "block w-full"
          }`}
        >
          <style jsx global>{`
            .editor-container :global(.ProseMirror) {
              min-height: 480px !important;
              height: 500px !important;
              padding: 20px !important;
              overflow-y: auto !important;
              color: #1f2937 !important;
              background-color: #f5f4f4 !important;
              font-size: 16px !important;
              line-height: 1.7 !important;
            }
          `}</style>
          <div className="editor-container">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-full lg:w-1/2 border border-gray-300 rounded-lg shadow-md p-6 bg-gray-50 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Preview</h3>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>
      <ConfirmSaveBlog open={open} onClose={()=>setOpen(false)} onConfirm={handleConfirm} />
    </div>
  );
};

export default TiptapEditor;
