const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Invalid Repository" });
  }

  request.params.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request.params;

  const newRepositoryInfo = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = newRepositoryInfo;

  return response.json(newRepositoryInfo);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { repositoryIndex } = request.params;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
