import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, email, isLoggedIn } = useAuth();

  const initials = email ? email[0].toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="navbar px-4"
      style={{ background: '#0f0f0f', height: '64px' }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="navbar-brand fw-bold fs-5 text-white text-decoration-none"
      >
        Album<span style={{ color: '#c8f135' }}>.</span>
      </Link>

      {/* Nav Links */}
      <ul className="navbar-nav flex-row gap-2 mb-0">
        <li className="nav-item">
          <Link
            to="/"
            className="nav-link px-3 py-2 rounded-pill fw-medium"
            style={{
              color: isActive('/') ? '#0f0f0f' : '#aaa',
              background: isActive('/') ? '#c8f135' : 'transparent',
              fontSize: '0.875rem',
            }}
          >
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/albums"
            className="nav-link px-3 py-2 rounded-pill fw-medium"
            style={{
              color: isActive('/albums') ? '#0f0f0f' : '#aaa',
              background: isActive('/albums') ? '#c8f135' : 'transparent',
              fontSize: '0.875rem',
            }}
          >
            All Albums
          </Link>
        </li>

        {isLoggedIn && (
          <li className="nav-item">
            <Link
              to="/my_albums"
              className="nav-link px-3 py-2 rounded-pill fw-medium"
              style={{
                color: isActive('/my_albums') ? '#0f0f0f' : '#aaa',
                background: isActive('/my_albums') ? '#c8f135' : 'transparent',
                fontSize: '0.875rem',
              }}
            >
              My Albums
            </Link>
          </li>
        )}
      </ul>

      {!isLoggedIn && (
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-sm rounded-pill px-4"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
            Login
          </Link>
          <Link to="/signup" className="btn btn-sm rounded-pill px-4 fw-semibold"
            style={{ background: '#c8f135', color: '#0f0f0f', border: 'none' }}>
            Sign Up
          </Link>
        </div>
      )}


      {/* Auth Section */}
      {isLoggedIn && (
        <div style={{ position: 'relative' }}>

          {/* Avatar */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#c8f135',
              color: '#0f0f0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {initials}
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '140px',
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#c8f135',
                  background: 'transparent',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                👤 Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#ff6b6b',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;