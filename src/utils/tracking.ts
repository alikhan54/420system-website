const TRACK_URL = 'https://webhooks.zatesystems.com/webhook/website-visitor-track'
const LEAD_URL = 'https://webhooks.zatesystems.com/webhook/website-exit-lead'
const SOURCE = '420system'

function getUTMs() {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  }
}

function getDeviceType(): string {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function getScrollDepth(): number {
  const doc = document.documentElement
  const scrollTop = window.scrollY || doc.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight
  return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
}

let pageLoadTime = Date.now()

export function initVisitorTracking() {
  pageLoadTime = Date.now()

  const sendTrack = () => {
    const payload = {
      source: SOURCE,
      page_url: window.location.href,
      time_spent_seconds: Math.round((Date.now() - pageLoadTime) / 1000),
      scroll_depth: getScrollDepth(),
      referrer: document.referrer || '',
      device_type: getDeviceType(),
      ...getUTMs(),
      timestamp: new Date().toISOString(),
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, JSON.stringify(payload))
    } else {
      fetch(TRACK_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})
    }
  }

  window.addEventListener('beforeunload', sendTrack)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendTrack()
  })
}

export function trackCTAClick(buttonName: string) {
  const payload = {
    source: SOURCE,
    event: 'cta_click',
    button: buttonName,
    page_url: window.location.href,
    device_type: getDeviceType(),
    ...getUTMs(),
    timestamp: new Date().toISOString(),
  }

  if (navigator.sendBeacon) {
    navigator.sendBeacon(TRACK_URL, JSON.stringify(payload))
  } else {
    fetch(TRACK_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {})
  }
}

export function submitExitLead(name: string, email: string): Promise<boolean> {
  const payload = {
    source: SOURCE,
    name,
    email,
    page_url: window.location.href,
    device_type: getDeviceType(),
    ...getUTMs(),
    referrer: document.referrer || '',
    timestamp: new Date().toISOString(),
  }

  return fetch(LEAD_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(() => true)
    .catch(() => false)
}

const DEMO_URL = 'https://cal.com/zatesystems/demo'

export function navigateToDemo(buttonName: string) {
  trackCTAClick(buttonName)
  setTimeout(() => {
    window.open(DEMO_URL, '_blank', 'noopener')
  }, 150)
}
