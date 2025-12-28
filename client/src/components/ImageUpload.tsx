import React, { useRef, useState } from "react";
import { FiUpload, FiUser, FiX } from "react-icons/fi";

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File | null) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ImageUpload({
  currentImage,
  onImageSelect,
  className = "",
  size = "md",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${isDragging ? "border-cyan-400 bg-cyan-50" : "border-gray-300"} 
          border-2 border-dashed rounded-full
          flex items-center justify-center
          cursor-pointer
          transition-colors
          relative
          overflow-hidden
          bg-gray-50
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              type="button"
            >
              <FiX className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FiUser
              className={`${
                size === "sm"
                  ? "w-4 h-4"
                  : size === "md"
                  ? "w-6 h-6"
                  : "w-8 h-8"
              } mb-1`}
            />
            <FiUpload
              className={`${
                size === "sm"
                  ? "w-3 h-3"
                  : size === "md"
                  ? "w-4 h-4"
                  : "w-5 h-5"
              }`}
            />
            <span
              className={`${
                size === "sm" ? "text-xs" : "text-sm"
              } text-center mt-1`}
            >
              Upload
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {size === "lg" && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Click or drag an image here
        </p>
      )}
    </div>
  );
}
