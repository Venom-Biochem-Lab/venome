/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Model for protein entry in the database.
 */
export type ProteinEntry = {
    name: string;
    length: number;
    mass: number;
    atoms: number;
    speciesName: string;
    content?: (string | null);
    refs?: (string | null);
    thumbnail?: (string | null);
    description?: (string | null);
    datePublished?: (string | null);
    pdbFileStr?: (string | null);
};

