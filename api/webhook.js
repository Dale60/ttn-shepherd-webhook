// TTN Webhook Handler for Vercel
// Place this in: /api/webhook.js

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('Received TTN webhook:', JSON.stringify(body));

    // Check for port 90 uplink
    if (body.uplink_message?.f_port === 90) {
      const payload = Buffer.from(body.uplink_message.frm_payload, 'base64');
      
      // Check for stats request (0x01)
      if (payload[0] === 0x01) {
        console.log('Network stats request detected');
        
        const appId = body.end_device_ids.application_ids.application_id;
        const deviceId = body.end_device_ids.device_id;
        
        // Send downlink via TTN API
        const response = await fetch(
          `https://eu1.cloud.thethings.network/api/v3/as/applications/${appId}/devices/${deviceId}/down/push`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.TTN_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              downlinks: [{
                f_port: 91,
                frm_payload: Buffer.from([0x01]).toString('base64'),
                priority: "NORMAL"
              }]
            })
          }
        );
        
        if (!response.ok) {
          const error = await response.text();
          console.error('Downlink failed:', error);
          return res.status(500).json({ error: 'Failed to queue downlink' });
        }
        
        return res.status(200).json({ message: 'Downlink queued for stats refresh' });
      }
    }
    
    return res.status(200).json({ message: 'OK' });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}