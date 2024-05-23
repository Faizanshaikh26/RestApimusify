const express = require("express");
const app = express();
require("./db/connection");
const path = require("path");

const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cors = require("cors");
const albumsControllers = require("./Controllers/albums");
require("dotenv").config();
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "Images")));
app.use("/songurl", express.static(path.join(__dirname, "Songurl")));
app.use(cors({ origin: "*" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", albumsControllers.allAlbums);
app.get("/api/search", albumsControllers.searchAlbums);
app.get("/api/:id", albumsControllers.allAlbumsById);
app.post("/api/albums", albumsControllers.newAlbum);
app.put("/api/:id", albumsControllers.updateAlbum);
app.delete("/api/:id", albumsControllers.deleteAlbum);

app.listen(port, () => console.log("done"));
