// 自动化爬虫脚本
import log4js from 'log4js'
const logger = log4js.getLogger("auto.js");
import fs from 'fs'
import path from 'path'
logger.level = 'debug';
import axios from 'axios'

export default async function main(): Promise<void> {
    logger.info('开始执行爬虫脚本')
    const start = new Date()
    const list = JSON.parse(fs.readFileSync(path.join(__dirname, '../userlist.json'), 'utf8'))
    for (let i = 0; i < list.length; i++) {
        const res = await getinfo(list[i].niukeID)
        list[i].challenge = Number(res.challenge)
        list[i].pass = Number(res.pass)
        list[i].submit = Number(res.submit)
        logger.info(`爬取${list[i].name}成功`)
        // console.log(list[i])
        await sleep(100)
    }
    // console.log(list)
    // 更新时间戳

    let now = new Date()
    let o = {
        data: list,
        update: now.toString()
    }
    // 写入list.json
    fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(o, null, 2))
    // 同时创建并写入/data/timestemp.json
    fs.writeFileSync(path.join(__dirname, '../data/' + now.valueOf() + '.json'), JSON.stringify(o, null, 2), { flag: 'w' })
    const end = new Date().valueOf()
    logger.info(`爬虫脚本执行完毕，耗时${end - start.valueOf()}ms`)
}



// sleep
async function sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}






// 爬虫


// https://ac.nowcoder.com/acm/contest/profile/{id}/practice-coding
async function getinfo(id: string) {
    const url = `https://ac.nowcoder.com/acm/contest/profile/${id}/practice-coding`
    const res = await axios.get(url)
    // 如果200，说明id存在
    if (res.status === 200) {
        let m = res.data.match(/<div class="state-num">.*<\/div>/g)
        let data = {
            challenge: m[0].replace(/\D/g, ''),
            pass: m[1].replace(/\D/g, ''),
            submit: m[2].replace(/\D/g, ''),
        }
        return data
    }
    else {
        throw new Error('用户不存在或者访问失败')
    }
}
