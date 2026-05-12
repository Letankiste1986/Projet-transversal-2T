import express from "express";
import * as data from "../controllers/dataControllers";


const router = express.Router();

router.get("/",data.getAllData);

export default router;