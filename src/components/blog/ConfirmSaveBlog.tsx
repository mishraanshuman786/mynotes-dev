// components/blog/ConfirmSaveBlog.tsx
"use client";

import { useState,useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { createBlogSchema } from "@/lib/schemas/blog";
import { getBlogCategories } from "@/app/actions/blogCategory";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    title: string;
    slug: string;
    category_id: string | null;
  }) => void;
};

export function ConfirmSaveBlog({
  open,
  onClose,
  onConfirm,
}: Props) {

    type Category={
     id:string;
     name:string;
     slug:string;
  }

    const [categories,setCategories]=useState<Category[]>([]);

    // state for setting the confirm form
  const [meta, setMeta] = useState({
    title: "",
    slug: "",
    category_id: null as string | null,
  });

  

  useEffect(()=>{
    async function fetchBlogCategory(){
        const categoryList=await getBlogCategories();
        setCategories(categoryList);
    }

    fetchBlogCategory();
  },[]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const parsed = createBlogSchema
      .pick({ title: true, slug: true, category_id: true })
      .safeParse(meta);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0] ?? "",
        slug: fieldErrors.slug?.[0] ?? "",
      });
      return;
    }

    setErrors({});
    onConfirm({
  ...parsed.data,
  category_id: parsed.data.category_id ?? null,
});

  }

  return (
    <Modal
      open={open}
      title="Save Blog"
      onClose={onClose}
      onSubmit={submit}
      submitText="Save"
    >
      <input
        className="w-full border p-2 rounded border-gray-500 text-gray-600 mb-2"
        placeholder="Title"
        value={meta.title}
        onChange={(e) =>
          setMeta({ ...meta, title: e.target.value })
        }
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title}</p>
      )}

      <input
        className="w-full border border-gray-500 p-2 rounded text-gray-600 mb-2"
        placeholder="slug-like-this"
        value={meta.slug}
        onChange={(e) =>
          setMeta({ ...meta, slug: e.target.value })
        }
      />
      {errors.slug && (
        <p className="text-red-500 text-sm">{errors.slug}</p>
      )}

      <select
        className="w-full border p-2 rounded border-gray-500 text-gray-600"
        onChange={(e) =>
          setMeta({
            ...meta,
            category_id: e.target.value || null,
          })
        }
      >
        <option value="">Select category</option>

        {
            categories.map((cat)=>(
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            ))
        }
      </select>
    </Modal>
  );
}
