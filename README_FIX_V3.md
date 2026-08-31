# ShopVannĐaiiVIP AUTH FIX V3

- Admin password uses a fixed server-side verifier; plaintext is not shipped to frontend.
- Registration auto-logs the user in.
- Login/register errors return explicit JSON instead of generic errors.
- Session cookies work on Render HTTPS and local HTTP.
- `/api/version` returns build `SHOPVANNDAIIVIP-AUTH-ORDERS-AIM-V7`.

After deploying, open `/api/version`; it must show `SHOPVANNDAIIVIP-AUTH-ORDERS-AIM-V7`. If it does not, Render is still serving an older deployment.
