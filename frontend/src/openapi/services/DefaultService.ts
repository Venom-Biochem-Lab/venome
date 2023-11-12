/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProteinEntry } from '../models/ProteinEntry';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Get All Entries
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getAllEntries(): CancelablePromise<Array<ProteinEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/all-entries',
        });
    }

    /**
     * Get Protein Entry
     * @param proteinId
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getProteinEntry(
        proteinId: string,
    ): CancelablePromise<ProteinEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein-entry/{protein_id}',
            path: {
                'protein_id': proteinId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
