# StarX Exchange style - zmiany

Zrobione pod wygląd ze screenów, ale z brandingiem **🌟 StarX Exchange**.

## Co zostało dodane/zmienione
- panel ticketów w stylu embeda jak na screenie,
- ticket wymiany z informacją o kwocie, metodzie i prowizji,
- przycisk przejęcia ticketa przez realizatora,
- embed „TICKET PRZEJĘTY”,
- przycisk danych płatności BLIK,
- embed „DANE PŁATNOŚCI BLIK”,
- embed do wystawienia legit checka po zamknięciu ticketa,
- cały branding w `tickets.js` ustawiony na **🌟 StarX Exchange**.

## Do ustawienia w `tickets.js`
- `PANEL_CHANNEL_ID`
- `REALIZATOR_ROLE_ID`
- `CLIENT_ROLE_ID`
- `LEGIT_CHECK_CHANNEL_ID`
- `OPINIE_CHANNEL_ID`
- dane w sekcji `PAYMENT`
- opcjonalnie linki bannerów przez zmienne środowiskowe `BANNER_TICKET_URL` i `BANNER_LEGIT_URL`.
