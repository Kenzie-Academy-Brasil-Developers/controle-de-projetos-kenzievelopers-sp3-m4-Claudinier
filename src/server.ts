import { json } from "express";
import app from "./app";
import { startDatabase } from "./database";
import { addTechInProject, createDeveloper, createDeveloperInfos, createProject, deleteDeveloper, getDeveloper, updateDeveloper } from "./logic";
import { verifyEmal, verifyId, verifyInfos, verifySO, verifyTechName, verifyTechNameExistsInProject } from "./middlewares";

const appPort = process.env.APP_PORT || 3000;


app.use(json());

app.get('/developers/:id', verifyId, getDeveloper);
app.post('/developers', verifyEmal, createDeveloper);
app.patch('/developers/:id', verifyId, verifyEmal, updateDeveloper);
app.delete('/developers/:id', verifyId, deleteDeveloper);
app.post('/developers/:id/infos', verifyId, verifySO, verifyInfos, createDeveloperInfos);

app.post('/projects', verifyId, createProject);
app.get('/projects/:id')
app.patch('/projects/:id')
app.delete('/projects/:id')
app.post('/projects/:id/technologies', verifyId, verifyTechName, verifyTechNameExistsInProject, addTechInProject)
app.delete('/projects/:id/technologies/:name', verifyId)




const server = (port: number) => app.listen(port, async () => {
  await startDatabase();
  console.log(`Server is running on port ${port}.`);
});


if (process.env.NODE_ENV === "dev") {
  server(Number(appPort));
} else {
  console.log(process.env.NODE_ENV);

}

export default server;
