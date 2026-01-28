import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import Error404 from './pages/Error/Error404'
import About from './pages/About/About'
import Catalog from './pages/Catalog/Catalog'
import Contacts from './pages/Contacts/Contacts'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ItemPage from './pages/ItemPage/ItemPage'
import Cart from './pages/Cart/Cart'

function App() {

  return (
    <>

      <BrowserRouter>
        <div>
          <Header />
          <div className="page">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="*" element={<Error404 />} />
              <Route path="/about.html" element={<About />} />
              <Route path="/catalog.html" element={<Catalog />} />
              <Route path="/contacts.html" element={<Contacts />} />
              <Route path="/catalog/:id.html" element={<ItemPage />} />
              <Route path="/cart.html" element={<Cart />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App