import { readFile, writeFile } from 'node:fs/promises'

const guildId = '404096765340549120'
const token = process.env.DISCORD_BOT_TOKEN

const readEvents = async (path, variable) => {
    const content = await readFile(path, 'utf8').catch(() => '')
    const prefix = `window.${variable} = `
    if (!content.startsWith(prefix)) return []
    return JSON.parse(content.slice(prefix.length))
}

const publicEvent = (event) => ({
    id: event.id,
    name: event.name,
    description: event.description || '',
    start: event.scheduled_start_time,
    end: event.scheduled_end_time,
    location: event.entity_metadata?.location || '',
    userCount: event.user_count || 0,
    url: `https://discord.com/events/${guildId}/${event.id}`
})

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

const discordEvents = await response.json()
const previousEvents = await readEvents('events-data.js', 'CYSCUVU_EVENTS')
const previousPastEvents = await readEvents('past-events-data.js', 'CYSCUVU_PAST_EVENTS')

const events = discordEvents
    .filter((event) => event.status === 1 || event.status === 2)
    .map(publicEvent)
    .sort((a, b) => new Date(a.start) - new Date(b.start))

const activeIds = new Set(events.map((event) => event.id))
const canceledIds = new Set(discordEvents.filter((event) => event.status === 4).map((event) => event.id))
const finishedEvents = discordEvents.filter((event) => event.status === 3).map(publicEvent)
const expiredEvents = previousEvents.filter((event) => {
    const finishedAt = event.end || event.start
    return new Date(finishedAt) < new Date() && !activeIds.has(event.id) && !canceledIds.has(event.id)
})

const archive = new Map(previousPastEvents.map((event) => [event.id, event]))
finishedEvents.concat(expiredEvents).forEach((event) => archive.set(event.id, event))
const pastEvents = [...archive.values()].sort((a, b) => new Date(b.start) - new Date(a.start))

const saveEvents = async (path, variable, data) => {
    const output = `window.${variable} = ${JSON.stringify(data, null, 2)}\n`
    const current = await readFile(path, 'utf8').catch(() => '')
    if (output !== current) await writeFile(path, output)
}

await saveEvents('events-data.js', 'CYSCUVU_EVENTS', events)
await saveEvents('past-events-data.js', 'CYSCUVU_PAST_EVENTS', pastEvents)
console.log(`Updated ${events.length} upcoming and ${pastEvents.length} past events`)
