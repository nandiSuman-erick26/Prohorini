"use client";

import { useCreatePost } from "@/hooks/react-query/useCreatePost";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useState, useRef } from "react";
import {
  Image as ImageIcon,
  X,
  Send,
  Camera,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";

const CreateCommunityPost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { mutate, isPending } = useCreatePost();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!content && !image) return;

    mutate(
      {
        userId: userProfile?.id as any,
        content,
        image: image || undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setImage(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-4 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex gap-3">
        <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
          <Camera size={18} />
        </div>

        <div className="flex-1 min-w-0 font-sans">
          <textarea
            placeholder="Share an update..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[60px] p-0 bg-transparent text-slate-800 text-base md:text-lg font-medium placeholder:text-slate-400 resize-none outline-none border-none pt-2"
          />

          {preview && (
            <div className="relative rounded-2xl overflow-hidden group mt-2">
              <img
                src={preview}
                alt="Selected"
                className="w-full h-auto max-h-[300px] object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 h-7 w-7 bg-zinc-950/50 hover:bg-zinc-950 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-zinc-100 transition-all"
                title="Add Media"
              >
                <ImageIcon size={18} />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-bold uppercase tracking-tight whitespace-nowrap">
                <Globe size={10} />
                Public
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isPending || (!content && !image)}
              className="h-9 px-5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-red-100 font-bold text-[10px] uppercase tracking-wide border-none disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
            >
              {isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <Send size={12} />
                  <span>Post</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPost;
