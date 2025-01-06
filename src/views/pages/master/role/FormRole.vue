<template>
    <div class="flex flex-col gap-8 mt-8">
        <section
            class="p-4 shadow-md border border-solid border-softGray flex flex-col gap-4 bg-white"
        >
            <h2 class="font-medium my-2">Form {{ title }}</h2>
            <BasicInput
                class="lg:w-1/2"
                label="Name"
                placeholder="Name"
                required
                :disabled="loading || !initialPage.isCreate"
                :error="errors.name"
                v-model="payload.name"
            />
            <BasicInput
                class="lg:w-1/2"
                label="Description"
                placeholder="Description"
                type="textarea"
                required
                :disabled="loading || initialPage.isShow"
                :error="errors.description"
                v-model="payload.description"
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

        <!-- Assign Permission -->
        <section
            v-if="!initialPage.isCreate"
            class="p-4 shadow-md border border-solid border-softGray flex flex-col gap-4 bg-white"
        >
            <section class="grid content-start gap-4">
                <TableControl
                    :can-add="isCanAssign"
                    add-text="Assign Permission"
                    @add="showModalForm"
                    :search-field="table.searchField"
                    v-model="table.searchValue"
                />
                <vTable
                    table-class-name="main-table"
                    theme-color="#d2a92a"
                    :headers="table.headers"
                    :items="table.items"
                    :rows-items="table.itemShows"
                    :loading="table.loading"
                    :rows-per-page="table.rowsPerPage"
                    :search-field="table.searchField"
                    :search-value="table.searchValue"
                    buttons-pagination
                    show-index
                >
                    <template #header-action="header">
                        <div class="flex justify-center w-full">
                            {{ header.text }}
                        </div>
                    </template>
                </vTable>
            </section>
        </section>

        <ModalForm
            v-if="modalTable"
            :content="'Assign Permission'"
            :loading="loading"
            @close="modalTable = false"
            @proses="syncHandler"
            actionClass="justify-end"
            btnClass=""
            btnCancel="Batal"
            btnConfirm="Sync"
        >
            <section class="grid content-start gap-4">
                <TableControl
                    :can-add="false"
                    :search-field="statePermission.searchField"
                    v-model="statePermission.searchValue"
                    @search-enter="initialPermission.search()"
                />
                <vTable
                    table-class-name="main-table fixed overflow-auto min-w-[700px]"
                    theme-color="#d2a92a"
                    v-model:server-options="statePermission.serverOptions"
                    :server-items-length="statePermission.total"
                    :headers="statePermission.headers"
                    :items="mapItems"
                    :rows-items="statePermission.itemShows"
                    :loading="statePermission.loading"
                    :search-field="statePermission.searchField"
                    :search-value="statePermission.searchValue"
                    v-model:items-selected="itemsSelected"
                    fixed-checkbox
                    :checkbox-column-width="36"
                    buttons-pagination
                />
            </section>
        </ModalForm>
    </div>
</template>

<script setup>
import {
    ref,
    reactive,
    watchEffect,
    computed,
    onMounted,
    getCurrentInstance,
} from "vue";
import { useRoute } from "vue-router";
import BasicInput from "@/components/input/BasicInput.vue";
import ModalForm from "@/components/modal/ModalForm.vue";
import PageRoleController from "@/controllers/page/PageRoleController";
import InputValidationController from "@/controllers/state/InputValidationController";
import PagePermissionController from "@/controllers/page/PagePermissionController";

const route = useRoute();
const title = route.meta.title;
const id = route.params.id;

const initialPage = new PageRoleController();
const { payload, loading } = initialPage.buildForm();
const errors = computed(() => InputValidationController.get());

// Table Current Permission
const table = reactive({
    headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
    ],
    items: [],
    rowsPerPage: 5,
    loading: false,
    searchField: ["name"],
    searchValue: "",
});

watchEffect(() => {
    table.items = payload.value.permissions || [];
    table.loading = loading.value;
});

// Modal Table Permission
const initialPermission = new PagePermissionController();
initialPermission.initialTable.headers.pop();

const statePermission = reactive(initialPermission.buildTable());
const itemsSelected = ref([]);
const modalTable = ref(false);

const { appContext } = getCurrentInstance();
const { config } = appContext;
const { globalProperties } = config;
const { can } = globalProperties;

const isCanAssign = computed(() => {
    if (!initialPage.isEdit) return false;

    return can("ROLE_ASSIGN_PERMISSION");
});

const mapItems = computed(() => {
    return statePermission.items.map((val) => {
        return {
            id: val.id,
            name: val.name,
            description: val.description,
        };
    });
});

const showModalForm = () => {
    initialPermission.index();
    itemsSelected.value = [...table.items];
    modalTable.value = true;
};

const syncHandler = async () => {
    try {
        const permisisons = itemsSelected.value.map((val) => val.name);
        await initialPage.sync(permisisons);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        modalTable.value = false;
    }
};

onMounted(() => id && initialPage.show(id));
</script>

<style lang="scss"></style>
