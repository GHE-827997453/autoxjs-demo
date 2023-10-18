const { ui } = require("../ui");
const { util } = require("../util");

const config = {
    name: '钉钉',
    gzt: '工作台',
    kaoqin: '考勤打卡',
    signin: '班打卡',
    signsuc: '打卡成功'
}

function signin() {
    util.log('打卡开始...');
    ui.waitText(config.gzt);
    // ui.waitText(KEY_WORD.GongZuoTai);
    enterScene(KEY_WORD.GongZuoTai, KEY_WORD.KaoQin);
    enterScene(KEY_WORD.KaoQin, KEY_WORD.Daka);
    click(KEY_WORD.Daka);
    util.log('打卡操作结束...');
    waitText(KEY_WORD.Success);
    sendEmail('自动打卡成功!');
}

exports.action = signin;