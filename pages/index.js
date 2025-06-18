import { useState } from 'react';

export default function Home() {
  const [password, setPassword] = useState('');
  const [pairings, setPairings] = useState('');
  const [status, setStatus] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Mengirim...');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        new_pairing: pairings.trim()
      }),
    });
    const data = await res.json();
    setStatus(data.message || 'Success!');
    setPairings('');
  };

  return (
    <main style={{ maxWidth: 400, margin: '30px auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#0070f3' }}>AddDatabase By ZenOfficial</h1>

      {/* 🔒 Form Tambah */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Password (untuk tambah)" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, marginBottom: 10 }} />
        <textarea placeholder="Masukkan 1 nomor pairing" value={pairings} onChange={e => setPairings(e.target.value)} required style={{ width: '100%', padding: 10, marginBottom: 10 }} />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#0070f3', color: 'white', border: 'none' }}>Kirim</button>
      </form>

      {/* 🔗 Tombol ke halaman pairings */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/pairings">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📋 Lihat Semua Pairing
          </button>
        </a>
      </div>

      {/* ✅ Status */}
      <p style={{ color: 'green' }}>{status}</p>
    </main>
  );
        }
        
