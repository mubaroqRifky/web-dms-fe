<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12h-15"
            />
        </svg>
    </span>
</template>
<script>
export default {
    props: ["width", "height", "styles", "className", "bold"],
};
</script>
<style lang=""></style>
