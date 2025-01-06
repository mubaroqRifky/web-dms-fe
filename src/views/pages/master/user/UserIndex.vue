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
            <template #item-action="item">
                <div class="flex gap-2 items-center justify-center">
                    <button class="text-green-dark" @click="editUser(item)">
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button class="text-success" @click="showUser(item)">
                        <IconShow width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanEdit"
                        class="text-green-dark"
                        @click="initialPage.editItem(item.muser_id)"
                    >
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanView"
                        class="text-success"
                        @click="initialPage.showItem(item.muser_id)"
                    >
                        <IconShow width="20px" height="20px" />
                    </button>
                </div>
            </template>
        </vTable>

        <ModalForm
            content="Invite People"
            v-if="modal_form"
            :disabled="cannot_create || isShowing"
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
                        :disabled="!!selected_user || isShowing"
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
                            :disabled="cannot_create || isShowing"
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
                            :disabled="cannot_create || isShowing"
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
                            :disabled="cannot_create || isShowing"
                            no-validity
                        />
                        <BasicSelect
                            dir="col"
                            label="View Divisi Lain"
                            placeholder="View Divisi Lain"
                            :options="options.list_division"
                            :reduce="(v) => v.value"
                            v-model="form.vw_doc_div"
                            :disabled="cannot_create || isShowing"
                            multiple
                            no-validity
                        />
                    </div>

                    <div
                        v-if="false"
                        class="flex flex-col gap-2 p-2 rounded-md border border-solid border-primary"
                    >
                        <label class="flex gap-4 items-center mb-0">
                            <span class="text-[.7rem] font-medium">
                                Request Download
                            </span>
                            <div class="switch">
                                <input
                                    type="checkbox"
                                    :true-value="1"
                                    :false-value="0"
                                    v-model="form.custodian"
                                    :disabled="cannot_create || isShowing"
                                />

                                <span class="slider round"></span>
                            </div>
                        </label>

                        <p class="text-[.7rem] leading-4">
                            User dapat melakukan request download dokumen pada
                            menu daftar dokumen.
                        </p>
                    </div>

                    <section v-if="false" class="flex flex-col gap-2 mt-2">
                        <p class="text-[.7rem] font-medium">Pilih Role</p>

                        <div
                            class="flex flex-col rounded-md border border-solid border-primary divide-y divide-solid divide-primary"
                        >
                            <template
                                v-for="(item, index) of options.list_role"
                            >
                                <div
                                    v-if="item.value != 30"
                                    class="flex flex-col gap-1 px-2 py-4"
                                >
                                    <span
                                        class="text-[.7rem] font-medium flex justify-between items-center"
                                    >
                                        {{ item.text }}

                                        <input
                                            type="radio"
                                            name="select_role"
                                            :value="item.value"
                                            :checked="
                                                item.value == form.user_role
                                            "
                                            v-model="form.user_role"
                                            :disabled="
                                                cannot_create || isShowing
                                            "
                                        />
                                    </span>

                                    <p
                                        v-if="
                                            item.value ==
                                            USER_ROLE.ADMINISTRATOR
                                        "
                                        class="text-[.7rem] leading-4"
                                    >
                                        User dapat melakukan semua akses yaitu
                                        Add, Edit, Deactivate User, Assign Role,
                                        menentukan approver, upload dokumen dan
                                        melihat dokumen.
                                    </p>
                                    <p
                                        v-else-if="
                                            item.value == USER_ROLE.UPLOADER
                                        "
                                        class="text-[.7rem] leading-4"
                                    >
                                        User dapat melakukan upload document dan
                                        lihat dokumen.
                                    </p>
                                    <p
                                        v-else-if="
                                            item.value == USER_ROLE.VIEWER
                                        "
                                        class="text-[.7rem] leading-4"
                                    >
                                        User hanya dapat melihat dokumen.
                                    </p>
                                    <p
                                        v-else-if="
                                            item.value == USER_ROLE.SUPER_USER
                                        "
                                        class="text-[.7rem] leading-4"
                                    >
                                        User dapat menghapus dokumen.
                                    </p>

                                    <label
                                        class="mt-2 flex flex-col gap-1"
                                        v-if="
                                            item.value == USER_ROLE.UPLOADER &&
                                            current_atasan
                                        "
                                    >
                                        <span
                                            class="text-[.7rem] font-medium flex justify-between items-center"
                                        >
                                            Nama Approver
                                        </span>
                                        <div class="flex justify-between gap-3">
                                            <p class="text-[.7rem] leading-4">
                                                {{
                                                    current_atasan.name +
                                                    " | " +
                                                    current_atasan.email
                                                }}
                                            </p>
                                        </div>
                                    </label>

                                    <label
                                        class="mt-2 flex flex-col gap-1"
                                        v-if="item.value == USER_ROLE.VIEWER"
                                    >
                                        <span
                                            class="text-[.7rem] font-medium flex justify-between items-center"
                                        >
                                            Restrict Document
                                        </span>
                                        <div class="flex justify-between">
                                            <p class="text-[.7rem] leading-4">
                                                User dapat membuka dokumen
                                                terbatas
                                            </p>
                                            <input
                                                type="checkbox"
                                                name="restrict"
                                                v-model="form.restrict"
                                                :disabled="
                                                    cannot_create || isShowing
                                                "
                                            />
                                        </div>
                                    </label>
                                </div>
                            </template>
                        </div>
                    </section>
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

    isShowing.value = false;
};

const editUser = (item) => {
    openForm();

    selected_user.value = item;

    form.email = item.user_email;
    form.user_role = item.role_id;
    form.restrict = item.restrict;
    form.doc_div = item.docdiv_id;
    form.company = item.company;
    form.plant = item.plant;
    form.custodian = item.muser_custodian;

    form.vw_doc_div = item.vw_docdiv_id
        ? item.vw_docdiv_id.split(",").map((v) => Number(v))
        : [];

    getAtasan(form.email);
    getListPlant(form.company);
};

const isShowing = ref(false);
const showUser = (item) => {
    isShowing.value = true;
    editUser(item);
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
