import { useState, useEffect } from "react";
import DesktopIcons from "./features/desktop/components/DesktopIcons/DesktopIcons";
import Desktop from "./features/desktop/components/Desktop/Desktop";
import Taskbar from "./features/desktop/components/Taskbar/Taskbar";
import Start from "./features/desktop/components/Start/Start";
import Modal from "./components/Modal/Modal";
import { useWindowManagement } from "./features/desktop/hooks/useWindowManagement";
import { useClock } from "./hooks/useClock";
import { useShutdownSound } from "./hooks/useShutdownSound";

const App = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const { playShutdown } = useShutdownSound();
  const { formattedTime, formattedDate } = useClock();

  const windowMgmt = useWindowManagement(["about-me"]);

  const handleShutdown = () => {
    playShutdown();
    setShowShutdownModal(true);
    setShowStartMenu(false);
  };

  const handleShutdownConfirm = () => {
    setShowShutdownModal(false);
    // Show "safe to turn off" screen
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #000;
        color: #fff;
        font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
        font-size: 14pt;
      ">
        <img src="/assets/icons/w98_windows.ico" alt="" style="width: 64px; height: 64px; margin-bottom: 20px;" />
        <p>It is now safe to turn off your computer.</p>
      </div>
    `;
    // Close tab after 5 seconds
    setTimeout(() => {
      window.close();
    }, 5000);
  };

  return (
    <div className="win98-app">
      <div className="desktop-container">
        <DesktopIcons handleOpenWindow={windowMgmt.handleOpenWindow} />
        <Desktop
          {...windowMgmt}
        />
      </div>

      <Start
        showStartMenu={showStartMenu}
        setShowStartMenu={setShowStartMenu}
        handleOpenWindow={windowMgmt.handleOpenWindow}
        onShutdown={handleShutdown}
      />

      <Taskbar
        {...windowMgmt}
        setShowStartMenu={setShowStartMenu}
        showStartMenu={showStartMenu}
        time={formattedTime}
        date={formattedDate}
      />

      <Modal
        isOpen={showShutdownModal}
        title="Shut Down Computer"
        icon="/assets/icons/w98_shut_down_normal.ico"
        onClose={() => setShowShutdownModal(false)}
        width={380}
        height={110}
      >
        <div style={{ padding: '8px', textAlign: 'center' }}>
          <p style={{ marginBottom: '16px', fontSize: '8pt' }}>
            You can safely turn off your computer now.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button
              className="win98-btn"
              onClick={handleShutdownConfirm}
              style={{ padding: '4px 16px' }}
            >
              OK
            </button>
            <button
              className="win98-btn"
              onClick={() => setShowShutdownModal(false)}
              style={{ padding: '4px 16px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;