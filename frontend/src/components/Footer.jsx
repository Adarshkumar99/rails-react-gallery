import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ background: '#0f0f0f', color: '#888', padding: '2rem 2rem 1.5rem' }}>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-4 pb-4"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        
        {/* Brand */}
        <div>
          <Link to="/" className="text-decoration-none fw-bold fs-5 text-white d-block mb-1">
            Album<span style={{ color: '#c8f135' }}>.</span>
          </Link>
          <p style={{ fontSize: '0.8rem', color: '#555', maxWidth: '180px' }}>
            Discover and collect the best music albums.
          </p>
        </div>

        {/* Links */}
        <div className="d-flex gap-5 flex-wrap">
          {[
            { title: 'Navigate', links: [['Home', '/'], ['All Albums', '/albums']] },
            { title: 'Account', links: [['Login', '/login'], ['Sign Up', '/signup']] },
            { title: 'Company', links: [['About', '/about'], ['Privacy', '/privacy']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h6 className="text-white mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {title}
              </h6>
              <ul className="list-unstyled">
                {links.map(([label, path]) => (
                  <li key={label} className="mb-1">
                    <Link to={path} className="text-decoration-none" style={{ color: '#666', fontSize: '0.82rem' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-3 flex-wrap gap-2">
        <p className="mb-0" style={{ fontSize: '0.78rem', color: '#444' }}>
          © 2026 Album. All rights reserved.
        </p>
        <div className="d-flex gap-2">
          {['React', 'Bootstrap'].map(t => (
            <span key={t} className="rounded-pill px-2 py-1"
              style={{ fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.1)', color: '#555' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;