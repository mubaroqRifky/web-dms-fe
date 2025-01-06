<template>
    <section
        class="fixed top-0 left-0 bottom-0 right-0 z-40 bg-blur flex justify-center"
        @click.self.stop="closeHandler"
    >
        <div
            class="bg-white rounded-sm flex flex-col min-h-[400px] max-h-100 w-full md:w-auto md:min-w-[600px] max-w-[80vw]"
        >
            <div
                class="px-4 py-2.5 border-b border-solid border-gray flex justify-between items-center z-10 bg-white"
            >
                <h2 class="font-semibold text-primary text-sm">Preview</h2>
                <slot name="header-right"></slot>
                <button class="text-danger" @click="closeHandler">
                    <IconClose />
                </button>
            </div>

            <div
                class="flex items-center divide-x divide-solid divide-primary overflow-auto min-h-fit border-b border-solid border-gray bg-white z-10"
            >
                <template v-for="(item, index) of tabs">
                    <button
                        class="px-4 py-2 text-xs whitespace-nowrap min-w-fit hover:text-primary hover:bg-primaryLight transition-all outline-none"
                        :class="
                            current == item.name
                                ? 'text-primary bg-primaryLight'
                                : 'text-gray-dark'
                        "
                        @click="$emit('preview', item)"
                    >
                        File {{ index + 1 }}
                    </button>
                </template>
            </div>

            <section class="flex-1 overflow-auto md:overflow-visible">
                <slot></slot>
            </section>
        </div>
    </section>
</template>

<script setup>
import IconClose from "@/components/icons/action/IconClose.vue";

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    hasFiltered: {
        type: Boolean,
        default: false,
    },
    tabs: {
        type: Array,
        default: function () {
            return [];
        },
    },
    current: {
        default: "",
    },
});

const emit = defineEmits(["reset", "apply", "close", "open", "preview"]);

const closeHandler = () => {
    emit("close");
};
</script>

<style lang="css" scoped>
.bg-blur {
    background: linear-gradient(
        147deg,
        rgba(108, 108, 108, 0.2) 0%,
        rgba(108, 108, 108, 0.2) 100%
    );
    backdrop-filter: blur(2px);
}
</style>
