/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Article } from '../models/Article';
import type { ArticleComponentSwap } from '../models/ArticleComponentSwap';
import type { ArticleUpload } from '../models/ArticleUpload';
import type { EditArticleProteinComponent } from '../models/EditArticleProteinComponent';
import type { EditArticleTextComponent } from '../models/EditArticleTextComponent';
import type { EditBody } from '../models/EditBody';
import type { LoginBody } from '../models/LoginBody';
import type { LoginResponse } from '../models/LoginResponse';
import type { ProteinEditSuccess } from '../models/ProteinEditSuccess';
import type { ProteinEntry } from '../models/ProteinEntry';
import type { RangeFilter } from '../models/RangeFilter';
import type { SearchProteinsBody } from '../models/SearchProteinsBody';
import type { SearchProteinsResults } from '../models/SearchProteinsResults';
import type { SimilarProtein } from '../models/SimilarProtein';
import type { Tutorial } from '../models/Tutorial';
import type { TutorialEdit } from '../models/TutorialEdit';
import type { TutorialUpload } from '../models/TutorialUpload';
import type { UploadArticleProteinComponent } from '../models/UploadArticleProteinComponent';
import type { UploadArticleTextComponent } from '../models/UploadArticleTextComponent';
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
     * @returns RangeFilter Successful Response
     * @throws ApiError
     */
    public static searchRangeLength(): CancelablePromise<RangeFilter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/range/length',
        });
    }
    /**
     * Search Range Mass
     * @returns RangeFilter Successful Response
     * @throws ApiError
     */
    public static searchRangeMass(): CancelablePromise<RangeFilter> {
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
     * edit_protein_entry
     * Returns: On successful edit, will return an object with editedName
     * If not successful will through an HTTP status 500
     * @param requestBody
     * @returns ProteinEditSuccess Successful Response
     * @throws ApiError
     */
    public static editProteinEntry(
        requestBody: EditBody,
    ): CancelablePromise<ProteinEditSuccess> {
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
     * Align Proteins
     * @param proteinA
     * @param proteinB
     * @returns string Successful Response
     * @throws ApiError
     */
    public static alignProteins(
        proteinA: string,
        proteinB: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/pdb/{proteinA}/{proteinB}',
            path: {
                'proteinA': proteinA,
                'proteinB': proteinB,
            },
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
    /**
     * Get Tutorial
     * @param title
     * @returns Tutorial Successful Response
     * @throws ApiError
     */
    public static getTutorial(
        title: string,
    ): CancelablePromise<Tutorial> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tutorial/{title: str}',
            query: {
                'title': title,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Tutorial
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editTutorial(
        requestBody: TutorialEdit,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tutorial',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Tutorial
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadTutorial(
        requestBody: TutorialUpload,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tutorial',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Tutorial
     * @param title
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteTutorial(
        title: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tutorial/{title}',
            path: {
                'title': title,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Article
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticle(
        requestBody: ArticleUpload,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/upload',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Article
     * @param title
     * @returns Article Successful Response
     * @throws ApiError
     */
    public static getArticle(
        title: string,
    ): CancelablePromise<Article> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/{title}',
            path: {
                'title': title,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Article Text Component
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleTextComponent(
        requestBody: EditArticleTextComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/component/text',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Article Text Component
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticleTextComponent(
        requestBody: UploadArticleTextComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/component/text',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Article Text Component
     * @param componentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteArticleTextComponent(
        componentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/article/component/text/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Article Protein Component
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleProteinComponent(
        requestBody: EditArticleProteinComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/component/protein',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Article Protein Component
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticleProteinComponent(
        requestBody: UploadArticleProteinComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/component/protein',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Article Protein Component
     * @param componentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteArticleProteinComponent(
        componentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/article/component/protein/{component_id}',
            path: {
                'component_id': componentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Swap Component Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static swapComponentOrder(
        requestBody: ArticleComponentSwap,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/component/swap/{direction}',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
