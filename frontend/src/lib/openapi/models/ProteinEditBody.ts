/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Model for the protein edit request body.
 */
export type ProteinEditBody = {
    oldName: string;
    newName: string;
    oldSpeciesName: string;
    newSpeciesName: string;
    newContent?: (string | null);
    newRefs?: (string | null);
    newDescription?: (string | null);
};

