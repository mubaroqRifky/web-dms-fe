<template>
    <div class="flex flex-col gap-3 mt-4">
        <div class="flex gap-4 items-end justify-between">
            <div class="flex gap-2 items-center">
                <BasicSelect
                    v-if="listAction.length"
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
                    :disabled="!itemsSelected?.length || !action"
                    class="text-white text-xs px-4 py-2 rounded-md flex justify-center items-center"
                    :class="
                        !itemsSelected?.length || !action
                            ? 'bg-gray'
                            : 'bg-primary'
                    "
                >
                    Submit
                </button>
            </div>
        </div>

        <vTable
            table-class-name="primary-table"
            theme-color="#f0bf2e"
            v-model:server-options="serverOptions"
            :server-items-length="meta.total"
            :headers="headers"
            :items="items"
            :rows-items="itemShows"
            :loading="loading"
            :search-field="searchField"
            :search-value="params.search"
            v-model:items-selected="itemsSelected"
            fixed-checkbox
            :checkbox-column-width="36"
            buttons-pagination
        >
            <template #item-doh_date="item">
                <p class="whitespace-nowrap">
                    {{ formatLocaleDate(item.doh_date) }}
                </p>
            </template>
            <template #item-approvel="item">
                <p v-if="item.approvel" class="flex gap-2 items-center">
                    <span class="p-1 rounded-full bg-[#32b97c] text-white">
                        <IconSuccess width="15px" height="15px" />
                    </span>
                    Download Approved
                </p>
                <p v-else class="flex gap-2 items-center">
                    <span class="p-1 rounded-full bg-[#138dff] text-white">
                        <IconDocWaiting width="15px" height="15px" />
                    </span>
                    Waiting Approval
                </p>
            </template>
            <template #item-action="item">
                <div
                    class="flex gap-2 items-center justify-end"
                    v-if="item.approvel"
                >
                    <button class="text-success" @click="confirmDownload(item)">
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
            <section v-if="action == '10'" class="w-full">
                <BasicDate
                    dir="col"
                    label="Valid Date"
                    placeholder="Valid Date"
                    no-validity
                    v-model="form_action.todate"
                />
            </section>
        </ModalForm>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from "vue";
import IconSuccess from "@/components/icons/modal/IconSuccess.vue";
import IconDocWaiting from "@/components/icons/page/IconDocWaiting.vue";
import ModalForm from "@/components/modal/ModalForm.vue";
import Document from "@/apis/Document";
import Modal from "@/controllers/state/ModalController";
import Loading from "@/controllers/state/LoadingController";
import { formatLocaleDate } from "@/helpers/utils";

const headers = ref([
    { text: "Bentuk Dokumen", value: "nm_reff" },
    { text: "No. Dokumen", value: "doh_title" },
    { text: "Nama Dokumen", value: "doh_docform" },
    { text: "Status", value: "approvel" },
    { text: "Tanggal Efektif", value: "doh_date" },
    { text: "", value: "action" },
]);

const items = ref([]);

const serverOptions = ref({
    page: 1,
    rowsPerPage: 10,
});
const loading = ref(false);
const meta = reactive({
    total: 0,
});
const params = reactive({
    page: 1,
    per_page: 10,
    search: "",
});

const action = ref(null);

const ACTION_DOCUMENT = {
    APPROVE_DOWNLOAD: "10", // action approve download
    DOWNLOAD_DOCUMENT: "20", // action download document
};

const searchField = reactive(["name", "kategori"]);
const itemShows = reactive([5, 10, 50, 100]);
const itemsSelected = ref([]);
const listAction = ref([]);

const modal_form = ref(false);
const form_action = reactive({
    todate: "",
});

const getDataDownload = async () => {
    try {
        loading.value = true;
        const { data } = await Document.getAllDownload(params);

        if (data?.action?.length) {
            listAction.value = data.action;
        }

        items.value = data.paging.data;
        meta.total = data.paging.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loading.value = false;
    }
};

watch(
    () => params.search,
    (newValue) => {
        if (newValue == "") {
            getDataDownload();
        }
    }
);

watch(
    () => serverOptions.value.rowsPerPage,
    (newValue) => {
        serverOptions.value.page = 1;
        params.per_page = newValue;
    },
    { deep: true }
);
watch(
    () => serverOptions.value.page,
    (newValue) => {
        params.page = newValue;
        getDataDownload();
    },
    { deep: true }
);

const confirmDownload = (item) => {
    Modal.confirm(`Apakah anda yakin ingin download data ini?`);
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

const closeModalForm = () => {
    modal_form.value = false;
    form_action.todate = "";
};

const submitHandler = () => {
    switch (action.value) {
        case ACTION_DOCUMENT.APPROVE_DOWNLOAD:
            modal_form.value = true;
            break;
        case ACTION_DOCUMENT.DOWNLOAD_DOCUMENT:
            Modal.confirm(`Yakin ingin download dokumen?`);
            Modal.onconfirm = processDownloadDocument;
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
        case ACTION_DOCUMENT.APPROVE_DOWNLOAD:
            data.title = "Permintaan Unduh Dokumen?";
            break;
        default:
            break;
    }

    return data;
});

const confirmSubmitHandler = () => {
    switch (action.value) {
        case ACTION_DOCUMENT.APPROVE_DOWNLOAD:
            Modal.confirm(`Apakah anda yakin ingin proses data?`);
            Modal.onconfirm = processApproveDownload;
            break;
        default:
            break;
    }
};

const processApproveDownload = async () => {
    try {
        Loading.start();
        const payload = {
            todate: form_action.todate,
            id: itemsSelected.value.map((v) => v.id),
        };

        const { message } = await Document.approveDownload(payload);
        Modal.success(message);
        Modal.onclose = () => {
            getDataDownload();
            itemsSelected.value = [];
        };
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        closeModalForm();
        Loading.stop();
    }
};

const processDownloadDocument = async () => {
    try {
        Loading.start();

        const item_details = [];
        itemsSelected.value.forEach((item) => {
            if (item.approvel) {
                item.details.forEach((val) => {
                    item_details.push(val);
                });
            }
        });

        if (item_details.length) {
            await downloadFile(item_details);

            Modal.success("Berhasil unduh dokumen");
            Modal.onclose = () => {
                getDataDownload();
                itemsSelected.value = [];
            };
        } else {
            Modal.warning({
                content: "Unprocessable Content",
                subcontent: "Dokumen reviewed tidak bisa didownload",
            });
        }
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        closeModalForm();
        Loading.stop();
    }
};

onMounted(() => {
    getDataDownload();
});
</script>

<style lang="scss"></style>
