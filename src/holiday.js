const config = {
    url: "https://apis.tianapi.com/jiejiari/index",
    key: "5f903b4e3519cb83f33d5a46ebe8b752"
}
/**
 * 天行服务 [节假日接口]
 * https://www.tianapi.com/
 */
const holiday = {
    /**今日是否休息 */
    check: () => {
        return new Promise((resolve, reject) => {
            const url = `${config.url}?key=${key}`;
            http.get(url, null, (res) => {
                if (res.statusCode != 200) {
                    reject(res.statusMessage);
                }
                else {
                    const data = res && res.body && res.body.json();
                    const code = data.code;
                    if (code == 200) {
                        const result = data && data.result;
                        const date = result.list[0];
                        resolve(date.isnotwork == 1);
                    } else {
                        reject(res.msg);
                    }
                }
            });
        });
    }
}
exports.holiday = holiday;