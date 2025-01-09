const initialTable = {
    headers: [],
    searchField: [],
    searchValue: "",
    itemShows: [5, 10, 50, 100],
    serverOptions: {
        page: 1,
        rowsPerPage: 5,
        sortBy: [],
        sortType: [],
    },
    params: {},
    items: [],
    total: 0,
    loading: false,
};

const initialForm = {
    payload: {},
    loading: false,
    data: {},
};

class InitialState {
    initialTable = {};
    initialForm = {};

    constructor() {
        this.initialTable = initialTable;
        this.initialForm = initialForm;
    }

    get table_params() {
        return this.state_table.params;
    }

    set table_params(objValue = {}) {
        Object.assign(this.initialTable.params, objValue);
    }

    set table_headers(arrValue = []) {
        this.initialTable.headers = arrValue;
    }

    set form(objValue) {
        this.initialForm.payload = objValue;
    }
}

export default InitialState;
