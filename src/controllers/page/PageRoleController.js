import BasicInitialPage from "./BasicInitialPage";
import Role from "@/apis/Role";
import Modal from "@/controllers/state/ModalController";
import { goToIndex, addItem, editItem, showItem } from "./ImplementMethods";

class PageRoleController extends BasicInitialPage {
    route_index = "master-role";
    route_create = "master-role-create";
    route_edit = "master-role-edit";
    route_show = "master-role-show";

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
            const { data, meta } = await Role.getAll({
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
            const { message } = await Role.createData(this.payload);
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
            const { data } = await Role.getData(id);

            this.payload.id = data.id;
            this.payload.name = data.name;
            this.payload.description = data.description;
            this.payload.permissions = data.permissions;
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
            const { message } = await Role.updateData(this.payload.id, {
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
        Modal.confirm(`Apakah anda yakin ingin menghapus role ${item.name}?`);
        Modal.onconfirm = () => this.delete(item.id);
    }

    async delete(id) {
        try {
            const { message } = await Role.deleteData(id);
            Modal.onclose = () => this.index();
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }

    async sync(permissions = []) {
        try {
            const { message } = await Role.syncPermission({
                role_name: this.payload.name,
                permissions,
            });
            Modal.onclose = () => this.show(this.payload.id);
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}

PageRoleController.prototype.goToIndex = goToIndex;
PageRoleController.prototype.addItem = addItem;
PageRoleController.prototype.editItem = editItem;
PageRoleController.prototype.showItem = showItem;

export default PageRoleController;
