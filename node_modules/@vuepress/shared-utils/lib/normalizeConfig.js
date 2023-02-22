"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datatypes_1 = require("./datatypes");
const logger_1 = __importDefault(require("./logger"));
const chalk_1 = __importDefault(require("chalk"));
function normalizeConfig(pluginsConfig) {
    const { valid, warnMsg } = (0, datatypes_1.assertTypes)(pluginsConfig, [Object, Array]);
    if (!valid) {
        if (pluginsConfig !== undefined) {
            logger_1.default.warn(`[${chalk_1.default.gray('config')}] `
                + `Invalid value for "plugin" field : ${warnMsg}`);
        }
        pluginsConfig = [];
        return pluginsConfig;
    }
    if (Array.isArray(pluginsConfig)) {
        pluginsConfig = pluginsConfig.map(item => {
            return Array.isArray(item) ? item : [item];
        });
    }
    else if (typeof pluginsConfig === 'object') {
        pluginsConfig = Object.keys(pluginsConfig).map(item => {
            return [item, pluginsConfig[item]];
        });
    }
    return pluginsConfig;
}
exports.default = normalizeConfig;
