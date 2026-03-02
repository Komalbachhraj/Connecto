import { useState, useRef, useCallback, DragEvent, ChangeEvent, MouseEvent, useEffect } from "react";
import { createPortal } from "react-dom";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfilePhotoEditorProps {
  userId?: number | string;
  userName?: string;
  currentPhoto?: string | null;
  onPhotoUpdated?: (newUrl: string) => void;
}

interface UploadResponse {
  photoUrl: string;
  message?: string;
}

// ── Modal (rendered via Portal at document.body) ──────────────────────────────

interface ModalProps {
  preview: string | null;
  photo: string | null;
  initials: string;
  isDragging: boolean;
  isUploading: boolean;
  error: string;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onBrowse: () => void;
  onRemove: () => void;
  onSave: () => void;
  onCancel: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PhotoModal({
  preview, photo, initials, isDragging, isUploading, error,
  onDrop, onDragOver, onDragLeave, onBrowse, onRemove,
  onSave, onCancel, fileInputRef, onFileChange,
}: ModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="relative w-[440px] max-w-[95vw] bg-gradient-to-b from-[#0f1e35] to-[#0a1628] border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Update Profile Photo</h2>
          <p className="text-xs text-slate-500 mt-1">JPG, PNG or WEBP · Max 5MB</p>
        </div>

        {/* Preview row */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : photo ? (
              <img src={photo} alt="Current" className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {preview ? (
                <span className="text-cyan-400 font-medium">New photo ready to save ✓</span>
              ) : (
                "Choose a photo below to preview it here before saving."
              )}
            </p>
            {photo && !preview && (
              <button
                type="button"
                onClick={onRemove}
                className="text-xs text-red-400/70 hover:text-red-400 mt-1 transition-colors"
              >
                Remove current photo
              </button>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={onBrowse}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-7 text-center mb-5
            ${isDragging
              ? "border-cyan-400 bg-cyan-400/10"
              : "border-cyan-500/25 hover:border-cyan-400/50 hover:bg-white/[0.02] bg-transparent"
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">
            Drag & drop or{" "}
            <span className="text-cyan-400 underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG, WEBP</p>

          {isDragging && (
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 bg-cyan-400/5 flex items-center justify-center">
              <span className="text-cyan-300 text-sm font-medium">Drop to preview</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!preview || isUploading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${preview && !isUploading
                ? "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30"
                : "bg-cyan-500/20 text-cyan-700 cursor-not-allowed"
              }`}
          >
            {isUploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading...
              </>
            ) : "Save Photo"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfilePhotoEditor({
  userName = "N",
  currentPhoto = null,
  onPhotoUpdated,
}: ProfilePhotoEditorProps) {
  const [photo, setPhoto] = useState<string | null>(currentPhoto);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    setPhoto(currentPhoto ?? null);
  }, [currentPhoto]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = userName.charAt(0).toUpperCase();

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFile = (file: File | undefined): void => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async (): Promise<void> => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const res = await fetch("http://localhost:5001/api/profile/upload-photo", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });

      const data: UploadResponse = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setPhoto(data.photoUrl);
      setPreview(null);
      setSelectedFile(null);
      setSuccess(true);
      setIsModalOpen(false);
      onPhotoUpdated?.(data.photoUrl);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = (): void => {
    setPreview(null);
    setSelectedFile(null);
    setError("");
    setIsModalOpen(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Avatar trigger ── */}
      <div
        className="relative w-32 h-32 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
          {photo ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
          {/* Hover camera overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
            <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Camera badge */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
          className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 border-2 border-[#0f172a] flex items-center justify-center shadow-lg shadow-cyan-500/40 transition-all duration-200 hover:scale-110 z-10"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* ── Modal via Portal ── */}
      {isModalOpen && (
        <PhotoModal
          preview={preview}
          photo={photo}
          initials={initials}
          isDragging={isDragging}
          isUploading={isUploading}
          error={error}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onBrowse={() => fileInputRef.current?.click()}
          onRemove={() => setPhoto(null)}
          onSave={handleSave}
          onCancel={handleCancel}
          fileInputRef={fileInputRef}
          onFileChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
        />
      )}

      {/* ── Success toast via Portal ── */}
      {success && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-[#0d1f2d] border border-cyan-500/40 text-cyan-300 text-sm px-4 py-3 rounded-xl shadow-xl shadow-cyan-500/10">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Profile photo updated!
        </div>,
        document.body
      )}
    </>
  );
}
