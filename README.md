# Development

This site uses Tailwind CSS v4.

1. Install the project dependencies with `npm install`.
2. Start Tailwind in watch mode with `npm run dev`.
3. Open `index.html` in a browser. Tailwind will rebuild `output.css` whenever the HTML or CSS changes.

Run `npm run build` to produce a minified stylesheet for deployment.

## Discord Meetings

The `Update Discord events` GitHub workflow refreshes `events-data.js` every 15 minutes.

1. Create a Discord application and bot in the Discord Developer Portal.
2. Add the bot to the CYSCUVU server with permission to view event channels.
3. Add its token to the GitHub repository as an Actions secret named `DISCORD_BOT_TOKEN`.
4. Allow GitHub Actions read and write repository permissions.
5. Run the workflow manually once to test it.

Never add the bot token to a project file or commit it to Git.
