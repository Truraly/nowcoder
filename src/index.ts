import express from 'express'
const router = express()
import auto from './auto'
import log4js from 'log4js'
import path from 'path'
import fs from 'fs'
const logger = log4js.getLogger("server.js");
logger.level = 'debug'
auto()
log4js.configure({
    appenders: {
        everything: {
            type: "file",
            filename: path.join(__dirname, '../log', 'server.log'),
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
import cors from 'cors'
router.use(cors())
router.get('/getInfoAll', async (req, res) => {
    logger.info('获取所有榜单')
    res.send({
        status: 200,
        data: await getfile(),
        message: 'success'
    })
})

// 获取月榜
router.get('/getInfoMonth', async (req, res) => {
    logger.info('获取月榜')
    // 获取data下的json文件目录
    let list: string[] = fs.readdirSync(path.join(__dirname, '../data'))
    let listn: number[] = list.map(item => parseInt(item.split('.')[0]))
    // 筛选本月初的数据
    let now = new Date()
    now.setDate(1)
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    let data = listn.filter(item => item > now.valueOf())
    // logger.info(data)
    // 获取本月第一个
    data.sort((a, b) => a - b)
    // 获取数据
    const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../data', data[0] + '.json'), 'utf8'))
    res.send({
        status: 200,
        data: result,
        message: 'success'
    })
})

// 获取72小时榜
router.get('/getInfo72', async (req, res) => {
    logger.info('获取72小时榜')
    // 获取data下的json文件目录
    const list = fs.readdirSync(path.join(__dirname, '../data'))
    let listn: number[] = list.map(item => parseInt(item.split('.')[0]))
    // logger.info(list)
    // 1695478250684.json
    // 获取72小时前的时间戳
    let L72 = new Date().valueOf() - 72 * 60 * 60 * 1000
    let data = listn.filter(item => item > L72)
    // logger.info(data)
    // 获取第一个
    data.sort((a, b) => a - b)
    // 获取数据
    const result = JSON.parse(fs.readFileSync(path.join(__dirname, '../data', data[0] + '.json'), 'utf8'))
    res.send({
        status: 200,
        data: result,
        message: 'success'
    })
})

// 404
router.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        message: '404 not found'
    })
})

// 错误处理
router.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err)
    res.status(500).send({
        status: 500,
        message: '500 server error'
    })
})


// getfile
function getfile() {
    const list = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'))
    return list
}
export { router, auto, express }
