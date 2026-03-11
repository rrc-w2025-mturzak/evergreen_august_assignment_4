import { Request, Response } from "express";
import { auth } from "../config/firebaseConfig";

export const setUserClaims = async (req: Request, res: Response) => {
    let userClaimsToset = req.body

    await auth.setCustomUserClaims(userClaimsToset.uid, userClaimsToset.claims)
    res.status(200).send("Ok");
}
