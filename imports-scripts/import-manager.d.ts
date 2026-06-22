/**
 * Container information interface containing authentication and service details
 */
export interface ContainerInfo {
    tokenValues: {
        username: string;
        password: string;
        realm: string;
        alias: string;
        port: number;
        clientId: string;
    };
    services: Record<string, {
        alias: string;
        port: number;
    }>;
}
/**
 * Import Manager class for orchestrating data imports across OneCX services
 *
 * This class manages the complete data import process for a OneCX platform setup,
 * including authentication, service discovery, and coordinated imports of various data types.
 */
export declare class ImportManager {
    private containerInfo;
    /**
     * Initializes the ImportManager with container configuration
     *
     * @param containerInfoPath - Path to the JSON file containing container and service information
     * @throws Error if the configuration file cannot be found or parsed
     */
    constructor(containerInfoPath: string);
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
    import(): Promise<void>;
    /**
     * Retrieves an authentication token from the Keycloak service
     *
     * @returns Promise resolving to the access token
     * @throws Error if token retrieval fails
     * @private
     */
    private getToken;
    private getServiceUrl;
    private getServicePort;
}
