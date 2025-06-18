export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'ZenOfficialcode.json';

  if (!githubToken || !githubRepo) {
    return res.status(500).json({
      message: '❌ Environment variable tidak lengkap',
      detail: {
        GITHUB_TOKEN: !!githubToken,
        GITHUB_REPO: !!githubRepo
      }
    });
  }

  try {
    const url = `https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const status = response.status;
    const text = await response.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        message: '❌ Gagal parse respon dari GitHub',
        status,
        raw: text,
      });
    }

    if (!response.ok) {
      return res.status(status).json({
        message: '❌ Gagal mengambil file dari GitHub',
        detail: parsed,
        url,
        repo: githubRepo,
        branch,
      });
    }

    const decoded = Buffer.from(parsed.content, 'base64').toString();
    const json = JSON.parse(decoded);

    return res.status(200).json({ allowed_pairings: json.allowed_pairings || [] });

  } catch (err) {
    return res.status(500).json({
      message: '❌ Unexpected server error',
      error: err.message,
    });
  }
}
