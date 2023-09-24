"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.express = exports.auto = exports.router = void 0;
const express_1 = __importDefault(require("express"));
exports.express = express_1.default;
const router = (0, express_1.default)();
exports.router = router;
const auto_1 = __importDefault(require("./auto"));
exports.auto = auto_1.default;
const log4js_1 = __importDefault(require("log4js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger = log4js_1.default.getLogger("server.js");
logger.level = 'debug';
(0, auto_1.default)();
log4js_1.default.configure({
    appenders: {
        everything: {
            type: "file",
            filename: path_1.default.join(__dirname, '../log', 'server.log'),
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
        },
    },
    categories: {
        default: { appenders: ["everything"], level: "debug" },
    },
});
// 跨域
const cors_1 = __importDefault(require("cors"));
router.use((0, cors_1.default)());
router.get('/getInfoAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('获取所有榜单');
    res.send({
        status: 200,
        data: yield getfile(),
        message: 'success'
    });
}));
// 获取月榜
router.get('/getInfoMonth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('获取月榜');
    // 获取data下的json文件目录
    let list = fs_1.default.readdirSync(path_1.default.join(__dirname, '../data'));
    let listn = list.map(item => parseInt(item.split('.')[0]));
    // 筛选本月初的数据
    let now = new Date();
    now.setDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    let data = listn.filter(item => item > now.valueOf());
    // logger.info(data)
    // 获取本月第一个
    data.sort((a, b) => a - b);
    // 获取数据
    const result = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../data', data[0] + '.json'), 'utf8'));
    res.send({
        status: 200,
        data: result,
        message: 'success'
    });
}));
// 获取72小时榜
router.get('/getInfo72', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('获取72小时榜');
    // 获取data下的json文件目录
    const list = fs_1.default.readdirSync(path_1.default.join(__dirname, '../data'));
    let listn = list.map(item => parseInt(item.split('.')[0]));
    // logger.info(list)
    // 1695478250684.json
    // 获取72小时前的时间戳
    let L72 = new Date().valueOf() - 72 * 60 * 60 * 1000;
    let data = listn.filter(item => item > L72);
    // logger.info(data)
    // 获取第一个
    data.sort((a, b) => a - b);
    // 获取数据
    const result = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../data', data[0] + '.json'), 'utf8'));
    res.send({
        status: 200,
        data: result,
        message: 'success'
    });
}));
// 404
router.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        message: '404 not found'
    });
});
// 错误处理
router.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send({
        status: 500,
        message: '500 server error'
    });
});
// getfile
function getfile() {
    const list = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../data.json'), 'utf8'));
    return list;
}
