/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface SubmissionsCreateBody {
  projectId: MultipartFieldNumberJson;
  "userIds[]"?: MultipartFieldNumberJson[] | MultipartFieldNumberJson;
  file: MultipartFileJson;
}
export interface MultipartFieldNumberJson {
  value: number;
}
export interface MultipartFileJson {
  encoding: string;
  filename: string;
  mimetype: string;
  [k: string]: unknown;
}
