import { useEffect, useState } from 'react';
import '../styles/styles.css';

export default function Home() {
  const [password, setPassword] = useState('');
  const [pairings, setPairings] = useState('');
  const [status, setStatus] = useState('');
  const [list, setList] = useState([]);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    fetchPairings();
  }, []);

  const fetchPairings = async () => {
    try {
      const res = await fetch('/api/pairings');
      const data = await res.json();
      if (data.allowed_pairings) {
        setList(data.allowed_pairings);
      }
    } catch {
      setStatus('⚠️ Gagal mengambil daftar pairing.');
    }
  };

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
    fetchPairings();
  };

  const handleDelete = async (number) => {
    const confirm = window.confirm(`Hapus nomor ${number}?`);
    if (!confirm) return;
    const res = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pairing: number,
        password: deletePassword
      }),
    });
    const data = await res.json();
    setStatus(data.message);
    fetchPairings();
  };

  return (
    <main className="container">
      <h1>Add Data to GitHub</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Password (untuk tambah)" value={password} onChange={e => setPassword(e.target.value)} required />
        <textarea placeholder="Masukkan 1 nomor pairing" value={pairings} onChange={e => setPairings(e.target.value)} required />
        <button type="submit">Kirim</button>
      </form>

      <h2>Daftar Pairing:</h2>
      <input type="password" placeholder="Password Hapus" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} />
      <ul>
        {list.map((item, i) => (
          <li key={i} style={{ marginBottom: '6px' }}>
            {item}
            <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(item)}>Hapus</button>
          </li>
        ))}
      </ul>

      <p>{status}</p>
    </main>
  );
      }
    
