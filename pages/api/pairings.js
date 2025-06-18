import { useEffect, useState } from 'react';

export default function PairingListPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPairings = async () => {
      try {
        const res = await fetch('/api/pairings');
        const result = await res.json();
        if (res.ok) {
          setData(result.allowed_pairings);
        } else {
          throw new Error(result.message || 'Gagal ambil data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPairings();
  }, []);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#1e88e5',
        marginBottom: '1.5rem',
        fontWeight: 700,
      }}>📋 Daftar Pairing Aktif</h1>

      {loading && <p>Loading daftar pairing...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((number, index) => (
          <li
            key={index}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ccc',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontSize: '1rem',
              fontWeight: '500',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontWeight: 700, color: '#444' }}>{index + 1}.</span> {number}
          </li>
        ))}
      </ul>
    </div>
  );
    }
        
