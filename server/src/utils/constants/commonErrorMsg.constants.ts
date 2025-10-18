import { ObjectId } from "mongoose";

export const ErrorMsg = {
  MISSING_FILE: 'File is missing in the request.',
  INVALID_FILE_TYPE: 'Invalid file type provided.',
  FILE_TOO_LARGE: 'File size exceeds the allowed limit.',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing in the request.',
  ADHAAR_NOT_VALID: 'Aadhaar number is not valid.',
  UID_MISMATCH: 'UID on the front and back of the Aadhaar card do not match.',
  FAILED_TO_CLEAN: 'Failed to clean up uploaded files',
  INVALID_AADHAAR_CONTENT: 'Uploaded images do not appear to be valid Aadhaar cards.',
  FILE_SIZE_TOOLARGE: 'File size too large.',
  FRONT_AND_BACK_REQUIRED: 'Both front and back images are required.',
  ALLOWED_FILE_TYPE: 'Invalid file type. Only JPEG and PNG are allowed.',
  BACK_IMG_REQUIRED: 'Aadhaar Back image is required',
  FRONT_IMG_REQUIRED: 'Aadhaar Front image is required',
  PROJECT_NAME_REQUIRED: 'Project name is required for update.',
  PROJECT_DESCRIPTION_REQUIRED: 'Project description is required for update.',
  TASK_TITLE_REQUIRED: 'Task title is required.',
  TASK_DESCRIPTION_REQUIRED: 'Task description is required.',


  TASK_WITH_ID_NOT_FOUND: (taskId: string | ObjectId) => `Task with ID ${taskId} not found.`,
  PROJECT_WITH_ID_NOT_FOUND: (projectId: string | ObjectId) => `Project with ID ${projectId} not found.`,
  INVALID_TASK_STATUS: (status: string) => `Invalid task status: ${status}.`,
};
