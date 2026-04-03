import { useState } from 'react'
import './App.css'
import logoSvg from './assets/logo.svg'
import pizzaPlate from './assets/pizza-plate.png'
import plateClean from './assets/plate-clean.png'
import pizzaSlice from './assets/pizza-slice.png'
import EraserReveal from './EraserReveal'

function App() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [sliceSlid, setSliceSlid] = useState(false)
  const [eraseTriggered, setEraseTriggered] = useState(false)
  const [overlayKey, setOverlayKey] = useState(0)

  const openOverlay = () => {
    setSliceSlid(false)
    setEraseTriggered(false)
    setOverlayKey((k) => k + 1)
    setOverlayOpen(true)
    // Slice slides after spin-in
    setTimeout(() => setSliceSlid(true), 700)
    // Erase dirty plate after slice is gone
    setTimeout(() => setEraseTriggered(true), 2200)
  }

  const closeOverlay = () => {
    setOverlayOpen(false)
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
          <button className="nav-item" onClick={openOverlay}>Menu</button>
          <button className="nav-item" onClick={openOverlay}>Pop-ups</button>
        </div>
        <div className="nav-col right">
          <button className="nav-item" onClick={openOverlay}>Booking</button>
          <button className="nav-item" onClick={openOverlay}>Contact</button>
        </div>
      </nav>

      {/* PIZZA PLATE OVERLAY */}
      {overlayOpen && (
        <div className="plate-overlay" onClick={closeOverlay}>
          <div className="plate-container" key={overlayKey}>
            {/* Eraser reveal: dirty plate erases to show clean plate */}
            <EraserReveal
              topSrc={pizzaPlate}
              bottomSrc={plateClean}
              size="100%"
              trigger={eraseTriggered}
            />

            {/* Pizza slice — top layer */}
            <img
              src={pizzaSlice}
              alt="Pizza slice"
              className={`slice-image ${sliceSlid ? 'slid' : ''}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
