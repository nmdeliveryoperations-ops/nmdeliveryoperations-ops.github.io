// بيخلّي الصفحة قابلة للتثبيت كأبلكيشن. الداتا كلها بتيجي أونلاين من جوجل
const CACHE = 'nm-shell-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;           // جوجل: مباشر من النت
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});

// ===== إشعارات الموبايل (Firebase Cloud Messaging) =====
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyDskvnKAEBpp5N9u4FZ1cQB8FPJpV-VGLA",
  authDomain: "delivery-team-49321.firebaseapp.com",
  projectId: "delivery-team-49321",
  storageBucket: "delivery-team-49321.firebasestorage.app",
  messagingSenderId: "967652460258",
  appId: "1:967652460258:web:d7bea8cb0f69ba86c9c0bb"
});
// الأبلكيشن مقفول أو في الخلفية: نطلّع الإشعار
firebase.messaging().onBackgroundMessage(function (p) {
  const d = (p && p.data) || {};
  return self.registration.showNotification(d.title || 'تسليمات نهضة مصر', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', dir: 'rtl', lang: 'ar',
    tag: 'nm-chat', renotify: true, data: { url: d.url || './' }
  });
});
// الضغط على الإشعار: يفتح الأبلكيشن (أو يرجع لصفحته لو مفتوحة)
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});
