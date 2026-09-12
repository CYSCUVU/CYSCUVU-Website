const status = document.querySelector('#events-status')
const list = document.querySelector('#events-list')
const category = list.dataset.category
const label = category === 'meeting' ? 'club meeting' : 'event'

const eventCategory = (name) => {
    if (/^\s*\[event\]/i.test(name)) return 'event'
    return /\bclub\s+meeting\b/i.test(name) ? 'meeting' : 'event'
}

const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Denver'
}).format(new Date(date))

const addText = (parent, tag, classes, text) => {
    const element = document.createElement(tag)
    element.className = classes
    element.textContent = text
    parent.append(element)
}

const showEvents = (events) => {
    if (!events.length) {
        status.textContent = `No upcoming ${label}s are posted yet. Check Discord for announcements.`
        return
    }

    status.textContent = `${events.length} upcoming ${label}${events.length === 1 ? '' : 's'}`

    events.forEach((event) => {
        const card = document.createElement('article')
        card.className = 'rounded-lg border border-white/10 p-6 sm:p-8'

        addText(card, 'p', 'font-tommy text-sm text-cysc-green', `${formatDate(event.start)} MT`)
        addText(card, 'h2', 'mt-2 font-tommy text-2xl font-bold', event.name)

        if (event.description) {
            addText(card, 'p', 'mt-3 whitespace-pre-line font-tommy leading-relaxed text-white/60', event.description)
        }

        const details = event.location || 'Discord'
        addText(card, 'p', 'mt-4 font-tommy text-sm text-white/50', `${details} · ${event.userCount} interested`)

        const link = document.createElement('a')
        link.className = 'mt-6 inline-block rounded bg-cysc-green px-5 py-3 font-tommy font-bold text-black hover:bg-white'
        link.href = event.url
        link.textContent = 'View on Discord'
        card.append(link)
        list.append(card)
    })
}

showEvents((window.CYSCUVU_EVENTS || []).filter((event) => eventCategory(event.name) === category))
