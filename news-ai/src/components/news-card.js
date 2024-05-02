import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import "../App.css";


export default function NewsCard({ obj }) {
    const title = obj.Title;
    const sourceUrl = obj.Url;
    const imgUrl = obj.Image;
    const date = obj.PublishedOn;
    const source = obj.Source;

    const [summary, setSummary] = useState([]);
    const [summaryLoading, setSummaryLoading] = useState(false);

    const d = new Date(date);

    const formattedDate = d.toISOString().split('T')[0];

    async function handleSumm(u) {
        setSummaryLoading(true);
        const apiUrl = 'https://yashxx07-summarize-articles.hf.space/summarize-v2';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "url": u,
                "percentage": 20
            })
        };

        try {
            const response = await fetch(apiUrl, options);
            const result = await response.json();
            setSummary(result.summary);
            setSummaryLoading(false)
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Card className="bg-light text-dark news-card" style={{ width: '100%', boxShadow: "0px 0px 10px rgb(189, 189, 189)", border: "none", borderRadius: "6px", textAlign: "left" }}>
            <Card.Body >
                <Card.Title >{title}</Card.Title>
                <Card.Img src={imgUrl} alt='' />

                <p>Source: {source}</p>
                <a href={sourceUrl} className='link-secondary'>Read</a>
                <p>Published On: {formattedDate}</p>
                {summary != "" ? null : <Button variant="dark" onClick={() => handleSumm(sourceUrl)} className="full-width-button">

                    {summaryLoading ? <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> : "Summarize"}


                </Button>}

                <Card.Text>
                    {summary}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
