import { useState } from 'react';
import '../styles/styles.css';

export default function Home() {
  const [password, setPassword] = useState('');
  const [pairings, setPairings] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        allowed_pairings: pairings.split(',').map(p => p.trim())
      }),
    });

    const data = await res.json();
    setStatus(data.message || 'Success!');
  };

  return (
    <main className="container">
      <h1>Add Data to GitHub</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <textarea placeholder="Allowed Pairings, pisahkan koma" value={pairings} onChange={e => setPairings(e.target.value)} required />
        <button type="submit">Kirim</button>
      </form>
      <p>{status}</p>
    </main>
  );
    }
                                                                             
