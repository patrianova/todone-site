# to-did.app

The website and the web app, on Firebase Hosting (project `todone-51870`, custom domain `to-did.app`).

| path | what |
|---|---|
| `index.html`, `style.css` | the site: what To-did is, pricing, the links |
| `app/index.html` | the web app — the same list as the iPhone and the Mac, read and written through CloudKit's web services with the person's own Apple ID |
| `privacy/`, `terms/`, `support/` | the policies and the support page |
| `firebase.json` | hosting config; rewrites `/v1/**` to the capture proxy on Cloud Run |

## The web app

- Signs in with Apple ID through CloudKit JS' web auth; the session token lives only in the browser (`localStorage`).
- Reads the list with `records/query` every six seconds while the tab is visible; writes are optimistic and keep the returned change tag so the next edit is not a conflict.
- Captures by mic (peak measured before upload — silence is not sent) or typed text, through the same proxy as the apps; refuses to file anything when the model's transcript has no words.
- Edits title and date in place; deletes at once and sends the delete five seconds later unless Undo is tapped; clears the list by scope when the voice asks.
- Shows the allowance and the upgrade link; purchases happen in the iPhone or Mac app.

## Deploying

```bash
firebase deploy --only hosting
```

The site is plain HTML/CSS/JS with no build step. Keep `app/index.html` self-contained; it is served with the same CSP as the rest of the site.
