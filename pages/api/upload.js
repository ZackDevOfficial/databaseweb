export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, allowed_pairings } = req.body;

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  const content = JSON.stringify({ password, allowed_pairings }, null, 2);
  const encodedContent = Buffer.from(content).toString('base64');
  const filePath = 'ZenOfficialcode.json';

  // STEP 1: Get SHA for update
  const getRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const current = await getRes.json();
  const sha = current.sha;

  // STEP 2: Push update
  const updateRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `🔁 Update ZenOfficialcode.json`,
      content: encodedContent,
      branch,
      sha
    }),
  });

  if (!updateRes.ok) {
    const error = await updateRes.json();
    return res.status(500).json({ message: '❌ Update gagal', detail: error });
  }

  const data = await updateRes.json();
  return res.status(200).json({ message: `✅ Sukses diupdate: ${data.content.html_url}` });
}
  
