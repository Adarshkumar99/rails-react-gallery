import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function Albums({ apiUrl, title = "All Albums" }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAlbums();
  }, [location.pathname]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const data = await api.get(apiUrl);
      setAlbums(data);
    } catch (err) {
      console.error("Error fetching albums", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = albums.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center page-bg">
        <p className="text-muted">Loading albums...</p>
      </div>
    );
  }

  return (
    <div className="page-bg px-3 px-md-4 py-5">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="album-header-title mb-0">{title}</h1>
        {isLoggedIn && (
          <Link
            to="/album/new"
            className="btn rounded-pill fw-semibold btn-primary-custom"
          >
            ＋ New Album
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search albums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control search-input"
        />
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <div className="fs-1 mb-3">🗂️</div>
          <h3 className="album-header-title fs-5 mb-2">No albums yet</h3>
          <p className="text-muted small mb-4">Be the first to create an album!</p>
          {isLoggedIn && (
            <Link
              to="/albums/new"
              className="btn rounded-pill fw-semibold btn-primary-custom px-4"
            >
              Create Album
            </Link>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((album) => (
            <div className="col-6 col-md-3" key={album.id}>
              <div
                className="album-card rounded-4 overflow-hidden h-100"
                onClick={() => navigate(`/albums/${album.id}`)}
              >
                {/* Cover Image */}
                <div className="album-cover">
                  {album.cover_image_url ? (
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                      loading="lazy"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 album-cover-placeholder">
                      🖼️
                    </div>
                  )}
                  <div className="album-cover-overlay" />
                  {album.is_private && (
                    <span className="badge position-absolute top-0 start-0 m-2 album-private-badge">
                      🔒 Private
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="album-title mb-1 text-truncate">{album.title}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="album-photos-count">
                      <span className="album-dot me-1"></span>
                      {album.photos_count ?? 0} photos
                    </span>
                    <span className="album-user">
                      @{album.user?.email?.split("@")[0] ?? "user"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Albums;