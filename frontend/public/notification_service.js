
let communicationPort;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PORT_INITIALIZATION') {
    if (!communicationPort) {
      // get reference of sender
      communicationPort = event.ports[0];
      console.log("communication PORT_INITIALIZATION")
      communicationPort.postMessage({ type: 'STATUS', data: "init success" });
    }
  } else {
    console.log("service worker got", event.data)
  }
});

const sendMessage = (data) => {
  // sending message to sender or tab from where it registered
  communicationPort.postMessage({ type: 'MSG', data });
}

const broadcastToTab = (data) => {
  // broad cast to all clients[opened tabs]
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'TAB_BROADCAST', data })
    })
  })
}

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


const saveSubscription = async subscription => {
  const SERVER_URL = '/api/subscribe_to_notification'
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  })
  return response.json()
}

addEventListener('install', installEvent => {
  self.skipWaiting();
  console.log({ installEvent })
});




self.addEventListener('activate', async (event) => {
  clients.claim();
  console.log("service worker activated")
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk'
    )
    const options = { applicationServerKey, userVisibleOnly: true }
    const subscription = await self.registration.pushManager.subscribe(options)
    console.log({ subscription })
    const response = await saveSubscription(subscription)
    console.log(response)
    console.log("success fully registered")
    sendMessage("success fully registered")
  } catch (err) {
    console.log('Error', err)
    self.registration.unregister();
    sendMessage("Error")
  }
})

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    broadcastToTab(["Push event!! ", event.data.text()])
    showLocalNotification("Test notification", event.data.text(), self.registration);
  } else {
    console.log("Push event but no data");
  }
});
const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};