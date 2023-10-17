const util = {
    /**获取当前日期: 2023-01-01 */
    getDate: () => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    /**日志 */
    log: (msg) => {
        
    }
}
exports.util = util;