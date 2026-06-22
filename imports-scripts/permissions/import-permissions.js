"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPermissions = importPermissions;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const imports_logger_1 = require("../utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportPermissions');
async function importPermissions(permissionsDir, endpointBase) {
    logger.info('IMPORT_PERMISSIONS_START');
    const files = await (0, promises_1.readdir)(permissionsDir);
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        const fileName = file.replace('.json', '');
        const [product, appid] = fileName.split('_');
        logger.info('PROCESSING_FILE', `${file} - Product: ${product}, App: ${appid}`);
        const data = await (0, promises_1.readFile)(path_1.default.join(permissionsDir, file), 'utf-8');
        const endpoint = `${endpointBase}/operator/v1/${product}/${appid}`;
        try {
            const response = await axios_1.default.put(endpoint, JSON.parse(data), {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: () => true,
            });
            logger.status('UPLOAD_SUCCESS', response.status, `Permissions for app ${appid} and product ${product}`);
        }
        catch (err) {
            logger.error('UPLOAD_ERROR', `Permissions for app ${appid} and product ${product}`, err);
        }
    }
}
//# sourceMappingURL=import-permissions.js.map