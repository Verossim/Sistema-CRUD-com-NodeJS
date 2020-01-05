const express = require("express");
const server = express();
server.use(express.json());

const projects = [];

//Função para verificar via ID se o projeto existe
function projectsID(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  return next();
}

//Contador de requisições
function logRequests(req, res, next) {
  console.count("Número de requisições");
  return next();
}

server.use(logRequests);

//Cadastra um novo projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

//Adiciona uma tarefa ao projeto via ID
server.post("/projects/:id/tasks", projectsID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

//Lista os projetos existentes
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Lista um projeto
server.get("/projects/:id", projectsID, (req, res) => {
  const { id } = req.params;

  return res.json(projects[id]);
});

//Altera o título de um projeto
server.put("/projects/:id", projectsID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;
  return res.json(project);
});

//Deleta um projeto
server.delete("/projects/:id", projectsID, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3333);
