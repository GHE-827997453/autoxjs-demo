const { email } = require("./email");
const { holiday } = require("./holiday");
const { phone } = require("./phone");
const { util } = require("./util");

function main() {
    holiday.check()
    .then(holiday => {
        !holiday && workflow();
    })
    .catch(msg => {
        util.log(msg);
        setTimeout(() => {
            retry();
        }, 10 * 1000);
    })
}

function workflow() {
    prepare();
    start();
    finish();
}

/**
 * 准备工作
 * 无障碍服务检查->屏幕解锁->home->退出应用->home
 */
function prepare() {
    let thread = util.thread2(()=>{}), cd = 10, timer;
    const timeout = () => {
        email.send('无障碍服务启动超时!', '请调试设备手动开启');
        thread.clearInterval(timer);
        finish();
    }
    timer = thread.setInterval(() => {
        cd --;
        cd <= 0 && timeout();
    });
    //检查无障碍服务是否启动
    auto.waitFor();
    thread.clearInterval(timer);
    thread.interrupt();
    //解锁屏幕
    phone.weakup();
    sleep(500);
    //手机主界面
    home();
    sleep(500);
    //退出应用
    const app = phone.app;
    openAppSetting(getPackageName(app.name));
    ui.waitText(app.stop, retry);
    click(app.stop);
    sleep(500);
    click(app.stop, 1);
    sleep(500);
    //再次返回主界面
    home();
    sleep(1000);
}

/**
 * 工作开始
 * 打开app->业务执行
 */
function start() {
    if (app.launchApp(phone.app.name)) {
        // signin_dd();
    } else {
        retry();
    }
}

/**工作结束 */
function finish() {
    home();
    sleep(500);
    phone.lock();
    threads.shutDownAll();
    exit();
}

let MAX_RETRY = 5;
/**重试 */
function retry() {
    if (MAX_RETRY > 0) {
        util.log('重试: ', MAX_RETRY);
        MAX_RETRY--;
        main();
    } else {
        email.send(`本次执行结束, 重试5次, 退出脚本`);
        finish();
    }
}

main();