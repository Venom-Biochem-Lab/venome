/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArticleImageComponent } from './ArticleImageComponent';
import type { ArticleProteinComponent } from './ArticleProteinComponent';
import type { ArticleTextComponent } from './ArticleTextComponent';
export type Article = {
    title: string;
    description?: (string | null);
    datePublished?: (string | null);
    orderedComponents: Array<(ArticleTextComponent | ArticleProteinComponent | ArticleImageComponent)>;
};

