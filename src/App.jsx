import { useState } from 'react'
import './App.css'
import logoSvg from './assets/logo.svg'
import pizzaPlate from './assets/pizza-plate.png'
import plateClean from './assets/plate-clean.png'
import pizzaSlice from './assets/pizza-slice.png'
import phonePng from './assets/phone.png'
import orderslipPng from './assets/orderslip.png'
import EraserReveal from './EraserReveal'
import HandwrittenMenu from './HandwrittenMenu'

const menuItems = [
  'Margherita',
  'Pepperoni',
  'Green pie',
  'Butter chicken',
  'Preserved lemon',
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [popupsOpen, setPopupsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [sliceSlid, setSliceSlid] = useState(false)
  const [eraseTriggered, setEraseTriggered] = useState(false)
  const [handwritingTriggered, setHandwritingTriggered] = useState(false)
  const [overlayKey, setOverlayKey] = useState(0)

  const openPlateOverlay = (setter) => {
    setSliceSlid(false)
    setEraseTriggered(false)
    setHandwritingTriggered(false)
    setOverlayKey((k) => k + 1)
    setter(true)
    setTimeout(() => setSliceSlid(true), 700)
    setTimeout(() => setEraseTriggered(true), 2200)
    // Handwriting starts after erase finishes (~2200 + 1500ms erase)
    setTimeout(() => setHandwritingTriggered(true), 3800)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setSliceSlid(false)
    setEraseTriggered(false)
    setHandwritingTriggered(false)
  }

  const closePopups = () => {
    setPopupsOpen(false)
    setSliceSlid(false)
    setEraseTriggered(false)
  }

  return (
    <div className="page">
      {/* TOP INFO */}
      <div className="top-info">
        <div className="top-row">
          <span>Big Tomato</span>
          <span>Est. 2026</span>
        </div>
      </div>

      {/* CENTER LOGO */}
      <div className="center-logo">
        <div className="logo-icon">
          <img src={logoSvg} alt="Big Tomato logo" />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <div className="nav-col left">
          <button className="nav-item" onClick={() => openPlateOverlay(setMenuOpen)}>Menu</button>
          <button className="nav-item" onClick={() => openPlateOverlay(setPopupsOpen)}>Pop-ups</button>
        </div>
        <div className="nav-col right">
          <button className="nav-item" onClick={() => setBookingOpen(true)}>Booking</button>
          <button className="nav-item" onClick={() => setContactOpen(true)}>Contact</button>
        </div>
      </nav>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="plate-overlay" onClick={closeMenu}>
          <div className="plate-container" key={overlayKey}>
            <EraserReveal
              topSrc={pizzaPlate}
              bottomSrc={plateClean}
              size="100%"
              trigger={eraseTriggered}
            />
            <img
              src={pizzaSlice}
              alt="Pizza slice"
              className={`slice-image ${sliceSlid ? 'slid' : ''}`}
            />
            <HandwrittenMenu
              trigger={handwritingTriggered}
              items={menuItems}
            />
          </div>
        </div>
      )}

      {/* POP-UPS OVERLAY */}
      {popupsOpen && (
        <div className="plate-overlay" onClick={closePopups}>
          <div className="plate-container" key={overlayKey}>
            <EraserReveal
              topSrc={pizzaPlate}
              bottomSrc={plateClean}
              size="100%"
              trigger={eraseTriggered}
            />
            <img
              src={pizzaSlice}
              alt="Pizza slice"
              className={`slice-image ${sliceSlid ? 'slid' : ''}`}
            />
          </div>
        </div>
      )}

      {/* BOOKING OVERLAY */}
      {bookingOpen && (
        <div className="contact-overlay" onClick={() => setBookingOpen(false)}>
          <div className="contact-container" onClick={(e) => e.stopPropagation()}>
            <img src={orderslipPng} alt="Order slip" className="booking-slip" />
            <div className="contact-info">
              <span className="booking-label">Email us</span>
              <a href="mailto:booking@bigtomato.com">booking@bigtomato.com</a>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT OVERLAY */}
      {contactOpen && (
        <div className="contact-overlay" onClick={() => setContactOpen(false)}>
          <div className="contact-container" onClick={(e) => e.stopPropagation()}>
            <img src={phonePng} alt="Phone" className="contact-phone" />
            <div className="contact-info">
              <a href="tel:+12125551234">(212) 555-1234</a>
              <a href="mailto:hello@bigtomato.com">hello@bigtomato.com</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
