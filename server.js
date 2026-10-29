
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.get("/api/activity", async (req, res) => {

    try {
        const response = await fetch(
            "https://bored-api.appbrewery.com/random"
        );

        if (!response.ok) {
            throw new Error("Bored API request failed");
        }

        const activity = await response.json();

        res.json(activity);

    } catch (error) {
        console.error("Error:", error);

        res.status(502).json({
            error: "Unable to retrieve activity"
        });
    }

});

app.listen(5000, () => {
    console.log("Server running on http://127.0.0.1:5000");
});
