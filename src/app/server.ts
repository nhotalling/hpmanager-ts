import app from "./app";
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

//Define request response in root URL (/)
app.get("/", function (req, res) {
  res.send("Hello World!");
});
