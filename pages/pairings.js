export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

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
  const contentBuffer = Buffer.from(current.content, 'base64').toString();
  let json = {};
  try {
    json = JSON.parse(contentBuffer);
  } catch (e) {
    return res.status(500).json({ message: 'Format JSON rusak di repo.' });
  }

  return res.status(200).json({ allowed_pairings: json.allowed_pairings || [] });
    }
                                 
