/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArticleImageComponent } from './ArticleImageComponent';
import type { ArticleProteinComponent } from './ArticleProteinComponent';
import type { ArticleTextComponent } from './ArticleTextComponent';
/**
 * Represents an article with its components.
 */
export type ArticleEntry = {
    id: number;
    title?: (string | null);
    description?: (string | null);
    datePublished?: (string | null);
    refs?: (string | null);
    orderedComponents: Array<(ArticleTextComponent | ArticleProteinComponent | ArticleImageComponent)>;
};

