import { useEffect, useState } from 'react';

export default function PairingsPage() {
  const [pairings, setPairings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState('');

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

  const handleDelete = async (pairing) => {
    const confirm = window.confirm(`Yakin ingin menghapus pairing ${pairing}?`);
    if (!confirm) return;

    const password = prompt("Masukkan password hapus pairing:");
    if (!password) return alert("❌ Password wajib diisi.");

    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        pairing_to_delete: pairing
      })
    });

    const data = await res.json();
    if (res.ok) {
      setPairings(pairings.filter(p => p !== pairing));
      alert('✅ Pairing berhasil dihapus!');
    } else {
      alert(data.message || '❌ Gagal menghapus pairing.');
    }
  };

  return (
    <main style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '1.5rem',
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
        <div style={{
          maxHeight: '350px',
          overflowY: 'auto',
          paddingRight: '5px',
          marginTop: '1rem'
        }}>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {pairings.map((num, i) => (
              <li key={i} style={{
                backgroundColor: '#f0f4ff',
                marginBottom: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{i + 1}. {num}</span>
                <button
                  onClick={() => handleDelete(num)}
                  style={{
                    marginLeft: '10px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#e53935',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}>
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tombol kembali */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
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
        
