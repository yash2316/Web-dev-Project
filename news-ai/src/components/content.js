import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import "../styles/loading-screens.css";
import NewsCard from "./news-card";
import { Skeleton } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

import Masonry from 'react-masonry-css';

import "../styles/loading-screens.css";

export default function Content({ newsList, setNewsList, topic }) {


    async function handleFetch() {

        if (newsList.length != 0)
            return;

        console.log("flag");

        const data = [];
        const qry = query(collection(db, "news"), where("category_key", "in", topic), orderBy("PublishedOn", "desc"), limit(15))
        const querySnapshot = await getDocs(qry);
        querySnapshot.forEach((doc) => {

            const obj = doc.data();
            obj.id = doc.id;
            data.push(obj);

        });
        //console.log(data)
        setNewsList(data);
    }

    useEffect(() => {
        handleFetch();
    }, [topic[0]]);


    const breakpointColumnsObj = {
        default: 3,
        1300: 2,
        900: 1,
    };


    return (
        <div className="p-2" style={{ width: "100%" }}>

            {newsList.length == 0 ? <SkeletonLoading /> : null}
            

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">

                {newsList && newsList.map((c) => <NewsCard obj={c} key={c.id} />)}

            </Masonry>

        </div>
    );

}



function SkeletonLoading() {

    const breakpointColumnsObj = {
        default: 3,
        1300: 2,
        900: 1,
    };


    return (
        // <div className="news-grid">
        //     {Array.from({ length: 8 }, (_, index) => (
        //         <SkeletonCard key={index} />
        //     ))}
        // </div>



        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">

            {Array.from({ length: 15 }, (_, index) => (
                <SkeletonCard key={index} />
            ))}
        </Masonry>

    );
}

function SkeletonCard() {

    return (
        <div className="loading-card">
            <Skeleton
                sx={{ bgcolor: 'rgb(196, 196, 196)' }}
                variant="rounded"
                animation={"pulse"}
                height={80}
            />

            <Skeleton
                sx={{ bgcolor: 'rgb(196, 196, 196)' }}
                variant="rounded"
                animation={"pulse"}
                height={500}
            />
            <Skeleton
                sx={{ bgcolor: 'rgb(196, 196, 196)' }}
                variant="rounded"
                animation={"pulse"}
                height={30}
                width={150}
            />
            <Skeleton
                sx={{ bgcolor: 'rgb(196, 196, 196)' }}
                variant="rounded"
                animation={"pulse"}
                height={30}
                width={200}
            />
        </div>
    )

}


