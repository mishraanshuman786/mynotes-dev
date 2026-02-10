"use client";

import { ReactNode } from "react";

type ModalProps={
    open:boolean,
    title?:string,
    onClose:()=>void,
    onSubmit:()=>void,
    submitText?:string,
    cancelText?:string,
    children:ReactNode
}

export function Modal({open,title, onClose, onSubmit, submitText="Submit", cancelText="Cancel",children}:ModalProps){

    if(!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b text-gray-500">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-600"
          >
            {cancelText}
          </button>

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {submitText}
            </button>
          )}
        </div>
      </div>
    </div>
    )

}