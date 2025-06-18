export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, allowed_pairings } = req.body;

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO; // Format: user/repo
  const branch = process.env.GITHUB_BRANCH || 'main';

  const content = JSON.stringify({ password, allowed_pairings }, null, 2);
  const filename = `data-${Date.now()}.json`;

  const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filename}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add data file ${filename}`,
      content: Buffer.from(content).toString('base64'),
      branch,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    return res.status(500).json({ message: 'Upload failed', detail: err });
  }

  const data = await response.json();
  return res.status(200).json({ message: `Success! Uploaded to ${data.content.html_url}` });
    }
  
