<template>
    <section class="md:col-span-2 grid md:flex gap-4 mt-4 mb-4">
        <span class="font-medium text-xs w-32 mt-1">
            Dokumen
            <i class="text-danger">*</i>
        </span>

        <div class="grid gap-6 content-start">
            <div class="flex gap-4 md:gap-16 min-w-96">
                <div class="flex items-center gap-2">
                    <div
                        class="w-14 h-14 bg-primary rounded-full flex items-center justify-center"
                    >
                        <IconPDF />
                    </div>
                    <article class="flex-1">
                        <span class="text-sm font-medium whitespace-nowrap">
                            PDF Format
                        </span>
                        <p class="text-xs text-darkGray">Max File 10Mb</p>
                    </article>
                </div>
                <div class="flex items-center gap-2" v-if="false">
                    <div
                        class="w-14 h-14 bg-primary rounded-full flex items-center justify-center"
                    >
                        <IconImage />
                    </div>
                    <article class="flex-1">
                        <span class="text-sm font-medium whitespace-nowrap">
                            Image
                        </span>
                        <p class="text-xs text-darkGray">
                            Max File 10Mb (JPEG, PNG)
                        </p>
                    </article>
                </div>
            </div>
            <label
                v-if="$route.name != 'document-show' && canEdit"
                class="upload-file-container"
                @dragenter.prevent="dragEnter"
                @dragover.prevent="dragEnter"
                @dragleave.prevent="dragLeave"
                @drop.prevent="dragOnDrop"
            >
                <input
                    ref="inputFile"
                    type="file"
                    multiple
                    hidden
                    :disabled="$route.name == 'document-show'"
                    @change="uploadFileHandler"
                    accept="application/pdf"
                />
                <div class="grid content-start justify-items-center">
                    <IconUpload />
                    <p class="text-darkGray text-xs mt-2">
                        Max File 10Mb (JPEG, PNG)
                    </p>
                    <p class="text-sm">Drag & Drop to Upload</p>
                </div>
            </label>

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
                                previewFile[show_preview]?.type ==
                                'application/pdf'
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

            <section v-show="files.length" class="grid content-start gap-4">
                <div class="flex justify-between items-center">
                    <label class="flex gap-4 items-center">
                        <input type="checkbox" @change="selectAllHandler" />
                        <span class="text-xs font-medium">Pilih Semua</span>
                    </label>

                    <button
                        class="btn btn-sm btn-primary"
                        :disabled="!item_selected.length"
                        @click.prevent="viewDocumentHandler"
                    >
                        Lihat Dokumen
                    </button>
                </div>

                <section class="grid gap-4 content-start">
                    <FileUpload
                        name="file_upload[]"
                        v-for="item in files"
                        :item="item"
                        :can-activate="canActivate"
                        @activate="activatedFileHandler"
                        @delete="removeFileHandler"
                        @selected="selectedItemHandler"
                        @deselect="deselectedItemHandler"
                    />
                </section>

                <button
                    v-if="$route.name != 'document-show' && canEdit"
                    class="text-xs flex gap-1 items-center"
                    @click="$refs.inputFile.click()"
                >
                    <Icon icon="heroicons:paper-clip" />
                    Upload file lain
                </button>
            </section>

            <section v-if="!files.length && $route.name == 'document-show'">
                <p class="text-darkGray text-xs">Tidak ada file upload</p>
            </section>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import IconPDF from "@/components/icons/page/IconPDF.vue";
import IconImage from "@/components/icons/page/IconImage.vue";
import IconUpload from "@/components/icons/page/IconUpload.vue";
import FileUpload from "@/components/FileUpload.vue";
import Document from "@/apis/Document";
import ModalFile from "@/components/modal/ModalFile.vue";
import BounceLoaderVue from "vue-spinner/src/BounceLoader.vue";

const props = defineProps({
    files: {
        type: Array,
        default: function () {
            return [];
        },
    },
    defaultName: {
        default: "",
    },
    revisionName: {
        default: "",
    },
    canEdit: {
        type: Boolean,
        default: true,
    },
    canActivate: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["delete"]);

const uploadFileHandler = (e) => {
    const { target } = e;

    for (let i = 0; i < target.files.length; i++) {
        const fileExist = props.files.find((val) => {
            return val.name == target.files[i].name;
        });

        if (!fileExist) {
            const newFile = renameFile(target.files[i], props.revisionName, i);
            props.files.push(newFile);
        }
    }

    target.value = "";
};

const removeFileHandler = (item) => {
    deselectedItemHandler(item);
    emit("delete", item);
};

const renameFile = (originalFile, revision, i) => {
    const index = originalFile.name.lastIndexOf(".");
    const extension = originalFile.name.slice(index);
    let name = originalFile.name.slice(0, index);
    let multipleFile = "";

    if (props.defaultName) {
        name = `${props.defaultName}`;
        multipleFile = i ? ` ${i}` : "";
    }

    const suffix = revision ? ` (Rev_${revision})` : "";
    return new File([originalFile], name + suffix + multipleFile + extension, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
};

const item_selected = ref([]);

const selectAllHandler = (e) => {
    const { target } = e;
    const inputAll = document.querySelectorAll(
        'input[type="checkbox"][name="file_upload[]"]'
    );

    inputAll.forEach((input) => {
        input.checked != target.checked && input.click();
    });
};

const selectedItemHandler = (item) => {
    const itemName = item.name || item.file_name;
    const result = item_selected.value.find((v) => {
        const name = v.name || v.file_name;
        return name == itemName;
    });

    if (!result) item_selected.value.push(item);
};

const deselectedItemHandler = (item) => {
    const itemName = item.name || item.file_name;
    item_selected.value = item_selected.value.filter((v) => {
        const name = v.name || v.file_name;
        return name != itemName;
    });
};

const loading = ref(false);
const show_preview = ref(false);
const previewFile = reactive({});
const viewDocumentHandler = async () => {
    try {
        const [file] = item_selected.value;
        if (!file) return;

        if (file.id) {
            await fetchFile(file);
        } else {
            await fetchFileLocal(file);
        }
    } catch (error) {
        closePreviewHandler();
        throw new ErrorHandler(error);
    }
};

const previewFileHandler = async (item) => {
    try {
        if (item.id) {
            await fetchFile(item);
        } else {
            await fetchFileLocal(item);
        }
    } catch (error) {
        closePreviewHandler();
        throw new ErrorHandler(error);
    }
};

const fetchFile = async (item) => {
    if (!item.id) return;

    if (previewFile[item.file_name]) {
        show_preview.value = item.file_name;
        return;
    }

    show_preview.value = item.file_name;
    loading.value = true;

    let type_action = "application/pdf";
    if (String(item.file_type).toLocaleLowerCase() != "pdf") {
        type_action = "image/png";
    }

    const data = await Document.viewFile({
        dokumen_id: item.id,
    });

    const newFile = new File([data], item.file_name, {
        type: type_action,
    });

    readFileBLob(newFile);
};

const fetchFileLocal = async (file) => {
    if (previewFile[file.name]) {
        show_preview.value = file.name;
        return;
    }

    show_preview.value = file.name;
    loading.value = true;

    readFileBLob(file);
};

const closePreviewHandler = () => {
    show_preview.value = null;
};

const readFileBLob = (file) => {
    const type = file.type;
    const name = file.name;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (evt) => {
        previewFile[name] = {
            type,
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

const dragEnter = (evt) => {
    const elContainer = document.querySelector(".upload-file-container");
    elContainer.style.background = "#fff1f1";
};
const dragLeave = (evt) => {
    const elContainer = document.querySelector(".upload-file-container");
    elContainer.style.background = "";
};
const dragOnDrop = (evt) => {
    const input = document.querySelector(
        '.upload-file-container > input[type="file"]'
    );
    input.files = evt.dataTransfer.files;
    uploadFileHandler({ target: input });
    dragLeave();
};

const activatedFileHandler = (value) => {
    emit("activate", value);
};
</script>

<style lang="scss">
.upload-file-container {
    @apply bg-white hover:bg-[#fff1f1] transition-all h-40 border border-dashed border-primaryOutline rounded-lg flex justify-center items-center;
}
</style>
