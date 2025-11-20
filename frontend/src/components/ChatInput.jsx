import React, { useRef, useState } from "react";
import { ImagePlus, X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useHomepageStore } from "../store/useHomePageStore";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useHomepageStore();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  const handleSend = async () => {
    if (!message.trim() && !imageFile) {
      toast.error("Message or image required");
      return;
    }

    setIsSending(true);
    let uploadedImageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "user_profile_upload");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dhjblh6jr/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        uploadedImageUrl = data.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed", err);
        toast.error("Image upload failed");
        setIsSending(false);
        return;
      }
    }

    sendMessage({ text: message, image: uploadedImageUrl });

    setMessage("");
    setImageFile(null);
    setImagePreview(null);
    fileInputRef.current.value = null;
    setIsSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-base-200 p-4 rounded-box shadow-md w-full">
      {imagePreview && (
        <div className="relative mb-4 max-w-full sm:max-w-sm">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-lg border border-base-300 w-full h-auto"
          />
          <button
            onClick={handleRemoveImage}
            className="btn btn-xs btn-circle btn-error absolute top-1 right-1"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="input input-bordered flex-1 min-w-[150px]"
        />
        <button
          type="button"
          onClick={handleImageClick}
          className="btn btn-outline btn-sm"
          aria-label="Attach image"
        >
          <ImagePlus className="w-4 h-4" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          onClick={handleSend}
          className="btn btn-primary btn-sm"
          aria-label="Send message"
          disabled={isSending}
        >
          {isSending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
