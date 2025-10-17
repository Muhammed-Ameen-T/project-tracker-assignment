import dotenv from 'dotenv';
import { CustomError } from '../../utils/errors/custom.error';
import { EnvErrMsg } from '../../utils/constants/envErrorMsg.constants';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';

dotenv.config();

/**
 * @typedef {'development' | 'production' | 'test'} NodeEnvType
 * Valid values for NODE_ENV.
 */
export type NodeEnvType = 'development' | 'production' | 'test';

/**
 * @constant {object} env
 * Centralized, validated environment variable configuration object.
 * Accessing any property throws an error if the variable is missing or invalid.
 */
export const env = {
  
  /**
   * Retrieves and validates the server port.
   * @returns {number}
   */
  get PORT(): number {
    const raw = process.env.PORT;
    if (!raw) {
      throw new CustomError(EnvErrMsg.PORT_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    const parsed = parseInt(raw, 10);
    // Note: Assuming BAD_REQUEST is the correct error code for a config validation failure.
    if (isNaN(parsed)) {
      throw new CustomError(EnvErrMsg.PORT_INVALID, HttpResCode.BAD_REQUEST); 
    }
    return parsed;
  },

  /**
   * Retrieves and validates the Node environment type.
   * @returns {NodeEnvType}
   */
  get NODE_ENV(): NodeEnvType {
    const env = process.env.NODE_ENV;
    if (!env) {
      throw new CustomError(EnvErrMsg.NODE_ENV_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return env as NodeEnvType;
  },

  /**
   * @returns {string}
   */
  get CLIENT_ORIGIN(): string {
    const origin = process.env.CLIENT_ORIGIN;
    if (!origin) {
      throw new CustomError(EnvErrMsg.CLIENT_ORIGIN_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return origin;
  },

  /**
   * Retrieves and validates the MongoDB connection string.
   * @returns {string}
   */
  get MONGO_URI(): string {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new CustomError(EnvErrMsg.MONGO_URI_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return uri;
  },

  /**
   * Retrieves and validates the Gemini AI API Key.
   * @returns {string}
   */
  get GEMINI_API_KEY(): string {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new CustomError(EnvErrMsg.GEMINI_API_KEY_UNDEFINED, HttpResCode.INTERNAL_SERVER_ERROR);
    }
    return apiKey;
  },

};