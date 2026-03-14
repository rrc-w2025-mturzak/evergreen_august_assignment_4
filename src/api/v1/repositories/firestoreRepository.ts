import { db } from "../config/firebaseConfig";
import { DocumentReference, QuerySnapshot } from "firebase-admin/firestore";
import { Loan } from "../models/loanModel";
import { LoanCreateRequest } from "../models/loanCreateRequestModel";
import { LoanUpdateRequest } from "../models/loanUpdateRequestModel";
import { LoanDTO } from "../models/loanDTO";

export const addLoan = async (item:LoanCreateRequest): Promise<string> => {

    const docRef: DocumentReference = db.collection("loans").doc("6");

    const itemEntity: Loan = {
        applicant: item.applicant,
        amount: item.amount,
        status: item.status,
        createdAt: new Date()
    }
    await docRef.set(itemEntity);
    return docRef.id;
};

export const getLoanById = async (id: string): Promise<LoanDTO | undefined> => {
    const docRef: DocumentReference = db.collection("loans").doc(id);

    const doc = await docRef.get();

    if (doc.exists) {
        let data = doc.data();

        return {
            id: doc.id,
            applicant: data!.applicant,
            amount: data!.amount,
            status: data!.status,
            createdAt: data!. createdAt
        }
    } else {
        console.log("No such loan!");
    }
};

export const getLoans = async (): Promise<Array<LoanDTO> | undefined> => {

    const snapshot: QuerySnapshot = await db.collection("loans").get();

    const Loans: LoanDTO[] = []
    snapshot.forEach((doc) => {
        let data = doc.data();
        Loans.push({
            id: doc.id,
            applicant: data!.applicant,
            amount: data!.amount,
            status: data!.status,
            createdAt: data!.createdAt?.toDate().toISOString()
        });
    });

    return Loans;
};

export const updateLoans = async (id: string , item: LoanUpdateRequest): Promise<void> => {

    const docRef: DocumentReference = db.collection("loans").doc(id);

    const updateData: Partial<Loan> = {};
    if (item.applicant !== undefined) updateData.applicant = item.applicant;
    if (item.amount !== undefined) updateData.amount = item.amount;
    if (item.status !== undefined) updateData.status = item.status;

    if (Object.keys(updateData).length === 0) {
        return;
    }

    await docRef.update(updateData);
    return;
};

export const deleteLoan = async (id: string): Promise<void> => {

    const docRef: DocumentReference = db.collection("loans").doc(id);

    await docRef.delete();
};
