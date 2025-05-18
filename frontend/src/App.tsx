import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ProductPage from './pages/ProductPage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import FavoritesPage from './pages/FavoritesPage';
import { FavoriteProvider } from './context/FavoriteContext'; 

function App() {
  return (
    <FavoriteProvider> 
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route 
            path="/favorites" 
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </FavoriteProvider>
  );
}

export default App;
