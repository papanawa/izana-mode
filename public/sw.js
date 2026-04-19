// ── IZANA MODE SERVICE WORKER ─────────────────────────────────────────────────
// Handles push notifications and scheduled reminder alarms

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// ── NOTIFICATION CLICK ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return self.clients.openWindow('/');
    })
  );
});

// ── SCHEDULED ALARMS via periodic messages ────────────────────────────────────
// The app sends a 'SCHEDULE' message with reminder times.
// SW stores them and fires notifications at the right time.

let reminders = [];

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SCHEDULE_REMINDERS') {
    reminders = e.data.reminders || [];
  }
  if (e.data?.type === 'TRIGGER_CHECK') {
    checkAndFire();
  }
});

function checkAndFire() {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  reminders.forEach(r => {
    if (r.time === hhmm) {
      self.registration.showNotification(r.title || 'Izana Mode', {
        body: r.body || 'Time to train. 🔥',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: r.tag || 'izana-reminder',
        renotify: true,
        data: { url: '/' },
      });
    }
  });
}

// Check every minute via a keepalive ping from the app
// (true push requires a push server — this approach works while app is open/backgrounded on mobile PWA)
