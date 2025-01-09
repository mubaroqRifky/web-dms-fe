<template>
    <div>
        <button
            @click="openHandler"
            class="shadow-sm rounded-md px-4 py-1 border border-solid flex gap-2 items-center transition-all text-sm"
            :class="
                hasFiltered
                    ? 'text-white bg-primary border-primary hover:bg-white hover:text-primary'
                    : 'text-primary bg-white border-primary hover:bg-primary hover:text-white'
            "
        >
            <IconFilter width="15px" height="15px" /> Filter
        </button>

        <Transition name="ghost">
            <section
                v-if="filter_show"
                class="fixed top-0 left-0 bottom-0 right-0 z-40 bg-blur flex justify-center items-center"
                @click.self.stop="closeHandler"
            >
                <div
                    class="bg-white rounded-sm flex flex-col min-h-[400px] max-h-[100vh] w-full md:w-auto md:min-w-[600px] md:max-w-[20vw]"
                >
                    <div
                        class="px-4 py-2.5 border-b border-solid border-gray flex justify-between items-center"
                    >
                        <h2
                            class="font-semibold hidden sm:block whitespace-nowrap text-primary text-sm"
                        >
                            Filter by
                        </h2>
                        <slot name="header-right"></slot>
                    </div>

                    <section class="flex-1 overflow-auto md:overflow-visible">
                        <slot></slot>
                    </section>

                    <div class="flex justify-end items-center gap-2 px-4 py-3">
                        <button
                            class="px-4 py-1.5 rounded-md border border-solid border-primary text-sm text-primary"
                            @click="resetHandler"
                        >
                            Reset
                        </button>
                        <button
                            class="px-4 py-1.5 rounded-md border border-solid border-primary text-sm text-white bg-primary"
                            @click="applyHandler"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </section>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from "vue";
import IconFilter from "@/components/icons/action/IconFilter.vue";

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    hasFiltered: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["reset", "apply", "close", "open"]);

const openHandler = () => {
    emit("open");
    filter_show.value = true;
};

const filter_show = ref(false);
const closeHandler = () => {
    emit("close");
    filter_show.value = false;
};
const resetHandler = () => {
    emit("reset");
    closeHandler();
};
const applyHandler = () => {
    emit("apply");
    closeHandler();
};
</script>

<style lang="css">
.bg-blur {
    background: linear-gradient(
        147deg,
        rgba(108, 108, 108, 0.2) 0%,
        rgba(108, 108, 108, 0.2) 100%
    );
    backdrop-filter: blur(2px);
}
</style>
