import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { useEffect, useState } from 'react';

const recentPhotos = [
  { id: 1, emoji: '🌄', title: 'Sunset Valley', user: '@adarsh', likes: 42, bg: '#2a1f08', tall: true },
  { id: 2, emoji: '🌿', title: 'Forest Walk', user: '@priya', likes: 18, bg: '#0d2a1a' },
  { id: 3, emoji: '🌊', title: 'Ocean Blues', user: '@rohan', likes: 31, bg: '#0d1a2a' },
  { id: 4, emoji: '🏙️', title: 'City Nights', user: '@meera', likes: 67, bg: '#2a0d0d', wide: true },
  { id: 5, emoji: '🌸', title: 'Bloom', user: '@neha', likes: 25, bg: '#2a0d2a' },
];

const dummyAlbums = [
  { id: 1, title: 'Nature Vibes', photos_count: 24, cover_image_url: null },
  { id: 2, title: 'Travel 2024', photos_count: 58, cover_image_url: null },
  { id: 3, title: 'Night Shots', photos_count: 12, cover_image_url: null },
  { id: 4, title: 'Macro World', photos_count: 37, cover_image_url: null },
];

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    api.get("/home")
      .then((data) => {
        setAlbums(data.albums?.length > 0 ? data.albums : dummyAlbums);
        setTotalUsers(data.total_user);
        setTotalAlbums(data.total_albums);
        setTotalPhotos(data.total_photos);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="page-bg">

      {/* HERO */}
      <section className="text-center py-5 px-3">
        <span className="badge rounded-pill mb-3 px-3 py-2 hero-badge">
          IMAGE GALLERY
        </span>
        <h1 className="hero-title fw-bold mb-3">
          Your Photos,<br />
          <span className="text-accent">Beautifully</span> Organized
        </h1>
        <p className="hero-subtitle mx-auto mb-4">
          Upload images, create albums, and share your visual stories with the world.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link
            to={isLoggedIn ? '/album/new' : '/signup'}
            className="btn rounded-pill px-4 fw-semibold btn-primary-custom"
          >
            Start Uploading
          </Link>
          <Link
            to="/albums"
            className="btn rounded-pill px-4 btn-outline-custom"
          >
            Browse Gallery
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar d-flex justify-content-center">
        {[[totalPhotos, 'Photos'], [totalAlbums, 'Albums'], [totalUsers, 'Users'], ['20K', 'Views']].map(([num, lbl]) => (
          <div key={lbl} className="stat-item text-center px-4 py-3">
            <div className="stat-num">{num}</div>
            <div className="stat-lbl">{lbl}</div>
          </div>
        ))}
      </div>

      {/* RECENT PHOTOS */}
      <section className="p-4">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <h2 className="section-title">Recent Photos</h2>
          <Link to="/albums" className="see-all-link">See all →</Link>
        </div>
        <div className="row g-2">
          {recentPhotos.map(p => (
            <div key={p.id} className={p.tall ? 'col-3' : p.wide ? 'col-6' : 'col-3'}>
              <div
                className="rounded-3 overflow-hidden position-relative photo-item"
                style={{ background: p.bg, minHeight: p.tall ? '220px' : '104px' }}
              >
                <div
                  className="d-flex align-items-center justify-content-center h-100 photo-emoji"
                  style={{ minHeight: 'inherit' }}
                >
                  {p.emoji}
                </div>
                <div className="photo-info position-absolute bottom-0 start-0 end-0 p-2">
                  <div className="photo-info-title">{p.title}</div>
                  <div className="photo-info-user">{p.user}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ALBUMS */}
      <section className="px-4 pb-4">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <h2 className="section-title">Featured Albums</h2>
          <Link to="/albums" className="see-all-link">See all →</Link>
        </div>
        <div className="row g-3">
          {albums.map(album => (
            <div className="col-6 col-md-3" key={album.id}>
              <div
                className="album-card rounded-4 overflow-hidden h-100"
                onClick={() => navigate(`/albums/${album.id}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(200,241,53,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                }}
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
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="album-title mb-1 text-truncate">{album.title}</p>
                  <div className="album-photos-count">
                    <span className="album-dot me-1"></span>
                    {album.photos_count ?? 0} photos
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-banner mx-4 mb-4 p-4 rounded-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3 className="cta-title">Start your gallery today</h3>
          <p className="cta-subtitle mb-0">
            Create an account, upload your photos and organize them into beautiful albums.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link
            to={isLoggedIn ? "/album/new" : "/signup"}
            className="btn rounded-pill px-4 fw-semibold btn-primary-custom"
          >
            {isLoggedIn ? "Create Album" : "Create Account"}
          </Link>
          <Link
            to="/albums"
            className="btn rounded-pill px-4 btn-outline-custom"
          >
            Browse Gallery
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Home;