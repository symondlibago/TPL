const CLIENT_ID = process.env.MDI_CLIENT_ID || "727bf2a9-ffa8-4aa6-8d10-23029907e8c9";
const CLIENT_SECRET = process.env.MDI_CLIENT_SECRET || "Nv9EG1YSJDbzAl3DC8WCkyZxwBkpXgrOBeSFy6SS";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // STEP 1: Authenticate with explicit keys
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
    
    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    const mdi = (path, body) => fetch(`https://api.mdintegrations.com/v1/partner${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify(body)
    });
    let patientId = null;
    const p = req.body.patient;
    const consent = req.body.consent || null;
    if (p?.email) {
      try {
        for (const body of [{ search: p.email }, { search: p.email, is_sandbox: true }]) {
          if (patientId) break;
          const searchRes = await mdi('/patients/search', body);
          if (searchRes.ok) {
            const found = await searchRes.json();
            const list = Array.isArray(found) ? found : found.data || [];
            const match = list.find((x) => (x.email || '').toLowerCase() === p.email.toLowerCase());
            if (match) patientId = match.patient_id || match.id;
          }
        }
        // No existing record, and only contact info so far? Tell the client
        // to collect the medical profile (modal steps 2–3) — no voucher yet.
        const hasFullProfile = p.first_name && p.last_name && p.date_of_birth && p.gender &&
          p.address?.address && p.weight && p.height;
        if (!patientId && !hasFullProfile) {
          return res.status(200).json({ need_profile: true });
        }

        // Creating (vs re-using) a patient requires the full record — MDI
        // rejects creates without DOB, gender, address, weight, and height.
        if (!patientId && hasFullProfile) {
          const createRes = await mdi('/patients', {
            first_name: p.first_name,
            last_name: p.last_name,
            email: p.email,
            phone_number: p.phone_number || null,
            phone_type: 2,
            date_of_birth: p.date_of_birth,
            gender: p.gender,
            weight: p.weight,   // kg (converted client-side from lbs)
            height: p.height,   // cm (converted client-side from ft/in)
            address: {
              address: p.address.address,
              address2: p.address.address2 || null,
              zip_code: p.address.zip_code,
              city_name: p.address.city_name,
              state_name: p.address.state_name
            },
            is_sms_enabled: true,
            is_email_enabled: true,
            metadata: { ...(p.metadata || {}), consent }
          });
          if (createRes.ok) {
            const created = await createRes.json();
            patientId = created.patient_id || created.id || created.data?.patient_id || null;
          } else {
            console.error('MDI Patient Create Rejected:', await createRes.text());
          }
        }
      } catch (e) {
        console.error('MDI patient prefill failed:', e.message);
      }
    }
    if (consent && (patientId || p?.email)) {
      console.info('The Peptide Lounge consent:', JSON.stringify({
        patient_id: patientId,
        email: p?.email || null,
        ...consent,
      }));
    }

    // STEP 3: Generate Voucher (bound to the patient when we have one)
    const voucherResponse = await mdi('/vouchers', {
      hold_status: true,
      patient_id: patientId,
      questionnaire_id: req.body.questionnaire_id,
      case_offerings: [],
      disease: []
    });

    if (!voucherResponse.ok) {
      const errText = await voucherResponse.text();
      console.error("MDI Voucher Rejected:", errText);
      return res.status(500).json({ error: "Voucher Failed", details: errText });
    }

    const voucherData = await voucherResponse.json();
    return res.status(200).json({ ...voucherData, patient_id: patientId, prefill: !!patientId });

  } catch (error) {
    console.error("Internal API Error:", error.message);
    return res.status(500).json({ error: 'Catch Block Triggered', details: error.message });
  }
}