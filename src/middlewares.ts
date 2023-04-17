import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

const verifyId = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    let { id } = req.params;



    if (req.route.path === "/projects" && req.method === "POST") {
        id = req.body.developerId;
    }

    const queryString: string = `SELECT *
    FROM developers
    WHERE id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);

    if (queryResult.rowCount > 0) {
        res.locals.developer = queryResult.rows[0];
        return next();
    }

    return res.status(404).json({
        "message": "Developer not found."
    });
};
const verifyEmal = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const { email } = req.body;

    const queryString: string = `SELECT *
    FROM developers
    WHERE email = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [email]
    }

    const queryResult: QueryResult = await client.query(queryConfig);

    if (queryResult.rowCount > 0) {
        return res.status(409).json({
            "message": "Email already exists."
        });
    }
    return next();

};

const verifySO = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { preferredOS } = req.body;
    const options = ["Windows", "Linux", "MacOS"]

    if (options.includes(preferredOS)) {
        return next();
    }
    return res.status(400).json({
        "message": "Invalid OS option.",
        "options": ["Windows", "Linux", "MacOS"]
    });


}
const verifyInfos = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;

    const queryString: string = `SELECT id
    FROM developer_infos
    WHERE "developerId" = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);

    if (queryResult.rowCount > 0) {
        return res.status(409).json({
            "message": "Developer infos already exists."
        });
    }
    return next();
}
const verifyTechName = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name } = req.body;

    const queryString: string = `SELECT id
    FROM technologies
    WHERE name = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name]
    }

    const queryResult: QueryResult = await client.query(queryConfig);

    if (queryResult.rowCount > 0) {

        res.locals.techID = queryResult.rows[0];
        return next();
    }
    return res.status(400).json({
        message: "Technology not supported.",
        options: [
            "JavaScript",
            "Python",
            "React",
            "Express.js",
            "HTML",
            "CSS",
            "Django",
            "PostgreSQL",
            "MongoDB"
        ]
    })

}
const verifyTechNameExistsInProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const queryString: string = `SELECT *
    FROM projects_technologies
    WHERE "technologyId" = $1;
    `;


    const queryConfig: QueryConfig = {
        text: queryString,
        values: [res.locals.techID.id]
    }


    const queryResult: QueryResult = await client.query(queryConfig);


    if (queryResult.rowCount > 0) {

        return res.status(409).json({
            "message": "This technology is already associated with the project"
        })
    }

    return next();


}

const verifyIdProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const queryString: string = `SELECT id
    FROM projects
    WHERE "id" = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.id]
    }

    const queryResult: QueryResult = await client.query(queryConfig);

    

    if (queryResult.rowCount == 0) {        
        return res.status(404).json({
            message: "Project not found."
        });
    }
    
    return next();
}

export {
    verifyId,
    verifyEmal,
    verifySO,
    verifyInfos,
    verifyTechName,
    verifyTechNameExistsInProject,
    verifyIdProject
}