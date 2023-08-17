import React, { useEffect, useRef } from "react"
import "./App.scss"
import { init_subscription } from "./my_module/notification_subscription"

export default function App() {
    let count = useRef(0)
    useEffect(() => {
        if (count.current == 1) {
            navigator.serviceWorker.addEventListener("message", (event) => {
                alert(JSON.stringify(event.data))
              });
            navigator.serviceWorker.onmessage = (event) => {
                alert(JSON.stringify(event.data))
            };
        }
        count.current++
    }, [])


    const sendNotification = () => {
        const url = "/api/send_notification_to_myself/?msg=" + inputRef.current.value
        console.log({ url })
        fetch(url)
            .then(res => res.text())
            .then(res => {
                console.log(res)
                // if(res.status!=200){
                //     alert(JSON.stringify(res))
                // }
            })
            .catch(e => alert(JSON.stringify(e)))
    }

    const inputRef = useRef()

    return <div className="App">

        <button onClick={init_subscription}>Test register</button><br />
        <input type="text" ref={inputRef} /><button onClick={sendNotification}>Send</button>


    </div>
}