const CLIENT_ID = process.env.MDI_CLIENT_ID || "727bf2a9-ffa8-4aa6-8d10-23029907e8c9";
const CLIENT_SECRET = process.env.MDI_CLIENT_SECRET || "Nv9EG1YSJDbzAl3DC8WCkyZxwBkpXgrOBeSFy6SS";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const caseId = req.body?.case_id;
  if (!caseId) {
    return res.status(400).json({ error: 'case_id is required' });
  }

  try {
    const authResponse = await fetch('https://api.mdintegrations.com/v1/partner/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "*"
      })
    });

    if (!authResponse.ok) {
      const errText = await authResponse.text();
      console.error("MDI Auth Rejected:", errText);
      return res.status(500).json({ error: "Auth Failed", details: errText });
    }

    const { access_token } = await authResponse.json();

    const releaseResponse = await fetch(
      `https://api.mdintegrations.com/v1/partner/cases/${encodeURIComponent(caseId)}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ hold_status: false })
      }
    );

    if (!releaseResponse.ok) {
      const errText = await releaseResponse.text();
      console.error("MDI Release Rejected:", errText);
      return res.status(500).json({ error: "Release Failed", details: errText });
    }

    return res.status(200).json({ released: true, case_id: caseId });

  } catch (error) {
    console.error("Internal API Error:", error.message);
    return res.status(500).json({ error: 'Catch Block Triggered', details: error.message });
  }
}
