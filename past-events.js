const status = document.querySelector('#past-events-status')
const list = document.querySelector('#past-events-list')

const displayTitle = (name) => name
    .replace(/^\s*(?:\[(?:club\s+meeting|event)\]|(?:club\s+meeting|event)\b)\s*[:|–—-]?\s*/i, '')
    .trim() || 'Untitled activity'

const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'America/Denver'
}).format(new Date(date))

const events = window.CYSCUVU_PAST_EVENTS || []

if (!events.length) {
    status.textContent = 'Past meetings and events will appear here after they finish.'
} else {
    status.textContent = `${events.length} past ${events.length === 1 ? 'activity' : 'activities'}`

    events.forEach((event) => {
        const item = document.createElement('li')
        item.className = 'flex flex-col gap-2 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between'

        const title = document.createElement('h2')
        title.className = 'font-tommy text-lg font-bold'
        title.textContent = displayTitle(event.name)

        const date = document.createElement('p')
        date.className = 'font-tommy text-sm text-white/50'
        date.textContent = formatDate(event.start)

        item.append(title, date)
        list.append(item)
    })
}
