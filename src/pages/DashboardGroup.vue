<template>
    <div class="dashboard-group d-flex flex-column">
        <header class="d-flex dashboard-header justify-content-center align-items-center p-3 ">
            <router-link to="/dashboard" class="d-flex  align-items-center mb-3 mb-md-0  text-decoration-none">
                <span class="header-title">服务监控</span>
            </router-link>
            <div class="header-time" v-if="!$root.isMobile">
                {{ timeTips }}
            </div>
        </header>

        <div class="main-container d-flex flex-column p-3 ">
            <div class="row overview pb-2">
                <div class="col overview-col d-flex  justify-content-center">
                    <div class="overview-item ">
                        <h4 class="p-1 mb-0">{{ $t("Up") }}</h4>
                        <span class="num">{{ stats.up }}</span>
                    </div>
                </div>
                <div class="col d-flex  justify-content-center">
                    <div class="overview-item">
                        <h4 class="p-1 mb-0">{{ $t("Down") }}</h4>
                        <span class="num text-danger">{{ stats.down }}</span>
                    </div>
                </div>
                <div class="col d-flex  justify-content-center">
                    <div class="overview-item">
                        <h4 class="p-1 mb-0">{{ $t("Unknown") }}</h4>
                        <span class="num text-secondary">{{ stats.unknown }}</span>
                    </div>
                </div>
                <div class="col d-flex  justify-content-center">
                    <div class="overview-item">
                        <h4 class="p-1 mb-0">{{ $t("pauseDashboardHome") }}</h4>
                        <span class="num text-secondary">{{ stats.pause }}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column flex-fill flex-grow-0" style="overflow: hidden;">
                <SeamlessScroll :class-option="{step:2}" :data="$root.publicGroupList" class="warp">
                    <div v-for="item in $root.publicGroupList" class="main-card flex-shrink-1  mb-2">
                        <div class="main-card-top-border">
                        </div>
                        <div class="main-card-header  ps-4 py-1">
                            {{ item.name }}
                        </div>
                        <div class="main-card-body p-3">
                            <div class="row row-cols-auto">
                                <ServerCard v-for="(monitor,index) in item.monitorList" :key="index" class="col mb-2" :monitor="monitor"/>
                            </div>
                        </div>
                    </div>
                </SeamlessScroll>
            </div>
        </div>
    </div>
</template>

<script>

import axios from "axios";
import ServerCard from "../components/ServerCard.vue";
import SeamlessScroll from "../components/SeamlessScroll.vue";
import { ref } from "vue";
import dayjs from "dayjs";

export default {
    name: "DashboardGroup",
    components: {
        ServerCard,
        SeamlessScroll,
    },
    setup() {
        let timeTips = ref("");
        setInterval(() => timeTips.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss"), 1000);
        return {
            timeTips,
        };
    },
    computed: {
        stats() {
            let result = {
                up: 0,
                down: 0,
                unknown: 0,
                pause: 0,
            };

            for (let monitorID in this.$root.monitorList) {
                let beat = this.$root.lastHeartbeatList[monitorID];
                let monitor = this.$root.monitorList[monitorID];

                if (monitor && !monitor.active) {
                    result.pause++;
                } else if (beat) {
                    if (beat.status === 1) {
                        result.up++;
                    } else if (beat.status === 0) {
                        result.down++;
                    } else if (beat.status === 2) {
                        result.up++;
                    } else {
                        result.unknown++;
                    }
                } else {
                    result.unknown++;
                }
            }

            return result;
        },
    },
    mounted() {
        axios.get("/api/status-page/monitor-list").then((res) => {
            this.$root.publicGroupList = res.data;
        });
    },

};
</script>

<style lang="scss" scoped>
.dashboard-group {
    width: 100%;
    height: 100vh;
    background: #000d4a url("../../public/dashboard-bg.png") center center;
    background-size: cover;
    color: #fff;
    flex-wrap: nowrap;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
    Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB',
    'Microsoft Yahei', sans-serif;

    .header-title {
        color: #fff !important;
        position: relative;
        top: -5px;
    }

    .header-time {
        position: absolute;
        right: 10px;
        top: 10px;
        color: rgba(255, 255, 255, 0.7);
        font-family: electronicFont, serif;
        font-size: 27px;
    }

    .dashboard-header {
        height: 90px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        font-size: 30px;
        background: url("../../public/dashboard-head_bg.png") no-repeat center center;
        background-size: 100% 100%;
        position: relative;
    }

    .main-container {
        padding-top: 0 !important;
        flex: 1;
        overflow: hidden;
    }

    .main-card {
        width: 100%;
        border: 1px solid rgba(7, 118, 181, 0.5);
        box-shadow: inset 0 0 10px rgb(7 118 181 / 40%);
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;

        &::before {
            width: 100%;
            height: 1px;
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            background: linear-gradient(to right, #076ead, #4ba6e0, #076ead);
            box-shadow: 0 0 5px rgb(131 189 227);
            opacity: 0.6;
        }
    }

    .main-card-top-border {
        width: 100%;
        height: 0;
        background: #35aa87;
    }

    .main-card-header {
        font-size: 20px;
        border-bottom: 1px solid rgba(7, 118, 181, 0.7);
        position: relative;

        &::before {
            position: absolute;
            content: "";
            width: 6px;
            height: 6px;
            background: rgba(22, 214, 255, 0.9);
            box-shadow: 0 0 5px rgb(22 214 255 / 90%);
            border-radius: 10px;
            left: 10px;
            top: 18px;
        }
    }

    .overview {
        text-align: center;
        position: relative;

    }

    .num {
        font-size: 30px;
        color: #5cdd8b;
        font-weight: bold;
        display: block;
    }

    .overview-item {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(7, 118, 181, 0.5);
        box-shadow: inset 0 0 10px rgb(7 118 181 / 40%);
    }

}

</style>
