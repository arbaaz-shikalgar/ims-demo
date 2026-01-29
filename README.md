# ims-demo

- Copyright © Arbaaz Shikalgar's Property - All Rights Reserved
-
- Proprietary and confidential
-
- Business layer for IMS
-
- @summary Business Layer : API Integration for IMS::
- @author ARBAAZ SHIKALGAR (arbazshikalgar@gmail.com)

## Mail setup

This project supports sending invoices via email. Configuration options:

- Preferred: **SendGrid API** — set `SENDGRID_API_KEY` in server environment.
- Alternative: SMTP — set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (e.g., SendGrid SMTP user `apikey` + API key as password).
- Development fallback: no envs set → the server uses Nodemailer Ethereal and returns a preview URL.

Add `.env` (from `.env.example`) on the server and restart `ims-api` to apply settings.

Test transport status via GraphQL:

```
query { transportStatus { provider configured detail } }
```

To test sending, open GraphiQL at `http://localhost:4300/graphql` and run the `sendMail` mutation (or use the UI Send Mail modal).

