const util = {
    /**获取当前日期: 2023-01-01 00:00:00 */
    getDate: () => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    /**日志 */
    log: (msg) => {
        console.log(msg, '\n', getDate());
    },
    /**开启一个子线程 */
    thread2: (action) => {
        return threads.start(action);
    }
}
exports.util = util;