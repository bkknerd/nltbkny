# New Life Tabernacle website

The NLT BKNY site: a fast static site built with [Eleventy](https://www.11ty.dev/), edited in [Decap CMS](https://decapcms.org/), hosted on [Netlify](https://www.netlify.com/).

Every piece of content lives in `src/_data/*.json` and is editable at **/admin** without touching code: church details, service times, events, videos, pastors and portraits, the “a word for today” verses, the first-Sunday tips, the Fellowship, the Family Life Development Center and the giving options.

## Go live on Netlify (about 15 minutes)

1. **Put the code on GitHub.** Create a new repository (for example `nltbkny-site`) and push this folder to its `main` branch.
2. **Create the site.** In Netlify: *Add new site → Import an existing project → GitHub →* pick the repo. Netlify reads `netlify.toml`, so the build settings fill in themselves (`npm run build`, publish `_site`). Deploy.
3. **Turn on sign-in for editors.**
   - *Project configuration → Identity → Enable Identity.*
   - Under *Registration*, choose **Invite only**.
   - Under *Services → Git Gateway*, click **Enable Git Gateway**.
4. **Invite editors.** *Identity → Invite users*, enter their emails. They accept the email, set a password, and land in the editor at `yoursite/admin`.
5. **Forms.** The “say hello” form and the newsletter sign-up are Netlify Forms. They are detected on the first deploy. Under *Forms → Form notifications*, add an email notification so messages reach the church inbox (for example newlife1476@aol.com).
6. **Domain.** *Domain management → Add a domain* (for example `nltbkny.org`). Then update `url` in **Church details** in the CMS, and `site_url` / `display_url` in `src/admin/config.yml`.

## Editing content

- Go to `https://<your-site>/admin`, sign in, choose a section, edit, **Publish**.
- Each publish saves to GitHub and Netlify rebuilds the site automatically (about a minute).
- **Events:** set the start date and time. The big number and month on the poster fill in from the date unless you type an override (like “Wed” / “weekly” for a weekly event). The Google Calendar link is built automatically.
- **Videos:** paste the YouTube video ID, the part after `watch?v=` in a YouTube link.
- **Portraits:** upload tall photos, at least 800 × 1000. They show in black and white and turn to color on hover.
- **Italics:** in bios and “ways to watch”, wrap words in `*asterisks*`.

## Work on it locally

```bash
npm install
npm start          # site at http://localhost:8080
```

To use the CMS locally without signing in, uncomment `local_backend: true` in `src/admin/config.yml`, then run `npm run cms` in a second terminal and open http://localhost:8080/admin.

## What's where

| Path | What it is |
| --- | --- |
| `src/index.njk` | The page template |
| `src/_data/*.json` | All content (what the CMS edits) |
| `src/assets/site.css`, `site.js` | Design and interactions |
| `src/images/uploads/` | Photos uploaded through the CMS |
| `src/admin/config.yml` | What the CMS shows editors |
| `netlify.toml` | Build settings, security headers, caching |
| `eleventy.config.js` | Build setup and helpers (calendar links, dates, italics) |

## Notes

- **Sign-in options:** this uses Netlify Identity with Git Gateway. To sign in with GitHub accounts instead, change `backend` in `src/admin/config.yml` to `name: github` with `repo: <owner>/<repo>`, and add a GitHub OAuth app under *Netlify → Access & security → OAuth*.
- **Search:** the page includes church details for Google (address, phone, pastors), a share image, a favicon and a `robots.txt`.
- **Fonts:** Source Serif 4 (headlines and scripture) and Hanken Grotesk (everything else), loaded from Google Fonts.
