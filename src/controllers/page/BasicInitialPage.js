import { onBeforeUnmount, reactive, toRefs, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import InitialState from "./InitialState";

class BasicInitialPage extends InitialState {
    state_table = {};
    state_form = {};
    router = useRouter();
    route = useRoute();

    constructor() {
        super();
        this.table_params = {
            page: this.initialTable.serverOptions.page,
            per_page: this.initialTable.serverOptions.rowsPerPage,
            search: undefined,
        };
    }

    buildTable() {
        this.state_table = reactive({ ...this.initialTable });
        this.watchingPaginate();
        this.watchingSearch();
        this.watchingFilter();
        return toRefs(this.state_table);
    }

    buildForm() {
        this.state_form = reactive({ ...this.initialForm });
        return toRefs(this.state_form);
    }

    search(value) {
        this.state_table.serverOptions = {
            ...this.state_table.serverOptions,
            search: value,
            page: 1,
        };
    }

    filter(params) {
        this.state_table.params = {
            ...params,
            per_page: this.state_table.serverOptions.rowsPerPage,
            page: 1,
        };
    }

    watchingPaginate() {
        watch(
            () => this.state_table.serverOptions,
            (value) => {
                this.state_table.params.page = value.page;
                this.state_table.params.per_page = value.rowsPerPage;
                this.state_table.params.search = value.search;
                this.state_table.params.sort_by = value.sortBy;
                this.state_table.params.sort_type = value.sortType;
            },
            { deep: true }
        );
    }

    watchingSearch() {
        // watch(
        //     () => this.state_table.searchValue,
        //     (value) => {
        //         this.state_table.params.search = value;
        //         if (!value) this.search();
        //     }
        // );
    }

    watchingFilter() {
        watch(
            () => this.state_table.params,
            (value) => {
                Object.assign(this.initialTable.params, value);
                this.index();
            },
            { deep: true }
        );

        onBeforeUnmount(() => {
            this.initialTable.params = {};
        });
    }

    get payload() {
        return this.state_form.payload;
    }

    get isCreate() {
        return this.route.name.includes("create");
    }

    get isEdit() {
        return this.route.name.includes("edit");
    }

    get isShow() {
        return this.route.name.includes("show");
    }
}

export default BasicInitialPage;
