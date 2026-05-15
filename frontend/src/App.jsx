import { Routes, Route } from 'react-router-dom'
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import CreateAlbum from "./pages/CreateAlbum";
import Album from "./pages/Album";
import AlbumDetail from "./pages/AlbumDetail";
import UserProfile from "./pages/UserProfile";
import EditAlbum from "./pages/EditAlbum";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/new" element={<CreateAlbum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/albums" element={<Album apiUrl="/albums"  title="All Albums"  />} />
        <Route path="/my_albums" element={<Album apiUrl="/albums/my_albums" title="My Albums"  />} />
        <Route path="/albums/:id/edit" element={<EditAlbum />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;