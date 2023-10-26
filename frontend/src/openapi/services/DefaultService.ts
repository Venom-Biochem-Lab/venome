/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllResponse } from '../models/AllResponse';
import type { RandNormBody } from '../models/RandNormBody';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Hello World
     * @returns AllResponse Successful Response
     * @throws ApiError
     */
    public static helloWorld(): CancelablePromise<AllResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    /**
     * Gen Norm Dist
     * @param requestBody
     * @returns number Successful Response
     * @throws ApiError
     */
    public static genNormDist(
        requestBody: RandNormBody,
    ): CancelablePromise<Array<number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gen-norm-dist',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
