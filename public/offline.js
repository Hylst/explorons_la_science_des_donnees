// Page hors ligne : script externe (et non en ligne) pour rester valide sous une Content-Security-Policy `script-src 'self'`.
// Il est pré-caché par le service worker avec offline.html.
document.getElementById('retryButton').addEventListener('click', () => window.location.reload());
document.getElementById('backButton').addEventListener('click', () => window.history.back());

// Monitor connection status
function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    
    if (navigator.onLine) {
        statusElement.className = 'connection-status status-online';
        statusElement.innerHTML = '🟢 Connexion Internet rétablie';
        
        // Auto-reload after 2 seconds when back online
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        statusElement.className = 'connection-status status-offline';
        statusElement.innerHTML = '🔴 Connexion Internet indisponible';
    }
}

// Listen for connection changes
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);

// Initial status check
updateConnectionStatus();

// Periodic connection check
setInterval(() => {
    // Try to fetch a small resource to verify actual connectivity
    fetch("./favicon.svg", {
        method: 'HEAD',
        cache: 'no-cache'
    })
    .then(() => {
        if (!navigator.onLine) {
            // Force online status if fetch succeeds
            window.dispatchEvent(new Event('online'));
        }
    })
    .catch(() => {
        if (navigator.onLine) {
            // Force offline status if fetch fails
            window.dispatchEvent(new Event('offline'));
        }
    });
}, 5000);

// Add click tracking for cached links
document.querySelectorAll('.cached-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Add loading state
        link.style.opacity = '0.6';
        link.innerHTML = '⏳ Chargement...';
        
        // Reset after navigation attempt
        setTimeout(() => {
            link.style.opacity = '1';
        }, 1000);
    });
});

// Service worker registration check
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.location.reload();
    }
    
    if (e.key === 'Escape') {
        window.history.back();
    }
});
