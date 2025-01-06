<template>
    <div class="flex flex-col gap-3 mt-4">
        <TableControl
            :can-add="isCanAdd"
            add-text="Add Role"
            @add="initialPage.addItem()"
            :search-field="state.searchField"
            v-model="state.searchValue"
            @search-enter="initialPage.search()"
        />

        <vTable
            table-class-name="main-table"
            theme-color="#f0bf2e"
            v-model:server-options="state.serverOptions"
            :server-items-length="state.total"
            :headers="state.headers"
            :items="state.items"
            :rows-items="state.itemShows"
            :loading="state.loading"
            :search-field="state.searchField"
            :search-value="state.searchValue"
        >
            <template #header-action="header">
                <div class="flex justify-center w-full">
                    {{ header.text }}
                </div>
            </template>
            <template #item-action="item">
                <div class="flex gap-2 items-center justify-center">
                    <button
                        v-if="isCanEdit"
                        class="text-green-dark"
                        @click="initialPage.editItem(item.id)"
                    >
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanView"
                        class="text-success"
                        @click="initialPage.showItem(item.id)"
                    >
                        <IconShow width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanDelete"
                        class="text-danger"
                        @click="initialPage.confirmDelete(item)"
                    >
                        <IconDelete width="20px" height="20px" />
                    </button>
                </div>
            </template>
        </vTable>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, getCurrentInstance } from "vue";
import PageRoleController from "@/controllers/page/PageRoleController";

const initialPage = new PageRoleController();
const state = reactive(initialPage.buildTable());

const { appContext } = getCurrentInstance();
const { config } = appContext;
const { globalProperties } = config;
const { can } = globalProperties;

const isCanAdd = computed(() => {
    return can("ROLE_CREATE");
});
const isCanView = computed(() => {
    return can("ROLE_VIEW_DETAIL");
});
const isCanEdit = computed(() => {
    return can("ROLE_UPDATE");
});
const isCanDelete = computed(() => {
    return false;
});
const isCanTakeAction = computed(() => {
    return isCanView.value || isCanEdit.value || isCanDelete.value;
});

if (!isCanTakeAction.value) {
    state.headers.pop();
}

onMounted(() => initialPage.index());
</script>

<style lang="scss"></style>
