import Pet from "./pages/pet";
import "./App.css";
import "./theme.css";
import "./antd.css";
import { CursorProvider } from "./providers/CursorProvider";
import { useEffect } from "react";
import { HashRouter } from 'react-router-dom'
import { StorageProvider } from "./providers/StorageProvider";
import { useTray } from "./hooks/useTray";
import { getCurrentWindow } from '@tauri-apps/api/window';
import Layout from "./Layout";

function App() {
  const { createTray } = useTray()

  useEffect(() => {
    const window = getCurrentWindow();
    const label = window.label;
    if (label === 'main') {
      createTray()
    }
  }, [])

  return (
    <HashRouter>
      <StorageProvider>
        <CursorProvider>
          <Layout />
        </CursorProvider>
      </StorageProvider>
    </HashRouter>
  );
}

export default App;
