"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importThemes = importThemes;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const imports_logger_1 = require("../utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportThemes');
/**
 * Imports theme configurations from JSON files to the theme service
 *
 * This function processes all JSON files in the specified directory and uploads them as theme configurations.
 * Each file should follow the naming convention: `{tenantName}_{themeName}.json`
 *
 * @param themesDir - Directory path containing the theme JSON files
 * @param getTokenForTenant - Function to retrieve authentication token for a specific tenant
 * @param endpoint - API endpoint URL for theme import operations
 *
 * @example
 * ```typescript
 * await importThemes(
 *   './data/themes',
 *   (tenant) => getAuthToken(tenant),
 *   'http://localhost:8080/onecx-theme-svc/internal/themes'
 * )
 * ```
 */
async function importThemes(themesDir, getTokenForTenant, endpoint) {
    logger.info('IMPORT_THEMES_START');
    const files = await (0, promises_1.readdir)(themesDir);
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        const [tenant, theme] = file.replace('.json', '').split('_');
        logger.info('PROCESSING_FILE', `${file} - Tenant: ${tenant}, Theme: ${theme}`);
        const token = await getTokenForTenant(tenant);
        const data = await (0, promises_1.readFile)(path_1.default.join(themesDir, file), 'utf-8');
        try {
            const response = await axios_1.default.post(endpoint, JSON.parse(data), {
                headers: {
                    'apm-principal-token': token,
                    'Content-Type': 'application/json',
                },
                validateStatus: () => true,
            });
            logger.status('UPLOAD_SUCCESS', response.status, `Theme ${theme} for tenant ${tenant}`);
        }
        catch (err) {
            logger.error('UPLOAD_ERROR', `Theme ${theme} for tenant ${tenant}`, err);
        }
    }
}
//# sourceMappingURL=import-themes.js.map