/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Article } from "../models/Article";
import type { ArticleUpload } from "../models/ArticleUpload";
import type { EditArticleImageComponent } from "../models/EditArticleImageComponent";
import type { EditArticleMetadata } from "../models/EditArticleMetadata";
import type { EditArticleProteinComponent } from "../models/EditArticleProteinComponent";
import type { EditArticleTextComponent } from "../models/EditArticleTextComponent";
import type { EditBody } from "../models/EditBody";
import type { InsertBlankComponentEnd } from "../models/InsertBlankComponentEnd";
import type { InsertComponent } from "../models/InsertComponent";
import type { LoginBody } from "../models/LoginBody";
import type { LoginResponse } from "../models/LoginResponse";
import type { MoveComponent } from "../models/MoveComponent";
import type { ProteinBody } from "../models/ProteinBody";
import type { ProteinEditSuccess } from "../models/ProteinEditSuccess";
import type { ProteinEntry } from "../models/ProteinEntry";
import type { RangeFilter } from "../models/RangeFilter";
import type { SearchProteinsBody } from "../models/SearchProteinsBody";
import type { SearchProteinsResults } from "../models/SearchProteinsResults";
import type { SignupBody } from "../models/SignupBody";
import type { SignupResponse } from "../models/SignupResponse";
import type { SimilarProtein } from "../models/SimilarProtein";
import type { TMAlignInfo } from "../models/TMAlignInfo";
import type { UploadArticleImageComponent } from "../models/UploadArticleImageComponent";
import type { UploadArticleProteinComponent } from "../models/UploadArticleProteinComponent";
import type { UploadArticleTextComponent } from "../models/UploadArticleTextComponent";
import type { UploadBody } from "../models/UploadBody";
import type { UploadError } from "../models/UploadError";
import type { UploadPNGBody } from "../models/UploadPNGBody";
import type { UserBody } from "../models/UserBody";
import type { UserIDResponse } from "../models/UserIDResponse";
import type { UserResponse } from "../models/UserResponse";
import type { UsersResponse } from "../models/UsersResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DefaultService {
	/**
	 * Signup
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static signup(
		requestBody: SignupBody
	): CancelablePromise<SignupResponse | null> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/users/signup",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Login
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static login(
		requestBody: LoginBody
	): CancelablePromise<LoginResponse | null> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/users/login",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Admin Signup
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static adminSignup(requestBody: LoginBody): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/users/admin/signup",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Users
	 * @returns UsersResponse Successful Response
	 * @throws ApiError
	 */
	public static getUsers(): CancelablePromise<UsersResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/users/",
		});
	}
	/**
	 * Get User Id
	 * @param username
	 * @returns UserIDResponse Successful Response
	 * @throws ApiError
	 */
	public static getUserId(username: string): CancelablePromise<UserIDResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/user/id/{username}",
			path: {
				username: username,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get User
	 * @param userId
	 * @returns UserResponse Successful Response
	 * @throws ApiError
	 */
	public static getUser(userId: number): CancelablePromise<UserResponse> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/user/{id}",
			query: {
				user_id: userId,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Edit User
	 * @param userId
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static editUser(
		userId: number,
		requestBody: UserBody
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/user/{id}",
			query: {
				user_id: userId,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Delete User
	 * @param userId
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static deleteUser(userId: number): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/user/{id}",
			query: {
				user_id: userId,
			},
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
		requestBody: SearchProteinsBody
	): CancelablePromise<SearchProteinsResults> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/search/proteins",
			body: requestBody,
			mediaType: "application/json",
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
			method: "GET",
			url: "/search/range/length",
		});
	}
	/**
	 * Search Range Mass
	 * @returns RangeFilter Successful Response
	 * @throws ApiError
	 */
	public static searchRangeMass(): CancelablePromise<RangeFilter> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/search/range/mass",
		});
	}
	/**
	 * Search Range Atoms
	 * @returns RangeFilter Successful Response
	 * @throws ApiError
	 */
	public static searchRangeAtoms(): CancelablePromise<RangeFilter> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/search/range/atoms",
		});
	}
	/**
	 * Search Species
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static searchSpecies(): CancelablePromise<Array<string> | null> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/search/species",
		});
	}
	/**
	 * Search Venome Similar
	 * @param proteinName
	 * @returns SimilarProtein Successful Response
	 * @throws ApiError
	 */
	public static searchVenomeSimilar(
		proteinName: string
	): CancelablePromise<Array<SimilarProtein>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/search/venome/similar/{protein_name}",
			path: {
				protein_name: proteinName,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Search Venome Similar Compare
	 * @param proteinName
	 * @param proteinCompare
	 * @returns SimilarProtein Successful Response
	 * @throws ApiError
	 */
	public static searchVenomeSimilarCompare(
		proteinName: string,
		proteinCompare: string
	): CancelablePromise<SimilarProtein> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/search/venome/similar/{protein_name}/{protein_compare}",
			path: {
				protein_name: proteinName,
				protein_compare: proteinCompare,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Plddt Given Protein
	 * @param proteinName
	 * @returns number Successful Response
	 * @throws ApiError
	 */
	public static getPLddtGivenProtein(
		proteinName: string
	): CancelablePromise<Record<string, Array<number>>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/pLDDT/{protein_name}",
			path: {
				protein_name: proteinName,
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
	public static getPdbFile(proteinName: string): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/pdb/{protein_name}",
			path: {
				protein_name: proteinName,
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
	public static getFastaFile(proteinName: string): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/fasta/{protein_name}",
			path: {
				protein_name: proteinName,
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
		proteinName: string
	): CancelablePromise<ProteinEntry | null> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/entry/{protein_name}",
			path: {
				protein_name: proteinName,
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
		proteinName: string
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/protein/entry/{protein_name}",
			path: {
				protein_name: proteinName,
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
			method: "GET",
			url: "/protein/entries",
		});
	}
	/**
	 * Get All Pending Protein Entries
	 * @returns ProteinEntry Successful Response
	 * @throws ApiError
	 */
	public static getAllPendingProteinEntries(): CancelablePromise<
		Array<ProteinEntry>
	> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/entries/pending",
		});
	}
	/**
	 * Get All Denied Protein Entries
	 * @returns ProteinEntry Successful Response
	 * @throws ApiError
	 */
	public static getAllDeniedProteinEntries(): CancelablePromise<
		Array<ProteinEntry>
	> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/entries/denied",
		});
	}
	/**
	 * Upload Protein Png
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static uploadProteinPng(
		requestBody: UploadPNGBody
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/protein/upload/png",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Add Protein Entry
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static addProteinEntry(
		requestBody: ProteinBody
	): CancelablePromise<UploadError | null> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/protein/add",
			body: requestBody,
			mediaType: "application/json",
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
		requestBody: UploadBody
	): CancelablePromise<UploadError | null> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/protein/upload",
			body: requestBody,
			mediaType: "application/json",
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
		requestBody: EditBody
	): CancelablePromise<ProteinEditSuccess> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/protein/edit",
			body: requestBody,
			mediaType: "application/json",
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
		proteinB: string
	): CancelablePromise<string> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/pdb/{proteinA}/{proteinB}",
			path: {
				proteinA: proteinA,
				proteinB: proteinB,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Tm Info
	 * @param proteinA
	 * @param proteinB
	 * @returns TMAlignInfo Successful Response
	 * @throws ApiError
	 */
	public static getTmInfo(
		proteinA: string,
		proteinB: string
	): CancelablePromise<TMAlignInfo> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/tmalign/{proteinA}/{proteinB}",
			path: {
				proteinA: proteinA,
				proteinB: proteinB,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get Random Protein
	 * @returns ProteinEntry Successful Response
	 * @throws ApiError
	 */
	public static getRandomProtein(): CancelablePromise<ProteinEntry> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/protein/random",
		});
	}
	/**
	 * Get Article
	 * get_article
	 *
	 * Args:
	 * id (int): ID of the article
	 *
	 * Raises:
	 * HTTPException: status 404 if the article is not found by the given ID
	 * HTTPException: status 500 if any other errors occur
	 *
	 * Returns:
	 * Article
	 * @param articleId
	 * @returns Article Successful Response
	 * @throws ApiError
	 */
	public static getArticle(articleId: number): CancelablePromise<Article> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/article/meta/{article_id}",
			path: {
				article_id: articleId,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Delete Article
	 * @param articleId
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static deleteArticle(articleId: number): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/article/meta/{article_id}",
			path: {
				article_id: articleId,
			},
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Get All Articles Metadata
	 * @returns Article Successful Response
	 * @throws ApiError
	 */
	public static getAllArticlesMetadata(): CancelablePromise<Array<Article>> {
		return __request(OpenAPI, {
			method: "GET",
			url: "/article/all/meta",
		});
	}
	/**
	 * Upload Article
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static uploadArticle(
		requestBody: ArticleUpload
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/meta/upload",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Edit Article Metadata
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static editArticleMetadata(
		requestBody: EditArticleMetadata
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/article/meta",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Delete Article Component
	 * @param articleId
	 * @param componentId
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static deleteArticleComponent(
		articleId: number,
		componentId: number
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "DELETE",
			url: "/article/{article_id}/component/{component_id}",
			path: {
				article_id: articleId,
				component_id: componentId,
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
		requestBody: EditArticleTextComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/article/component/text",
			body: requestBody,
			mediaType: "application/json",
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
		requestBody: UploadArticleTextComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/component/text",
			body: requestBody,
			mediaType: "application/json",
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
		requestBody: EditArticleProteinComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/article/component/protein",
			body: requestBody,
			mediaType: "application/json",
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
		requestBody: UploadArticleProteinComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/component/protein",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Edit Article Image Component
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static editArticleImageComponent(
		requestBody: EditArticleImageComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/article/component/image",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Upload Article Image Component
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static uploadArticleImageComponent(
		requestBody: UploadArticleImageComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/component/image",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Insert Component Above
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static insertComponentAbove(
		requestBody: InsertComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/component/insert/above",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Insert Blank Component End
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static insertBlankComponentEnd(
		requestBody: InsertBlankComponentEnd
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "POST",
			url: "/article/component/insert/blank",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
	/**
	 * Move Component
	 * @param requestBody
	 * @returns any Successful Response
	 * @throws ApiError
	 */
	public static moveComponent(
		requestBody: MoveComponent
	): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: "PUT",
			url: "/article/component/move",
			body: requestBody,
			mediaType: "application/json",
			errors: {
				422: `Validation Error`,
			},
		});
	}
}
