/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ReviewsIndexResponse = {
  id: number;
  comment: string | null;
  comparison: ("strongly_worse" | "slightly_worse" | "similar" | "slightly_better" | "strongly_better") | null;
  reviewedSubmissionId: number;
  reviewerSubmissionId: number;
}[];
