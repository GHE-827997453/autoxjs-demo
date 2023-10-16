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

const SCREEN_PASSWORD = '827997';

function main() {
    //检查 autoxjs 无障碍权限是否启用
    auto();
    //唤醒
    weakup();
    //准备
    prepare();
    //开始
    start();
}

/**准备 */
function prepare() {
    home();
    sleep(500);
    openAppSetting(getPackageName('钉钉'));
    waitText(KEY_WORD.StopApp);
    click(KEY_WORD.StopApp);
    sleep(1000);
    click(KEY_WORD.StopApp, 1);
    sleep(500);
    home();
    sleep(1000);
}

/**开始 */
function start() {
    if (app.launchApp('钉钉')) {
        waitText(KEY_WORD.GongZuoTai);
        signin_dd();
        waitText(KEY_WORD.Success);
        sendEmail('自动打卡成功!');
    } else {
        retry();
    }
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

/**
 * 钉钉打卡
 */
function signin_dd() {
    console.log('打卡开始...');
    enterScene(KEY_WORD.GongZuoTai, KEY_WORD.KaoQin);
    enterScene(KEY_WORD.KaoQin, KEY_WORD.Daka);
    click(KEY_WORD.Daka);
    console.log('打卡操作结束...');
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
        threads.shutDownAll();
        exit();
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