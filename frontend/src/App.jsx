import React, {useEffect, useRef, useState} from "react"
import "./App.scss"
import {
    init_subscription,
    unregister_service_worker,
    get_registered_service_worker,
} from "./my_module/notification_subscription"

export default function App() {
    const [regCount, setRegCount] = useState(0)
    const inputRef = useRef()

    const updateRegCount = () => {
        get_registered_service_worker().then((reg) => {
            setRegCount(reg.length)
        })
    }

    useEffect(() => {
        updateRegCount()
    }, [])

    const register_service_worker = async () => {
        const {messageChannel} = await init_subscription()
        messageChannel.port1.onmessage = (event) => {
            console.log({service_worker: event})
            if (event?.data?.type == "MSG") {
                alert(JSON.stringify(event?.data))
            }
            updateRegCount()
        }
    }

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
        </div>
    )
}
