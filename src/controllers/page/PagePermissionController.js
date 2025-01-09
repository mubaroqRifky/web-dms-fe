import BasicInitialPage from "./BasicInitialPage";
import Permission from "@/apis/Permission";
import Modal from "@/controllers/state/ModalController";
import { goToIndex, addItem, editItem, showItem } from "./ImplementMethods";

class PagePermissionController extends BasicInitialPage {
    route_index = "master-permission";
    route_create = "master-permission-create";
    route_edit = "master-permission-edit";
    route_show = "master-permission-show";

    constructor() {
        super();
        this.generate();
        this.generateForm();
    }

    generate() {
        this.table_headers = [
            { text: "Name", value: "name" },
            { text: "Description", value: "description" },
            { text: "Actions", value: "action" },
        ];
    }

    generateForm() {
        this.form = {
            name: "",
            description: "",
        };
    }

    async index() {
        try {
            this.state_table.loading = true;
            const { data, meta } = await Permission.getAll({
                ...this.table_params,
                search: this.state_table.searchValue,
            });
            this.state_table.items = data || [];
            this.state_table.total = meta?.total || 0;
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_table.loading = false;
        }
    }

    async search() {
        this.table_params.page = 1;
        this.index();
    }

    confirmSave() {
        Modal.confirm(`Apakah anda yakin ingin menyimpan data?`);
        Modal.onconfirm = () => this.store();
    }

    async store() {
        try {
            this.state_form.loading = true;
            const { message } = await Permission.createData(this.payload);
            Modal.onclose = () => this.goToIndex();
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_form.loading = false;
        }
    }

    async show(id) {
        try {
            this.state_form.loading = true;
            const { data } = await Permission.getData(id);

            this.payload.id = data.id;
            this.payload.name = data.name;
            this.payload.description = data.description;
        } catch (error) {
            Modal.onclose = this.router.back;
            throw new ErrorHandler(error);
        } finally {
            this.state_form.loading = false;
        }
    }

    confirmUpdate() {
        Modal.confirm(`Apakah anda yakin ingin mengubah data?`);
        Modal.onconfirm = () => this.update();
    }

    async update() {
        try {
            this.state_form.loading = true;
            const { message } = await Permission.updateData(this.payload.id, {
                name: this.payload.name,
                description: this.payload.description,
            });
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_form.loading = false;
        }
    }

    confirmDelete(item) {
        Modal.confirm(
            `Apakah anda yakin ingin menghapus permission ${item.name}?`
        );
        Modal.onconfirm = () => this.delete(item.id);
    }

    async delete(id) {
        try {
            const { message } = await Permission.deleteData(id);
            Modal.onclose = () => this.index();
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}

PagePermissionController.prototype.goToIndex = goToIndex;
PagePermissionController.prototype.addItem = addItem;
PagePermissionController.prototype.editItem = editItem;
PagePermissionController.prototype.showItem = showItem;

export default PagePermissionController;
