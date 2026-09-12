# Development

This site uses Tailwind CSS v4.

1. Install the project dependencies with `npm install`.
2. Start Tailwind in watch mode with `npm run dev`.
3. Open `index.html` in a browser. Tailwind will rebuild `output.css` whenever the HTML or CSS changes.

Run `npm run build` to produce a minified stylesheet for deployment.

## Discord meeting and event announcements

Both schedule pages read `events-data.js`, which the Discord updater refreshes from scheduled events. Create announcements as Discord scheduled events; ordinary channel messages are not imported.

Use these title conventions:

- `[Club Meeting] Intro to Linux` → Future Meetings
- `[Event] Fall CTF` → Future Events

Matching ignores capitalization. Any title containing the words `club meeting` goes to Future Meetings, unless it starts with `[Event]`. All other titles go to Future Events. Leading `[Club Meeting]`, `[Event]`, `Club Meeting:`, and `Event:` labels are hidden from website titles; the original Discord title still determines the page. Each item appears on only one page, and its description provides the announcement details.

The GitHub workflow runs every 15 minutes and requires the repository secret `DISCORD_BOT_TOKEN` for a bot added to the club server. You can also run **Update Discord events** manually from GitHub Actions.

## Publishing

In GitHub **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. Push website changes to `main`, or manually run **Update Discord events**. The workflow fetches Discord events, builds the stylesheet, and publishes the site directly to GitHub Pages. It also runs on the 15-minute schedule (GitHub may delay scheduled runs).

The bot must be installed on the club server and its token saved as `DISCORD_BOT_TOKEN` in repository Actions secrets. A failed fetch stops deployment and leaves the last published site in place. Generated event data is deployed without committing it back to the repository, so the local `events-data.js` may differ from the live feed.
