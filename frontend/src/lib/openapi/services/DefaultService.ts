/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArticleEntry } from '../models/ArticleEntry';
import type { ArticleImageComponent } from '../models/ArticleImageComponent';
import type { ArticleImageEditBody } from '../models/ArticleImageEditBody';
import type { ArticleImageUploadBody } from '../models/ArticleImageUploadBody';
import type { ArticleMetadataEditBody } from '../models/ArticleMetadataEditBody';
import type { ArticleProteinComponent } from '../models/ArticleProteinComponent';
import type { ArticleProteinEditBody } from '../models/ArticleProteinEditBody';
import type { ArticleProteinUploadBody } from '../models/ArticleProteinUploadBody';
import type { ArticleTextComponent } from '../models/ArticleTextComponent';
import type { ArticleTextEditBody } from '../models/ArticleTextEditBody';
import type { ArticleTextUploadBody } from '../models/ArticleTextUploadBody';
import type { ArticleUploadBody } from '../models/ArticleUploadBody';
import type { FullProteinInfo } from '../models/FullProteinInfo';
import type { InsertBlankComponentEnd } from '../models/InsertBlankComponentEnd';
import type { InsertComponent } from '../models/InsertComponent';
import type { MoveComponent } from '../models/MoveComponent';
import type { ProteinEditBody } from '../models/ProteinEditBody';
import type { ProteinEntry } from '../models/ProteinEntry';
import type { ProteinUploadBody } from '../models/ProteinUploadBody';
import type { RangeFilter } from '../models/RangeFilter';
import type { RequestBody } from '../models/RequestBody';
import type { RequestStatus } from '../models/RequestStatus';
import type { RequestStatusEdit } from '../models/RequestStatusEdit';
import type { SearchProteinsBody } from '../models/SearchProteinsBody';
import type { SearchProteinsResults } from '../models/SearchProteinsResults';
import type { SimilarProtein } from '../models/SimilarProtein';
import type { TMAlignInfo } from '../models/TMAlignInfo';
import type { UploadPNGBody } from '../models/UploadPNGBody';
import type { UserEditBody } from '../models/UserEditBody';
import type { UserEntry } from '../models/UserEntry';
import type { UserIDResponse } from '../models/UserIDResponse';
import type { UserLoginBody } from '../models/UserLoginBody';
import type { UserLoginResponse } from '../models/UserLoginResponse';
import type { UserProteinResponse } from '../models/UserProteinResponse';
import type { UserSignupBody } from '../models/UserSignupBody';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Signup
     * Creates a new user account.
     *
     * Args:
     * body (UserSignupBody): The request body containing user signup info.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signup(
        requestBody: UserSignupBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * Logs in a user and returns a JWT token and user ID.
     *
     * Args:
     * body (UserLoginBody): The request body containing
     * user login information.
     * Returns:
     * UserLoginResponse: The response containing the
     * JWT token, user ID.
     * @param requestBody
     * @returns UserLoginResponse Successful Response
     * @throws ApiError
     */
    public static login(
        requestBody: UserLoginBody,
    ): CancelablePromise<UserLoginResponse> {
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
     * Get Users
     * Returns a list of all users in the database
     *
     * Args:
     * req (Request): The request object.
     * Returns:
     * list[UserEntry]: The response containing a list of users,
     * and an error message if any.
     * @returns UserEntry Successful Response
     * @throws ApiError
     */
    public static getUsers(): CancelablePromise<Array<UserEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
        });
    }
    /**
     * Get User
     * Returns the user entry for a given user ID.
     *
     * Args:
     * user_id (int): The user ID to retrieve.
     * Returns:
     * UserEntry: The response containing the user entry,
     * and an error message if any.
     * @param userId
     * @returns UserEntry Successful Response
     * @throws ApiError
     */
    public static getUser(
        userId: number,
    ): CancelablePromise<UserEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit User
     * Edits a user entry for a given user ID.
     *
     * Args:
     * user_id (int): The user ID to edit.
     * body (UserEditBody): The request body containing user info.
     * req (Request): The request object.
     * @param userId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static editUser(
        userId: number,
        requestBody: UserEditBody,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * Deletes a user entry for a given user ID.
     *
     * Args:
     * user_id (int): The user ID to delete.
     * req (Request): The request object.
     * @param userId
     * @returns void
     * @throws ApiError
     */
    public static deleteUser(
        userId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Id
     * Returns the user ID for a given username.
     *
     * Args:
     * username (str): The username to retrieve the ID for.
     * Returns:
     * UserIDResponse: The response containing the user ID,
     * and an error message if any.
     * @param username
     * @returns UserIDResponse Successful Response
     * @throws ApiError
     */
    public static getUserId(
        username: string,
    ): CancelablePromise<UserIDResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/id/{username}',
            path: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Proteins
     * Returns a list of protein names for a given user ID.
     *
     * Args:
     * user_id (int): The user ID to retrieve proteins for.
     * Returns:
     * UserProteinResponse: The response containing a list of protein names,
     * and an error message if any.
     * @param userId
     * @returns UserProteinResponse Successful Response
     * @throws ApiError
     */
    public static getUserProteins(
        userId: number,
    ): CancelablePromise<UserProteinResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{user_id}/proteins',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Proteins
     * Search for proteins in the database based on various filters.
     * Args:
     * body (SearchProteinsBody): The request body containing parameters.
     * Returns:
     * SearchProteinsResults: The search results containing protein entries.
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
     * Get the range of protein lengths in the database.
     * Returns:
     * RangeFilter: The minimum and maximum protein lengths.
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
     * Get the range of protein masses in the database.
     * Returns:
     * RangeFilter: The minimum and maximum protein masses.
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
     * Search Range Atoms
     * Get the range of protein atoms in the database.
     * Returns:
     * RangeFilter: The minimum and maximum protein atoms.
     * @returns RangeFilter Successful Response
     * @throws ApiError
     */
    public static searchRangeAtoms(): CancelablePromise<RangeFilter> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/range/atoms',
        });
    }
    /**
     * Search Species
     * Get the list of species in the database.
     * Returns:
     * list[str] | None: The list of species names.
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
     * Search for similar proteins in the Venome database.
     * Args:
     * protein_name (str): The name of the protein to search for.
     * Returns:
     * list[SimilarProtein]: A list of similar proteins.
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
     * Search Venome Similar Compare
     * Search for a specific protein in the Venome database
     * and compare it to another protein.
     * Args:
     * protein_name (str): The name of the protein to search for.
     * protein_compare (str): The name of the protein to compare against.
     * Returns:
     * SimilarProtein: The most similar protein to the specified protein.
     * @param proteinName
     * @param proteinCompare
     * @returns SimilarProtein Successful Response
     * @throws ApiError
     */
    public static searchVenomeSimilarCompare(
        proteinName: string,
        proteinCompare: string,
    ): CancelablePromise<SimilarProtein> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/search/venome/similar/{protein_name}/{protein_compare}',
            path: {
                'protein_name': proteinName,
                'protein_compare': proteinCompare,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Plddt Given Protein
     * Returns the pLDDT values for a given protein
     * @param proteinName
     * @returns number Successful Response
     * @throws ApiError
     */
    public static getPlddtGivenProtein(
        proteinName: string,
    ): CancelablePromise<Record<string, Array<number>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/pLDDT/{protein_name}',
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
     * Returns the PDB file for a given protein
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
     * Returns the FASTA file for a given protein
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
     * Returns: ProteinEntry if found
     * @param proteinName
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getProteinEntry(
        proteinName: string,
    ): CancelablePromise<ProteinEntry> {
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
     * Deletes a protein entry by its name
     * Args:
     * protein_name (str): The name of the protein
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
     * Get Protein Entry User
     * Get the user who created a protein entry
     * Args:
     * protein_name (str): The name of the protein
     * Returns:
     * UserEntry: The user who created the protein entry
     * @param proteinName
     * @returns UserEntry Successful Response
     * @throws ApiError
     */
    public static getProteinEntryUser(
        proteinName: string,
    ): CancelablePromise<UserEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/entry/{protein_name}/user',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Protein Entries
     * Get all protein entries
     * Returns: List of ProteinEntry objects
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getAllProteinEntries(): CancelablePromise<Array<ProteinEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/entries',
        });
    }
    /**
     * Get All Pending Protein Entries
     * Get all protein entries that are pending approval
     * Returns: List of ProteinEntry objects
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getAllPendingProteinEntries(): CancelablePromise<Array<ProteinEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/entries/pending',
        });
    }
    /**
     * Get All Denied Protein Entries
     * Get all protein entries that are denied
     * Returns: List of ProteinEntry objects
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getAllDeniedProteinEntries(): CancelablePromise<Array<ProteinEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/entries/denied',
        });
    }
    /**
     * Upload Protein Png
     * Uploads a protein thumbnail image to the database
     * Args:
     * body (UploadPNGBody): The request containing the protein image
     * req (Request): The request object
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
     * Add Protein Entry
     * Adds a protein entry to the database
     * Args:
     * body (ProteinUploadBody): The protein body
     * req (Request): The request object
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addProteinEntry(
        requestBody: ProteinUploadBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/protein/add',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Protein Entry
     * Wrapper that adds a protein entry then creates an approved request
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadProteinEntry(
        requestBody: ProteinUploadBody,
    ): CancelablePromise<any> {
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
     * Get Protein Status
     * Get the status of a protein request
     * Args:
     * protein_name (str): The name of the protein
     * req (Request): The request object
     * Returns:
     * RequestStatus: The status of the protein request
     * @param proteinName
     * @returns RequestStatus Successful Response
     * @throws ApiError
     */
    public static getProteinStatus(
        proteinName: string,
    ): CancelablePromise<RequestStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/{protein_name}/request',
            path: {
                'protein_name': proteinName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Request Protein Entry
     * Wrapper that adds a protein entry then creates a request
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static requestProteinEntry(
        requestBody: RequestBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/protein/request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Request Status
     * Edit the status of a protein request
     * Args:
     * body (RequestStatusEdit): The request body
     * req (Request): The request object
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editRequestStatus(
        requestBody: RequestStatusEdit,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/protein/request/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Request Entries
     * Get all protein request entries
     * Returns: List of FullProteinInfo objects
     * @returns FullProteinInfo Successful Response
     * @throws ApiError
     */
    public static getAllRequestEntries(): CancelablePromise<Array<FullProteinInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/request/entries',
        });
    }
    /**
     * Edit Protein Entry
     * Edits a protein entry in the database
     * Args:
     * body (ProteinEditBody): The request body
     * req (Request): The request object
     * Returns:
     * ProteinEditSuccess: The response containing the edited protein name
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editProteinEntry(
        requestBody: ProteinEditBody,
    ): CancelablePromise<any> {
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
     * Returns the aligned PDB file for two proteins
     * Args:
     * protein_a (str): The name of the first protein
     * protein_b (str): The name of the second protein
     * Returns:
     * StreamingResponse: The aligned PDB file
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
            query: {
                'protein_a': proteinA,
                'protein_b': proteinB,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Tm Info
     * Returns the TM Align info for two proteins
     * Args:
     * protein_a (str): The name of the first protein
     * protein_b (str): The name of the second protein
     * Returns:
     * TMAlignInfo: The TM Align info
     * @param proteinA
     * @param proteinB
     * @returns TMAlignInfo Successful Response
     * @throws ApiError
     */
    public static getTmInfo(
        proteinA: string,
        proteinB: string,
    ): CancelablePromise<TMAlignInfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/tmalign/{proteinA}/{proteinB}',
            query: {
                'protein_a': proteinA,
                'protein_b': proteinB,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Random Protein
     * Get a random protein entry from the database
     * Returns: ProteinEntry object
     * @returns ProteinEntry Successful Response
     * @throws ApiError
     */
    public static getRandomProtein(): CancelablePromise<ProteinEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protein/random',
        });
    }
    /**
     * Get Text Components
     * Get all text components for a given article ID.
     * Args:
     * article_id (int): ID of the article.
     * Returns:
     * list[ArticleTextComponent]: List of text components for the article.
     * @param articleId
     * @returns ArticleTextComponent Successful Response
     * @throws ApiError
     */
    public static getTextComponents(
        articleId: number,
    ): CancelablePromise<Array<ArticleTextComponent>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/{article_id}/components/text',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Protein Components
     * Get all protein components for a given article ID.
     *
     * Args:
     * article_id (int): ID of the article.
     * Returns:
     * list[ArticleProteinComponent]: List of protein components for the
     * article.
     * @param articleId
     * @returns ArticleProteinComponent Successful Response
     * @throws ApiError
     */
    public static getProteinComponents(
        articleId: number,
    ): CancelablePromise<Array<ArticleProteinComponent>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/{article_id}/components/protein',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Image Components
     * Get all image components for a given article ID.
     * Args:
     * article_id (int): ID of the article.
     * Returns:
     * list[ArticleImageComponent]: List of image components for the article.
     * @param articleId
     * @returns ArticleImageComponent Successful Response
     * @throws ApiError
     */
    public static getImageComponents(
        articleId: number,
    ): CancelablePromise<Array<ArticleImageComponent>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/{article_id}/components/image',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Article Metadata
     * Get metadata for a given article ID.
     * Args:
     * article_id (int): ID of the article.
     * Returns:
     * tuple: A tuple containing the title, description, date_published,
     * and refs of the article.
     * @param articleId
     * @returns any[] Successful Response
     * @throws ApiError
     */
    public static getArticleMetadata(
        articleId: number,
    ): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/{article_id}/components',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Articles Metadata
     * Get all articles metadata.
     * Returns:
     * list[ArticleEntry]: List of all articles with their metadata.
     * @returns ArticleEntry Successful Response
     * @throws ApiError
     */
    public static getAllArticlesMetadata(): CancelablePromise<Array<ArticleEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/all',
        });
    }
    /**
     * Get Article
     * Get article entry by ID.
     *
     * Args:
     * id (int): ID of the article
     *
     * Returns:
     * Article: The article object containing the article ID,
     * title, description, date published, and ordered components.
     * @param articleId
     * @returns ArticleEntry Successful Response
     * @throws ApiError
     */
    public static getArticle(
        articleId: number,
    ): CancelablePromise<ArticleEntry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/article/meta/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Article
     * Deletes an article by ID.
     * Args:
     * article_id (int): ID of the article to delete.
     * req (Request): The request object.
     * @param articleId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteArticle(
        articleId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/article/meta/{article_id}',
            path: {
                'article_id': articleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Article
     * Upload an article.
     * Args:
     * body (ArticleUploadBody): The article upload body
     * containing the article title and description.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticle(
        requestBody: ArticleUploadBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/meta/upload',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Article Metadata
     * Edit article metadata.
     * Args:
     * body (ArticleMetadataEditBody): The article metadata edit body
     * containing the article title, new title, new description, and new
     * references.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleMetadata(
        requestBody: ArticleMetadataEditBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/meta',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Article Component
     * Deletes an article component by ID.
     * Args:
     * article_id (int): ID of the article.
     * component_id (int): ID of the component to delete.
     * req (Request): The request object.
     * @param articleId
     * @param componentId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteArticleComponent(
        articleId: number,
        componentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/article/{article_id}/component/{component_id}',
            path: {
                'article_id': articleId,
                'component_id': componentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Article Text Component
     * Edit a text component
     * Args:
     * body (ArticleTextEditBody): The article text edit body
     * containing the component ID and new markdown.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleTextComponent(
        requestBody: ArticleTextEditBody,
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
     * Upload a text component
     * Args:
     * body (UploadArticleTextComponent): The article text upload body
     * containing the article ID and markdown.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticleTextComponent(
        requestBody: ArticleTextUploadBody,
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
     * Edit Article Protein Component
     * Edit a protein component
     * Args:
     * body (ArticleProteinEditBody): The article protein edit body
     * containing the component ID, new name, and new aligned with name.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleProteinComponent(
        requestBody: ArticleProteinEditBody,
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
     * Upload a protein component
     * Args:
     * body (ArticleProteinUploadBody): The article protein upload body
     * containing the article ID, name, and aligned with name.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticleProteinComponent(
        requestBody: ArticleProteinUploadBody,
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
     * Edit Article Image Component
     * Edit an image component
     * Args:
     * body (ArticleImageEditBody): The article image edit body
     * containing the component ID, new source, new width, and new height.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static editArticleImageComponent(
        requestBody: ArticleImageEditBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/component/image',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Article Image Component
     * Upload an image component
     * Args:
     * body (ArticleImageUploadBody): The article image upload body
     * containing the article ID, source, width, and height.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadArticleImageComponent(
        requestBody: ArticleImageUploadBody,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/component/image',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Insert Component Above
     * Insert a component at the top.
     * Args:
     * body (InsertComponent): The insert component body
     * containing the article ID, component ID, and component type.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertComponentAbove(
        requestBody: InsertComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/component/insert/above',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Insert Blank Component End
     * Insert a blank component at the end.
     * Args:
     * body (InsertBlankComponentEnd): The insert blank component body
     * containing the article ID and component type.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static insertBlankComponentEnd(
        requestBody: InsertBlankComponentEnd,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/article/component/insert/blank',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Component
     * Move a component up or down in the article.
     * Args:
     * body (MoveComponent): The move component body
     * containing the article ID, component ID, and direction.
     * req (Request): The request object.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static moveComponent(
        requestBody: MoveComponent,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/article/component/move',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
