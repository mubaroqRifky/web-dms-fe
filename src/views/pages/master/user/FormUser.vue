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
                v-model="payload.name"
            />
            <BasicInput
                class="lg:w-1/2"
                label="Email"
                placeholder="Email"
                required
                :disabled="loading || !initialPage.isCreate"
                :error="errors.email"
                v-model="payload.email"
            />

            <div class="grid grid-cols-2 gap-4">
                <BasicSelect
                    dir="col"
                    label="Company"
                    placeholder="Company"
                    :options="options.list_company"
                    :reduce="(v) => v.value"
                    v-model="payload.company"
                    :disabled="loading || initialPage.isShow"
                    multiple
                    required
                    no-validity
                    @option:selected="selectCompanyHandler"
                />
                <BasicSelect
                    dir="col"
                    label="Plant"
                    placeholder="Plant"
                    :options="options.list_plant"
                    :reduce="(v) => v.value"
                    v-model="payload.plant"
                    :disabled="loading || initialPage.isShow"
                    multiple
                    required
                    no-validity
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <BasicSelect
                    dir="col"
                    label="Pilih Divisi"
                    placeholder="Pilih Divisi"
                    :options="options.list_division"
                    :reduce="(v) => v.value"
                    v-model="payload.doc_div"
                    :disabled="loading || initialPage.isShow"
                    no-validity
                />
                <BasicSelect
                    dir="col"
                    label="View Divisi Lain"
                    placeholder="View Divisi Lain"
                    :options="options.list_division"
                    :reduce="(v) => v.value"
                    v-model="payload.vw_doc_div"
                    :disabled="loading || initialPage.isShow"
                    multiple
                    no-validity
                />
            </div>

            <div class="mt-4">
                <button
                    v-if="initialPage.isEdit"
                    class="btn btn-sm btn-primary"
                    :disabled="loading"
                    @click="confirmUpdateUser"
                >
                    Update User
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

        <section
            v-if="!initialPage.isCreate"
            class="p-4 shadow-md border border-solid border-softGray flex flex-col gap-4 bg-white"
        >
            <div class="grid grid-cols-2 md:flex mt-2 text-xs">
                <template v-for="(item, index) in tabs" :key="index">
                    <button
                        @click="activeTab = item.value"
                        class="px-4 py-2 md:w-40 border border-solid transition-all outline-none"
                        :class="
                            activeTab == item.value
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray'
                        "
                    >
                        {{ item.text }}
                    </button>
                </template>
            </div>

            <section class="grid content-start mt-4 gap-4">
                <TableControl
                    :can-add="isCanAssign"
                    :add-text="`Assign ${
                        tabs.find((v) => v.value == activeTab).text
                    }`"
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
            @close="closeModalTable"
            @proses="syncHandler"
            actionClass="justify-end"
            btnClass=""
            btnCancel="Batal"
            btnConfirm="Sync"
        >
            <section class="grid content-start gap-4">
                <TableControl
                    :can-add="false"
                    :search-field="stateTableModal.searchField"
                    v-model="stateTableModal.searchValue"
                    @search-enter="searchModalTable"
                />
                <vTable
                    table-class-name="main-table fixed overflow-auto min-w-[700px]"
                    theme-color="#d2a92a"
                    v-model:server-options="stateTableModal.serverOptions"
                    :server-items-length="stateTableModal.total"
                    :headers="stateTableModal.headers"
                    :items="mapItems"
                    :rows-items="stateTableModal.itemShows"
                    :loading="stateTableModal.loading"
                    :search-field="stateTableModal.searchField"
                    :search-value="stateTableModal.searchValue"
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
    computed,
    watchEffect,
    onMounted,
    getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import ModalForm from "@/components/modal/ModalForm.vue";
import PageUserController from "@/controllers/page/PageUserController";
import Modal from "@/controllers/state/ModalController";
import InputValidationController from "@/controllers/state/InputValidationController";
import PagePermissionController from "@/controllers/page/PagePermissionController";
import PageRoleController from "@/controllers/page/PageRoleController";
import Document from "@/apis/Document";
import User from "@/apis/User";

const route = useRoute();
const router = useRouter();

const title = route.meta.title;
const id = route.params.id;

const initialPage = new PageUserController();
const { payload, loading, data } = initialPage.buildForm();
const errors = computed(() => InputValidationController.get());

const itemsSelected = ref([]);
const modalTable = ref(false);

const options = reactive({
    list_division: [],
    list_company: [],
    list_plant: [],
});

let user_detail = localStorage.getItem("user_detail");
const list_company = localStorage.getItem("list_company");
const list_division = localStorage.getItem("list_division");

if (list_company) {
    options.list_company = JSON.parse(list_company);
}

if (list_division) {
    options.list_division = JSON.parse(list_division);
}

const selectCompanyHandler = (value) => {
    getListPlant(payload.value.company);
};

const getListPlant = async (companies = []) => {
    try {
        if (!companies?.length) return;

        const { data } = await Document.getListPlant({
            company: companies,
        });

        options.list_plant = data.list_plant || [];
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

if (user_detail) {
    user_detail = JSON.parse(user_detail);

    if (user_detail.muser_id != id) router.back();

    if (user_detail.company?.length) {
        getListPlant(user_detail.company);
    }

    payload.value.company = user_detail.company;
    payload.value.plant = user_detail.plant;
    payload.value.doc_div = user_detail.docdiv_id;
    payload.value.vw_doc_div = user_detail.vw_docdiv_id
        .split(",")
        .map((val) => Number(val));
} else {
    router.back();
}

const activeTab = ref("roles");
const tabs = ref([
    { text: "Role", value: "roles" },
    { text: "Permission", value: "permissions" },
]);

const headers = reactive({
    roles: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
    ],
    permissions: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
    ],
});

const table = reactive({
    headers: headers[activeTab.value],
    items: [],
    rowsPerPage: 5,
    loading,
    searchField: ["name"],
    searchValue: "",
});

watchEffect(() => {
    table.headers = headers[activeTab.value] || [];
    table.items = data.value[activeTab.value] || [];
});

const { appContext } = getCurrentInstance();
const { config } = appContext;
const { globalProperties } = config;
const { can } = globalProperties;

const isCanAssign = computed(() => {
    if (!initialPage.isEdit) return false;

    if (activeTab.value == "roles") return can("USER_ASSIGN_ROLE");

    if (activeTab.value == "permissions") return can("USER_ASSIGN_PERMISSION");

    return false;
});

const mapItems = computed(() => {
    return stateTableModal.value.items.map((val) => {
        let result = {};
        switch (activeTab.value) {
            default:
                result.id = val.id;
                result.name = val.name;
                result.description = val.description;
                break;
        }
        return result;
    });
});

const initialPermission = new PagePermissionController();
initialPermission.initialTable.headers.pop();

const initialRole = new PageRoleController();
initialRole.initialTable.headers.pop();

let stateTableModal = ref({});
const modalTableInitial = ref(null);
const path = ref("");

const showModalForm = () => {
    switch (activeTab.value) {
        case "roles":
            stateTableModal.value = reactive(initialRole.buildTable());
            modalTableInitial.value = initialRole;
            path.value = "role";
            break;
        case "permissions":
            stateTableModal.value = reactive(initialPermission.buildTable());
            modalTableInitial.value = initialPermission;
            path.value = "permission";
            break;
        default:
            break;
    }
    modalTableInitial.value.index();
    itemsSelected.value = [...table.items];
    modalTable.value = true;
};

const closeModalTable = () => {
    stateTableModal.value.searchValue = "";
    stateTableModal.value.serverOptions.page = 1;
    modalTable.value = false;
};
const searchModalTable = () => {
    if (modalTableInitial.value) modalTableInitial.value.search();
};

const syncHandler = async () => {
    try {
        const values = itemsSelected.value.map((val) => val.name);
        await initialPage.sync(path.value, activeTab.value, values);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        closeModalTable();
    }
};

const confirmUpdateUser = () => {
    Modal.confirm("Yakin ingin update data?");
    Modal.onconfirm = prosesUpdateUser;
};

const prosesUpdateUser = async () => {
    try {
        let message = "";
        const payloadData = {
            email: payload.value.email,
            user_role: payload.value.user_role,
            nik_atasan: payload.value.nik_atasan,
            restrict: payload.value.restrict,
            doc_div: payload.value.doc_div,
            company: payload.value.company,
            plant: payload.value.plant,
            custodian: payload.value.custodian,
        };

        if (initialPage.isEdit) {
            payloadData.user_id = id;
            payloadData.vw_docdiv_id = payload.value.vw_doc_div.join(",");

            const { message: msg } = await User.update(payloadData);
            message = msg;
        } else {
            payloadData.vw_docdiv = payload.value.vw_doc_div.join(",");

            const { message: msg } = await User.create(payloadData);
            message = msg;
        }

        Modal.success(message);
        Modal.onclose = () => {
            localStorage.removeItem("user_detail");
            localStorage.removeItem("list_company");
            localStorage.removeItem("list_division");
        };
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

onMounted(() => id && initialPage.show(id));
</script>

<style lang=""></style>
