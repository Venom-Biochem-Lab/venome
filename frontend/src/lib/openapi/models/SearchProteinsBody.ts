/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RangeFilter } from './RangeFilter';
/**
 * Request body for searching proteins.
 */
export type SearchProteinsBody = {
    query: string;
    speciesFilter?: (string | null);
    lengthFilter?: (RangeFilter | null);
    massFilter?: (RangeFilter | null);
    atomsFilter?: (RangeFilter | null);
    proteinsPerPage?: (number | null);
    page?: (number | null);
    sortBy?: (string | null);
};

