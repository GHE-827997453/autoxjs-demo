const ui = {
    /**等待文本出现 默认等待20s */
    waitText: (str, timeout) => {
        if (!str) {
            return;
        }
        let cd = 20, timer, thread, mainThread;
        const stop = () => {
            timeout && timeout();
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
}
exports.ui = ui;