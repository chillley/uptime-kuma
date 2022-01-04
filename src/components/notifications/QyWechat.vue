<template>
    <div class="mb-3">
        <label for="WebHookUrl" class="form-label">{{ $t("WebHookUrl") }}<span style="color: red;"><sup>*</sup></span></label>
        <input id="WebHookUrl" v-model="$parent.notification.qyWeChatWebHookUrl" type="text" class="form-control" required>
    </div>
</template>
