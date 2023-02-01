const express = require('express');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_API_KEY);
const axios = require('axios');
const cors = require('cors');
const CORSWhitelist = [process.env.FRONTEND_URL];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        const originIsWhitelisted = CORSWhitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
}))

app.post('/articles', async (req, res) => {
    try {
        // Request body contains the query in the form of a JSON object, which will be sent to the news API.
        const newsAPIResponse = await newsapi.v2.everything({
            ...req.body,
            language: 'en'
        });
        console.log("Fetch articles executed successfully!");
        return res.json(newsAPIResponse);
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).send(err);
    }
})

app.listen(process.env.BACKEND_PORT,
    /**
     * Confirms server's success status, is triggered once the server begins.
     */
    () => {
        console.log(`Server started on port ${process.env.BACKEND_PORT}.`);
    })