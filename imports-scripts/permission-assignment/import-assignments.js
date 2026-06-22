"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAssignments = importAssignments;
const tslib_1 = require("tslib");
const promises_1 = require("fs/promises");
const path_1 = tslib_1.__importDefault(require("path"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const imports_logger_1 = require("../utils/imports-logger");
const logger = new imports_logger_1.Logger('ImportAssignments');
async function importAssignments(assignmentsDir, endpoint) {
    logger.info('IMPORT_ASSIGNMENTS_START');
    const files = await (0, promises_1.readdir)(assignmentsDir);
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        const product = file.replace(/\.json$/, '');
        logger.info('PROCESSING_FILE', `${file} - Product: ${product}`);
        const data = await (0, promises_1.readFile)(path_1.default.join(assignmentsDir, file), 'utf-8');
        try {
            const response = await axios_1.default.post(endpoint, JSON.parse(data), {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: () => true,
            });
            logger.status('UPLOAD_SUCCESS', response.status, `Assignments for product ${product}`);
        }
        catch (err) {
            logger.error('UPLOAD_ERROR', `Assignments for product ${product}`, err);
        }
    }
}
//# sourceMappingURL=import-assignments.js.map