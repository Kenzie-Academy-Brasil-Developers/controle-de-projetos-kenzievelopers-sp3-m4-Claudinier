import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";
import { Developer, DeveloperInfo } from "./interfaces/developers.interfaces";
import { project, projectRegister } from "./interfaces/projetcts.interfaces";

const createDeveloper = async (req: Request, res: Response): Promise<Response> => {
    const { name, email } = req.body;
    const queryString: string = `
    INSERT INTO developers
        ("name", email)
        VALUES($1, $2) RETURNING *;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name, email]
    }

    const queryResult: QueryResult = await client.query(queryConfig);
    return res.status(201).json(
        queryResult.rows[0]
    );

}

const createDeveloperInfos = async (req: Request, res: Response): Promise<Response> => {

    const { developerSince, preferredOS } = req.body;
    const queryString: string = `
    INSERT INTO developer_infos
    ("developerSince", "preferredOS", "developerId")
    VALUES($1, $2, $3)
     RETURNING *;
    `;


    const queryConfig: QueryConfig = {
        text: queryString,
        values: [new Date(developerSince), preferredOS, req.params.id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);
    return res.status(201).json(
        queryResult.rows[0]
    );

}
const deleteDeveloper = async (req: Request, res: Response): Promise<Response> => {

    const queryString: string = `DELETE
    FROM developers
    WHERE id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);
    return res.status(204).json(
        queryResult.rows[0]
    );
}
const getDeveloper = async (req: Request, res: Response): Promise<Response> => {


    const queryString: string = ` SELECT 
    de."id" "developerId",
    de."name"  "developerName",
    de."email" "developerEmail",
    df."developerSince" "developerInfoDeveloperSince",
    df."preferredOS" "developerInfoPreferredOS"
    FROM
    developers de
    LEFT JOIN
    developer_infos df ON de."id" = df."developerId";
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
    }
    const queryResult: QueryResult<Developer> = await client.query(queryConfig);




    return res.status(200).json(queryResult.rows[0]);
}
const updateDeveloper = async (req: Request, res: Response): Promise<Response> => {
    const queryKeys = Object.keys(req.body);
    const queryValues = Object.values(req.body);
    const queryString: string = format(`UPDATE developers
    SET (%I) = ROW(%L)
    WHERE id=$1 RETURNING *;
    `, queryKeys, queryValues);

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.id]
    }
    const queryResult: QueryResult = await client.query(queryConfig);

    return res.status(200).json(queryResult.rows[0]);
}
 const createProject = async (
    req: Request, 
    res: Response
): Promise<Response> => {
    const projectData: projectRegister = req.body

    const queryString: string = format(
        `
        INSERT INTO
        projects(%I)
        VALUES
            (%L)
        RETURNING  * ;
        `,
        Object.keys(projectData),
        Object.values(projectData)
    )

    const queryResult: QueryResult<project> = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])
}

const addTechInProject = async (req: Request, res: Response): Promise<Response> => {

    const queryString: string = `
    INSERT INTO technologies
    ("developerSince", "preferredOS", "developerId")
    VALUES($1, $2, $3)
     RETURNING *;
    `;


    const queryConfig: QueryConfig = {
        text: queryString,
        values: [ req.params.id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);
    return res.status(201).json(
        queryResult.rows[0]
    );

    return res.status(201).json()
}


export {
    createDeveloper,
    deleteDeveloper,
    createDeveloperInfos,
    updateDeveloper,
    getDeveloper,
    createProject,
    addTechInProject
}