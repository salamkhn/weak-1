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

     
    req.on("data", (chunk) => {  //data come in form of chunk
      container += chunk;
    });

    
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
       try {
      const data = await fs.readFile(fileName, option);
      console.log("data is successfully readed :", data);

      res.writeHead(200, { "content-type": "application/json" });
      res.end(data);
     
      } catch (err) {
        console.log("err in catach of show user :", err.message);
      }
    };

    ReadFile("qq.json", "utf-8");
  }

  // logic for updating the file
  // searching based on name and updating them  !!
  if (req.url === "/user/update" && req.method === "PUT") {
    let newData = "";

    req.on("data", (chunk) => {
      // chunk data
      newData += chunk.toString();
    });

    try {
      req.on("end", async () => {
        console.log("newData :", newData);

        const updatedData = JSON.parse(newData);

        // Logic for getting existing data
        let Products = await fs.readFile("qq.json", "utf-8");

        Products = JSON.parse(Products);
        console.log("type of Products :", typeof Products);

        // maping the Products and getting the individual product data
        let found = false;
        Products = Products.map((product, index) => {
          if (product.name === updatedData.name) {
            found = true;
            return { ...product, ...updatedData };
          }
          return product;
        });
        console.log("found :", found);
        if (!found) { //if product with that name is not found
          console.log("the product with this name is not found");
          return res.end("product not found");
        }

        // writting file after getting data with validation
        console.log("products for writting the file  :", Products);
        // console.log("Products Before :", typeof Products);
        // Products = JSON.stringify(Products, null, 10);
        // console.log("Products After :", typeof Products);
        await fs.writeFile("qq.json", JSON.stringify(Products, null, 10));
      });
    } catch (err) {
      console.log("Error :", err.message), res.end("Error :", err);
    }
  }

  // logic for deleting the individual object
  if (req.url === "/user/delete" && req.method === "DELETE") {
    let newData = "";
    req.on("data", (chunk) => {
      // Data comming in the form of chunk
      newData += chunk.toString();
    });
    // when all data is come successfully
    req.on("end", async () => {
      try {
        let updatedData = JSON.parse(newData);

        //logic for reading the data from the existing file
        let Products = await fs.readFile("qq.json", "utf-8");
        Products = JSON.parse(Products);

        // filtering the products which not match with given Name
        let found = false;
        Products = Products.filter((product, index) => {
          if (product.name !== updatedData.name) {
            return product;
          }
          if (!found) {
            console.log("Product with this name is not found");
          }
        });

       

        //  making file and putting it
        await fs.writeFile("qq.json", JSON.stringify(Products, null, 10));
      } catch (err) {
        console.log("Error in catch :", err.message);
      }
    });
  }

  //if you want to delete whole file than use fs.unlink concept
});


//listing
const port = 1001;
server.listen(port, () => {
  console.log(`hello he is listining at port ${port}`);
});
