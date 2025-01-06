<template>
    <div>
        <ModalFilter
            :has-filtered="isFilter"
            @apply="applyFilterHanlder"
            @reset="resetFilterHandler"
        >
            <template #header-right>
                <div class="flex gap-4 items-center">
                    <label class="flex gap-4 items-center mb-0">
                        <span
                            class="text-[.7rem] whitespace-nowrap font-medium"
                        >
                            Created by me
                        </span>
                        <div class="switch">
                            <input
                                type="checkbox"
                                :true-value="true"
                                :false-value="''"
                                v-model="filter_params.createbyme"
                            />

                            <span class="slider round"></span>
                        </div>
                    </label>
                    <BasicDate
                        placeholder="Tanggal"
                        range
                        no-validity
                        v-model="filter_params.tanggal"
                    />
                </div>
            </template>

            <div
                class="flex flex-col md:grid grid-cols-2 items-start content-start gap-8 px-8 py-6"
            >
                <section class="flex flex-col gap-4 w-full">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-sm font-medium">Status Dokumen</h3>
                        <div
                            class="text-xs flex flex-col gap-1 scrollbar-secondary max-h-28 overflow-auto"
                        >
                            <template v-if="options?.list_status?.length">
                                <label
                                    class="flex gap-2 items-center"
                                    v-for="(item, index) in options.list_status"
                                    :key="index"
                                >
                                    <input
                                        type="radio"
                                        name="status_dokumen"
                                        :value="item.value"
                                        v-model="filter_params.status"
                                    />
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </label>
                            </template>
                            <p v-else style="color: lightgray">
                                Tidak ada data.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-sm font-medium">Company</h3>
                        <div
                            class="text-xs flex flex-col gap-1 scrollbar-secondary max-h-28 overflow-auto"
                        >
                            <template v-if="options?.list_company?.length">
                                <label
                                    class="flex gap-2 items-center"
                                    v-for="(
                                        item, index
                                    ) in options.list_company"
                                    :key="index"
                                >
                                    <input
                                        type="checkbox"
                                        :value="item.value"
                                        v-model="filter_params.companies"
                                        @change="companyChangeHandler"
                                    />
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </label>
                            </template>
                            <p v-else style="color: lightgray">
                                Tidak ada data.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-sm font-medium">Plant</h3>
                        <div
                            class="text-xs flex flex-col gap-1 scrollbar-secondary max-h-28 overflow-auto"
                        >
                            <template v-if="options?.list_plant?.length">
                                <label
                                    class="flex gap-2 items-center"
                                    v-for="(item, index) in options.list_plant"
                                    :key="index"
                                >
                                    <input
                                        type="checkbox"
                                        :value="item.value"
                                        v-model="filter_params.plants"
                                    />
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </label>
                            </template>
                            <p v-else style="color: lightgray">
                                Tidak ada data.
                            </p>
                        </div>
                    </div>
                </section>

                <section class="flex flex-col gap-4 w-full">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-sm font-medium">Divisi</h3>
                        <div
                            class="text-xs flex flex-col gap-1 scrollbar-secondary max-h-28 overflow-auto"
                        >
                            <template v-if="options?.list_division?.length">
                                <label
                                    class="flex gap-2 items-center"
                                    v-for="(
                                        item, index
                                    ) in options.list_division"
                                    :key="index"
                                >
                                    <input
                                        type="checkbox"
                                        :value="item.value"
                                        v-model="filter_params.divisi"
                                    />
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </label>
                            </template>
                            <p v-else style="color: lightgray">
                                Tidak ada data.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-sm font-medium">Bentuk Dokumen</h3>
                        <div
                            class="text-xs flex flex-col gap-1 scrollbar-secondary max-h-28 overflow-auto"
                        >
                            <template v-if="options?.list_tipe_dokumen?.length">
                                <label
                                    class="flex gap-2 items-center"
                                    v-for="(
                                        item, index
                                    ) in options.list_tipe_dokumen"
                                    :key="index"
                                >
                                    <input
                                        type="checkbox"
                                        :value="item.value"
                                        v-model="filter_params.kategori"
                                    />
                                    <span>
                                        {{ item.text }}
                                    </span>
                                </label>
                            </template>
                            <p v-else style="color: lightgray">
                                Tidak ada data.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </ModalFilter>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import ModalFilter from "@/components/modal/ModalFilter.vue";
import Document from "@/apis/Document";

const props = defineProps({
    listFilter: {
        type: Object,
        default: function () {
            return {};
        },
    },
    filterParams: {
        type: Object,
        default: function () {
            return {
                status: "",
                companies: [],
                divisi: [],
                kategori: [],
                plants: [],
                tanggal: [],
                createbyme: "",
            };
        },
    },
});

const emit = defineEmits(["filter"]);

const filter_params = reactive({
    status: "",
    companies: [],
    divisi: [],
    kategori: [],
    plants: [],
    tanggal: [],
    createbyme: "",
    ...props.filterParams,
});

const hasFiltered = () => {
    let result = false;
    for (const key in filter_params) {
        if (typeof filter_params[key] == "string") {
            if (filter_params[key]) {
                result = true;
                break;
            }
        } else {
            if (filter_params[key] && filter_params[key].length) {
                result = true;
                break;
            }
        }
    }
    console.log(result, filter_params, "ini result");
    return result;
};

const isFilter = ref(hasFiltered());

const options = reactive({
    list_status: [],
    list_division: [],
    list_tipe_dokumen: [],
    list_company: [],
    list_plant: [],
});

watch(
    () => props.listFilter,
    (newFilter) => {
        options.list_status = newFilter.list_status;
        options.list_division = newFilter.division;
        options.list_tipe_dokumen = newFilter.list_tipe_dokumen;
    }
);

watch(filter_params, () => {
    isFilter.value = hasFiltered();
});

const applyFilterHanlder = () => {
    const tanggal = filter_params.tanggal.join(",");
    const filter = { ...filter_params, tanggal };
    emit("filter", filter);
};

const resetFilterHandler = () => {
    filter_params.status = "";
    filter_params.divisi = [];
    filter_params.kategori = [];
    filter_params.companies = [];
    filter_params.plants = [];
    filter_params.tanggal = [];
    filter_params.createbyme = "";

    emit("filter", filter_params);
};

const getCompanies = async () => {
    try {
        const { data } = await Document.getListCompany();

        options.list_company = data || [];
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const companyChangeHandler = () => {
    getPlant({
        company: filter_params.companies,
    });
};

const getPlant = async (params) => {
    try {
        const { data } = await Document.getListPlant(params);
        options.list_plant = data?.list_plant || [];
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

onMounted(() => {
    getCompanies();
});
</script>

<style lang="css"></style>
