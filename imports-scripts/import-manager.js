"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportManager = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const import_tenants_1 = require("./tenant/import-tenants");
const import_themes_1 = require("./theme/import-themes");
const import_assignments_1 = require("./permission-assignment/import-assignments");
const import_workspaces_1 = require("./workspace/import-workspaces");
const import_product_store_1 = require("./product-store/import-product-store");
const import_permissions_1 = require("./permissions/import-permissions");
const imports_logger_1 = require("./utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportManager');
/**
 * Import Manager class for orchestrating data imports across OneCX services
 *
 * This class manages the complete data import process for a OneCX platform setup,
 * including authentication, service discovery, and coordinated imports of various data types.
 */
class ImportManager {
    containerInfo;
    /**
     * Initializes the ImportManager with container configuration
     *
     * @param containerInfoPath - Path to the JSON file containing container and service information
     * @throws Error if the configuration file cannot be found or parsed
     */
    constructor(containerInfoPath) {
        logger.info('IMPORT_MANAGER_INIT');
        if (!fs.existsSync(containerInfoPath)) {
            logger.error('CONFIG_FILE_NOT_FOUND', containerInfoPath);
        }
        const containerInfoData = fs.readFileSync(containerInfoPath, 'utf-8');
        this.containerInfo = JSON.parse(containerInfoData);
        logger.success('CONFIG_LOADED');
        logger.info('CONTAINER_DISCOVERED', `Keycloak: ${this.containerInfo.tokenValues.alias}:${this.containerInfo.tokenValues.port}`);
        logger.info('SERVICES_FOUND', `${Object.keys(this.containerInfo.services).length} services configured`);
    }
    /**
     * Executes the complete data import process for all OneCX containers
     *
     * This method orchestrates the import of various data types including tenants, themes,
     * workspaces, product store data, permissions, and assignments. The imports are executed
     * in a specific order to respect dependencies between services.
     *
     * @returns Promise that resolves when all imports are completed
     * @throws Error if any critical import step fails
     *
     * @example
     * ```typescript
     * const importManager = new ImportManager('./container-info.json')
     * await importManager.import()
     * ```
     *
     * @remarks
     * Import order:
     * 1. Tenants (foundational)
     * 2. Themes (tenant-specific)
     * 3. Product Store data (products, slots, microservices, microfrontends)
     * 4. Permissions (product-specific)
     * 5. Workspaces (depends on products)
     * 6. Assignments (final step)
     */
    async import() {
        logger.info('IMPORT_MANAGER_START');
        const token = await this.getToken();
        const base = path.resolve(__dirname, '');
        const { services } = this.containerInfo;
        // Get all available services
        const serviceNames = Object.keys(services);
        logger.info('SERVICES_FOUND', `Available services: ${serviceNames.join(', ')}`);
        // Tenant import - requires tenant service
        if (services['onecx-tenant-svc']) {
            logger.info('SERVICE_AVAILABLE', 'onecx-tenant-svc');
            await (0, import_tenants_1.importTenants)(path.join(base, 'tenant'), this.getServiceUrl('onecx-tenant-svc', '/exim/v1/tenants/operator'));
        }
        else {
            logger.info('SERVICE_UNAVAILABLE', 'onecx-tenant-svc - skipping tenant import');
        }
        // Theme import - requires theme service
        if (services['onecx-theme-svc']) {
            logger.info('SERVICE_AVAILABLE', 'onecx-theme-svc');
            await (0, import_themes_1.importThemes)(path.join(base, 'theme'), async () => token, this.getServiceUrl('onecx-theme-svc', '/exim/v1/themes/operator'));
        }
        else {
            logger.info('SERVICE_UNAVAILABLE', 'onecx-theme-svc - skipping theme import');
        }
        // Product store related imports - requires product store service
        if (services['onecx-product-store-svc']) {
            const productStore = 'product-store';
            logger.info('SERVICE_AVAILABLE', 'onecx-product-store-svc');
            const productStoreBase = this.getServiceUrl('onecx-product-store-svc', '/');
            await (0, import_product_store_1.importProducts)(path.join(base, productStore), productStoreBase);
            await (0, import_product_store_1.importSlots)(path.join(base, productStore), productStoreBase);
            await (0, import_product_store_1.importMicroservices)(path.join(base, productStore), productStoreBase);
            await (0, import_product_store_1.importMicrofrontends)(path.join(base, productStore), productStoreBase, this.getServicePort('onecx-product-store-svc'));
        }
        else {
            logger.info('SERVICE_UNAVAILABLE', 'onecx-product-store-svc - skipping product store imports');
        }
        // Permission imports - requires permission service
        if (services['onecx-permission-svc']) {
            logger.info('SERVICE_AVAILABLE', 'onecx-permission-svc');
            await (0, import_permissions_1.importPermissions)(path.join(base, 'permissions'), this.getServiceUrl('onecx-permission-svc'));
            await (0, import_assignments_1.importAssignments)(path.join(base, 'permission-assignment'), this.getServiceUrl('onecx-permission-svc', '/exim/v1/assignments/operator'));
        }
        else {
            logger.info('SERVICE_UNAVAILABLE', 'onecx-permission-svc - skipping permission imports');
        }
        // Workspace import - requires workspace service
        if (services['onecx-workspace-svc']) {
            logger.info('SERVICE_AVAILABLE', 'onecx-workspace-svc');
            await (0, import_workspaces_1.importWorkspaces)(path.join(base, 'workspace'), async () => token, this.getServiceUrl('onecx-workspace-svc', '/exim/v1/workspace/import'));
        }
        else {
            logger.info('SERVICE_UNAVAILABLE', 'onecx-workspace-svc - skipping workspace import');
        }
        logger.success('IMPORT_COMPLETE');
    }
    /**
     * Retrieves an authentication token from the Keycloak service
     *
     * @returns Promise resolving to the access token
     * @throws Error if token retrieval fails
     * @private
     */
    async getToken() {
        logger.info('REQUESTING_TOKEN');
        const { tokenValues } = this.containerInfo;
        const url = `http://${tokenValues.alias}:${tokenValues.port}/realms/${tokenValues.realm}/protocol/openid-connect/token`;
        const params = new URLSearchParams({
            username: tokenValues.username,
            password: tokenValues.password,
            grant_type: 'password',
            client_id: tokenValues.clientId,
        });
        try {
            const response = await axios_1.default.post(url, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            logger.success('TOKEN_SUCCESS');
            return response.data.access_token;
        }
        catch (error) {
            logger.error('TOKEN_ERROR', undefined, error);
            throw error;
        }
    }
    getServiceUrl = (serviceName, path = '') => {
        const { services } = this.containerInfo;
        const service = services[serviceName];
        if (!service) {
            logger.error('SERVICE_UNAVAILABLE', serviceName);
            throw new Error(`Service '${serviceName}' not found in container info`);
        }
        return `http://${service.alias}:${service.port}${path}`;
    };
    getServicePort = (serviceName) => {
        const { services } = this.containerInfo;
        const service = services[serviceName];
        if (!service) {
            logger.error('SERVICE_UNAVAILABLE', serviceName);
            throw new Error(`Service '${serviceName}' not found in container info`);
        }
        return service.port;
    };
}
exports.ImportManager = ImportManager;
//# sourceMappingURL=import-manager.js.map