import { useEffect, useState } from "react"
import { db } from "../firebase-config";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";


export default function UserProfile({ userEmail,setOpenUserProfile }) {

    
    const [subsList, setSubsList] = useState([]);
    const [temp, setTemp] = useState(2);

    useEffect(() => {
        getMySubscriptions();
        //console.log(subsList);
    }, [temp]);

    async function getMySubscriptions() {

        try {

            const qry = query(collection(db, "subscriptions"), where("email", "==", userEmail))
            const snapshot = await getDocs(qry);

            const list = []

            snapshot.forEach((doc) => {

                const data = doc.data();
                data.id = doc.id;
                list.push(data);
                //console.log(doc.data());
            })

            setSubsList(list);
        } catch (e) {
            console.log(e);
        }

    }

    async function handleDeleteSubscription(docId) {


        try {
            const documentRef = doc(db, "subscriptions", docId);
            const response = await deleteDoc(documentRef);
            console.log(response);

        } catch (e) {
            console.log(e);
        }

    }

    function SubscriptionTemplate({ sub }) {

        const id = sub.id;

        const handleCancel = () => {
            handleDeleteSubscription(id);
            setTemp(temp+1);
        };

        return (
            <div className="container d-flex justify-content-evenly align-items-center border border-top-0">
                <h1>{sub.time.toUpperCase()}</h1>
                <button onClick={handleCancel} className="btn btn-dark" >Cancel</button>
            </div>
        );
    }


    return (

        <div className="modal-view">
            <div className="user-profile-modal">
            <h1>Your subscriptions</h1>
            <button className='btn-close' onClick={() => { setOpenUserProfile(false) }}></button>
                <p>Email: {userEmail}</p>
                {subsList.length==0 ? <div>No subscriptions</div>: null}
                {subsList && subsList.map(sub => <SubscriptionTemplate key={sub.id} sub={sub} />)}
            </div>
        </div>
    )
}