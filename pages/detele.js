export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { pairing, password } = req.body;
  const adminPassword = process.env.DELETE_SECRET;
  if (password !== adminPassword) {
    return res.status(401).json({ message: '❌ Password salah untuk hapus.' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'ZenOfficialcode.json';

  const getRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!getRes.ok) {
    return res.status(500).json({ message: 'Gagal membaca file dari GitHub' });
  }

  const current = await getRes.json();
  const sha = current.sha;
  const contentBuffer = Buffer.from(current.content, 'base64').toString();
  let json = {};
  try {
    json = JSON.parse(contentBuffer);
  } catch (e) {
    return res.status(500).json({ message: 'Format JSON rusak di repo.' });
  }

  if (!json.allowed_pairings || !json.allowed_pairings.includes(pairing)) {
    return res.status(400).json({ message: 'Nomor tidak ditemukan.' });
  }

  json.allowed_pairings = json.allowed_pairings.filter(p => p !== pairing);
  const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

  const updateRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Remove pairing ${pairing}`,
      content: newContent,
      branch,
      sha
    }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return res.status(500).json({ message: 'Gagal update file.', error: err });
  }

  return res.status(200).json({ message: '✅ Nomor berhasil dihapus.' });
    }
    
