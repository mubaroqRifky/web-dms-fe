import BasicInitialPage from "./BasicInitialPage";
import User from "@/apis/User";
import Modal from "@/controllers/state/ModalController";
import Loading from "@/controllers/state/LoadingController";
import { goToIndex, addItem, editItem, showItem } from "./ImplementMethods";

class PageCategoryController extends BasicInitialPage {
    route_index = "master-category";
    route_create = "master-category-create";
    route_edit = "master-category-edit";
    route_show = "master-category-show";

    constructor() {
        super();
        this.generate();
        this.generateForm();
    }

    generate() {
        this.table_headers = [
            { text: "Nama Kategori", value: "kategori_name" },
            { text: "Divisi", value: "category.text" },
            { text: "Disimpan", value: "lama_kategori_disimpan" },
            { text: "Diarsipkan", value: "lama_kategori_diarsipkan" },
            { text: "", value: "action" },
        ];
    }

    generateForm() {
        this.form = {
            name: "",
            email: "",
        };
    }

    async index() {
        try {
            this.state_table.loading = true;
            const { data } = await User.getAll(this.table_params);
            for (const val of data.kategori) {
                const hasil = data.doc_div.find(
                    ({ value }) => value == val.cat_parent
                );

                if (hasil && hasil.child) hasil.child.push(val);
                else hasil.child = [val];
            }

            this.state_table.items = data.kategori.map((v) => {
                const category = data.doc_div.find(
                    ({ value }) => value == v.cat_parent
                );

                return {
                    ...v,
                    category,
                };
            });
            this.state_table.total = data.kategori.length;

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

            this.payload.id = data.id;
            this.payload.name = data.name;
            this.payload.email = data.email;
            this.payload.is_active = data.is_active;

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
            const { message } = await User.updateData(this.payload.id, {
                name: this.payload.name,
                email: this.payload.email,
                is_active: this.payload.is_active,
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
                user_id: this.payload.id,
                [key]: values,
            });
            Modal.onclose = () => this.show(this.payload.id);
            Modal.success(message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}

PageCategoryController.prototype.goToIndex = goToIndex;
PageCategoryController.prototype.addItem = addItem;
PageCategoryController.prototype.editItem = editItem;
PageCategoryController.prototype.showItem = showItem;

export default PageCategoryController;
