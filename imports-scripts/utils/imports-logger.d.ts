/**
 * Centralized logging messages
 */
export declare const LogMessages: {
    readonly IMPORT_ASSIGNMENTS_START: "Starting assignments import";
    readonly IMPORT_WORKSPACES_START: "Starting workspaces import";
    readonly IMPORT_THEMES_START: "Starting themes import";
    readonly IMPORT_TENANTS_START: "Starting tenants import";
    readonly IMPORT_PERMISSIONS_START: "Starting permissions import";
    readonly IMPORT_PRODUCTS_START: "Starting products import for product store";
    readonly IMPORT_SLOTS_START: "Starting slots import for product store";
    readonly IMPORT_MICROSERVICES_START: "Starting microservices import for product store";
    readonly IMPORT_MICROFRONTENDS_START: "Starting microfrontends import for product store";
    readonly IMPORT_MANAGER_INIT: "Initializing Import Manager";
    readonly IMPORT_MANAGER_START: "Starting import process";
    readonly UPLOAD_SUCCESS: "Upload completed successfully";
    readonly TOKEN_SUCCESS: "Authentication token received successfully";
    readonly CONFIG_LOADED: "Container configuration loaded successfully";
    readonly IMPORT_COMPLETE: "Import process completed successfully";
    readonly UPLOAD_ERROR: "Upload failed";
    readonly TOKEN_ERROR: "Failed to obtain authentication token";
    readonly CONFIG_ERROR: "Failed to load container configuration";
    readonly FILE_READ_ERROR: "Failed to read file";
    readonly CONFIG_FILE_NOT_FOUND: "Container info file not found";
    readonly PROCESSING_FILE: "Processing file";
    readonly SERVICE_AVAILABLE: "Service available";
    readonly SERVICE_UNAVAILABLE: "Service not available, skipping import";
    readonly REQUESTING_TOKEN: "Requesting authentication token from Keycloak";
    readonly CONTAINER_DISCOVERED: "Container discovered";
    readonly SERVICES_FOUND: "Services found in configuration";
};
export type LogMessageKey = keyof typeof LogMessages;
/**
 * Structured logger with timestamp, class and context information
 */
export declare class Logger {
    private className;
    constructor(className: string);
    private formatTimestamp;
    private formatMessage;
    /**
     * Log info message
     */
    info(messageKey: LogMessageKey, context?: string): void;
    /**
     * Log success message
     */
    success(messageKey: LogMessageKey, context?: string): void;
    /**
     * Log error message
     */
    error(messageKey: LogMessageKey, context?: string, error?: unknown): void;
    /**
     * Log based on HTTP status code
     */
    status(messageKey: LogMessageKey, statusCode: number, context?: string): void;
}
