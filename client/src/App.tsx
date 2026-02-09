
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LiveView from './views/LiveView.tsx';
import ManagerView from './views/ManagerView.tsx';
import { MusicProvider } from './contexts/MusicContext.tsx';

function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-white font-sans">
          <nav className="border-b border-white/10 p-4 flex gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DJ Graph Flow
            </h1>
            <Link to="/" className="hover:text-primary transition">Live</Link>
            <Link to="/manager" className="hover:text-primary transition">Manager</Link>
          </nav>

          <main className="p-4">
            <Routes>
              <Route path="/" element={<LiveView />} />
              <Route path="/manager" element={<ManagerView />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MusicProvider>
  );
}

export default App;
