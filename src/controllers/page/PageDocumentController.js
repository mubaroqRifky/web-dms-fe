import BasicInitialPage from "./BasicInitialPage";
import Document from "@/apis/Document";
import Modal from "@/controllers/state/ModalController";
import { goToIndex, addItem, editItem, showItem } from "./ImplementMethods";

class PageDocumentController extends BasicInitialPage {
    route_index = "document";
    route_create = "document-create";
    route_edit = "document-edit";
    route_show = "document-show";

    constructor() {
        super();
        this.generate();
    }

    generate() {
        this.table_headers = [
            { text: "Bentuk Dokumen", value: "doh_tagging_desc" },
            { text: "No. Dokumen", value: "doh_title" },
            { text: "Nama Dokumen", value: "doh_docform" },
            { text: "Revisi", value: "revisi" },
            { text: "Tanggal Efektif", value: "doh_date" },
            { text: "", value: "action" },
        ];
        this.initialTable.serverOptions.rowsPerPage = 10;
        this.table_params = { per_page: 10 };
    }

    async index() {
        try {
            this.state_table.loading = true;
            const { data } = await Document.getAll(this.table_params);
            this.state_table.items = data.data;
            this.state_table.total = data.total;
        } catch (error) {
            throw new ErrorHandler(error);
        } finally {
            this.state_table.loading = false;
        }
    }

    confirmDelete(item) {
        Modal.confirm(
            `Apakah anda yakin ingin menghapus data ${item.doh_title}?`
        );
        Modal.onconfirm = () => this.delete(item.doh_id);
    }

    async delete(id) {
        try {
            const data = await Document.deleteData(id);
            Modal.onclose = () => this.index();
            Modal.success(data.message);
        } catch (error) {
            throw new ErrorHandler(error);
        }
    }
}

PageDocumentController.prototype.goToIndex = goToIndex;
PageDocumentController.prototype.addItem = addItem;
PageDocumentController.prototype.editItem = editItem;
PageDocumentController.prototype.showItem = showItem;

export default PageDocumentController;
