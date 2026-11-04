# Mivida Boulevard commercial landing page

## Setup before running ads (about 10 minutes)

### 1. Save leads to a Google Sheet
1. Create a new Google Sheet, then open **Extensions → Apps Script**.
2. Replace the code with the contents of `google-apps-script.gs`. Optionally set `NOTIFY_EMAIL`. Save.
3. Click **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Deploy and approve the permissions.
4. Copy the Web app URL (`https://script.google.com/macros/s/.../exec`).
5. In `index.html`, paste that URL into `CONFIG.LEAD_ENDPOINT`.

Until `LEAD_ENDPOINT` is set, the form falls back to WhatsApp and **no Google Ads conversion is recorded**.

### 2. Google Ads
- The lead conversion (`CONFIG.LEAD_CONVERSION`) fires only after the Sheet confirms the lead was saved.
- In Google Ads, go to **Goals → Conversions → Settings** and turn on **Enhanced conversions for web**, using the Google tag method.
- Optional: create two more conversion actions, "Call click" and "WhatsApp click". Paste their `send_to` values into `CONFIG.CALL_CONVERSION` and `CONFIG.WHATSAPP_CONVERSION`. Set them as **Secondary** if you only want to bid on form leads.

### 3. Test
Submit the form once with a test number. Then check that a row appears in the Sheet, and that the conversion shows in Google Tag Assistant or in Google Ads under **Diagnostics**.

## Files
- `index.html`: the landing page
- `privacy.html`: the privacy policy (required by Google Ads for lead forms)
- `images/`: page images, including the social share image (`og.jpg`)
- `google-apps-script.gs`: the lead receiver for Google Sheets
