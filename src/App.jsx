import { useState, useEffect } from 'react'
import './App.css'
import logoSvg from './assets/logo.svg'
import pizzaPlate from './assets/pizza-plate.png'
import plateClean from './assets/plate-clean.png'
import pizzaSlice from './assets/pizza-slice.png'
import phonePng from './assets/phone.png'
import orderslipPng from './assets/orderslip.png'
import EraserReveal from './EraserReveal'
import dylelipng from './assets/dyleli.png'

// Preload all images so animations are smooth on first run
function usePreloadAssets(srcs) {
  useEffect(() => {
    srcs.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])
}

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [text])

  return (
    <p className="typewriter-text">
      {displayed}<span className="typewriter-cursor">|</span>
    </p>
  )
}

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
  const [menuRevealed, setMenuRevealed] = useState(false)
  const [overlayKey, setOverlayKey] = useState(0)

  usePreloadAssets([pizzaPlate, plateClean, pizzaSlice, phonePng, orderslipPng, dylelipng, logoSvg])

  const anyOpen = menuOpen || popupsOpen || contactOpen || bookingOpen

  const closeAll = () => {
    setMenuOpen(false)
    setPopupsOpen(false)
    setContactOpen(false)
    setBookingOpen(false)
    setSliceSlid(false)
    setEraseTriggered(false)
    setMenuRevealed(false)
  }

  const openPlateOverlay = (setter) => {
    closeAll()
    setSliceSlid(false)
    setEraseTriggered(false)
    setMenuRevealed(false)
    setOverlayKey((k) => k + 1)
    setter(true)
    setTimeout(() => setSliceSlid(true), 700)
    setTimeout(() => setEraseTriggered(true), 2200)
    setTimeout(() => setMenuRevealed(true), 2200)
  }

  const openSimpleOverlay = (setter) => {
    closeAll()
    setter(true)
  }

  return (
    <div className="page">
      {/* TOP INFO */}
      <div className="top-info">
        <div className="top-row">
          <span>Big Tomato</span>
          <span className="est-desktop">Est. 2026</span>
          <span className="est-mobile">2026</span>
        </div>
      </div>

      {/* CENTER LOGO — hidden when any overlay is open */}
      <div className={`center-logo ${anyOpen ? 'logo-hidden' : ''}`}>
        <div className="logo-icon">
          <img src={logoSvg} alt="Big Tomato logo" />
        </div>
      </div>

      {/* BOTTOM NAV — always on top so you can click through overlays */}
      <nav className="bottom-nav">
        <div className="nav-col left">
          <button className="nav-item" onClick={() => openPlateOverlay(setMenuOpen)}>Menu</button>
          <button className="nav-item" onClick={() => openPlateOverlay(setPopupsOpen)}>Pop-ups</button>
        </div>
        <div className="nav-col right">
          <button className="nav-item" onClick={() => openSimpleOverlay(setBookingOpen)}>Booking</button>
          <button className="nav-item" onClick={() => openSimpleOverlay(setContactOpen)}>Contact</button>
        </div>
      </nav>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div className="plate-overlay" onClick={closeAll}>
          <div className="plate-container" key={overlayKey} onClick={(e) => e.stopPropagation()}>
            <EraserReveal
              topSrc={pizzaPlate}
              bottomSrc={plateClean}
              size="100%"
              trigger={eraseTriggered}
            >
              {menuRevealed && (
                <div className="plate-menu visible">
                  {menuItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </EraserReveal>
            <img
              src={pizzaSlice}
              alt="Pizza slice"
              className={`slice-image ${sliceSlid ? 'slid' : ''}`}
            />
          </div>
        </div>
      )}

      {/* POP-UPS OVERLAY */}
      {popupsOpen && (
        <div className="contact-overlay" onClick={closeAll}>
          <div className="contact-container popups-container" onClick={(e) => e.stopPropagation()}>
            <img src={dylelipng} alt="Dyl and Eli" className="dyleli-img" />
            <Typewriter text="Pop-up dates coming soon." />
          </div>
        </div>
      )}

      {/* BOOKING OVERLAY */}
      {bookingOpen && (
        <div className="contact-overlay" onClick={closeAll}>
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
        <div className="contact-overlay" onClick={closeAll}>
          <div className="contact-container" onClick={(e) => e.stopPropagation()}>
            <img src={phonePng} alt="Phone" className="contact-phone" />
            <div className="contact-info">
              <a href="tel:+13104252906">(310) 425-2906</a>
              <a href="mailto:hello@bigtamato.co">hello@bigtamato.co</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
