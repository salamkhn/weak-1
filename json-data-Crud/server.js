import http from "http";

import fs from "fs/promises";
import { json } from "stream/consumers";

const server = http.createServer((req, res) => {
  // logic for creating file
  let largeContainer = [];
  if (req.url === "/user/create" && req.method === "POST") {
    //creating file with empty data
    fs.writeFile("main.json", "");
    console.log("file made successfully");
  }

  // logic for adding || appending data

  if (req.url === "/user/add" && req.method === "POST") {
    let container = "";

    //request for data
    req.on("data", (chunk) => {
      container += chunk;
    });

    //request for end
    req.on("end", async () => {
      try {
        const parsed = JSON.parse(container);

        console.log("parsed", parsed);

        // Read -> Push-> Write

        try {
          const existing = await fs.readFile("main.json", "utf-8");
          largeContainer = JSON.parse(existing);
        } catch (err) {
          largeContainer = [];
        }
        largeContainer.push(parsed);

        await fs.writeFile("qq.json", JSON.stringify(largeContainer, null, 10));
        console.log("data is saved successfully");
      } catch (err) {
        console.log(
          "this error is comming during catch in appendFile",
          err.message
        );
      }
     
    });
  }

  // logic for showing all the data

  if (req.url === "/users" && req.method === "GET") {
    const ReadFile = async (fileName, option) => {
      const data = await fs.readFile(fileName, option);
      console.log("data is successfully readed :", data);

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
      try {
      } catch (err) {
        console.log("err in catach of show user :", err.message);
      }
    };

    ReadFile("3.js", "utf-8");
  }
});

// file mading function

const port = 1001;
server.listen(port, () => {
  console.log(`hello he is listining at port ${port}`);
});
