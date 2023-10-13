const SCENE_DD = {
    gong_zuo_tai: '工作台',
    kao_qin: '考勤打卡',
    shang_ban: '上班打卡',
    xia_ban: '下班打卡',
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
    //解锁
    weakup();
    //如果钉钉正在运行、先退出
    // todo
    //打开应用
    if (app.launchApp('钉钉')) {
        textContains(SCENE_DD.gong_zuo_tai).waitFor();
        signin_dd();
        textContains('').waitFor();
        sendEmail('自动打卡成功!');
    } else {
        //重试
        main();
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
            const password = '827997'.split('');
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
    console.log('action start...');
    enterScene(SCENE_DD.gong_zuo_tai, SCENE_DD.kao_qin);
    const str = '班打卡';
    enterScene(SCENE_DD.kao_qin, str);
    click(str);
    console.log('action end...');
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
    textContains(waitContent).waitFor();
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
        console.log('邮件接口返回: ', res);
    });
}
main();