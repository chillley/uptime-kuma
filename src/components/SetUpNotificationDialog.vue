<template>
    <form @submit.prevent="submit">
        <div ref="modal" class="modal fade" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="exampleModalLabel" class="modal-title">
                            {{ $t("Notifications") }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">

                            <p v-if="$root.notificationList.length === 0">
                                {{ $t("Not available, please setup.") }}
                            </p>

                            <div v-for="notification in $root.notificationList" :key="notification.id" class="form-check form-switch my-3">
                                <input :id=" 'notification' + notification.id" v-model="notificationIDList[notification.id]" class="form-check-input" type="checkbox">

                                <label class="form-check-label" :for=" 'notification' + notification.id">
                                    {{ notification.name }}
                                    <a href="#" @click="$refs.notificationDialog.show(notification.id)">{{ $t("Edit") }}</a>
                                </label>

                                <span v-if="notification.isDefault == true" class="badge bg-primary ms-2">{{ $t("Default") }}</span>
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" :disabled="processing" @click="setUpNotification">
                            <div v-if="processing" class="spinner-border spinner-border-sm me-1"></div>
                            {{ $t("Save") }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <NotificationDialog ref="notificationDialog" @added="addedNotification"/>

</template>

<script>
import { Modal } from "bootstrap";
import NotificationDialog from "../components/NotificationDialog.vue";
import { toRaw } from "vue";

export default {
    name: "SetUpNotificationDialog",
    components: { NotificationDialog },
    data() {
        return {
            processing: false,
            notificationIDList: {},
            monitorList: [],
        };
    },
    mounted() {
        this.modal = new Modal(this.$refs.modal);
    },
    methods: {
        init() {
            // for (let monitor of this.monitorList) {
            //     const id = monitor.id;
            //     const normalMonitor = this.$root.monitorList[id];
            //
            // }

            this.notificationIDList = {};

        },

        show(monitorList) {
            this.monitorList = monitorList;
            this.modal.show();
            this.init();
        },
        setUpNotification() {
            this.processing = true;
            for (let monitor of this.monitorList) {
                const id = monitor.id;
                const normalMonitor = this.$root.monitorList[id];
                normalMonitor.notificationIDList = this.notificationIDList;
                this.$root.getSocket().emit("editMonitor", normalMonitor, (res) => {
                    this.processing = false;
                });
            }
            this.modal.hide();
            this.$root.toastRes({
                ok: true,
                msg: "设置成功",
            });
        },
        // Added a Notification Event
        // Enable it if the notification is added in EditMonitor.vue
        addedNotification(id) {
            this.notificationIDList[id] = true;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.dark {
    .modal-dialog .form-text, .modal-dialog p {
        color: $dark-font-color;
    }
}
</style>
