/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllEntries } from '../models/AllEntries';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Get All Entries
     * @returns AllEntries Successful Response
     * @throws ApiError
     */
    public static getAllEntries(): CancelablePromise<AllEntries> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/all-entries',
        });
    }

}
