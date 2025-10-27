import { useState } from 'react';
import JamSession from './JamSession';
import Modal from './Modal';
import type { Session } from '../types/session';
import '../styles/global.css';

/**
 * App - The ROOT
 * 
 * Manages the flow: Landing → Jamming → Review
 */
function App() {
  const [mode, setMode] = useState<'landing' | 'jamming' | 'review'>('landing');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const handleStartJam = async () => {
    setMode('jamming');
  };

  const handleStopJam = (session: Session) => {
    setCurrentSession(session);
    setMode('review');
  };

  const handleNewJam = () => {
    setCurrentSession(null);
    setMode('jamming');
  };

  const handleBackToLanding = () => {
    setMode('landing');
  };

  return (
    <div className="app">
      {mode === 'landing' && (
        <Modal mode="landing" onStartJam={handleStartJam} />
      )}
      
      {mode === 'jamming' && (
        <JamSession onStop={handleStopJam} />
      )}
      
      {mode === 'review' && currentSession && (
        <Modal
          mode="review"
          session={currentSession}
          onNewJam={handleNewJam}
          onBackToLanding={handleBackToLanding}
        />
      )}
    </div>
  );
}

export default App;

