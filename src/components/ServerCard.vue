<template>
    <div class="server-card">
        <div class="server-card-content" :class="`bg-${color}`">
            <div class="ps-3 pt-2 server-card-content-name">
                {{ monitor.name }}
            </div>
            <div class="ps-3 pt-2 d-flex align-items-center">
                <Badge :monitor="monitor"></Badge>
                <Uptime class="up-time ps-1" :monitor="monitor" type="24" :pill="true"/>
            </div>
        </div>
    </div>
</template>

<script>
import Badge from "../components/Badge.vue";
import Uptime from "../components/Uptime.vue";

export default {
    name: "ServerCard",
    components: {
        Badge,
        Uptime,
    },
    props: {
        monitor: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    computed: {
        color() {
            if (this.lastHeartBeat.status === 0) {
                return "danger";
            }

            if (this.lastHeartBeat.status === 1) {
                return "primary";
            }

            if (this.lastHeartBeat.status === 2) {
                return "warning";
            }

            return "secondary";
        },

        lastHeartBeat() {
            if (this.monitor.id in this.$root.lastHeartbeatList && this.$root.lastHeartbeatList[this.monitor.id]) {
                return this.$root.lastHeartbeatList[this.monitor.id];
            }
            return {
                status: -1,
            };
        },
    },
};
</script>

<style scoped>
.server-card-content {
    min-width: 208px;
    height: 100px;
    color: #fff;
}

.server-card-content-name {
    font-size: 20px;
    font-weight: bold;
}

.up-time {
    font-size: 25px;
    font-weight: bold;
    color: #fff;
    opacity: 1;
    background: transparent !important;
}
</style>
