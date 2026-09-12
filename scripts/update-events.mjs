import { readFile, writeFile } from 'node:fs/promises'

const guildId = '404096765340549120'
const token = process.env.DISCORD_BOT_TOKEN

if (!token) throw new Error('DISCORD_BOT_TOKEN is not set')

const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events?with_user_count=true`, {
    headers: {
        Authorization: `Bot ${token}`,
        'User-Agent': 'CYSCUVU-Website (https://cyscuvu.com)'
    }
})

if (!response.ok) {
    throw new Error(`Discord returned ${response.status}`)
}

const events = (await response.json())
    .filter((event) => event.status === 1 || event.status === 2)
    .map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description || '',
        start: event.scheduled_start_time,
        end: event.scheduled_end_time,
        location: event.entity_metadata?.location || '',
        userCount: event.user_count || 0,
        url: `https://discord.com/events/${guildId}/${event.id}`
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start))

const output = `window.CYSCUVU_EVENTS = ${JSON.stringify(events, null, 2)}\n`
const current = await readFile('events-data.js', 'utf8').catch(() => '')

if (output !== current) {
    await writeFile('events-data.js', output)
    console.log(`Updated ${events.length} events`)
} else {
    console.log('Events are already current')
}
