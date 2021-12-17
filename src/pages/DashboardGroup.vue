<template>
    <div class="dashboard-group d-flex flex-column">
        <header class="d-flex dashboard-header justify-content-center align-items-center p-3">
            <router-link to="/dashboard" class="d-flex  align-items-center mb-3 mb-md-0  text-dark text-decoration-none">
                <!--                <font-awesome-icon icon="tachometer-alt" class="m-3"/>-->
                服务监控
            </router-link>
        </header>
        <div class="main-container d-flex flex-column p-3 ">
            <div class="main-card flex-shrink-1  mb-3" v-for="item in groupPublicGroupList[pageIndex]">
                <div class="main-card-top-border">
                </div>
                <div class="main-card-header pt-3 ps-3">
                    {{ item.name }}
                </div>
                <div class="main-card-body p-3">
                    <div class="row row-cols-auto">
                        <ServerCard class="col mb-2" v-for="(monitor,index) in item.monitorList" :monitor="monitor" :key="index"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from "axios";
import _u from "zy-utils";
import ServerCard from "../components/ServerCard.vue";

export default {
    name: "DashboardGroup",
    components: {
        ServerCard,
    },
    data() {
        return {
            pageIndex: 0,
            timeTask: null,
        };
    },
    computed: {
        groupPublicGroupList() {
            return _u.chunk(this.$root.publicGroupList, 2);
        },
    },
    mounted() {
        axios.get("/api/status-page/monitor-list").then((res) => {
            this.$root.publicGroupList = res.data;
        });
        if (this.timeTask) {
            this.timeTask.stopAllTask();
        }
        this.timeTask = new _u.timeTasks([{
            name: "changePageIndex",
            callback: this.changePageIndex,
            time: 20000,
        }]);
    },
    unmounted() {
        this.timeTask.stopAllTask();
    },
    methods: {
        changePageIndex() {
            if (this.pageIndex < this.groupPublicGroupList.length - 1) {
                this.pageIndex++;
            } else {
                this.pageIndex = 0;
            }
        },

    },
};
</script>

<style lang="scss" scoped>
.dashboard-group {
    width: 100%;
    height: 100vh;
    background: #eaf2ff;
    color: #0f0e5c;
    flex-wrap: nowrap;

    .dashboard-header {
        height: 80px;
        background: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        font-weight: bold;
        font-size: 30px;
    }

    .main-container {
        flex: 1;
    }

    .main-card {
        width: 100%;
        background: #fff;
    }

    .main-card-top-border {
        width: 100%;
        height: 4px;
        background: #35aa87;
    }

    .main-card-header {
        font-size: 25px;
        font-weight: bold;
    }
}

</style>
