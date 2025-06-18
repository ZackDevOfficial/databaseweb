export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, new_pairing } = req.body;
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'ZenOfficialcode.json';

  // Get current file from GitHub
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

  if (!json.allowed_pairings) json.allowed_pairings = [];

  // Cek apakah sudah ada
  if (json.allowed_pairings.includes(new_pairing)) {
    return res.status(200).json({ message: '❗Nomor sudah terdaftar di GitHub.' });
  }

  // Tambahkan
  json.allowed_pairings.push(new_pairing);
  json.password = password;

  const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

  // Update kembali ke GitHub
  const updateRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add pairing ${new_pairing}`,
      content: newContent,
      branch,
      sha
    }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return res.status(500).json({ message: 'Gagal update file.', detail: err });
  }

  return res.status(200).json({ message: '✅ Sukses update' });
      }
    
