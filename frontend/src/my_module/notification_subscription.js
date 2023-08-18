let messageChannel = new MessageChannel()
const onMessageCallbacks = {}

const setMessageChannel = (ch) => (messageChannel = ch)

const startChannel = () => {
    if (!navigator.serviceWorker.controller) return
    navigator.serviceWorker.controller.postMessage({type: "PORT_INITIALIZATION"}, [
        messageChannel.port2,
    ])
}

const check = () => {
    if (!("serviceWorker" in navigator)) {
        throw new Error("No Service Worker support!")
    }
    if (!("PushManager" in window)) {
        throw new Error("No Push API Support!")
    }
}
const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register(
        process.env.PUBLIC_URL + "/notification_service.js",
        {scope: "/"}
    )
    return swRegistration
}
const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission()
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== "granted") {
        throw new Error("Permission not granted for Notification")
    }
}
const init_subscription = async () => {
    console.log("init_subscription...")
    check()
    // await unregister_service_worker()
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        // console.log("controller changed");
        // console.log(navigator.serviceWorker.controller,evt)
        startChannel()
    })
    const permission = await requestNotificationPermission()
    const swRegistration = await registerServiceWorker()
    console.log({swRegistration, permission})
    return {
        swRegistration,
        permission,
        messageChannel,
    }
}

const unregister_service_worker = () => {
    return new Promise((resolve, reject) => {
        navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => {
                registrations.forEach((registration) => {
                    console.log({registration})
                    registration.unregister()
                })
                resolve()
            })
            .catch(reject)
    })
}

const get_registered_service_worker = () => {
    return navigator.serviceWorker.getRegistrations()
}

messageChannel.port1.onmessage = (event) => {
    console.log({"service_worker onmessage": event})
    Object.entries(onMessageCallbacks).map(([key, cb]) =>
        setImmediate(() => cb(event, key))
    )
    // Process message
}

const sendMessage = (data) => {
    navigator.serviceWorker.controller.postMessage({type: "MSG", data}, [
        messageChannel.port2,
    ])
}

export {
    init_subscription,
    unregister_service_worker,
    sendMessage,
    get_registered_service_worker,
    onMessageCallbacks,
    setMessageChannel,
}
