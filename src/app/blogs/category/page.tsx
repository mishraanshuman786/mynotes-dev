import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/app/actions/blogCategory";
import { revalidatePath } from "next/cache";

export default async function CategoriesPage() {
  const categories = await getBlogCategories();

  /* ===============================
     Create Category Action
  ================================ */
  async function handleCreate(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    await createBlogCategory({ name });
    revalidatePath("/blogs/category");
  }

  /* ===============================
     Delete Category Action
  ================================ */
  async function handleDelete(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    await deleteBlogCategory(id);
    revalidatePath("/blogs/category");
  }

  /* ===============================
     Update Category Action
  ================================ */
  async function handleUpdate(formData: FormData) {
  "use server";

  await updateBlogCategory(formData);
  revalidatePath("/blogs/category");
}

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>

      {/* Add Category */}
      <form action={handleCreate} className="flex gap-4 mb-10">
        <input
          type="text"
          name="name"
          placeholder="Enter category name"
          required
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Add
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-4">
        {categories.length === 0 && (
          <p className="text-gray-500">No categories found.</p>
        )}

        {categories.map((cat) => (
  <div
    key={cat.id}
    className="flex justify-between items-center border p-4 rounded-lg"
  >
    <form action={handleUpdate} className="flex gap-4 items-center w-full">
      <input type="hidden" name="id" value={cat.id} />

      <input
        type="text"
        name="name"
        defaultValue={cat.name}
        className="border rounded-lg px-3 py-1 flex-1"
      />

      <button
        type="submit"
        className="text-blue-600 hover:text-blue-800"
      >
        Update
      </button>
    </form>

    <form action={handleDelete}>
      <input type="hidden" name="id" value={cat.id} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 ml-4"
      >
        Delete
      </button>
    </form>
  </div>
))}
      </div>
    </div>
  );
}