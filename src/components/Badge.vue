<template>
    <span class="badge-card" :class=" 'bg-' + status.color " :style="{borderColor:status.color }">{{ status.text }}</span>
</template>

<script>
export default {
    name: "Badge",
    props: {
        monitor: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    computed: {
        status() {
            if (this.$root.statusList[this.monitor.id]) {
                return this.$root.statusList[this.monitor.id];
            }
            return {
                text: "N/A",
            };
        },
    },
};
</script>

<style scoped>
.badge-card {
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-radius: 20px;
    padding: 1px 5px;
    margin-top: 3px;
    white-space: nowrap;
    min-width: 58px;
    text-align: center;
}
</style>
