import { useRef } from "react";
import { Camera, X, Plus } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onAdd: (photo: string) => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const PhotoUpload = ({
  photos,
  onAdd,
  onRemove,
  maxPhotos = 4,
  label = "Adicionar foto",
  size = "md",
}: PhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Foto muito grande! Máximo 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // Compress by drawing to canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h * maxDim) / w; w = maxDim; }
          else { w = (w * maxDim) / h; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        onAdd(compressed);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-3">
      {photos.map((photo, idx) => (
        <div key={idx} className={`${sizeClasses[size]} relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm`}>
          <img src={photo} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center shadow-md bounce-tap"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {photos.length < maxPhotos && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${sizeClasses[size]} photo-upload-area flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[9px] font-bold">{label}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

interface ProfilePhotoProps {
  foto?: string;
  onPhotoChange: (photo: string) => void;
  genero: string;
  size?: number;
}

export const ProfilePhoto = ({ foto, onPhotoChange, genero, size = 80 }: ProfilePhotoProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const dim = 200;
        canvas.width = dim;
        canvas.height = dim;
        const ctx = canvas.getContext("2d");
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, dim, dim);
        onPhotoChange(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const emoji = genero === "feminino" ? "👧" : genero === "masculino" ? "👦" : "👶";

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative overflow-hidden rounded-full border-4 border-dashed border-primary/30 hover:border-primary transition-all bounce-tap"
        style={{ width: size, height: size }}
      >
        {foto ? (
          <img src={foto} alt="Foto do bebê" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
            <span className="text-3xl">{emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </button>
      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
        <Plus className="w-3.5 h-3.5" />
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
};
