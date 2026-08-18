import { useRef, useState } from "react";

const CSWindow = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    setMuted(prev => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#000',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <video
        ref={videoRef}
        src="/assets/videos/cs16.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          background: '#000',
        }}
      />

      {/* Unmute button overlay */}
      <button
        onClick={toggleMute}
        title={muted ? "Enable sound" : "Mute"}
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid #555',
          color: '#fff',
          fontSize: '8pt',
          padding: '4px 10px',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {muted ? '🔇 Click for sound' : '🔊 Sound on'}
      </button>
    </div>
  );
};

export default CSWindow;
