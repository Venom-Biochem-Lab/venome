/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RangeFilter } from './RangeFilter';
export type SearchProteinsBody = {
    query: string;
    speciesFilter?: (string | null);
    lengthFilter?: (RangeFilter | null);
    massFilter?: (RangeFilter | null);
    num?: (number | null);
    page?: (number | null);
};

