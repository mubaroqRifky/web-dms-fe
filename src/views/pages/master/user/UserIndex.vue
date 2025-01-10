<template>
    <div class="flex flex-col gap-3 mt-4">
        <TableControl
            add-text="Add User"
            :can-add="isCanAdd"
            @add="openForm"
            :search-field="state.searchField"
            v-model="state.searchValue"
        />

        <vTable
            table-class-name="main-table"
            theme-color="#f0bf2e"
            :server-items-length="state.total"
            :headers="state.headers"
            :items="state.items"
            :rows-per-page="10"
            :rows-items="state.itemShows"
            :loading="state.loading"
            :search-field="state.searchField"
            :search-value="state.searchValue"
            show-index
        >
            <template #header-action="header">
                <div class="flex justify-center w-full">
                    {{ header.text }}
                </div>
            </template>
            <template #item-roles="item">
                <div class="flex justify-center w-full">
                    {{
                        item?.roles?.length
                            ? item.roles.map((v) => v.name).join(", ")
                            : "-"
                    }}
                </div>
            </template>
            <template #item-action="item">
                <div class="flex gap-2 items-center justify-center">
                    <button
                        v-if="isCanEdit"
                        class="text-green-dark"
                        @click="editUser(item)"
                    >
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanView"
                        class="text-success"
                        @click="showUser(item)"
                    >
                        <IconShow width="20px" height="20px" />
                    </button>
                </div>
            </template>
        </vTable>

        <ModalForm
            content="Invite People"
            v-if="modal_form"
            :disabled="cannot_create || !form.email"
            @close="closeForm"
            @proses="prosesSubmitUser"
        >
            <section class="flex flex-col">
                <p class="text-[.7rem] leading-4 mb-4">
                    Minta orang untuk bergabung dengan memasukkan alamat email
                    mereka. Kemudian tetapkan akses yang dapat mereka gunakan.
                </p>

                <section class="max-h-[70vh] flex flex-col gap-4">
                    <BasicInput
                        dir="col"
                        label="Masukan Alamat Email"
                        placeholder="Email CPP"
                        type="email"
                        v-model="form.email"
                        :disabled="!!selected_user"
                        required
                        no-validity
                        @value:change="emailSearchHandler"
                    />
                    <div class="grid grid-cols-2 gap-4">
                        <BasicSelect
                            dir="col"
                            label="Company"
                            placeholder="Company"
                            :options="options.list_company"
                            :reduce="(v) => v.value"
                            v-model="form.company"
                            :disabled="cannot_create"
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
                            v-model="form.plant"
                            :disabled="cannot_create"
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
                            v-model="form.doc_div"
                            :disabled="cannot_create"
                            no-validity
                        />
                        <BasicSelect
                            dir="col"
                            label="View Divisi Lain"
                            placeholder="View Divisi Lain"
                            :options="options.list_division"
                            :reduce="(v) => v.value"
                            v-model="form.vw_doc_div"
                            :disabled="cannot_create"
                            multiple
                            no-validity
                        />
                    </div>
                </section>
            </section>
        </ModalForm>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, getCurrentInstance } from "vue";
import PageUserController from "@/controllers/page/PageUserController";
import Modal from "@/controllers/state/ModalController";
import ModalForm from "@/components/modal/ModalForm.vue";
import User from "@/apis/User";
import Document from "@/apis/Document";

const initialPage = new PageUserController();
const state = reactive(initialPage.buildTable());
state.searchField = ["user_name", "user_email", "role_name"];

const { appContext } = getCurrentInstance();
const { config } = appContext;
const { globalProperties } = config;
const { can } = globalProperties;

const isCanAdd = computed(() => {
    return can("USER_ADD");
});
const isCanView = computed(() => {
    return can("USER_VIEW_DETAIL");
});
const isCanEdit = computed(() => {
    return can("USER_EDIT");
});
const isCanTakeAction = computed(() => {
    return isCanView.value || isCanEdit.value;
});

if (!isCanTakeAction.value) {
    state.headers.pop();
}

const USER_ROLE = {
    ADMINISTRATOR: 10,
    UPLOADER: 20,
    APPROVER: 30,
    VIEWER: 40,
    SUPER_USER: 50,
};

const form = reactive({
    email: "",
    nik_atasan: "",
    user_role: "",
    restrict: "",
    doc_div: "",
    vw_doc_div: [],
    company: [],
    plant: [],
    custodian: null,
});

const modal_form = ref(false);
const selected_user = ref(null);
const cannot_create = ref(false);

const openForm = () => {
    modal_form.value = true;
};

const closeForm = () => {
    modal_form.value = false;

    if (selected_user.value) resetForm();

    selected_user.value = null;
};

const resetForm = () => {
    form.email = "";
    form.nik_atasan = "";
    form.user_role = "";
    form.restrict = "";
    form.doc_div = "";
    form.vw_doc_div = [];
    form.company = [];
    form.plant = [];
    form.custodian = null;
};

const editUser = (item) => {
    localStorage.setItem("user_detail", JSON.stringify(item));
    initialPage.editItem(item.muser_id);
};

const showUser = (item) => {
    localStorage.setItem("user_detail", JSON.stringify(item));
    initialPage.showItem(item.muser_id);
};

const options = reactive({
    list_access: [],
    list_division: [],
    list_company: [],
    list_role: [],
    list_user: [],
    list_plant: [],
});

const selectCompanyHandler = (value) => {
    getListPlant(form.company);
};

const emailSearchHandler = async (value) => {
    try {
        if (!value) return;
        const { success, message } = await getAtasan(value);
        if (!success) throw new Error(message);
    } catch (error) {
        cannot_create.value = true;
        throw new ErrorHandler(error);
    }
};

const getDataUser = async () => {
    const data = await initialPage.index();

    options.list_access = data?.all_access || [];
    options.list_division = data?.doc_div || [];
    options.list_company = data?.list_company || [];
    options.list_role = data?.role || [];
    options.list_user = data?.user || [];

    localStorage.setItem("list_company", JSON.stringify(data?.list_company));
    localStorage.setItem("list_division", JSON.stringify(data?.doc_div));
};

const current_atasan = ref(null);
const getAtasan = async (email) => {
    try {
        if (!email) return;

        const { data, success, message } = await User.getAtasan({
            email,
        });

        form.nik_atasan = data?.atasan?.nik;
        current_atasan.value = data?.atasan?.nik ? data?.atasan : null;
        cannot_create.value = false;

        return { data, success, message };
    } catch (error) {
        throw new ErrorHandler(error);
    }
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

const prosesSubmitUser = async () => {
    try {
        let message = "";
        const payload = {
            email: form.email,
            user_role: form.user_role,
            nik_atasan: form.nik_atasan,
            restrict: form.restrict,
            doc_div: form.doc_div,
            company: form.company,
            plant: form.plant,
            custodian: form.custodian,
        };

        if (selected_user.value) {
            payload.user_id = selected_user.value?.muser_id;
            payload.vw_docdiv_id = form.vw_doc_div.join(",");

            const { message: msg } = await User.update(payload);
            message = msg;
        } else {
            payload.vw_docdiv = form.vw_doc_div.join(",");

            const { message: msg } = await User.create(payload);
            message = msg;
        }

        Modal.success(message);
        Modal.onclose = () => {
            closeForm();
            resetForm();
            getDataUser();
        };
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

onMounted(() => {
    getDataUser();
});
</script>

<style lang="scss"></style>
