import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Venues from './pages/Venues'
import VenueDetail from './pages/VenueDetail'
import Login from './pages/Login'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import BookingConfirmation from './pages/BookingConfirmation'
import BookingDetail from './pages/BookingDetail'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/my-bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
          <Route path="/booking-confirmation/:id" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
