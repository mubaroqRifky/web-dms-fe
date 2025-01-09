<template>
    <div class="flex flex-1 justify-center items-center">
        <div
            class="flex flex-col justify-center items-center max-w-md text-center"
        >
            <h1 class="text-9xl font-bold">401</h1>
            <h2 class="text-2xl">Page Not Authorized</h2>

            <h3 class="mt-4 mb-1 font-bold text-xl">
                {{ error.name }}
            </h3>
            <p>
                {{ error.message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const defaultName = "Your authorization failed.";
const defaultMessage =
    "Please contact your admin to give you access about this page.";

let { name = defaultName, message = defaultMessage } = window.$errordata || {};
const error = ref({ name, message });
</script>

<style lang=""></style>
