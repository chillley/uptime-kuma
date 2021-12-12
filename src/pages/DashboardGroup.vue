<template>
    <div class="container-fluid">
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <router-link to="/dashboard" class="nav-link">
                   服务监控
                </router-link>
            </div>
        </nav>
        <div class="main-container">
            <div class="row" v-for="item in $root.publicGroupList">
                <h5>
                    {{ item.name }}
                </h5>
                <div class="row">
                    <div class="card mb-3 col server-card" v-for="row in item.monitorList">
                        <div class="card-body">
                            <h5 class="card-title">
                                <Uptime :monitor="row" type="24" :pill="true"/>
                                {{ row.name }}
                            </h5>
                            <HeartbeatBar size="small" :monitor-id="row.id"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import axios from "axios";
import Uptime from "../components/Uptime.vue";
import HeartbeatBar from "../components/HeartbeatBar.vue";

export default {
    name: "DashboardGroup",
    components: {
        Uptime,
        HeartbeatBar,
    },
    mounted() {

        axios.get("/api/status-page/monitor-list").then((res) => {
            this.$root.publicGroupList = res.data;
        });

    },
};
</script>

<style lang="scss" scoped>
.main-container {
    padding: 20px;
    box-sizing: border-box;

    .server-card {
        max-width: 18rem;
        border-radius: 0;
        margin-right: 20px;
    }
}
</style>
