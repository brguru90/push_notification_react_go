import React, {useEffect, useRef, useState} from "react"
import "./App.scss"
import {
    init_subscription,
    unregister_service_worker,
    get_registered_service_worker,
    onMessageCallbacks,
} from "./my_module/notification_subscription"

export default function App() {
    const [regCount, setRegCount] = useState(0)
    const inputRef = useRef()
    const msgEventBinded = useRef(false)

    const [broadCastData, setBroadCastData] = useState([])

    const updateRegCount = () => {
        get_registered_service_worker().then((reg) => {
            setRegCount(reg.length)
        })
    }

    const listenForMessageEvent = () => {
        if (msgEventBinded.current) return
        onMessageCallbacks["reg"] = (event) => {
            console.log({service_worker: event})
            if (event?.data?.type == "MSG") {
                alert(JSON.stringify(event?.data))
            }
            updateRegCount()
        }
        // listening from tab broad cast
        navigator.serviceWorker.addEventListener("message", (event) => {
            setBroadCastData((e) => {
                return [event?.data?.data, ...e]
            })
        })
        msgEventBinded.current = true
    }

    const register_service_worker = async () => {
        await init_subscription()
        listenForMessageEvent()
    }

    useEffect(() => {
        updateRegCount()
        listenForMessageEvent()
    }, [])

    const sendNotification = () => {
        const url = "/api/send_notification_to_myself/?msg=" + inputRef.current.value
        console.log({url})
        fetch(url)
            .then((res) => res.text())
            .then((res) => {
                console.log(res)
            })
            .catch((e) => alert(JSON.stringify(e)))
    }

    return (
        <div className="App">
            <b>Test notification</b>
            <br />
            <i>Registered count: {regCount}</i>
            <br />
            <button onClick={register_service_worker}>register</button>
            <button
                onClick={() => {
                    unregister_service_worker().then(() => {
                        updateRegCount()
                        window.location.reload()
                    })
                }}
            >
                unregister
            </button>
            <br />
            <input type="text" ref={inputRef} />
            <button onClick={sendNotification}>Send</button>
            <br />
            <br />
            <b>Tab broadcast data</b>
            <br />
            {broadCastData.map((e) => (
                <p key={e}>{JSON.stringify(e)}</p>
            ))}
        </div>
    )
}
