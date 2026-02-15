// service-worker.js
const CACHE_NAME = 'vendas-alert-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install Event
self.addEventListener('install', event => {
    console.log('🔧 Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📦 Cache aberto');
            return cache.addAll(urlsToCache).catch(err => {
                console.log('⚠️ Alguns arquivos não foram cacheados (esperado em desenvolvimento)');
            });
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
    console.log('✅ Service Worker ativado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Network First Strategy
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone a resposta
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            })
            .catch(() => {
                // Se falhar, tenta cache
                return caches.match(event.request).then(response => {
                    return response || new Response('Offline - página não disponível', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});

// Push Notification Event
self.addEventListener('push', event => {
    console.log('📬 Push recebido:', event);

    let notificationData = {
        title: '💰 Venda Recebida!',
        body: 'Nova venda detectada',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%231a1a2e" width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80" fill="%2300d4ff" font-weight="bold" font-family="system-ui">$</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%2300ff88" width="192" height="192"/></svg>',
        tag: 'venda-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200]
    };

    // Tenta parsear dados JSON do push
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = {
                ...notificationData,
                title: `💰 ${data.cliente || 'Nova Venda'}`,
                body: `${data.produto || 'Venda'} - R$ ${data.valor || '0,00'}`,
                icon: data.imageUrl || notificationData.icon,
                data: data
            };
        } catch (e) {
            notificationData.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: notificationData.tag,
            requireInteraction: notificationData.requireInteraction,
            vibrate: notificationData.vibrate,
            data: notificationData.data,
            actions: [
                {
                    action: 'view',
                    title: 'Ver',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300d4ff"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>'
                },
                {
                    action: 'close',
                    title: 'Fechar',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
                }
            ]
        }).then(() => {
            // Armazena notificação no histórico
            storeNotification(notificationData.data || notificationData);
        })
    );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notificação clicada:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Abre a janela ou foca a existente
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Procura cliente já aberto
            for (let client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Abre nova janela se não encontrar
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Notification Close Event
self.addEventListener('notificationclose', event => {
    console.log('❌ Notificação fechada');
});

// Background Sync (sincroniza quando voltar online)
self.addEventListener('sync', event => {
    console.log('🔄 Background Sync:', event.tag);

    if (event.tag === 'sync-sales') {
        event.waitUntil(
            syncNotifications().catch(err => {
                console.error('❌ Erro ao sincronizar:', err);
            })
        );
    }
});

// Helper: Store Notification
async function storeNotification(data) {
    try {
        // Tenta usar IndexedDB (melhor para PWA)
        if ('indexedDB' in self) {
            const db = await openDB();
            const tx = db.transaction('notifications', 'readwrite');
            await tx.store.add({
                id: Date.now(),
                timestamp: new Date().toISOString(),
                ...data
            });
            return;
        }
    } catch (e) {
        console.log('⚠️ IndexedDB indisponível, usando localStorage');
    }

    // Fallback: localStorage
    try {
        let notifications = JSON.parse(self.localStorage?.getItem('notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...data
        });
        self.localStorage?.setItem('notifications', JSON.stringify(notifications.slice(0, 50)));
    } catch (e) {
        console.error('❌ Erro ao armazenar notificação:', e);
    }
}

// Helper: Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('vendas-alert', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('notifications')) {
                db.createObjectStore('notifications', { keyPath: 'id' });
            }
        };
    });
}

// Helper: Sync Notifications
async function syncNotifications() {
    console.log('🔄 Sincronizando notificações pendentes...');
    // Implementar lógica de sincronização conforme necessário
}

console.log('✅ Service Worker pronto para receber notificações');
