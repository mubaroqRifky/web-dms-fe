<template>
    <div class="grid content-start gap-6">
        <h2 class="text-primary font-semibold">SHOW DOCUMENT</h2>

        <div class="grid md:grid-cols-2 gap-x-10 gap-y-1">
            <InputSelect
                label="Perusahaan"
                placeholder="Perusahaan"
                disabled
                :reduce="(v) => v.value"
                :loading="loadingData"
                :options="option.list_company"
                v-model="form.company"
            />

            <InputSelect
                label="Plant"
                placeholder="Plant"
                disabled
                :reduce="(v) => v.value"
                :loading="loadingData || loadingPlant"
                :options="option.list_plant"
                v-model="form.plant"
            />

            <InputSelect
                label="Level Dokumen"
                placeholder="Level Dokumen"
                disabled
                option-label="nm_reff"
                option-key="kd_reff"
                :reduce="(v) => v.kd_reff"
                :loading="loadingData"
                :options="option.list_document_level"
                v-model="form.level_dokumen"
            />

            <InputSelect
                label="Bentuk Dokumen"
                placeholder="Bentuk Dokumen"
                disabled
                option-label="nm_reff"
                option-key="kd_reff"
                :reduce="(v) => v.kd_reff"
                :loading="loadingData"
                :options="option.list_document_name"
                v-model="form.bentuk_dokumen"
            />

            <InputText
                label="Nama Dokumen"
                placeholder="Nama Dokumen"
                v-model="form.nama_dokumen"
                disabled
            />

            <InputSelect
                label="Tipe Dokumen"
                placeholder="Tipe Dokumen"
                disabled
                :reduce="(v) => v.value"
                :loading="loadingData"
                :options="option.list_tipe_dokumen"
                v-model="form.tipe_dokumen"
            />

            <InputText
                label="No. Dokumen"
                placeholder="Tulis No. Dokumen"
                v-model="form.no_dokumen"
                disabled
            />

            <BasicDate
                dir="row"
                label="Tanggal Efektif"
                placeholder="Tanggal Efektif"
                v-model="form.tanggal"
                disabled
            />

            <InputText
                label="Deskripsi"
                placeholder="Deskripsi"
                type="textarea"
                v-model="form.deskripsi"
                disabled
            />

            <InputText
                label="Revisi"
                placeholder="Revisi"
                type="number"
                v-model="form.revisi"
                disabled
            />

            <InputFileUpload :files="files" v-model="selectedFiles" />

            <div
                class="md:col-span-2 flex gap-2 justify-end my-10"
                v-if="isCanApprove"
            >
                <button
                    class="btn btn-sm btn-danger"
                    @click="confirmApproval(false)"
                >
                    Reject
                </button>
                <button
                    class="btn btn-sm btn-primary"
                    @click="confirmApproval(true)"
                >
                    Approve
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import InputFileUpload from "@/components/input/InputFileUpload.vue";
import Modal from "@/controllers/state/ModalController";
import User from "@/controllers/auth/UserController.js";
import Document from "@/apis/Document";
import MReff from "@/apis/MReff";

export default {
    data() {
        return {
            loadingData: false,
            loadingPlant: false,
            option: {
                list_company: [],
                list_plant: [],
                list_document_level: [],
                list_document_name: [],
                list_tipe_dokumen: [],
            },
            selectedFiles: [],
            files: [],
            data: null,
            id: null,
            form: {
                company: "",
                plant: "",
                level_dokumen: "",
                nama_dokumen: "",
                bentuk_dokumen: "",
                tipe_dokumen: "",
                no_dokumen: "",
                tanggal: "",
                deskripsi: "",
            },
        };
    },
    components: { InputFileUpload },
    computed: {
        user_approve() {
            return this.data?.icon_approve;
        },
        user() {
            return User.get();
        },
        isCanApprove() {
            if (!this.user_approve || !this.user) return false;

            return this.user_approve?.to_email == this.user?.email;
        },
    },
    methods: {
        async getListDocumentName() {
            try {
                const { data } = await MReff.getDocumentName();
                this.option.list_document_name = data?.data || [];
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async getListDocumentLevel() {
            try {
                const { data } = await MReff.getDocumentLevel();
                this.option.list_document_level = data?.data || [];
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async getListPlant(companies) {
            try {
                this.loadingPlant = true;
                const { data } = await Document.getListPlant({
                    company: companies,
                });
                this.option.list_plant = data.list_plant || [];
            } catch (error) {
                throw new ErrorHandler(error);
            } finally {
                this.loadingPlant = false;
            }
        },
        async getListOption() {
            try {
                const { data } = await Document.getListOption();

                this.option.list_company = data.list_company || [];
                this.option.list_tipe_dokumen = data.list_tipe_dokumen || [];
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async getDataById(id) {
            try {
                this.loadingData = true;
                const { data } = await Document.showData(id);

                this.data = data;

                if (!data) throw Error("Dokumen tidak ditemukan");

                this.form = {
                    company: data.doh_company,
                    plant: String(data.doh_plant),
                    level_dokumen: String(data.kategori),
                    nama_dokumen: data.doh_docform,
                    bentuk_dokumen: data.tag,
                    tipe_dokumen: data.type,
                    no_dokumen: data.title,
                    tanggal: data.tanggal,
                    deskripsi: data.deskripsi,
                    revisi: data.revisi,
                };

                if (data.doh_company) {
                    this.getListPlant([data.doh_company]);
                }

                if (data.kategori) {
                    this.getListDocumentName({ parent: data.kategori });
                }

                this.files = data.detail
                    .map((v) => ({
                        ...v,
                        name: v.file_name,
                    }))
                    .filter((v) => v.active);
            } catch (error) {
                Modal.onclose = this.$router.back;
                throw new ErrorHandler(error);
            } finally {
                this.loadingData = false;
            }
        },
        confirmApproval(isApprove) {
            let message = "Anda yakin ingin approve dokumen?";
            if (!isApprove) message = "Anda yakin ingin reject dokumen?";

            Modal.confirm(message);
            Modal.onconfirm = () => this.processApproveReject(isApprove);
        },
        async processApproveReject(isApprove) {
            try {
                this.loadingData = true;

                let type = "approve";
                if (!isApprove) type = "reject";

                const { message } = await Document.approveDocument({
                    dokumen_id: this.id,
                    type,
                });

                Modal.success(message);
                Modal.onclose = this.$router.back;
            } catch (error) {
                Modal.onclose = this.$router.back;
                throw new ErrorHandler(error);
            } finally {
                this.loadingData = false;
            }
        },
    },
    created() {
        this.getListOption();
        this.getListDocumentLevel();
    },
    mounted() {
        const { id } = this.$route.params;
        this.id = id;
        this.getDataById(id);
    },
};
</script>

<style lang="scss" scoped></style>
