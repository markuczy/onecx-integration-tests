"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importWorkspaces = importWorkspaces;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const imports_logger_1 = require("../utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportWorkspaces');
/**
 * Imports workspace configurations from JSON files to the workspace service
 *
 * This function processes all JSON files in the specified directory and uploads them as workspace configurations.
 * Each file should follow the naming convention: `{tenantName}_{workspaceName}.json`
 * Only files containing an underscore in the name will be processed.
 *
 * @param workspacesDir - Directory path containing the workspace JSON files
 * @param getTokenForTenant - Function to retrieve authentication token for a specific tenant
 * @param endpoint - API endpoint URL for workspace import operations
 *
 * @example
 * ```typescript
 * await importWorkspaces(
 *   './data/workspaces',
 *   (tenant) => getAuthToken(tenant),
 *   'http://localhost:8080/onecx-workspace-svc/internal/workspaces'
 * )
 * ```
 */
async function importWorkspaces(workspacesDir, getTokenForTenant, endpoint) {
    logger.info('IMPORT_WORKSPACES_START');
    const files = await (0, promises_1.readdir)(workspacesDir);
    for (const file of files) {
        if (!file.endsWith('.json') || !file.includes('_'))
            continue;
        const [tenant, workspace] = file.replace('.json', '').split('_');
        logger.info('PROCESSING_FILE', `${file} - Tenant: ${tenant}, Workspace: ${workspace}`);
        const token = await getTokenForTenant(tenant);
        const data = await (0, promises_1.readFile)(path_1.default.join(workspacesDir, file), 'utf-8');
        try {
            const response = await axios_1.default.post(endpoint, JSON.parse(data), {
                headers: {
                    'apm-principal-token': token,
                    'Content-Type': 'application/json',
                },
                validateStatus: () => true,
            });
            logger.status('UPLOAD_SUCCESS', response.status, `Workspace ${workspace} for tenant ${tenant}`);
        }
        catch (err) {
            logger.error('UPLOAD_ERROR', `Workspace ${workspace} for tenant ${tenant}`, err);
        }
    }
}
//# sourceMappingURL=import-workspaces.js.map