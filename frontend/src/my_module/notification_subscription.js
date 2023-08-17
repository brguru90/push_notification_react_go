const check = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}
const registerServiceWorker = async () => {

    // try {
    //     const registration = await navigator.serviceWorker.ready
    //     const t=registration.unregister()
    //     console.log(t)
    // } catch (error) {
    //     console.log(error)
    // }

    const swRegistration = await navigator.serviceWorker.register(process.env.PUBLIC_URL + '/notification_service.js')
    return swRegistration
}
const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission()
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification')
    }
}
const init_subscription = async () => {
    console.log("init_subscription...")
    check()
    unregister_service_worker()
    const swRegistration = await registerServiceWorker()
    const permission = await requestNotificationPermission()
    return {
        swRegistration,
        permission,
    }
}

const unregister_service_worker = () => {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
            })
        });
}

export {
    init_subscription,
    unregister_service_worker
}