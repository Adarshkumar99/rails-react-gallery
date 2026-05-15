import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import toast from 'react-hot-toast';
import { useCallback } from "react";
function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, token } = useAuth();

  const fetchAlbum = useCallback(async () => {
    try {
      const res = await api.get(`/albums/${id}`);
      setAlbum(res);
    } catch (err) {
      toast.error("Failed to fetch album. Try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  // 🔥 UPLOAD FUNCTION
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const token = localStorage.getItem("token");

    try {
      const uploadedPhotos = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("photo[album_id]", id);
        formData.append("photo[image]", files[i]);
        const data = await api.post("/photos", formData);
        uploadedPhotos.push(data);
      };

      // UI instantly update
      setAlbum((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos],
      }));
      toast.success("Photos uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload photos. Try again.");
    }
  };

    const handleDelete = async (photoId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/v1/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (!res.ok) {
        console.error("Failed to delete photo");
        return;
      }

      setAlbum((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      }));
      toast.success("Photo deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 128px)", background: "#0f0f0f" }}>
        <div style={{ color: "#555", fontSize: "0.9rem" }}>Loading album...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 128px)", background: "#0f0f0f" }}>
        <div style={{ color: "#555", fontSize: "0.9rem" }}>Album not found.</div>
      </div>
    );
  }

  return (
  <div className="page-bg p-4 p-md-5">

    {/* Header */}
    <div className="d-flex align-items-center justify-content-between mb-4">
      <h1 className="album-header-title">{album.title}</h1>

      {isLoggedIn && (
        <div className="d-flex gap-2">
          <Link
            to={`/albums/${id}/edit`}
            className="btn-primary-custom"
          >
            ✏️ Edit Album
          </Link>
          <label className="btn-primary-custom">
            + Add Photo
            <input
              type="file"
              multiple
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}
    </div>

    {/* Photos */}
    {album.photos && album.photos.length > 0 ? (
      <div className="row g-3">
        {album.photos.map((photo) => (
          <div key={photo.id} className="col-6 col-md-4 col-lg-3">
            <div className="position-relative rounded-3 overflow-hidden photo-card">
              <img
                src={photo.image_url}
                className="w-100"
                alt="photo"
                loading="lazy"
              />
              {isLoggedIn && (
                <button
                  className="btn btn-sm position-absolute delete-btn"
                  onClick={() => handleDelete(photo.id)}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "300px" }}>
        <p className="loading-text">No photos yet</p>
      </div>
    )}
  </div>
);
}

export default AlbumDetail;