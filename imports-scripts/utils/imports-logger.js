"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogMessages = void 0;
/**
 * Centralized logging messages
 */
exports.LogMessages = {
    // Import section headers
    IMPORT_ASSIGNMENTS_START: 'Starting assignments import',
    IMPORT_WORKSPACES_START: 'Starting workspaces import',
    IMPORT_THEMES_START: 'Starting themes import',
    IMPORT_TENANTS_START: 'Starting tenants import',
    IMPORT_PERMISSIONS_START: 'Starting permissions import',
    IMPORT_PRODUCTS_START: 'Starting products import for product store',
    IMPORT_SLOTS_START: 'Starting slots import for product store',
    IMPORT_MICROSERVICES_START: 'Starting microservices import for product store',
    IMPORT_MICROFRONTENDS_START: 'Starting microfrontends import for product store',
    IMPORT_MANAGER_INIT: 'Initializing Import Manager',
    IMPORT_MANAGER_START: 'Starting import process',
    // Success messages
    UPLOAD_SUCCESS: 'Upload completed successfully',
    TOKEN_SUCCESS: 'Authentication token received successfully',
    CONFIG_LOADED: 'Container configuration loaded successfully',
    IMPORT_COMPLETE: 'Import process completed successfully',
    // Error messages
    UPLOAD_ERROR: 'Upload failed',
    TOKEN_ERROR: 'Failed to obtain authentication token',
    CONFIG_ERROR: 'Failed to load container configuration',
    FILE_READ_ERROR: 'Failed to read file',
    CONFIG_FILE_NOT_FOUND: 'Container info file not found',
    // Info messages
    PROCESSING_FILE: 'Processing file',
    SERVICE_AVAILABLE: 'Service available',
    SERVICE_UNAVAILABLE: 'Service not available, skipping import',
    REQUESTING_TOKEN: 'Requesting authentication token from Keycloak',
    CONTAINER_DISCOVERED: 'Container discovered',
    SERVICES_FOUND: 'Services found in configuration',
};
/**
 * Structured logger with timestamp, class and context information
 */
class Logger {
    className;
    constructor(className) {
        this.className = className;
    }
    formatTimestamp() {
        return new Date().toISOString();
    }
    formatMessage(level, messageKey, context) {
        const timestamp = this.formatTimestamp();
        const message = exports.LogMessages[messageKey];
        const contextPart = context ? ` - (${context})` : '';
        return `${this.className}: ${timestamp} [${level}] ${this.className} ${message}${contextPart}`;
    }
    /**
     * Log info message
     */
    info(messageKey, context) {
        console.log(this.formatMessage('INFO', messageKey, context));
    }
    /**
     * Log success message
     */
    success(messageKey, context) {
        console.log(`\x1b[32m${this.formatMessage('SUCCESS', messageKey, context)}\x1b[0m`);
    }
    /**
     * Log error message
     */
    error(messageKey, context, error) {
        const message = this.formatMessage('ERROR', messageKey, context);
        if (error) {
            console.error(`\x1b[31m${message}\x1b[0m`, error);
        }
        else {
            console.error(`\x1b[31m${message}\x1b[0m`);
        }
    }
    /**
     * Log based on HTTP status code
     */
    status(messageKey, statusCode, context) {
        if ([200, 201].includes(statusCode)) {
            this.success(messageKey, `${context} - Status: ${statusCode}`);
        }
        else {
            this.error(messageKey, `${context} - Status: ${statusCode}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=imports-logger.js.map