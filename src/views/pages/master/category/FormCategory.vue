<template>
    <div class="flex flex-col gap-3 mt-4">
        <section
            class="p-4 shadow-md border border-solid border-softGray flex flex-col gap-4 dark:bg-primaryTransparent bg-white"
        >
            <h2 class="font-medium my-2">Form {{ title }}</h2>
            <BasicInput
                class="lg:w-1/2"
                label="Name"
                placeholder="Name"
                required
                :disabled="loading || !initialPage.isCreate"
                :error="errors.name"
                v-model:value="payload.name"
            />
            <BasicInput
                class="lg:w-1/2"
                label="Description"
                placeholder="Description"
                type="textarea"
                required
                :disabled="loading || initialPage.isShow"
                :error="errors.description"
                v-model:value="payload.description"
            />

            <div>
                <button
                    v-if="initialPage.isEdit"
                    class="btn btn-sm btn-primary"
                    :disabled="loading"
                    @click="initialPage.confirmUpdate()"
                >
                    Update
                </button>
                <button
                    v-if="initialPage.isCreate"
                    class="btn btn-sm btn-primary"
                    :disabled="loading"
                    @click="initialPage.confirmSave()"
                >
                    Simpan
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import BasicInput from "@/components/input/BasicInput.vue";
import PagePermissionController from "@/controllers/page/PagePermissionController";
import InputValidationController from "@/controllers/state/InputValidationController";

const route = useRoute();
const title = route.meta.title;
const id = route.params.id;

const initialPage = new PagePermissionController();
const { payload, loading } = initialPage.buildForm();
const errors = computed(() => InputValidationController.get());

onMounted(() => id && initialPage.show(id));
</script>

<style lang=""></style>
