<template lang="">
    <li
        @click="$emit('press')"
        class="list-menu menu-parent justify-between"
        :class="[
            side_open ? 'show' : 'close',
            $route.name.match(item.name) ? 'text-primary font-medium' : '',
        ]"
    >
        <div class="flex items-center gap-2">
            <component
                v-if="item.icon"
                :is="item.icon"
                width="20px"
                height="20px"
            ></component>
            <span v-if="side_open">
                {{ item.text }}
            </span>
        </div>
        <IconArrow
            v-if="side_open"
            class="transition-transform"
            :class="isMenuActive(item) ? 'rotate-90' : ''"
            width="15px"
            height="15px"
        />
    </li>
</template>

<script>
import IconArrow from "@/components/icons/page/IconArrow.vue";

export default {
    components: {
        IconArrow,
    },
    props: {
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
    emits: ["press"],
    methods: {
        isMenuActive(item) {
            return item.show || this.$route.name.match(item.name);
        },
        boldParent(item) {
            if (item.child.some((val) => val.name == this.$route.name)) {
                return true;
            } else if (
                this.$route.meta.parent &&
                item.child.some((val) => val.name == this.$route.meta.parent)
            ) {
                return true;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.menu-parent {
    @apply px-6 py-3;
}
</style>
