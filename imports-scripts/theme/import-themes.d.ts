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
export declare function importThemes(themesDir: string, getTokenForTenant: (tenant: string) => Promise<string>, endpoint: string): Promise<void>;
