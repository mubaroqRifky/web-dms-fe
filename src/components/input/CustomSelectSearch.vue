<template lang="">
    <div class="relative">
        <label
            class="label-container"
            :class="[
                dir == 'row' ? '  flex gap-4' : 'grid gap-2',
                labelClass,
                width,
            ]"
        >
            <span
                class="whitespace-normal text-xs font-medium"
                :class="[spanClass, dir == 'row' ? 'mt-1' : '']"
                v-if="label"
            >
                {{ label }}
                <i v-if="required" class="text-danger">*</i>
            </span>

            <div
                class="w-full relative input-wrapper grid flex-1"
                :class="[
                    error.message
                        ? 'danger focus-error'
                        : 'primary focus-primary',
                    '',
                    width,
                ]"
            >
                <input
                    ref="inputRef"
                    type="text"
                    :class="[
                        gundul ? 'input-border' : 'input-base',
                        classContainer,
                        width,
                    ]"
                    style="padding-right: 3rem"
                    :placeholder="placeholder"
                    :required="required"
                    :disabled="disabled"
                    v-model="input_value"
                    @focus="focusInputHandler"
                    @input="typeInputHandler"
                />

                <button
                    v-if="input_value"
                    class="absolute text-darkGray right-5 top-1/2 -translate-y-1/2 z-10 mr-1 p-1"
                    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                    @click.stop="!disabled && clearInputHandler()"
                >
                    <IconClose width="12px" height="12px" :bold="true" />
                </button>

                <button
                    class="absolute text-darkGray right-0 top-1/2 -translate-y-1/2 z-10 transform transition-all p-1 outline-none"
                    :class="[
                        list_input ? 'rotate-[270deg]' : 'rotate-90',
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    ]"
                    @click.stop="clickArrowHandler"
                >
                    <IconArrow width="15px" height="15px" :bold="true" />
                </button>
            </div>

            <p v-if="!noValidity" class="text-danger text-[.6rem] -mt-1">
                {{ error.message || "&nbsp;" }}
            </p>
        </label>

        <ul
            ref="list_input"
            v-if="list_input"
            class="select-lists scrollbar-tertiary"
            :class="[
                list_input ? 'list_open' : '',
                dir == 'col' ? '-mt-2' : 'mt-1',
            ]"
            @scroll="scrollHandler"
        >
            <li
                v-for="(item, index) in getOptionsCreate"
                :key="index"
                @click="selectInputHandler(item)"
                :class="
                    (
                        hasSelected.includes(item[keys]) || selectedKey
                            ? item[selectedKey]
                            : false
                    )
                        ? 'bg-softGray text-darkGray'
                        : 'bg-none hover:bg-primaryDark hover:text-white cursor-pointer'
                "
            >
                <a
                    class="block focus:outline-none px-4 py-2"
                    :class="[
                        input_value == item[optionLabel]
                            ? 'bg-primary text-white selected'
                            : '',
                        (
                            hasSelected.includes(item[keys]) || selectedKey
                                ? item[selectedKey]
                                : false
                        )
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer',
                    ]"
                    @focus="listFocus"
                    >{{ item[optionLabel] }}</a
                >
            </li>

            <li
                v-if="loadInput"
                class="p-2 hover:bg-lightGray"
                v-for="(item, i) in 5"
                :key="i"
            >
                <p class="skeleton"></p>
            </li>

            <p v-if="!options_list.length && !loadInput" class="p-2">
                Tidak ada data
            </p>
        </ul>
    </div>
</template>

<script>
import IconClose from "@/components/icons/action/IconClose.vue";
import IconArrow from "@/components/icons/page/IconArrow.vue";

export default {
    data() {
        return {
            input_value: "",
            list_input: false,
            options_list: [],
            list_selected: [],
            search_timeout: null,
            selected: false,
            meta_input: {},
            loadInput: false,
            firstInit: false,
            error: {},
            inputRef: null,
        };
    },
    components: { IconClose, IconArrow },
    props: {
        api: {
            default: function () {
                return {};
            },
            required: false,
        },
        params: {
            type: Object,
            default: function () {
                return {};
            },
        },
        createOption: {
            type: Function,
            default: function (option) {
                return option;
            },
        },
        reduce: {
            type: Function,
            default: function (option) {
                return option.id;
            },
        },
        keys: {
            default: "id",
        },
        dir: {
            default: "row",
        },
        width: {
            default: "",
        },
        optionLabel: {
            default: "text",
        },
        searchKey: {
            default: function () {
                return [];
            },
        },
        placeholder: {
            type: String,
            default: "",
        },
        label: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            default: function () {
                return [];
            },
        },
        hasSelected: {
            type: Array,
            default: function () {
                return [];
            },
        },
        required: {
            type: Boolean,
            default: false,
        },
        disabled: {
            default: false,
        },
        gundul: {
            type: Boolean,
            default: false,
        },
        noValidity: {
            type: Boolean,
            default: false,
        },
        validity: {
            default: function () {
                return {};
            },
        },
        value: {
            default: "",
        },
        spanClass: {
            default: "w-full md:w-44",
        },
        classContainer: {
            default: "",
        },
        labelClass: {
            default: "",
        },
        selectedKey: {
            default: "",
        },
        lastValue: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    computed: {
        getOptionsCreate() {
            return this.options_list.map(this.createOption);
        },
    },
    watch: {
        async value(newValue) {
            if (String(newValue).trim() == "") this.clearInputHandler();
            if (newValue && !this.selected && !this.lastValue.length) {
                this.firstInit = true;
                await this.searchInputDataHandler(newValue);

                const [hasil] = this.getOptionsCreate;
                this.selectInputHandler(hasil);
            } else {
                if (!this.hasSelected.length) return;

                const result = this.options_list.find(
                    (val) => val[this.keys] == newValue
                );

                if (result) {
                    this.input_value = result[this.keys];
                } else {
                    this.input_value = newValue;
                }
            }
        },
        validity: {
            handler: function (newValue) {
                this.error = newValue;
            },
        },
        lastValue(newValue) {
            if (newValue.length) {
                this.options_list = [...newValue];
                const [hasil] = this.getOptionsCreate;
                this.selectInputHandler(hasil);
            }
        },
        async options(newValue) {
            this.options_list = newValue;
            if (!this.value) return;
            await this.searchInputDataHandler(this.value);
            const [hasil] = this.getOptionsCreate;
            this.selectInputHandler(hasil);
        },
    },
    methods: {
        getListSelected(lists) {
            return lists.map(this.reduce);
        },
        listFocus() {
            clearTimeout(this.search_timeout);
        },
        selectInputHandler(item) {
            if (!item) {
                this.selected = false;
                this.list_selected = [];
                this.input_value = "";
                this.$emit("selected", "");
                return;
            }

            if (this.hasSelected.find((val) => val == item[this.keys])) return;
            if (item[this.selectedKey] && !this.lastValue.length) {
                this.hideListMenu();
                return;
            }

            this.selected = true;
            this.list_selected = [item];
            this.input_value = item[this.optionLabel];
            this.list_input = false;
            this.error = {};

            if (!this.firstInit) {
                const hasil = this.getListSelected(this.list_selected);
                this.$emit("selected", hasil[0]);
            } else {
                this.firstInit = false;
            }

            this.hideListMenu();
        },
        scrollHandler(e) {
            const { target } = e;
            const { scrollHeight, clientHeight, scrollTop } = target;

            if (
                scrollHeight - clientHeight - scrollTop <= 1 &&
                !this.loadInput
            ) {
                if (this.meta_input.current_page >= this.meta_input.last_page)
                    return;

                const data = {
                    _page: ++this.meta_input.current_page,
                };

                this.loadInputDataIndex(data, this.input_value);
            }
        },
        clearInputHandler() {
            this.input_value = "";
            this.list_selected = [];
            this.isClear = true;

            setTimeout(() => {
                this.isClear = false;
            }, 120);

            this.$emit("clear");
        },
        scrollFocus() {
            if (this.selected) {
                setTimeout(() => {
                    const container = document.querySelector(".list_open");
                    const listActive = container.querySelector(".selected");

                    if (container && listActive) {
                        container.scrollTo({
                            behavior: "smooth",
                            top: listActive.offsetTop,
                        });
                    }
                }, 0);
            }
        },
        focusInputHandler() {
            this.scrollFocus();

            if (this.options_list.length || this.input_value == "") {
                this.list_input = true;
            }

            if (this.input_value == "") this.searchInputDataHandler("");

            setTimeout(() => {
                document.addEventListener("click", this.hideListMenu);
            }, 150);
        },
        hideListMenu(e = {}) {
            const listInput = this.$refs.list_input;
            const { target } = e;

            if (target == this.$refs.inputRef) return;

            if (this.list_input) {
                this.list_input = false;
                document.removeEventListener("click", this.hideListMenu);
            }
        },
        clickArrowHandler() {
            if (this.disabled) return;
            if (this.list_input) this.hideListMenu();
            else this.focusInputHandler();
        },

        async typeInputHandler(e) {
            const { target } = e;
            this.selected = false;
            this.isSearch = true;

            if (!this.selected) {
                clearTimeout(this.search_timeout);
                this.search_timeout = setTimeout(() => {
                    this.searchInputDataHandler(target.value);
                }, 250);
            }
        },
        async searchInputDataHandler(value) {
            if (!Object.values(this.api).length) {
                const regexp = new RegExp(value, "ig");
                const result = this.options.filter((val) => {
                    for (const key of this.searchKey) {
                        const result = String(val[key]).match(regexp);
                        if (result) return result;
                    }

                    return !this.searchKey.length;
                });

                this.options_list = result;
                return;
            }

            const params = this.getInputSearchParams(null, value);
            this.options_list = [];
            await this.getData(params);
        },
        loadInputDataIndex(data, search = "") {
            const params = this.getInputSearchParams(data, search);
            this.getData(params);
        },
        getInputSearchParams(data, search = "") {
            const page = {
                page: data?._page || 1,
                per_page: data?._minPage || this.minPage,
                search,
            };

            const params = Object.assign({}, page, this.params);
            return params;
        },
        async getData(params) {
            try {
                if (this.loadInput) return;
                if (this.api.hasOwnProperty("path_url")) {
                    this.loadInput = true;
                    let { data } = await this.api.getData({ params });

                    if (!data?.data) data = { data: [] };

                    let newData = [...this.options_list, ...data.data];

                    if (this.lastValue.length) {
                        let lastValue = [...this.lastValue];
                        const result = data.data.find(
                            (val) =>
                                val[this.keys] == this.lastValue[0][this.keys]
                        );

                        if (this.isSearch) lastValue = [];
                        if (!result) newData = [...lastValue, ...newData];
                    }

                    this.options_list = newData;
                    this.meta_input = data?.meta || {};
                    this.loadInput = false;
                    this.isSearch = false;
                }
            } catch (error) {
                this.loadInput = false;
                throw new ErrorHandler(error);
            }
        },
    },
    created() {
        this.options_list = this.options;
    },
    async mounted() {
        if (this.value && !this.lastValue.length) {
            await this.searchInputDataHandler(this.value);
            const [hasil] = this.getOptionsCreate;
            this.selectInputHandler(hasil);
        }

        this.inputRef = this.$refs.inputRef;
    },
    unmounted() {
        document.removeEventListener("click", this.hideListMenu);
    },
};
</script>

<style lang="scss" scoped>
.select-lists {
    @apply max-h-72 overflow-auto text-xs rounded-b-md shadow-md absolute z-20 top-full left-0 right-0;
    background: linear-gradient(
        147deg,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.5) 100%
    );
    box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);

    > li {
        &:not(:last-child) {
            border-bottom: 1px solid gray;
        }
    }
}
</style>
