const { email } = require("./email");

function main() {

}

function workflow() {
    prepare();
    start();
    finish();
}

/**准备工作 */
function prepare() {

}

/**工作开始 */
function start() {

}

/**工作结束 */
function finish() {

}

let MAX_RETRY
/**重试 */
function retry() {
    if (MAX_RETRY > 0) {
        console.log('重试: ', MAX_RETRY);
        MAX_RETRY--;
        main();
    } else {
        //打卡失败
        email.send('', '');
        finish();
    }
}

main();