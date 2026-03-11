import express, { Router } from "express";
import { healthData, 
        createLoan, 
        getLoanById, 
        getAllLoan, 
        updateLoanByIdAsync, 
        deleteLoanByIdAsync } from "../controllers/loanController";
import { validateRequest } from "../middleware/validateRequest";
import { postSchemas } from "../validation/loanValidation";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const loanRouter: Router = express.Router();

loanRouter.get("/health", healthData);
loanRouter.get("/loans", authenticate, getAllLoan);
loanRouter.get("/loans/:id", authenticate, validateRequest(postSchemas.getById), getLoanById);
loanRouter.post("/loans", authenticate, isAuthorized({ hasRole: ["admin"], allowSameUser: true}), validateRequest(postSchemas.create), createLoan);
loanRouter.put("/loans/:id", authenticate, isAuthorized({ hasRole: ["admin"], allowSameUser: true}),validateRequest(postSchemas.update), updateLoanByIdAsync);
loanRouter.delete("/loans/:id", authenticate, isAuthorized({ hasRole: ["admin"], allowSameUser: true}),validateRequest(postSchemas.delete), deleteLoanByIdAsync);

export default loanRouter;