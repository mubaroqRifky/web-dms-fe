<template>
    <div class="flex flex-col gap-3 mt-4">
        <TableControl
            add-text="Add Category"
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
                    <button class="text-green-dark" @click="editCategory(item)">
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button class="text-success" @click="showCategory(item)">
                        <IconShow width="20px" height="20px" />
                    </button>
                </div>
            </template>
        </vTable>

        <ModalForm
            content="Form Category"
            v-if="modal_form"
            :disabled="cannot_create || isShowing"
            @close="closeForm"
            @proses="prosesSubmitUser"
        >
            <section class="flex flex-col">
                <section
                    class="overflow-auto scroll-hidden max-h-[65vh] flex flex-col gap-4"
                >
                    <BasicSelect
                        dir="col"
                        label="Divisi"
                        placeholder="Divisi"
                        :options="options.list_division"
                        :reduce="(v) => v.value"
                        v-model="form.doc_div"
                        :disabled="cannot_create || isShowing"
                        required
                        no-validity
                    />
                    <BasicInput
                        dir="col"
                        label="Masukan Nama Kategori"
                        placeholder="Masukan Nama Kategori"
                        v-model="form.kategori_name"
                        :disabled="cannot_create || isShowing"
                        required
                        no-validity
                    />
                    <BasicInput
                        dir="col"
                        label="Lama Kategori Tersimpan"
                        placeholder="Lama Kategori Tersimpan"
                        v-model="form.lama_kategori_tersimpan"
                        :disabled="cannot_create || isShowing"
                        required
                        no-validity
                    />
                    <BasicInput
                        dir="col"
                        label="Lama Kategori Diarsipkan"
                        placeholder="Lama Kategori Diarsipkan"
                        v-model="form.lama_kategori_diarsipkan"
                        :disabled="cannot_create || isShowing"
                        required
                        no-validity
                    />
                </section>
            </section>
        </ModalForm>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import PageCategoryController from "@/controllers/page/PageCategoryController";
import Modal from "@/controllers/state/ModalController";
import ModalForm from "@/components/modal/ModalForm.vue";
import Category from "@/apis/Category";

const initialPage = new PageCategoryController();
const state = reactive(initialPage.buildTable());
state.searchField = ["kategori_name"];

const form = reactive({
    doc_div: "",
    kategori_name: "",
    lama_kategori_tersimpan: "",
    lama_kategori_diarsipkan: "",
});

const modal_form = ref(false);
const selected_category = ref(null);
const cannot_create = ref(false);

const openForm = () => {
    modal_form.value = true;
};

const closeForm = () => {
    modal_form.value = false;

    if (selected_category.value) resetForm();

    selected_category.value = null;
};

const resetForm = () => {
    form.doc_div = "";
    form.kategori_name = "";
    form.lama_kategori_tersimpan = "";
    form.lama_kategori_diarsipkan = "";

    isShowing.value = false;
};

const editCategory = (item) => {
    console.log(item);

    openForm();

    selected_category.value = item;

    form.doc_div = item.cat_parent;
    form.kategori_name = item.kategori_name;
    form.lama_kategori_tersimpan = item.lama_kategori_disimpan;
    form.lama_kategori_diarsipkan = item.lama_kategori_diarsipkan;
};

const isShowing = ref(false);
const showCategory = (item) => {
    isShowing.value = true;
    editCategory(item);
};

const options = reactive({
    list_division: [],
});

const getDataCategory = async () => {
    const data = await initialPage.index();

    options.list_division = data?.doc_div || [];
};

const prosesSubmitUser = async () => {
    try {
        let message = "";
        const payload = {
            doc_div: form.doc_div,
            kategori_name: form.kategori_name,
            lama_kategori_tersimpan: form.lama_kategori_tersimpan,
            lama_kategori_diarsipkan: form.lama_kategori_diarsipkan,
        };

        if (selected_category.value) {
            payload.kategori_id = selected_category.value?.kategori_id;

            const { message: msg } = await Category.update(payload);
            message = msg;
        } else {
            const { message: msg } = await Category.create(payload);
            message = msg;
        }

        Modal.success(message);
        Modal.onclose = () => {
            closeForm();
            resetForm();
            getDataCategory();
        };
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

onMounted(() => {
    getDataCategory();
});
</script>

<style lang="scss"></style>
