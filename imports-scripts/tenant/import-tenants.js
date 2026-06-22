"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTenants = importTenants;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const imports_logger_1 = require("../utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportTenants');
/**
 * Imports tenant configurations from JSON files to the tenant service
 *
 * This function processes all JSON files in the specified directory and uploads them as tenant configurations.
 * Unlike other import functions, tenant import doesn't require authentication tokens as it operates at the system level.
 *
 * @param tenantsDir - Directory path containing the tenant JSON files
 * @param endpoint - API endpoint URL for tenant import operations
 *
 * @example
 * ```typescript
 * await importTenants(
 *   './data/tenants',
 *   'http://localhost:8080/onecx-tenant-svc/internal/tenants'
 * )
 * ```
 */
async function importTenants(tenantsDir, endpoint) {
    logger.info('IMPORT_TENANTS_START');
    const files = await (0, promises_1.readdir)(tenantsDir);
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        logger.info('PROCESSING_FILE', file);
        const data = await (0, promises_1.readFile)(path_1.default.join(tenantsDir, file), 'utf-8');
        try {
            const response = await axios_1.default.post(endpoint, JSON.parse(data), {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: () => true,
            });
            logger.status('UPLOAD_SUCCESS', response.status, `Tenants from ${file}`);
        }
        catch (err) {
            logger.error('UPLOAD_ERROR', `Tenants from ${file}`, err);
        }
    }
}
//# sourceMappingURL=import-tenants.js.map