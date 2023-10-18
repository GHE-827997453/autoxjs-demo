const { util } = require("./util");

/**邮件配置 */
const config = {
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    recipient: '827997453@qq.com',
    //邮件配置预设
    publicKey:'uct_asSjj3IWdmpxB',
    privateKey: '6uMkOnDMFOyRHs08qWPk1',
    serviceId: 'service_txdonk9',
    templateId: 'template_d47n1hs',
}
/**
 * 邮件服务: https://www.emailjs.com/docs/
 */
const email = {
    send: (title, content) => {
        content = content + '\n' + util.getDate();
        const body = {
            service_id: config.serviceId,
            template_id: config.templateId,
            user_id: config.publicKey,
            accessToken: config.privateKey,
            template_params: {
                title,
                content,
                email: config.recipient
            }
        }
        http.postJson(config.url, body, null, (res) => {});
    }
}
exports.email = email;