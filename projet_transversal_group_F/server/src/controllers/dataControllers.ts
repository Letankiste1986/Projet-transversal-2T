import type { NextFunction, Request, Response } from "express";
import { allData } from '../services/dataServices';

export const getAllData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await allData();
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
}

