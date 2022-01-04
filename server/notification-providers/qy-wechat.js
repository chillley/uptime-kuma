const NotificationProvider = require("./notification-provider");
const {
    DOWN,
    UP,
} = require("../../src/util");
const { default: axios } = require("axios");
const Crypto = require("crypto");

class QyWechat extends NotificationProvider {
    name = "QyWechat";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";

        try {
            if (heartbeatJSON != null) {
                let params = {
                    "msgtype": "markdown",
                    markdown: {
                        content: `## [${this.statusToString(heartbeatJSON["status"])}] ${monitorJSON["name"]} \n > ${heartbeatJSON["msg"]}  \n > Time: ${heartbeatJSON["time"]}`,
                    },
                };
                if (this.sendToQyWechat(notification, params)) {
                    return okMsg;
                }
            } else {
                let params = {
                    msgtype: "text",
                    text: {
                        content: msg,
                    },
                };
                if (this.sendToQyWechat(notification, params)) {
                    return okMsg;
                }
            }
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    async sendToQyWechat(notification, params) {
        let timestamp = Date.now();

        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            url: `${notification.qyWeChatWebHookUrl}&timestamp=${timestamp}`,
            data: JSON.stringify(params),
        };

        let result = await axios(config);
        if (result.data.errmsg == "ok") {
            return true;
        }
        return false;
    }

    statusToString(status) {
        switch (status) {
            case DOWN:
                return "DOWN";
            case UP:
                return "UP";
            default:
                return status;
        }
    }
}

module.exports = QyWechat;
