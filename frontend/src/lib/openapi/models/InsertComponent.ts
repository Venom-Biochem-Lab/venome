/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InsertComponent = {
    articleId: number;
    componentId: number;
    componentType?: InsertComponent.componentType;
};
export namespace InsertComponent {
    export enum componentType {
        TEXT = 'text',
        IMAGE = 'image',
        PROTEIN = 'protein',
    }
}

