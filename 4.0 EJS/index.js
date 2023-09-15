import express from "express";
import weekday from "weekday";

const port = 3000;
const app = express();
const a = weekday();

app.get("/", (req, res) => {
    if (a === "Saturday" || a === "Sunday") {
        res.render("gg.ejs", {
            dayType: "a Weekend",
            advice: "Enjoy your day"
        });
    } else {
        res.render("gg.ejs", {
            dayType: "a Weekday",
            advice: "it's time to work hard !"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});