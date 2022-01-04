<template>
    <div class="mb-3">
        <label for="WebHookUrl" class="form-label">{{ $t("WebHookUrl") }}<span style="color: red;"><sup>*</sup></span></label>
        <input id="WebHookUrl" v-model="$parent.notification.qyWeChatWebHookUrl" type="text" class="form-control" required>
        <div class="form-text">
            <p><span style="color: red;"><sup>*</sup></span>{{ $t("Required") }}</p>
        </div>
        <i18n-t tag="div" keypath="wayToGetTeamsURL" class="form-text">
            <a
                href="https://work.weixin.qq.com/api/doc/90000/90136/91770"
                target="_blank"
            >{{ $t("here") }}</a>
        </i18n-t>
    </div>
</template>
