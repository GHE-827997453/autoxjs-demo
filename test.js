const KEY_WORD = {
    StopApp: '强行停止',

    DingDing: '钉钉',
    GongZuoTai: '工作台',
    KaoQin: '考勤打卡',
    Daka: '班打卡',
    Success: '打卡成功'
}

const MAIL_CONFIG = {
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    recipient: '827997453@qq.com',
    //邮件配置预设
    publicKey:'uct_asSjj3IWdmpxB',
    privateKey: '6uMkOnDMFOyRHs08qWPk1',
    serviceId: 'service_txdonk9',
    templateId: 'template_d47n1hs',
}

/**天行api服务配置 */
const TIAN_API = {
    key: '5f903b4e3519cb83f33d5a46ebe8b752',

    holiday: 'https://apis.tianapi.com/jiejiari/index'
}

const SCREEN_PASSWORD = '827997';

function main() {
    checkWorkday()
    .then(work => {
        work && workflow();
    })
    .catch(msg => {
        console.log(msg);
        setTimeout(() => {
            retry();
        }, 10 * 1000);
    });
}

/**工作流程 */
function workflow() {
    //准备
    prepare();
    //开始
    start();
    //结束
    finish();
}

/**准备 */
function prepare() {
    let thread = thread2(()=>{}), cd = 10, timer;
    const timeout = () => {
        sendEmail('打卡失败', '无障碍服务启动超时!');
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
    weakup();
    sleep(500);
    //手机主界面
    home();
    sleep(500);
    //退出应用
    openAppSetting(getPackageName(KEY_WORD.DingDing));
    waitText(KEY_WORD.StopApp);
    click(KEY_WORD.StopApp);
    sleep(500);
    click(KEY_WORD.StopApp, 1);
    sleep(500);
    //再次返回主界面
    home();
    sleep(1000);
}

/**开始 */
function start() {
    if (app.launchApp(KEY_WORD.DingDing)) {
        signin_dd();
    } else {
        retry();
    }
}

/**结束 */
function finish() {
    home();
    sleep(500);
    deviceSleep();
    threads.shutDownAll();
    exit();
}

/**
 * 解锁屏幕
 */
function weakup() {
    const awake = device.isScreenOn();
    if (!awake) {
        device.wakeUp();
        sleep(500);
        swipe(500, 10, 500, 1000, 500);
        sleep(500);
        if (SCREEN_PASSWORD) {
            const password = SCREEN_PASSWORD.split('');
            password.forEach(number => {
                click(number)
            });
        }
    }
}

/**一键锁屏 */
function deviceSleep() {
    click('一键锁屏');
}

/**
 * 钉钉打卡
 */
function signin_dd() {
    console.log('打卡开始...');
    waitText(KEY_WORD.GongZuoTai);
    enterScene(KEY_WORD.GongZuoTai, KEY_WORD.KaoQin);
    enterScene(KEY_WORD.KaoQin, KEY_WORD.Daka);
    click(KEY_WORD.Daka);
    console.log('打卡操作结束...');
    waitText(KEY_WORD.Success);
    sendEmail('自动打卡成功!');
}

/**
 * 进入当前app场景
 * @param {场景定义} entContent 
 * @param {该场景等待组件} waitContent 
 * @returns 
 */
function enterScene(entContent, waitContent) {
    if (!click(entContent)) {
        console.log(entContent,'无响应');
        return;
    }
    console.log('进入',entContent);
    if (!waitContent) {
        return;
    }
    waitText(waitContent);
}

/**
 * 发送邮件通知[email.js]
 * @docs https://www.emailjs.com/docs/
 */
function sendEmail(title, content) {
    const body = {
      service_id: MAIL_CONFIG.serviceId,
      template_id: MAIL_CONFIG.templateId,
      user_id: MAIL_CONFIG.publicKey,
      accessToken: MAIL_CONFIG.privateKey,
      template_params: {
          title,
          content,
          email: MAIL_CONFIG.recipient
      }
    }
    http.postJson(MAIL_CONFIG.url, body, null, (res) => {
        // console.log('邮件接口返回: ', res);
    });
}

/**
 * 工作日检查
 * @docs https://www.tianapi.com/
 * @desc 免费用户每日可请求100次, 参数key详情见天行后台
 * @return {bool} 今日是否是工作日
 */
function checkWorkday() {
    return new Promise((resolve, reject) => {
        const url = `${TIAN_API.holiday}?key=${key}`;
        http.get(url, null, (res) => {
            if (res.statusCode != 200) {
                reject(res.statusMessage);
            } else {
                const data = res && res.body && res.body.json();
                const code = data.code;
                if (code == 200) {
                    const result = data && data.result;
                    const date = result.list[0];
                    resolve(date.isnotwork == 0);
                } else {
                    reject(res.msg);
                }
            }
        })
    })
}

/**开启一个子线程 */
function thread2(action) {
    return threads.start(action);
}

let MAX_RETRY = 5;
/**
 * 行为超时
 */
function retry() {
    if (MAX_RETRY > 0) {
        console.log('重试: ', MAX_RETRY);
        MAX_RETRY--;
        main();
    } else {
        sendEmail('打卡失败', '重试5次, 退出脚本!');
        finish();
    }
}

/**
 * 等待指定文本
 * 默认时长 20s
 */
function waitText(str) {
    let cd = 20, timer, thread, mainThread;
    const stop = () => {
        retry();
        thread.interrupt();
        mainThread.interrupt();
    }
    const cutdown = () => {
        timer = setInterval(() => {
            console.log(`等待${str}, ${cd}s`);
            cd --;
            cd <= 0 && stop();
        }, 1000)
    }
    thread = thread2(cutdown);
    mainThread = threads.currentThread();
    textContains(str).waitFor();

    thread.clearInterval(timer);
    thread.interrupt();
}

main();