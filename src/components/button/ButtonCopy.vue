<template lang="">
    <button
        class="btn-copy"
        title="Copy to Clipboard"
        @click="$emit('copy', $el)"
    >
        <Icon icon="ph:copy" />
    </button>
</template>

<script>
export default {
    emits: ["copy"],
};
</script>

<style lang="scss" scoped>
.btn-copy {
    @apply absolute top-2 right-2 z-10 text-lg hover:text-white transition-all;
}
</style>
