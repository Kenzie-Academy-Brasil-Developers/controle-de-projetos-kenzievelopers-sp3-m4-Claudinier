import { json } from "express";
import app from "./app";
import { startDatabase } from "./database";
import { addTechInProject, createDeveloper, createDeveloperInfos, createProject, deleteDeveloper, deleteProject, deleteTechProject, getDeveloper, getlistProjectsTechnologies, updateDeveloper,updateProject } from "./logic";
import { verifyEmal, verifyId, verifyIdProject, verifyInfos, verifySO, verifyTechName, verifyTechNameByParam, verifyTechNameDeleteExistsInProject, verifyTechNameExistsInProject } from "./middlewares";

const appPort = process.env.APP_PORT || 3000;


app.use(json());

app.get('/developers/:id', verifyId, getDeveloper);
app.post('/developers', verifyEmal, createDeveloper);
app.patch('/developers/:id', verifyId, verifyEmal, updateDeveloper);
app.delete('/developers/:id', verifyId, deleteDeveloper);
app.post('/developers/:id/infos', verifyId, verifySO, verifyInfos, createDeveloperInfos);

app.post('/projects', verifyId, createProject);
app.get('/projects/:id',verifyIdProject,getlistProjectsTechnologies);
app.patch('/projects/:id',verifyIdProject,verifyId,updateProject);
app.delete('/projects/:id',verifyIdProject,deleteProject);
app.post('/projects/:id/technologies', verifyId, verifyIdProject,verifyTechName, verifyTechNameExistsInProject, addTechInProject);
app.delete('/projects/:id/technologies/:name',verifyIdProject,verifyTechNameByParam,verifyTechNameDeleteExistsInProject,deleteTechProject);




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
