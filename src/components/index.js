import Vue3EasyDataTable from "vue3-easy-data-table";
import vSelect from "vue-select";
import { Icon } from "@iconify/vue";

import ModalMain from "@/components/modal/ModalMain.vue";
import TableControl from "@/components/table/TableControl.vue";
import BasicInput from "@/components/input/BasicInput.vue";
import InputText from "@/components/input/InputText.vue";
import BasicDate from "@/components/input/BasicDate.vue";
import BasicSelect from "@/components/input/BasicSelect.vue";
import InputSelect from "@/components/input/InputSelect.vue";
import BasicCheckbox from "@/components/input/BasicCheckbox.vue";
import CustomSelectSearch from "@/components/input/CustomSelectSearch.vue";

import IconEdit from "@/components/icons/action/IconEdit.vue";
import IconShow from "@/components/icons/action/IconShow.vue";
import IconDelete from "@/components/icons/action/IconDelete.vue";
import IconDownload from "@/components/icons/action/IconDownload.vue";

const components = {
    vTable: Vue3EasyDataTable,
    "v-select": vSelect,

    ModalMain,
    TableControl,
    BasicInput,
    InputText,
    BasicDate,
    BasicSelect,
    InputSelect,
    BasicCheckbox,
    CustomSelectSearch,

    Icon,
    IconEdit,
    IconShow,
    IconDelete,
    IconDownload,
};

export default components;
