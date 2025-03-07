/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProteinBody } from './ProteinBody';
import type { RequestStatus } from './RequestStatus';
export type RequestBody = {
    userId: number;
    comment: string;
    status: RequestStatus;
    protein: ProteinBody;
};

