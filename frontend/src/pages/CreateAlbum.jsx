import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import toast from 'react-hot-toast';

function CreateAlbum() {
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateAlbum = async () => {
    if (!title.trim()) {
      toast.error("Please enter an album name.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("album[title]", title);
    formData.append("album[is_private]", isPrivate);
    if (coverImage) formData.append("album[cover_image]", coverImage);

    try {
      await api.post("/albums", formData);
      toast.success("Album created successfully!");
      navigate("/albums");
    } catch (err) {
      toast.error("Failed to create album. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg d-flex align-items-center justify-content-center px-3">
      <div className="w-100" style={{ maxWidth: "440px" }}>
        <div className="form-card rounded-4 p-4 p-md-5">

          {/* Heading */}
          <h2 className="form-title fw-bold mb-1">Create Album</h2>
          <p className="form-subtitle mb-4">Give your collection a name and a cover</p>

          {/* Cover Image Upload */}
          <div className="mb-4">
            <label className="form-label-custom d-block mb-1">
              Cover Image <span className="text-optional">(optional)</span>
            </label>

            <label htmlFor="cover-upload" className="d-block cursor-pointer">
              <div className="upload-box rounded-3 d-flex align-items-center justify-content-center overflow-hidden position-relative">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="upload-overlay position-absolute inset-0 d-flex align-items-center justify-content-center"
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <span className="text-white small">Change photo</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="fs-3 mb-1">🖼️</div>
                    <p className="upload-hint mb-0">Click to upload cover</p>
                    <p className="upload-hint-sub mb-0">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="d-none"
            />
          </div>

          {/* Album Title */}
          <div className="mb-4">
            <label className="form-label-custom d-block mb-1">Album Name</label>
            <input
              type="text"
              className="form-control search-input"
              placeholder="e.g. Summer 2024, Europe Trip..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Privacy Toggle */}
          <div className="toggle-box d-flex align-items-center justify-content-between mb-4 px-3 py-3 rounded-3">
            <div>
              <p className="toggle-label mb-0">
                {isPrivate ? "🔒 Private" : "🌍 Public"}
              </p>
              <p className="toggle-sublabel mb-0">
                {isPrivate ? "Only me" : "Anyone"}
              </p>
            </div>

            {/* Toggle Switch */}
            <div
              className="toggle-switch"
              onClick={() => setIsPrivate(!isPrivate)}
              style={{ background: isPrivate ? "#c8f135" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="toggle-thumb"
                style={{
                  background: isPrivate ? "#0f0f0f" : "#555",
                  left: isPrivate ? "23px" : "3px",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <Link
              to="/albums"
              className="btn rounded-3 px-4 flex-grow-1 btn-cancel"
            >
              Cancel
            </Link>
            <button
              className="btn rounded-3 fw-semibold flex-grow-1 btn-primary-custom"
              onClick={handleCreateAlbum}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating..." : "Create Album"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateAlbum;