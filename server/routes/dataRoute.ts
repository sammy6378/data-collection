import express, {Router} from "express";
import { createData } from "../controller/createData";

const dataRouter = Router();

dataRouter.post("/create", createData);

export default dataRouter;