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
// 自动化爬虫脚本
const log4js_1 = __importDefault(require("log4js"));
const logger = log4js_1.default.getLogger("auto.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
logger.level = 'debug';
const axios_1 = __importDefault(require("axios"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info('开始执行爬虫脚本');
        const start = new Date();
        const list = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../userlist.json'), 'utf8'));
        for (let i = 0; i < list.length; i++) {
            const res = yield getinfo(list[i].niukeID);
            list[i].challenge = Number(res.challenge);
            list[i].pass = Number(res.pass);
            list[i].submit = Number(res.submit);
            logger.info(`爬取${list[i].name}成功`);
            // console.log(list[i])
            yield sleep(100);
        }
        // console.log(list)
        // 更新时间戳
        let now = new Date();
        let o = {
            data: list,
            update: now.toString()
        };
        // 写入list.json
        fs_1.default.writeFileSync(path_1.default.join(__dirname, '../data.json'), JSON.stringify(o, null, 2));
        // 同时创建并写入/data/timestemp.json
        fs_1.default.writeFileSync(path_1.default.join(__dirname, '../data/' + now.valueOf() + '.json'), JSON.stringify(o, null, 2), { flag: 'w' });
        const end = new Date().valueOf();
        logger.info(`爬虫脚本执行完毕，耗时${end - start.valueOf()}ms`);
    });
}
exports.default = main;
// sleep
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    });
}
// 爬虫
// https://ac.nowcoder.com/acm/contest/profile/{id}/practice-coding
function getinfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://ac.nowcoder.com/acm/contest/profile/${id}/practice-coding`;
        const res = yield axios_1.default.get(url);
        // 如果200，说明id存在
        if (res.status === 200) {
            let m = res.data.match(/<div class="state-num">.*<\/div>/g);
            let data = {
                challenge: m[0].replace(/\D/g, ''),
                pass: m[1].replace(/\D/g, ''),
                submit: m[2].replace(/\D/g, ''),
            };
            return data;
        }
        else {
            throw new Error('用户不存在或者访问失败');
        }
    });
}
