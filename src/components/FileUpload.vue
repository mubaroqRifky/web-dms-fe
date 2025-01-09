<template>
    <div class="flex gap-4 items-center justify-between">
        <input type="checkbox" :name="name" @change="selectFileHandler" />
        <div
            class="rounded-md border border-solid flex gap-2 items-center px-4 py-2 text-sm flex-1"
            :class="[
                item.active == 0
                    ? 'bg-lightGray border-darkGray'
                    : 'bg-white border-primary',
            ]"
        >
            <IconPDF v-if="isExtension('PDF', item?.name)" />
            <IconFileImage v-else-if="isExtension('IMAGE', item?.name)" />
            <Icon v-else icon="flat-color-icons:file" width="35px" />
            <p class="flex-1">{{ item?.name }}</p>
            <div class="flex items-center" v-if="canActivate">
                <label class="flex gap-2 items-center mb-0">
                    <div class="switch">
                        <input
                            type="checkbox"
                            true-value="1"
                            false-value="0"
                            v-model="item.active"
                            @change="() => activatedFileHandler(item)"
                        />

                        <span class="slider round"></span>
                    </div>
                </label>
            </div>
        </div>
        <button v-if="$route.name != 'document-show' && !item.file_name">
            <Icon
                width="25px"
                icon="material-symbols:delete-outline"
                @click="$emit('delete', item)"
            />
        </button>
    </div>
</template>

<script setup>
import { defineModel } from "vue";
import IconPDF from "@/components/icons/page/IconPDF.vue";
import IconFileImage from "@/components/icons/page/IconFileImage.vue";

const props = defineProps({
    name: {
        type: String,
        default: "",
    },
    item: {
        type: Object,
        default: function () {
            return {};
        },
    },
    canActivate: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["delete", "selected", "deselect", "activate"]);

const isExtension = (type, name) => {
    if (!name) return false;

    const formatfile = {
        EXCEL: ["xls", "xlsx", "csv", "xla", "xlt"],
        DOC: ["doc", "docx"],
        PDF: ["pdf"],
        IMAGE: ["jpg", "jpeg", "png", "gif"],
    };

    let extension = name.split(".");
    extension = extension[extension.length - 1];

    const result = formatfile[type].includes(extension);
    return result;
};

const selectFileHandler = (e) => {
    const { target } = e;

    if (target.checked) emit("selected", props.item);
    else emit("deselect", props.item);
};

const activatedFileHandler = (item) => {
    if (item.active == 1) {
        emit("activate", { id: item.id, is_active: item.active });
    } else {
        emit("activate", { id: item.id, is_active: item.active });
    }
};
</script>

<style lang=""></style>
