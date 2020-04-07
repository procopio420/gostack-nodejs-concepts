const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const likes = 0;

  const rep = { id, title, url, techs, likes };
  repositories.push(rep);

  return response.json(rep);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(request.body.likes) return response.status(400).json({error:"Cannot update likes manually"});
  
  const index = repositories.findIndex((r)=>r.id === id);

  if(index<0) return response.status(400).json({error:"ID not found"});

  const likes = repositories[index].likes;

  const rep = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[index] = rep;

  return response.json(rep);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const index = repositories.findIndex(r=>r.id===id);
  if(index<0) return res.status(400).json({error:"ID not found"});

  repositories.splice(index, 1);

  return res.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(r=>r.id===id);
  if(index<0) return response.status(400).json({error:"ID not found"});

  repositories[index].likes++;

  return response.status(204).json();
});

module.exports = app;
