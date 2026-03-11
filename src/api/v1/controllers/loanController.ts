import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { createNewLoan, getLoanByIdAsync, getAllLoans, updateLoanById, deleteLoanById } from "../services/loanService";
import { LoanCreateRequest } from "../models/loanCreateRequestModel";

export const healthData = (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
};


export const createLoan = async (req: Request, res: Response) => {
    const requestLoan: LoanCreateRequest = {
        applicant: req.body.applicant,
        amount: req.body.amount,
        status: req.body.status
    }
    let result = await createNewLoan(requestLoan)
    res.status(HTTP_STATUS.CREATED).send(result)
}

export const getLoanById = async (req: Request, res: Response) => {
    try {
        let id = req.params.id as string;
        let results = await getLoanByIdAsync(id)

        res.status(HTTP_STATUS.OK).json(successResponse(results, "Loan retrieved"))
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error"})
    }
}

export const getAllLoan = async (req: Request, res: Response) => {
    try {
        const Loans = await getAllLoans();
        res.status(HTTP_STATUS.OK).json(successResponse(Loans, "Loans retrieved"))
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error"})
    }
}

export const updateLoanByIdAsync = async (req: Request, res: Response) => {
    let id: string = req.params.id as string; 
    let request: LoanCreateRequest = {
        applicant: req.body.applicant,
        amount: req.body.amount,
        status: req.body.status
    }

    await updateLoanById(id, request)

    res.status(HTTP_STATUS.NO_CONTENT).send(`Loan ${id} was updated`);
}

export const deleteLoanByIdAsync = async (req: Request, res: Response) => {
    let id = req.params.id as string;
    await deleteLoanById(id)

    res.status(HTTP_STATUS.NO_CONTENT).send(`Loan ${id} was deleted`);
}
