/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllReturn } from '../models/AllReturn';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * Hello World
     * @returns AllReturn Successful Response
     * @throws ApiError
     */
    public static helloWorld(): CancelablePromise<AllReturn> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

}
