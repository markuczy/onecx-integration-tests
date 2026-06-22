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
export declare function importWorkspaces(workspacesDir: string, getTokenForTenant: (tenant: string) => Promise<string>, endpoint: string): Promise<void>;
