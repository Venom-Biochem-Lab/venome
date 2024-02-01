/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditBody } from '../models/EditBody';
import type { LoginBody } from '../models/LoginBody';
import type { LoginError } from '../models/LoginError';
import type { ProteinEntry } from '../models/ProteinEntry';
import type { ResponseToken } from '../models/ResponseToken';
import type { SimilarProtein } from '../models/SimilarProtein';
import type { UploadBody } from '../models/UploadBody';
import type { UploadError } from '../models/UploadError';

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
    ): CancelablePromise<(ResponseToken | LoginError)> {
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
     * Get Similar Pdb
     * @param proteinName
     * @returns SimilarProtein Successful Response
     * @throws ApiError
     */
    public static getSimilarPdb(
        proteinName: string,
    ): CancelablePromise<Array<SimilarProtein>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/similar-pdb/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Similar Venome
     * @param proteinName
     * @returns SimilarProtein Successful Response
     * @throws ApiError
     */
    public static getSimilarVenome(
        proteinName: string,
    ): CancelablePromise<Array<SimilarProtein>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/similar-venome/{protein_name}',
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
            url: '/pdb/{protein_name}',
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
            url: '/fasta/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Entries
     * Gets all protein entries from the database
     * Returns: list[ProteinEntry] if found | None if not found
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllEntries(): CancelablePromise<(Array<ProteinEntry> | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/all-entries',
        });
    }

    /**
     * Search Entries
     * Gets a list of protein entries by a search string
     * Returns: list[ProteinEntry] if found | None if not found
     * @param proteinName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchEntries(
        proteinName: string,
    ): CancelablePromise<(Array<ProteinEntry> | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search-entries/{protein_name}',
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
            url: '/protein-entry/{protein_name}',
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
            url: '/protein-entry/{protein_name}',
            path: {
                'protein_name': proteinName,
            },
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
            url: '/protein-upload',
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
            url: '/protein-edit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get All Species
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllSpecies(): CancelablePromise<(Array<string> | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/all-species',
        });
    }

}
