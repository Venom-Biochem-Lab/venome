/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestStatus } from './RequestStatus';
/**
 * Full protein information for the request page.
 */
export type FullProteinInfo = {
    proteinId: number;
    proteinName: string;
    proteinContent: string;
    species: string;
    requestId: number;
    userId: number;
    username: string;
    requestDate: string;
    requestStatus: RequestStatus;
    comment: string;
};

