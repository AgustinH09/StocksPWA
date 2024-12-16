export async function showPriceAlertNotification(title: string, body: string) {
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg && Notification.permission === 'granted') {
    reg.showNotification(title, {
      body,
      icon: '/stock-market-192x192',
      badge: '/stock-market-192x192'
    });
  }
}
