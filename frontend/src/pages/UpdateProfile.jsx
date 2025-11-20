import React, { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  CalendarCheck,
  ShieldCheck,
  ImagePlus,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UpdateProfile = () => {
  const { updateProfile, isUpdatingProfile, authUser } = useAuthStore();
  const [avatar, setAvatar] = useState(authUser?.avatar || "");
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
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
      setAvatar(data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!avatar || !avatar.startsWith("http")) {
      toast.error("Please upload a valid image");
      return;
    }
    await updateProfile({ avatar });
  };

  if (isUpdatingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral text-base-100">
      <div className="card w-full max-w-xl bg-base-100 text-base-content shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary">Update Profile</h2>
          <p className="text-sm text-base-content/70">
            Manage your account settings and view your profile details. You
            can’t change your name or email.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatar || "/default_pic.png"} alt="Profile" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleImageClick}
              className="btn btn-sm btn-outline flex items-center gap-1"
            >
              <ImagePlus className="w-4 h-4" />
              Change Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">
                <span className="flex items-center gap-2 text-base font-medium">
                  <User className="w-4 h-4 text-base" />
                  Name
                </span>
              </label>
              <input
                type="text"
                value={authUser?.name || ""}
                disabled
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-2 text-base font-medium">
                  <Mail className="w-4 h-4 text-base" />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={authUser?.email || ""}
                disabled
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <CalendarCheck className="w-4 h-4" />
                Member since:{" "}
                {authUser?.createdAt ? authUser.createdAt.slice(0, 10) : "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Status:Active
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleSubmit} className="btn btn-primary w-full">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
