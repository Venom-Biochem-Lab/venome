/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditBody } from '../models/EditBody';
import type { LoginBody } from '../models/LoginBody';
import type { LoginResponse } from '../models/LoginResponse';
import type { ProteinEntry } from '../models/ProteinEntry';
import type { SearchProteinsBody } from '../models/SearchProteinsBody';
import type { SearchProteinsResults } from '../models/SearchProteinsResults';
import type { SimilarProtein } from '../models/SimilarProtein';
import type { Tutorial } from '../models/Tutorial';
import type { UploadBody } from '../models/UploadBody';
import type { UploadError } from '../models/UploadError';
import type { UploadPNGBody } from '../models/UploadPNGBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Login
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static login(
        requestBody: LoginBody,
    ): CancelablePromise<(LoginResponse | null)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Proteins
     * @param requestBody
     * @returns SearchProteinsResults Successful Response
     * @throws ApiError
     */
    public static searchProteins(
        requestBody: SearchProteinsBody,
    ): CancelablePromise<SearchProteinsResults> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/search/proteins',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Range Length
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchRangeLength(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/range/length',
        });
    }
    /**
     * Search Range Mass
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchRangeMass(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/range/mass',
        });
    }
    /**
     * Search Species
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchSpecies(): CancelablePromise<(Array<string> | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/species',
        });
    }
    /**
     * Search Venome Similar
     * @param proteinName
     * @returns SimilarProtein Successful Response
     * @throws ApiError
     */
    public static searchVenomeSimilar(
        proteinName: string,
    ): CancelablePromise<Array<SimilarProtein>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/venome/similar/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pdb File
     * @param proteinName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPdbFile(
        proteinName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/pdb/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Fasta File
     * @param proteinName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFastaFile(
        proteinName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/fasta/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Protein Entry
     * Get a single protein entry by its id
     * Returns: ProteinEntry if found | None if not found
     * @param proteinName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProteinEntry(
        proteinName: string,
    ): CancelablePromise<(ProteinEntry | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/entry/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Protein Entry
     * @param proteinName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProteinEntry(
        proteinName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/protein/entry/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Protein Png
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadProteinPng(
        requestBody: UploadPNGBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/protein/upload/png',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Protein Entry
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadProteinEntry(
        requestBody: UploadBody,
    ): CancelablePromise<(UploadError | null)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/protein/upload',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Protein Entry
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editProteinEntry(
        requestBody: EditBody,
    ): CancelablePromise<(UploadError | null)> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/protein/edit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Tutorials
     * @returns Tutorial Successful Response
     * @throws ApiError
     */
    public static getAllTutorials(): CancelablePromise<Array<Tutorial>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tutorials',
        });
    }
}
