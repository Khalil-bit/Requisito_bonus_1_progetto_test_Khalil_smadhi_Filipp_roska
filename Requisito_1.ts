import express, { Request, Response } from "express";
import https from "https";

const app = express();

// Endpoint per ottenere l'elenco di tutti i post
app.get("/posts", (req: Request, res: Response) => {
  https.get("https://22hbg.com/wp-json/wp/v2/posts/", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      const posts = JSON.parse(data);
      res.json(posts);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.status(500).send("Errore nel recupero dei post");
  });
});

// Endpoint per ottenere l'elenco dei post filtrati
app.get("/posts-filtered", (req: Request, res: Response) => {
  const title = req.query.title as string;
  const items = parseInt(req.query.items as string);

  https.get("https://22hbg.com/wp-json/wp/v2/posts/", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      const posts = JSON.parse(data);
      let filteredPosts = posts.filter((post: any) =>
        post.title.rendered.includes(title)
      );
      if (items) {
        filteredPosts = filteredPosts.slice(0, items);
      }
      res.json(filteredPosts);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.status(500).send("Errore nel recupero dei post");
  });
});

// Avvio del server
app.listen(3000, () => {
  console.log("Il server è in ascolto sulla porta 3000");
});
