import type { Session } from '../types/session';

interface ModalProps {
  mode: 'landing' | 'review';
  session?: Session;
  onStartJam?: () => void;
  onNewJam?: () => void;
  onBackToLanding?: () => void;
}

/**
 * Modal - The Gateway
 * 
 * Landing: Welcome to wonder
 * Review: Cherish the chaos
 */
function Modal({ mode, session, onStartJam, onNewJam, onBackToLanding }: ModalProps) {
  if (mode === 'landing') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h1 className="modal-title">👶 BabyTime 🎨</h1>
          <p className="modal-subtitle">Where keyboard mashing becomes ART</p>
          
          <div className="modal-description">
            <p>Every key does something MAGICAL</p>
            <p>Shapes! Colors! Sounds! CHAOS!</p>
            <p>Just mash the keyboard and CREATE</p>
          </div>

          <button className="modal-button primary" onClick={onStartJam}>
            START JAM 🎵
          </button>

          <div className="modal-hint">
            (Hold ESCAPE for 5 seconds to exit)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1 className="modal-title">✨ Your Masterpiece ✨</h1>
        
        {session && (
          <div className="session-info">
            <p>Duration: {Math.floor(session.duration)} seconds</p>
            <p>Seed: {session.seed}</p>
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-button primary" onClick={onNewJam}>
            🎨 START NEW JAM
          </button>
          
          <button className="modal-button" onClick={onBackToLanding}>
            🏠 BACK TO HOME
          </button>
        </div>

        <div className="modal-hint">
          Your creation is now part of the universe ✨
        </div>
      </div>
    </div>
  );
}

export default Modal;

