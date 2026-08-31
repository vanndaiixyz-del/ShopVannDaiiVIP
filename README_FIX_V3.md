# ShopVannĐaiiVIP AUTH FIX V3

- Admin password is fixed to `VDVIP`.
- Registration auto-logs the user in.
- Login/register errors return explicit JSON instead of generic errors.
- Session cookies work on Render HTTPS and local HTTP.
- `/api/version` returns build `AUTH-FIX-VDVIP-V3`.

After deploying, open `/api/version`; it must show `AUTH-FIX-VDVIP-V3`. If it does not, Render is still serving an older deployment.
