import React, { useRef } from "react"
import "./App.scss"
import { init_subscription } from "./my_module/notification_subscription"

export default function App() {
    // let count=useRef(0)
    // useEffect(() => {
    //     if(count.current==1){
    //         init_subscription()
    //     }
    //     count.current++
    // }, [])
    // init_subscription()


    const sendNotification=()=>{
        const url="/api/send_notification_to_myself/?msg="+inputRef.current.value
        console.log({url})
        fetch(url)
    }

    const inputRef=useRef()

    return <div className="App">

        <button onClick={init_subscription}>Test register</button><br />
        <input type="text" ref={inputRef} /><button onClick={sendNotification}>Send</button>


    </div>
}