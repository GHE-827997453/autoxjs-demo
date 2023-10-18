const password = '827997'
/**
 * 关于手机一些通用接口的定义
 * 不同型号的手机实现不同
 */
const phone = {
    /**锁屏解锁 */
    weakup: () => {
        const awake = device.isScreenOn();
        if (!awake) {
            device.wakeUp();
            sleep(500);
            swipe(500, 10, 500, 1000, 500);
            sleep(500);
            const arr = password.split('');
            arr.forEach(number => {
                click(number)
            });
        }
    },
    /**锁屏 */
    lock: () => {
        click('一键锁屏');
    }
}
exports.phone = phone;