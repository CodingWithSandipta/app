import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/index.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 50%, #ffd4e8 100%)',
      fontFamily: 'Arial, sans-serif',
      color: '#e91e63'
    }}>
      <p>Loading your special message...</p>
    </div>
  );
}

export default App;
