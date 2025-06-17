const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;
require("dotenv").config();
const apiKey = process.env.API_KEY;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;

  try {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(weatherURL);
    const data = response.data;

    const localTime = new Date((data.dt + data.timezone) * 1000)
      .toUTCString()
      .replace("GMT", ""); // Get readable time

    res.render("result", {
      weather: {
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        localTime: localTime
      }
    });
  } catch (err) {
    res.render("result", { weather: null, error: "City not found!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
