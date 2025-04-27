/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProteinUploadBody } from './ProteinUploadBody';
import type { RequestStatus } from './RequestStatus';
/**
 * Request body for protein upload.
 */
export type RequestBody = {
    userId: number;
    comment: string;
    status: RequestStatus;
    protein: ProteinUploadBody;
};

