import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFAB from './components/WhatsAppFAB'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/a-propos" element={<About />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    </BrowserRouter>
  )
}
