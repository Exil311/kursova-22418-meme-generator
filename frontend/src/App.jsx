import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [memes, setMemes] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [imageUrl, setImageUrl] = useState('https://i.imgflip.com/1g8my4.jpg');
  const [topText, setTopText] = useState('KOGATO DOKERA TRUGNE');
  const [bottomText, setBottomText] = useState('OT PURVIQ PUT');
  const [selectedMeme, setSelectedMeme] = useState(null);

  useEffect(() => {
    if (activeTab === 'gallery') fetchMemes();
  }, [activeTab]);

  const fetchMemes = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/memes`);
      const data = await res.json();
      setMemes(data);
    } catch (e) {
      console.error('Greshka pri vzimane na memeta', e);
    }
  };

  const saveMeme = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/memes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, top_text: topText, bottom_text: bottomText })
      });
      setTopText('');
      setBottomText('');
      setActiveTab('gallery');
    } catch (e) {
      console.error('Greshka pri zapis', e);
    }
  };

  const deleteMeme = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/memes/${id}`, { method: 'DELETE' });
      setMemes(prev => prev.filter(m => m.id !== id));
      setSelectedMeme(null);
    } catch (e) {
      console.error('Greshka pri triene', e);
    }
  };

  return (
    <>
      <header className="apple-header">
        <h1>Misho Kursova - Meme Creator</h1>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 80px' }}>

        {/* TABOVE */}
        <div className="tabs-container">
          <div className="tabs">
            <button className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
              Suzdai Meme
            </button>
            <button className={`tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
              Mystery Gallery
            </button>
          </div>
        </div>

        {/* TAB: SUZDAI MEME */}
        {activeTab === 'create' && (
          <div className="flex-container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

            {/* OPZII PANEL */}
            <div className="apple-panel" style={{ flex: '0 1 440px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '28px' }}>Nova Tvorba</h2>
              <form onSubmit={saveMeme} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label>URL na Kartinkata</label>
                  <input type="text" className="input-field" value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label>Goren Text</label>
                  <input type="text" className="input-field" value={topText}
                    onChange={e => setTopText(e.target.value)} placeholder="GOREN TEKST..." />
                </div>
                <div>
                  <label>Dolen Text</label>
                  <input type="text" className="input-field" value={bottomText}
                    onChange={e => setBottomText(e.target.value)} placeholder="DOLEN TEKST..." />
                </div>
                <button type="submit" className="btn" style={{ marginTop: '12px' }}>
                  Zapazi v Mystery Gallery
                </button>
              </form>
            </div>

            {/* LIVE PREVIEW */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
              <div className="meme-frame">
                {imageUrl
                  ? <img src={imageUrl} alt="preview" className="meme-image" onError={e => e.target.src = 'https://i.imgflip.com/1ur9b0.jpg'} />
                  : <span style={{ color: 'var(--text-secondary)' }}>Lipsvа snimka</span>
                }
                <h2 className="meme-text top">{topText}</h2>
                <h2 className="meme-text bottom">{bottomText}</h2>
              </div>
            </div>

          </div>
        )}

        {/* TAB: MYSTERY GALLERY */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '600' }}>Mystery Gallery</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '17px' }}>
                Vsqka kutiq krie iznenada. Klikni za da razkriesh.
              </p>
            </div>

            {memes.length === 0
              ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎁</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '17px', marginBottom: '32px' }}>Nqma nishto tuk oshte.</p>
                  <button className="btn" style={{ width: 'auto', padding: '14px 32px' }} onClick={() => setActiveTab('create')}>
                    Napravi parvoto si meme
                  </button>
                </div>
              ) : (
                <div className="gallery-grid">
                  {memes.slice().reverse().map(meme => (
                    <div key={meme.id} className="mystery-box" onClick={() => setSelectedMeme(meme)}>
                      <div className="mystery-icon">🎁</div>
                      <div className="mystery-text">Otvori me</div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* FULLSCREEN MODAL */}
      {selectedMeme && (
        <div className="modal-overlay" onClick={() => setSelectedMeme(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="meme-frame">
              <img src={selectedMeme.image_url} alt="meme" className="meme-image" />
              <h2 className="meme-text top">{selectedMeme.top_text}</h2>
              <h2 className="meme-text bottom">{selectedMeme.bottom_text}</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setSelectedMeme(null)}>Zatvori</button>
              <button className="btn-delete" style={{ flex: 1 }} onClick={() => deleteMeme(selectedMeme.id)}>Iztrii</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
