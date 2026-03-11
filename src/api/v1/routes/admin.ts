import express, { Router } from "express";
import { setUserClaims } from "../controllers/adminContoller";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const adminRouter: Router = express.Router();

adminRouter.post("/admin/setCustomClaims", authenticate, isAuthorized({hasRole: ["admin"], allowSameUser: true}), setUserClaims);

export default adminRouter;