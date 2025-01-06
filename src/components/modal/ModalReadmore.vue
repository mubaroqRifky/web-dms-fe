<template>
    <section
        class="fixed top-0 left-0 bottom-0 right-0 z-40 bg-blur flex justify-center items-center"
        @click.self.stop="closeHandler"
    >
        <div
            class="bg-white rounded-sm flex flex-col min-h-[400px] max-h-[100vh] w-full md:w-[50vw] md:min-w-[600px] max-w-[80vw]"
        >
            <div
                class="px-4 py-2.5 border-b border-solid border-gray flex justify-between items-center"
            >
                <div class="flex gap-4 items-center">
                    <h2 class="font-semibold text-primary text-sm">
                        {{ title }}
                    </h2>
                    <p class="text-sm text-darkGray">{{ subtitle }}</p>
                </div>
            </div>

            <div class="px-4 py-2 flex flex-col">
                <div>
                    <p class="text-sm font-medium">{{ name }}</p>
                </div>
                <article>
                    <template v-for="tag in tags.split(',')">
                        <p v-html="tag" class="text-sm"></p>
                    </template>
                </article>
            </div>

            <section
                class="flex-1 overflow-auto md:overflow-auto meta-container p-4 bg-primaryLight text-sm m-4"
            >
                <div v-html="content"></div>
            </section>

            <div class="p-4 flex justify-end">
                <button class="text-primary text-xs" @click="$emit('detail')">
                    View Detail
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subtitle: {
        type: String,
        default: "",
    },
    tags: {
        default: "",
    },
    name: {
        default: "",
    },
    content: {
        default: "",
    },
});

const emit = defineEmits(["close", "detail"]);

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
