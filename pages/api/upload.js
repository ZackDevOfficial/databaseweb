export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    let { password, new_pairing } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = 'ZenOfficialcode.json';

    const pairing = new_pairing.trim().replace(/,$/, "");

    
    const correctPassword = process.env.PAIRING_ADD_PASSWORD;
    if (!password || password !== correctPassword) {
      return res.status(403).json({ message: '❌ Password salah. Akses ditolak.' });
    }

    if (!pairing || pairing === "") {
      return res.status(400).json({ message: '❌ Nomor tidak boleh kosong atau koma saja.' });
    }

    
    const getRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!getRes.ok) {
      const err = await getRes.json();
      return res.status(500).json({ message: 'Gagal membaca file', error: err });
    }

    const current = await getRes.json();
    const sha = current.sha;
    const contentBuffer = Buffer.from(current.content, 'base64').toString();
    let json = {};
    try {
      json = JSON.parse(contentBuffer);
    } catch (e) {
      return res.status(500).json({ message: 'Format JSON rusak di repo.', error: e.message });
    }

    if (!json.allowed_pairings) json.allowed_pairings = [];

    if (json.allowed_pairings.includes(pairing)) {
      return res.status(200).json({ message: '❗Nomor sudah terdaftar Yah Ganteng' });
    }

    
    json.allowed_pairings.push(pairing);

    const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString('base64');

    const updateRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add pairing ${pairing}`,
        content: newContent,
        branch,
        sha
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return res.status(500).json({ message: 'Gagal update file.', error: err });
    }

    return res.status(200).json({ message: '✅ Berhasil Menambah Nomer✓!' });
  } catch (err) {
    return res.status(500).json({ message: '❌ Terjadi kesalahan tak terduga.', error: err.message });
  }
                                                  }
    
