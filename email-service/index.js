const express = require("express");
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const fetch = require('node-fetch');
//require('dotenv').config();

if(process.env.MAIL)
  console.log(process.env.MAIL);

// Initialize Firestore
const serviceAccount = require('./testapi-eb5d7-firebase-adminsdk-e21hj-0c8547adc1.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


const app = express();
const port = 7860;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});

app.get("/", (requset, response) => {
  response.send({
    "status": "OK"
  });
});


const categoryCodes = [
  "entertainment",
  "business",
  "health",
  "science",
  "sports",
  "technology",
  "india",
  "world",
];



// Function to fetch new news from API and write to Firestore
async function fetchDataAndWriteToFirestore(para) {

  const url = `https://news67.p.rapidapi.com/v2/topic-search?languages=en&search=${para}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '***api key***',
      'X-RapidAPI-Host': 'news67.p.rapidapi.com'
    }
  };

  const parameter = para;


  try {
    // Make API call
    const response = await fetch(url, options);
    const data = await response.json();


    // Write each object in the array to Firestore
    data.news.forEach(async (item) => {
      item['category_key'] = parameter;

      let documentName = item.Title.replace(/[^a-zA-Z]/g, '');

      await db.collection("news").doc(documentName).set(item);
      //console.log("Document written to Firestore:", item);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }


}

// ********* Route to trigger fetching data and writing to Firestore
app.get("/get-news", async (req, res) => {


  for (const param of categoryCodes) {
    await fetchDataAndWriteToFirestore(param);
  }

  res.send("Data fetched and written to Firestore successfully!");
});


// ***** update daily top 3 news
app.get("/update-today-top-for-emails", async (req, res) => {
  const key = req.query.key;
  const data = [];

  try {
    const newsRef = db.collection('news');
    const snapshot = await newsRef.orderBy('PublishedOn', "desc").limit(1).where("category_key", "==", key).get();

    const promises = snapshot.docs.map(async (doc) => {
      const d = doc.data();
      let summary;

      try {
        summary = await getSummary(d.Url);
      } catch (error) {
        console.error("Failed to get summary:", error);
        return; // Optionally handle this case differently
      }

      const data_obj = {
        "title": d.Title,
        "link": d.Url,
        "summary": summary,
        "source": d.Source
      };

      data.push(data_obj);

      try {
        await db.collection('mail-template').doc(key).set(data_obj);
      } catch (error) {
        console.error("Failed to update mail template:", error);
        // Handle error appropriately
      }
    });

    await Promise.all(promises); // Ensure all promises are resolved
    res.send({ data });
  } catch (e) {
    res.send({ "ERROR": e });
  }
});

async function getSummary(url) {

  console.log(url)
  const apiUrl = 'https://yashxx07-summarize-articles.hf.space/summarize-v2';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      "url": url,
      "percentage": 20
    })
  };

  try {
    const response = await fetch(apiUrl, options);

    const result = await response.json();
    //console.log(result);
    return result.summary;
  } catch (error) {
    console.error(error);
  }

  return "";


}


/// *******  email service code starts here





async function sendEmail(emailsList, mailContent) {
  try {
    const transporter = nodemailer.createTransport({
        host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: "zerothtest@mail.com",
    pass: "E6DADFA42CB201B8BA973C46DEA509951E20",
  },
    });

    let successCount = 0;
    for (const email of emailsList) {
      const info = await transporter.sendMail({
        from: {
          name: "RapidRecap",
          address: process.env.MAIL
        },
        to: email,
        subject: "Today's Top News",
        html: mailContent
      });
      successCount++;
      console.log(`Message sent: ${info.messageId}`);
    }

    return { STATUS: `${successCount} emails sent successfully` };
  } catch (error) {
    console.error(error);
    return { ERROR: error };
  }
}


async function getEmailsList(time) {
    const emailsList = [];
  
  try{
  const subRef = db.collection('subscriptions');
  const snapshot = await subRef.where('time', '==', time).get();

      snapshot.forEach(doc => {
    emailsList.push(doc.data().email);
  });
  return emailsList;
    
  }catch(e){
    console.log(e);
    return emailsList;
  }

  
 
}

async function getTopNews() {
   let mailContent = "";

  try{
    const newsRef = db.collection('mail-template');
  const snapshot = await newsRef.get();
 
  snapshot.forEach(doc => {
    mailContent += `<div style='background:white;margin-top:5px;color:#545454;padding:10px;border:1px solid white; text-align:center'>
      <a href='${doc.data().link}'><h1>${doc.data().title}</h1></a>`;
    mailContent += `<div style='display:flex;justify-content:center;align-items:center;'>
    <h1>Source: </h1>
    <a href='${doc.data().source}'><h1>${doc.data().source}</h1></a> </div>`
    mailContent += `<p>${doc.data().summary}</p>`
    mailContent += `</div>`;
  });
  return mailContent;
    
  }catch(e){
    console.log(e);
    return mailContent;
  }
  
}

app.get('/send-email', async (req, res) => {
  try {
    const time = req.query.time;
    const emailsList = await getEmailsList(time);
    const mailContent = await getTopNews();
    const result = await sendEmail(emailsList, mailContent);
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send({"Error": error});
  }
});