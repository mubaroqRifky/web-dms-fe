import BasicInitialPage from "./BasicInitialPage";
import User from "@/apis/User";
import Modal from "@/controllers/state/ModalController";
import Loading from "@/controllers/state/LoadingController";
import { goToIndex, addItem, editItem, showItem } from "./ImplementMethods";

class PageUserController extends BasicInitialPage {
    route_index = "master-user";
    route_create = "master-user-create";
    route_edit = "master-user-edit";
    route_show = "master-user-show";

    constructor() {
        super();
        this.generate();
        this.generateForm();
    }

    generate() {
        this.table_headers = [
            { text: "Name", value: "user_name" },
            { text: "Email", value: "user_email" },
            { text: "Status", value: "status" },
            { text: "Role", value: "roles" },
            { text: "Division", value: "docdiv_desc" },
            { text: "", value: "action" },
        ];
    }

    generateForm() {
        this.form = {
            name: "",
            email: "",

            company: [],
            plant: [],
            doc_div: [],
            vw_doc_div: [],
        };
    }

    async index() {
        try {
            this.state_table.loading = true;
            const { data } = await User.getAll(this.table_params);

            this.state_table.items = data.user;
            this.state_table.total = data.user.length;

            return data;
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_table.loading = false;
        }
    }

    deleteItem(item) {
        Modal.confirm(`Apakah anda yakin ingin menghapus data ${item.name}?`);
        Modal.onconfirm = () => {
            Loading.start();
            setTimeout(() => {
                Loading.stop();
                Modal.close();
            }, 2000);
            Modal.onclose = () => {
                this.index();
            };
        };
    }

    confirmSave() {
        Modal.confirm(`Apakah anda yakin ingin menyimpan data?`);
        Modal.onconfirm = () => this.store();
    }

    async store() {
        try {
            this.state_form.loading = true;
            const { message } = await User.createData(this.payload);
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
            const { data } = await User.getData(id);
            this.payload.muser_id = data.muser_id;
            this.payload.name = data.muser_name;
            this.payload.email = data.email;

            this.state_form.data.roles = data.roles;
            this.state_form.data.permissions = data.permissions;
        } catch (error) {
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
            const { message } = await User.updateData(this.payload.muser_id, {
                name: this.payload.name,
                email: this.payload.email,
            });
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_form.loading = false;
        }
    }

    async sync(path = "path", key = "default", values = []) {
        try {
            const { message } = await User.syncData(path, {
                user_id: this.payload.muser_id,
                [key]: values,
            });
            Modal.onclose = () => this.show(this.payload.muser_id);
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}

PageUserController.prototype.goToIndex = goToIndex;
PageUserController.prototype.addItem = addItem;
PageUserController.prototype.editItem = editItem;
PageUserController.prototype.showItem = showItem;

export default PageUserController;
