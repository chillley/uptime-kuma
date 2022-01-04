<template>
    <div>
        <!-- Group List -->
        <Draggable
            v-model="$root.publicGroupList"
            :disabled="!editMode"
            item-key="id"
            :animation="100"
        >
            <template #item="group">
                <div class="mb-5 ">
                    <!-- Group Title -->
                    <h2 class="group-title ">
                        <font-awesome-icon v-if="editMode && showGroupDrag" icon="arrows-alt-v" class="action drag me-3"/>
                        <font-awesome-icon v-if="editMode" icon="times" class="action remove me-3" @click="removeGroup(group.index)"/>
                        <Editable v-model="group.element.name" :contenteditable="editMode" tag="span"/>
                        <div style="float:right;" v-show="!editMode">
                            <button class="btn btn-light" style="margin-right: 20px;" @click="pauseDialog(group.element.monitorList)">
                                <font-awesome-icon icon="pause"/>
                                {{ $t("Pause") }}
                            </button>
                            <button class="btn btn-primary" @click="resumeMonitor(group.element.monitorList)">
                                <font-awesome-icon icon="play"/>
                                {{ $t("Resume") }}
                            </button>
                        </div>
                    </h2>

                    <div class="shadow-box monitor-list mt-4 position-relative">
                        <div v-if="group.element.monitorList.length === 0" class="text-center no-monitor-msg">
                            {{ $t("No Monitors") }}
                        </div>

                        <!-- Monitor List -->
                        <!-- animation is not working, no idea why -->
                        <Draggable
                            v-model="group.element.monitorList"
                            class="monitor-list"
                            group="same-group"
                            :disabled="!editMode"
                            :animation="100"
                            item-key="id"
                        >
                            <template #item="monitor">
                                <div class="item" :class="{ 'disabled': onMonitorDisabled(monitor.element.id)}">
                                    <div class="row">
                                        <div class="col-9 col-md-8 small-padding">
                                            <div class="info">
                                                <font-awesome-icon v-if="editMode" icon="arrows-alt-v" class="action drag me-3"/>
                                                <font-awesome-icon v-if="editMode" icon="times" class="action remove me-3" @click="removeMonitor(group.index, monitor.index)"/>

                                                <Uptime :monitor="monitor.element" type="24" :pill="true"/>
                                                {{ monitor.element.name }}
                                            </div>
                                            <div class="tags">
                                                <Tag v-for="tag in monitor.element.tags" :key="tag" :item="tag" :size="'sm'"/>
                                            </div>
                                        </div>
                                        <div :key="$root.userHeartbeatBar" class="col-3 col-md-4">
                                            <HeartbeatBar size="small" :monitor-id="monitor.element.id"/>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Draggable>
                    </div>
                </div>

            </template>
        </Draggable>
        <Confirm ref="confirmPause" :yes-text="$t('Yes')" :no-text="$t('No')" @yes="pauseMonitor">
            {{ $t("pauseMonitorMsg") }}
        </Confirm>
    </div>
</template>

<script>
import Draggable from "vuedraggable";
import HeartbeatBar from "./HeartbeatBar.vue";
import Uptime from "./Uptime.vue";
import Tag from "./Tag.vue";
import Confirm from "./Confirm.vue";
import { toRaw } from "vue";

export default {
    components: {
        Draggable,
        HeartbeatBar,
        Uptime,
        Tag,
        Confirm,
    },
    props: {
        editMode: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            groupList: [],
        };
    },
    computed: {
        showGroupDrag() {
            return (this.$root.publicGroupList.length >= 2);
        },
    },
    created() {

    },
    methods: {
        pauseDialog(groupList) {
            this.$refs.confirmPause.show();
            this.groupList = groupList;
        },

        onMonitorDisabled(id) {
            if (this.$root.monitorList[id]) {
                return !this.$root.monitorList[id].active;
            }
            return 0;
        },

        resumeMonitor(groupList) {
            const normalGroupList = toRaw(groupList);
            for (let monitor of normalGroupList) {
                this.$root.getSocket().emit("resumeMonitor", monitor.id, (res) => {
                    this.$root.toastRes(res);
                });
            }
        },
        pauseMonitor() {
            const normalGroupList = toRaw(this.groupList);
            for (let monitor of normalGroupList) {
                this.$root.getSocket().emit("pauseMonitor", monitor.id, (res) => {
                    this.$root.toastRes(res);
                });
            }
        },
        removeGroup(index) {
            this.$root.publicGroupList.splice(index, 1);
        },
        removeMonitor(groupIndex, index) {
            this.$root.publicGroupList[groupIndex].monitorList.splice(index, 1);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars";

.no-monitor-msg {
    position: absolute;
    width: 100%;
    top: 20px;
    left: 0;
}

.monitor-list {
    min-height: 46px;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}

.drag {
    color: #bbb;
    cursor: grab;
}

.remove {
    color: $danger;
}

.group-title {
    span {
        display: inline-block;
        min-width: 15px;
    }
}

.mobile {
    .item {
        padding: 13px 0 10px 0;
    }
}

</style>
