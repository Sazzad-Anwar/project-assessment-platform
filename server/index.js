const app = require("./app.js");
let port = process.env.PORT;

// Use the below code for not to expose the node application to the outside world
// server.listen(port, 'localhost', () => console.log(`App is listening on port ${port}!`));
app.listen(port, () => console.log(`App is listening on port ${port}!`));

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
