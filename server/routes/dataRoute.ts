import express, {Router} from "express";
import { createData, getData } from "../controller/createData";

const dataRouter = Router();

dataRouter.post("/create", createData);
dataRouter.get("/get-data", getData);

export default dataRouter;