import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { setDoc, collection, doc, Timestamp, serverTimestamp } from "firebase/firestore";
import "../styles/login.css";

export default function Subscribe({ userEmail, setOpenedSubscribe, setOpenLogin }) {

    const [time, setTime] = useState("8am");
    const [successMessage, setSuccessMessage] = useState("");


    async function handleSubscribe(e) {
        e.preventDefault();

        setSuccessMessage("");
        if (!userEmail) {
            setOpenedSubscribe(false);
            setOpenLogin(true)
            return;
        }

        try {

            await setDoc(doc(db, "subscriptions", userEmail + time), {
                email: userEmail,
                time: time.toString(),
                timestamp: serverTimestamp()

            });

            setSuccessMessage("Subscribed");
            console.log("success");
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000)

        } catch (e) {
            console.log(e);
        }


    }


    return (


        <form className="subscribe-card" onSubmit={(e) => { handleSubscribe(e) }}>
            {successMessage ? <p style={{ color: "lime" }}>{successMessage}</p> : null}
            <button className='btn-close close-btn' onClick={() => { setOpenedSubscribe(false) }}></button>
            <h1>Subscribe For Email Service</h1>

            <label>Select the time you want to recieve emails</label><br />
            <select id="time" name="time" onChange={(e) => { console.log("time", e.target.value); setTime(e.target.value) }} value={time}
                className="form-select"
            >
                <option value="8am">08:00 AM</option>
                <option value="12pm">12:00 PM</option>
                <option value="8pm">08:00 PM</option>
            </select><br />

            <button type="submit" className="btn btn-dark">Subscribe</button>
        </form>
    );
}