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
export declare function importTenants(tenantsDir: string, endpoint: string): Promise<void>;
