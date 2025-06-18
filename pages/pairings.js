import { useEffect, useState } from 'react';

export default function PairingsPage() {
  const [pairings, setPairings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairings = async () => {
      try {
        const res = await fetch('/api/pairings');
        const data = await res.json();
        if (res.ok || data.allowed_pairings) {
          setPairings(data.allowed_pairings || []);
        } else {
          setError(data.message || 'Gagal ambil data');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPairings();
  }, []);

  return (
    <main style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1e88e5' }}>📋 Daftar Pairing</h1>

      {loading ? (
        <p>⏳ Memuat...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : pairings.length === 0 ? (
        <p>Tidak ada pairing ditemukan.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {pairings.map((num, i) => (
            <li key={i} style={{
              backgroundColor: '#f0f4ff',
              marginBottom: '10px',
              padding: '10px 15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{i + 1}.</span> {num}
            </li>
          ))}
        </ul>
      )}

      {/* Tombol kembali */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ⬅️ Kembali ke Beranda
          </button>
        </a>
      </div>
    </main>
  );
  }
