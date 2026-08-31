# to-did website

Source for the To-did site and web app. **Hosting is Firebase**, in the same
Google Cloud project that runs the capture proxy and bills Gemini
(`todone-51870`). GitHub Pages is deliberately switched off — one live site only.

Deploy:

    firebase deploy --only hosting --project todone-51870

Live at https://todone-51870.web.app (custom domain to-did.app to follow).

`firebase.json` also rewrites `/v1/**` to the `todone-capture` Cloud Run service,
so the web app calls the capture API same-origin — no CORS hop.
