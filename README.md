# TTN Webhook Handler for EW Shepherd

Auto-responds to LoRaWAN network stats requests by sending downlinks.

## Deploy to Vercel

1. Push this folder to GitHub
2. Go to https://vercel.com
3. Import the GitHub repository
4. Add environment variable: `TTN_API_KEY`
5. Deploy!

## Webhook URL

After deployment, your webhook URL will be:
```
https://your-project-name.vercel.app/api/webhook
```

## TTN Configuration

Use this URL in TTN Console > Webhooks > Custom Webhook > Base URL