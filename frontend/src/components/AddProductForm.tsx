"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { mockSession } from "@/config/session";
import { api } from "@/services/api";
import { ProductInput } from "@/types";
import { getErrorMessage } from "@/utils/errorMessage";

const initialForm: ProductInput = {
  sellerId: mockSession.sellerId,
  title: "",
  unitPrice: 0,
  quantity: 0,
  image: "",
  description: ""
};

export function AddProductForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSaving(true);

    try {
      await api.createProduct(form);
      setSuccessMessage("Product saved successfully. Redirecting...");
      pushToast("Product created successfully.", "success");
      setForm(initialForm);
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 800);
    } catch (error) {
      const message = getErrorMessage(error, "Could not save product. Please try again.");
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setUploadMessage("");
    setErrorMessage("");
    setIsUploadingImage(true);

    try {
      const imageUrl = await api.uploadProductImage(selectedFile);
      updateField("image", imageUrl);
      setUploadMessage("Image uploaded successfully.");
      pushToast("Image uploaded successfully.", "success");
    } catch (error) {
      const message = getErrorMessage(error, "Could not upload image. Please try again.");
      setUploadMessage(message);
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const updateField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  return (
    <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Seller ID</span>
        <input
          required
          min={1}
          type="number"
          value={form.sellerId}
          onChange={(event) => updateField("sellerId", event.target.value)}
          placeholder="1"
          className="form-input"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Product Name</span>
        <input
          required
          type="text"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Enter product name"
          className="form-input"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Unit Price</span>
        <input
          required
          min={0}
          step="0.01"
          type="number"
          value={form.unitPrice || ""}
          onChange={(event) => updateField("unitPrice", Number(event.target.value) || 0)}
          placeholder="0.00"
          className="form-input"
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Quantity</span>
        <input
          required
          min={0}
          type="number"
          value={form.quantity || ""}
          onChange={(event) => updateField("quantity", Number(event.target.value) || 0)}
          placeholder="0"
          className="form-input"
        />
      </label>

      <div className="space-y-3 sm:col-span-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Product Image File</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="form-input file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={handleImageUpload} loading={isUploadingImage} disabled={!selectedFile}>
            {isUploadingImage ? "Uploading..." : "Upload Image"}
          </Button>
          <span className="text-xs text-slate-500">Allowed: JPG, PNG, WEBP (max 5MB)</span>
        </div>

        {uploadMessage ? <p className="text-sm font-medium text-slate-700">{uploadMessage}</p> : null}

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Image URL (auto-filled after upload)</span>
          <input
            required
            type="url"
            value={form.image}
            onChange={(event) => updateField("image", event.target.value)}
            placeholder="https://your-cdn-or-backend/uploads/products/..."
            className="form-input"
          />
        </label>

        {form.image ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="relative h-44 w-full">
              <Image
                src={form.image}
                alt="Selected product preview"
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          </div>
        ) : null}
      </div>

      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          required
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe your product"
          rows={5}
          className="form-input min-h-28 resize-y"
        />
      </label>

      {successMessage ? <p className="sm:col-span-2 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p className="sm:col-span-2 text-sm font-medium text-rose-700">{errorMessage}</p> : null}

      <div className="sm:col-span-2">
        <Button type="submit" loading={isSaving}>
          {isSaving ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
