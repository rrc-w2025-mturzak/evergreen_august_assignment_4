import { addLoan, getLoanById, getLoans, updateLoans, deleteLoan } from "../repositories/firestoreRepository";
import { LoanReponse } from "../models/loanResponse";
import { LoanCreateRequest } from "../models/loanCreateRequestModel";
import { LoanDTO } from "../models/loanDTO";
import { LoanNotFoundError } from "../errors/errors";

export const createNewLoan =  async (item: LoanCreateRequest): Promise<string> => {
    return await addLoan(item); 
}

export const getLoanByIdAsync = async (id: string): Promise<LoanReponse> => {
    const entity = await getLoanById(id);

    if (!entity) {
        throw new LoanNotFoundError(`Loan application not found`);
    }

    return {
        id: entity.id,
        applicant: entity.applicant
    };
}

export const getAllLoans = async (): Promise<Array<LoanDTO> | undefined> => {
    return await getLoans();
}

export const updateLoanById = async (id: string, item: LoanCreateRequest): Promise<void> => {
    await updateLoans(id, item);
    return;
}

export const deleteLoanById = async (id: string): Promise<void> => {
    const deleted = await deleteLoan(id);
    if (!deleted) {
        throw new LoanNotFoundError(`Loan application not found`);
    }
}