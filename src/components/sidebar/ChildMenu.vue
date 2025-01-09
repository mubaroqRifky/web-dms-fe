<template lang="">
    <li class="list-menu" :class="open ? 'show' : 'close'">
        <router-link
            :to="{ path: item.link }"
            :class="[open ? '' : 'justify-center', boldChild(item)]"
        >
            <component
                v-if="item.icon"
                :is="item.icon"
                width="20px"
                height="20px"
            ></component>
            <span v-if="open">
                {{ item.text }}
            </span>
        </router-link>
    </li>
</template>

<script>
export default {
    props: {
        textShow: {
            type: Boolean,
            default: true,
        },
        open: {
            type: Boolean,
            default: true,
        },
        item: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    computed: {
        side_open() {
            return this.open;
        },
    },
    methods: {
        boldChild(child) {
            if (
                this.$route.meta.parent == child.name ||
                this.$route.name == child.name
            ) {
                return "router-link-active";
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
