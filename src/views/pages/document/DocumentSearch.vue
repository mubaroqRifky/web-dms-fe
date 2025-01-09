<template>
    <div class="flex flex-col gap-3 mt-4">
        <div class="flex justify-between">
            <BasicInput
                placeholder="Search"
                type="search"
                v-model="params.search"
                @search-enter="searchAdvance"
                search
                no-validity
            />
            <FilterDocument
                :list-filter="list_filter"
                @filter="filterHanlder"
            />
        </div>

        <section class="flex items-center justify-between mt-4">
            <div>
                <h5 v-if="meta?.total" class="text-xs font-semibold">
                    Total {{ meta.total }}
                </h5>
            </div>
            <div
                class="flex gap-2 items-center text-xs text-primary"
                v-if="searching"
            >
                Searching
                <MoonLoader color="#d2a92a" size="20px" />
            </div>
        </section>

        <section
            class="p-4 bg-white meta-container flex flex-col gap-2 divide-y divide-solid divide-primary"
        >
            <template v-for="(item, index) in items" :key="index">
                <div class="py-2 flex flex-col gap-1">
                    <h5
                        @click="goToDetail(item)"
                        class="cursor-pointer text-primary text-sm"
                        v-html="item.doh_title"
                    ></h5>

                    <p class="flex text-xs gap-2">
                        <strong class="font-semibold">
                            {{ item.doi_date }}
                        </strong>
                        <span v-html="item.doh_note"> </span>
                    </p>

                    <article class="flex flex-col text-xs">
                        <strong class="font-semibold"> Content :</strong>

                        <span
                            class="text-elipsis elipsis-3 italic leading-4"
                            v-html="item.doi_meta"
                        ></span>
                    </article>

                    <div class="flex gap-2 items-center">
                        <button
                            class="text-primary text-xs"
                            @click="readMore(item)"
                        >
                            Read More
                        </button>
                        <button
                            class="text-primary text-xs"
                            @click="goToDetail(item)"
                        >
                            View Detail
                        </button>
                    </div>

                    <ul class="pl-4">
                        <li
                            class="text-sm list-disc"
                            v-for="tag in item.doh_tagging.split(',')"
                            v-html="tag"
                        ></li>
                    </ul>
                </div>
            </template>

            <div class="text-xs min-h-52" v-if="!items.length">
                <p class="text-gray">Search meta data.</p>
            </div>
        </section>

        <ModalReadmore
            v-if="read_more"
            :title="item?.doh_title"
            :subtitle="item?.doh_date"
            :tags="item?.doh_tagging"
            :name="item?.doi_name"
            :content="item?.doi_meta"
            @close="read_more = false"
            @detail="
                $router.push({
                    name: 'document-show',
                    params: { id: item.doh_id },
                })
            "
        ></ModalReadmore>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import MoonLoader from "vue-spinner/src/MoonLoader.vue";
import Document from "@/apis/Document";
import FilterDocument from "@/components/FilterDocument.vue";
import ModalReadmore from "@/components/modal/ModalReadmore.vue";

const router = useRouter();

const loading = ref(false);
const list_filter = ref([]);

const getListFilterDokumen = async () => {
    try {
        const { data } = await Document.getListFilterDokumen();

        list_filter.value = data || [];
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const items = ref([]);
const meta = reactive({ total: 0, total_page: 0 });
const params = reactive({ search: "", min_page: 10 });
const interval = ref(null);
const searching = ref(false);

const filterHanlder = (value) => {
    params.companies = value?.companies;
    params.divisi = value?.divisi;
    params.kategori = value?.kategori;
    params.plants = value?.plants;
    params.status = value?.status;

    searchAdvance();
};

const searchAdvance = async () => {
    try {
        searching.value = true;
        clearInterval(interval.value);

        await Document.searchAdvance(params);

        interval.value = setInterval(() => {
            if (!searching.value) {
                clearInterval(interval.value);
            } else {
                getDataSearchAdvance();
            }
        }, 2000);
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const getDataSearchAdvance = async () => {
    try {
        loading.value = true;
        const { data, success } = await Document.getDataSearchAdvance();

        if (success && data.length) {
            items.value = data;

            meta.total = data.length;
            meta.total_page = Math.ceil(data.length / params.min_page);

            searching.value = data[0]?.statussearch != "done" ? true : false;
        } else {
            items.value = [];
            clearInterval(interval.value);
            searching.value = false;
        }
    } catch (error) {
        clearInterval(interval.value);
        searching.value = false;
        throw new ErrorHandler(error);
    } finally {
        loading.value = false;
    }
};

const goToDetail = (item) => {
    router.push({ name: "document-show", params: { id: item.doh_id } });
};

const read_more = ref(false);
const item = ref(null);
const readMore = (value) => {
    read_more.value = true;
    item.value = value;
};

onMounted(() => {
    getListFilterDokumen();
});
</script>

<style lang="scss">
.meta-container {
    strong {
        font-weight: bold !important;
    }
}
</style>
