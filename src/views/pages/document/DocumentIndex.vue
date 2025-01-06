<template>
    <div class="flex flex-col gap-3 mt-4">
        <div class="flex justify-end">
            <FilterDocument
                :list-filter="list_filter"
                :filter-params="filter_params"
                @filter="filterHandler"
            />
        </div>

        <div class="flex gap-4 items-end justify-between">
            <div class="flex gap-2 items-center">
                <BasicSelect
                    v-if="listAction.length"
                    class="w-full"
                    placeholder="Pilih Aksi"
                    mode="client"
                    no-validity
                    option-label="nm_reff"
                    option-key="kd_reff"
                    :reduce="(v) => v.kd_reff"
                    :options="listAction"
                    :disabled="!itemsSelected?.length"
                    v-model="action"
                />

                <button
                    v-if="listAction.length"
                    @click="submitHandler"
                    :disabled="!itemsSelected?.length"
                    class="text-white text-xs px-4 py-2 rounded-md flex justify-center items-center"
                    :class="!itemsSelected?.length ? 'bg-gray' : 'bg-primary'"
                >
                    Submit
                </button>
            </div>

            <div class="flex gap-4 items-center">
                <TableControl
                    :can-add="false"
                    add-text="Add Document"
                    :search-field="state.searchField"
                    v-model="state.searchValue"
                    @search-enter="initialPage.search(state.searchValue)"
                    @add="$router.push({ name: 'upload-document' })"
                />
            </div>
        </div>

        <vTable
            table-class-name="primary-table"
            theme-color="#f0bf2e"
            v-model:server-options="state.serverOptions"
            :server-items-length="state.total"
            :headers="state.headers"
            :items="state.items"
            :rows-items="state.itemShows"
            :loading="state.loading"
            :search-field="state.searchField"
            :search-value="state.searchValue"
            v-model:items-selected="itemsSelected"
            fixed-checkbox
            :checkbox-column-width="36"
            buttons-pagination
            @click-row="goToDetailHandler"
        >
            <template #item-doh_date="item">
                <p class="whitespace-nowrap">
                    {{ formatLocaleDate(item.doh_date) }}
                </p>
            </template>
            <template #item-revisi="item">
                <p class="whitespace-nowrap">
                    {{ item.revisi || "-" }}
                </p>
            </template>
            <template #item-action="item">
                <div class="flex gap-2 items-center justify-end">
                    <button
                        v-if="isCanEdit(item)"
                        class="text-green-dark"
                        @click.stop="initialPage.editItem(item.doh_id)"
                    >
                        <IconEdit width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanViewFile(item)"
                        class="text-success"
                        @click.stop="viewDocumentHandler(item)"
                    >
                        <IconShow width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanDelete(item)"
                        class="text-danger"
                        @click.stop="initialPage.confirmDelete(item)"
                    >
                        <IconDelete width="20px" height="20px" />
                    </button>
                    <button
                        v-if="isCanDirectDownload(item)"
                        class="text-blue-light"
                        @click.stop="confirmDownload(item)"
                    >
                        <IconDownload width="20px" height="20px" />
                    </button>
                </div>
            </template>
        </vTable>

        <ModalForm
            v-if="modal_form"
            :content="getActionState?.title"
            @close="modal_form = false"
            @proses="confirmSubmitHandler"
        >
            <section v-if="action == '01'" class="w-full">
                <BasicDate
                    dir="col"
                    label="Valid Date"
                    placeholder="Valid Date"
                    no-validity
                    v-model="form_action.todate"
                />
            </section>
            <section v-if="action == '03'" class="w-full">
                <BasicSelect
                    dir="col"
                    label="Pilih Plant"
                    placeholder="Pilih Plant"
                    mode="client"
                    no-validity
                    :options="list_gudang"
                    v-model="form_action.doh_area"
                />
            </section>
        </ModalForm>

        <ModalFile
            v-if="show_preview"
            :tabs="item_selected"
            :current="show_preview"
            @close="closePreviewHandler"
            @preview="previewFileHandler"
        >
            <div class="flex flex-col w-[80vw] h-full">
                <div
                    v-if="loading"
                    class="flex flex-col gap-2 justify-center items-center h-full"
                >
                    <BounceLoaderVue
                        :color="'#d2a92a'"
                        :size="'100px'"
                    ></BounceLoaderVue>
                    <p class="text-primary text-sm">Loading...</p>
                </div>
                <template v-else>
                    <embed
                        v-if="
                            previewFile[show_preview]?.type == 'application/pdf'
                        "
                        class="flex-1"
                        :src="
                            previewFile[show_preview].url +
                            '#toolbar=0&navpanes=0&scrollbar=0'
                        "
                        width="100%"
                        height="100%"
                    />

                    <div v-else class="w-full h-[85vh]">
                        <img
                            :src="previewFile[show_preview].url"
                            class="w-full h-full object-contain"
                        />
                    </div>
                </template>
            </div>
        </ModalFile>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import Document from "@/apis/Document";
import FilterDocument from "@/components/FilterDocument.vue";
import ModalForm from "@/components/modal/ModalForm.vue";
import PageDocumentController from "@/controllers/page/PageDocumentController";
import User from "@/controllers/auth/UserController";
import Modal from "@/controllers/state/ModalController";
import Loading from "@/controllers/state/LoadingController";
import { formatLocaleDate } from "@/helpers/utils";
import ModalFile from "@/components/modal/ModalFile.vue";
import BounceLoaderVue from "vue-spinner/src/BounceLoader.vue";

const route = useRoute();
const router = useRouter();
const { form } = route.query;

const { appContext } = getCurrentInstance();
const { config } = appContext;
const { globalProperties } = config;
const { can, role } = globalProperties;

const user = User.get();

const initialPage = new PageDocumentController();
const state = reactive(initialPage.buildTable());

const action = ref(null);

state.searchField = ["name", "kategori"];
const itemsSelected = ref([]);
const listAction = ref([]);
const list_filter = ref([]);
const list_gudang = ref([]);

const modal_form = ref(false);
const form_action = reactive({
    doh_area: "",
    todate: "",
});

const STATUS_DOCUMENT = {
    DRAFT: "00",
    REVIEW: "10",
    APPROVE: "20",
};

const ACTION_DOCUMENT = {
    REQUEST_DOWNLOAD: "01", // action request download
    DELETE_DOCUMENT: "02", // action delete
    PINDAH_GUDANG: "03", // action pindah gudang
};

const isReview = (item) => {
    const { REVIEW } = STATUS_DOCUMENT;

    if ([REVIEW].includes(item.doh_stat)) return true;
    return false;
};

const isOwner = (item) => {
    if (item.usr_id == user.id) return true;
    return false;
};

const isCanEdit = (item) => {
    return can("DOCUMENT_REVISI");
};

const isCanViewFile = (item) => {
    return can("DOCUMENT_READ");
};

const isCanDelete = (item) => {
    return can("DOCUMENT_DELETE");
};

const isCanRequestDownload = (item) => {
    return role("REQUEST_DOWNLOAD");
};

const isCanDirectDownload = (item) => {
    return role("MR_MRP");
};

const goToDetailHandler = (item) => {
    router.push({ name: "document-show", params: { id: item.doh_id } });
};

const getListFilterDokumen = async () => {
    try {
        const { data } = await Document.getListFilterDokumen();

        list_filter.value = data || {};
        list_gudang.value = data?.list_gudang || [];

        if (data?.action?.length) {
            listAction.value = data.action;
        } else {
            listAction.value = [];
        }

        if (isCanDelete()) {
            listAction.value.push({
                kd_reff: "02",
                nm_reff: "Delete Dokumen",
            });
        }

        if (isCanRequestDownload()) {
            listAction.value.push({
                kd_reff: "01",
                nm_reff: "Request Download",
            });
        }
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const filter_params = ref({});
const filterHandler = (params) => {
    initialPage.filter(params);
    filter_params.value = params;
};

if (form) filterHandler({ kategori: [form] });

const closeModalForm = () => {
    modal_form.value = false;
    form_action.doh_area = "";
    form_action.todate = "";
};

const submitHandler = () => {
    switch (action.value) {
        case ACTION_DOCUMENT.REQUEST_DOWNLOAD:
            modal_form.value = true;
            break;
        case ACTION_DOCUMENT.DELETE_DOCUMENT:
            confirmDeleteMultiple();
            break;
        case ACTION_DOCUMENT.PINDAH_GUDANG:
            modal_form.value = true;
            break;
        default:
            break;
    }
};

const getActionState = computed(() => {
    const data = {
        title: "",
    };

    switch (action.value) {
        case ACTION_DOCUMENT.REQUEST_DOWNLOAD:
            data.title = "Permintaan Unduh Dokumen?";
            break;
        case ACTION_DOCUMENT.PINDAH_GUDANG:
            data.title = "Pindah Dokumen?";
            break;
        default:
            break;
    }

    return data;
});

const confirmDeleteMultiple = () => {
    Modal.confirm(`Apakah anda yakin ingin menghapus data?`);
    Modal.onconfirm = processDelete;
};

const processDelete = async () => {
    try {
        Loading.start();
        const params = {
            doh_id: itemsSelected.value.map((v) => v.doh_id),
        };

        const { message } = await Document.deleteMultiple(params);
        Modal.success(message);
        Modal.onclose = () => {
            initialPage.index();
            itemsSelected.value = [];
        };
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        Loading.stop();
    }
};

const confirmSubmitHandler = () => {
    Modal.confirm(`Apakah anda yakin ingin proses data?`);

    if (action.value == ACTION_DOCUMENT.REQUEST_DOWNLOAD) {
        Modal.onconfirm = processRequestDownload;
    }

    if (action.value == ACTION_DOCUMENT.PINDAH_GUDANG) {
        Modal.onconfirm = processPindahGudang;
    }
};

const processPindahGudang = async () => {
    try {
        Loading.start();
        const payload = {
            doh_area: form_action.doh_area,
            doh_id: itemsSelected.value.map((v) => v.doh_id),
        };

        const { message } = await Document.pindahGudang(payload);
        Modal.success(message);
        Modal.onclose = () => {
            initialPage.index();
            itemsSelected.value = [];
        };
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        closeModalForm();
        Loading.stop();
    }
};

const processRequestDownload = async () => {
    try {
        Loading.start();
        const params = {
            todate: form_action.todate,
            doh_id: itemsSelected.value.map((v) => v.doh_id),
        };

        const { message } = await Document.requestDownload(params);
        Modal.success(message);
        Modal.onclose = () => {
            initialPage.index();
            itemsSelected.value = [];
        };
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        closeModalForm();
        Loading.stop();
    }
};

const loading = ref(false);
const show_preview = ref(false);
const previewFile = reactive({});
const item_selected = ref([]);
const viewDocumentHandler = async (item) => {
    try {
        item_selected.value = item.details || [];

        const [file] = item_selected.value;
        if (!file) return;

        await fetchFile(file);
    } catch (error) {
        closePreviewHandler();
        throw new ErrorHandler(error);
    }
};

const previewFileHandler = async (item) => {
    try {
        await fetchFile(item);
    } catch (error) {
        closePreviewHandler();
        throw new ErrorHandler(error);
    }
};

const fetchFile = async (item) => {
    const { doi_seqno } = item;
    if (!doi_seqno) return;

    if (previewFile[doi_seqno]) {
        show_preview.value = doi_seqno;
        return;
    }

    show_preview.value = doi_seqno;
    loading.value = true;

    const data = await Document.viewFile({
        dokumen_id: doi_seqno,
    });

    const newFile = new File([data], item.doi_name, {
        type: item.mimetype,
    });

    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onload = (evt) => {
        previewFile[doi_seqno] = {
            type: item.mimetype,
            url: evt.target.result,
            file: evt.target.result,
        };

        loading.value = false;
    };
    reader.onerror = function (error) {
        loading.value = false;
        throw new Error(error?.message);
    };
};

const closePreviewHandler = () => {
    show_preview.value = null;
};

const confirmDownload = (item) => {
    Modal.confirm(`Apakah anda yakin ingin download dokumen ini?`);
    Modal.onconfirm = () => downloadFile(item.details);
};

const downloadFile = async (items = []) => {
    try {
        if (!items || !Array.isArray(items)) return;

        Loading.start();

        const promises = [];

        items.forEach((dok) => {
            const dataBody = new URLSearchParams();
            dataBody.append("dokumen_id[]", dok.doi_seqno);
            dataBody.append("type_action", "download");
            promises.push(Document.download(dataBody));
        });

        const responses = await Promise.all(promises);

        responses.forEach((data, i) => {
            const file = new File([data], items[i]?.doi_name, {
                type: items[i]?.mimetype,
            });

            let fileURL = URL.createObjectURL(file);
            getFileToDownload(fileURL, file.name);
            URL.revokeObjectURL(fileURL);
        });

        Modal.success("Berhasil download file");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        Loading.stop();
    }
};

const getFileToDownload = (url, file_name) => {
    let link = document.createElement("a");
    link.download = file_name;
    link.href = url;
    link.click();
    link.remove();
};

onMounted(() => {
    getListFilterDokumen();
    if (!form) initialPage.index();
});
</script>

<style lang="scss"></style>
