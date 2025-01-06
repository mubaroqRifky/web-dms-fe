<template lang="">
    <div class="grid content-start gap-6">
        <h2 class="text-primary font-semibold">EDIT DOCUMENT</h2>

        <div class="grid md:grid-cols-2 gap-x-10 gap-y-1">
            <InputSelect
                label="Perusahaan"
                placeholder="Perusahaan"
                :required="validation.company"
                :disabled="!canEditDocument"
                :reduce="(v) => v.value"
                :loading="loadingData"
                :options="option.list_company"
                v-model="form.company"
                v-model:error="validation.$errors.company"
                @selected="selectHandler"
                @reset="clearSelectHandler"
            />

            <InputSelect
                label="Plant"
                placeholder="Plant"
                :required="validation.plant"
                :disabled="!canEditDocument"
                :reduce="(v) => v.value"
                :loading="loadingData || loadingPlant"
                :options="option.list_plant"
                v-model="form.plant"
                v-model:error="validation.$errors.plant"
            />

            <InputSelect
                label="Level Dokumen"
                placeholder="Level Dokumen"
                :required="validation.level_dokumen"
                :disabled="!canEditDocument"
                option-label="nm_reff"
                option-key="kd_reff"
                :reduce="(v) => v.kd_reff"
                :loading="loadingData"
                :options="option.list_document_level"
                v-model="form.level_dokumen"
                v-model:error="validation.$errors.level_dokumen"
                @selected="selectLevelDocument"
                @reset="selectLevelDocument"
            />

            <InputSelect
                label="Bentuk Dokumen"
                placeholder="Bentuk Dokumen"
                :required="validation.bentuk_dokumen"
                :disabled="!canEditDocument"
                option-label="nm_reff"
                option-key="kd_reff"
                :reduce="(v) => v.kd_reff"
                :loading="loadingData"
                :options="option.list_document_name"
                v-model="form.bentuk_dokumen"
                v-model:error="validation.$errors.bentuk_dokumen"
            />

            <InputText
                label="Nama Dokumen"
                placeholder="Nama Dokumen"
                :required="validation.nama_dokumen"
                :disabled="!canEditDocument"
                v-model="form.nama_dokumen"
                v-model:error="validation.$errors.nama_dokumen"
            />

            <InputSelect
                label="Tipe Dokumen"
                placeholder="Tipe Dokumen"
                :required="validation.tipe_dokumen"
                :disabled="!canEditDocument"
                :reduce="(v) => v.value"
                :loading="loadingData"
                :options="option.list_tipe_dokumen"
                v-model="form.tipe_dokumen"
                v-model:error="validation.$errors.tipe_dokumen"
            />

            <InputText
                label="No. Dokumen"
                placeholder="Tulis No. Dokumen"
                :required="validation.no_dokumen"
                :disabled="!canEditDocument"
                v-model="form.no_dokumen"
                v-model:error="validation.$errors.no_dokumen"
            />

            <BasicDate
                dir="row"
                label="Tanggal Efektif"
                placeholder="Tanggal Efektif"
                :required="validation.tanggal"
                :disabled="!canEditDocument"
                v-model="form.tanggal"
                :error="validation.$errors.tanggal"
            />

            <InputText
                label="Deskripsi"
                placeholder="Deskripsi"
                type="textarea"
                :disabled="!canEditDocument"
                v-model="form.deskripsi"
            />

            <InputText
                label="Revisi"
                placeholder="Revisi"
                type="number"
                :disabled="!canEditDocument"
                v-model="form.revisi"
            />

            <InputFileUpload
                :files="files"
                v-model="selectedFiles"
                :default-name="
                    form.no_dokumen && form.nama_dokumen
                        ? `${form.no_dokumen} ${form.nama_dokumen}`
                        : ''
                "
                :can-edit="canEditDocument"
                :can-activate="canActivateDocument"
                :revision-name="form.revisi"
                @delete="confirmRemove"
                @activate="activatedFileHandler"
            />

            <div
                v-if="canEditDocument"
                class="md:col-span-2 flex gap-2 justify-end my-10"
            >
                <button
                    v-if="false"
                    class="btn btn-md btn-primary"
                    @click="confirmUpdate(true)"
                >
                    Save Draft
                </button>
                <button class="btn btn-md btn-primary" @click="confirmUpdate()">
                    Update
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive } from "vue";
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
            id: null,
            data: null,
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
                revisi: "",
            },
            file_update: {},
            STATUS_DOKUMEN: {
                DRAFT: "00",
                REVIEWED: "10",
                APPROVED: "20",
            },
        };
    },
    components: { InputFileUpload },
    computed: {
        user() {
            return User.get();
        },

        canActivateDocument() {
            return this.canEditDocument;
        },
        canEditDocument() {
            if (this.isReviewed) return false;

            if (!this.isOwner) return false;

            return this.can("revisi_document");
        },

        isOwner() {
            return this.data?.usr_id == this.user?.id;
        },
        isDraft() {
            return this.data?.status_id == this.STATUS_DOKUMEN.DRAFT;
        },
        isApproved() {
            return this.data?.status_id == this.STATUS_DOKUMEN.APPROVED;
        },
        isReviewed() {
            return this.data?.status_id == this.STATUS_DOKUMEN.REVIEWED;
        },

        validation() {
            const company = computed(() => true);
            const plant = computed(() => true);
            const level_dokumen = computed(() => true);
            const nama_dokumen = computed(() => true);
            const bentuk_dokumen = computed(() => true);
            const tipe_dokumen = computed(() => true);
            const no_dokumen = computed(() => true);
            const tanggal = computed(() => true);

            const errors = reactive({});

            const validate = (form) => {
                let isValid = true;

                for (const key in form) {
                    if (this.validation[key] && !form[key]) {
                        errors[key] = { message: `${key} is required` };
                        isValid = false;
                    }
                }

                return isValid;
            };

            return {
                company: company.value,
                plant: plant.value,
                level_dokumen: level_dokumen.value,
                nama_dokumen: nama_dokumen.value,
                bentuk_dokumen: bentuk_dokumen.value,
                tipe_dokumen: tipe_dokumen.value,
                no_dokumen: no_dokumen.value,
                tanggal: tanggal.value,
                $validate: validate,
                $errors: errors,
            };
        },
    },
    methods: {
        confirmRemove(item) {
            Modal.onconfirm = () => {
                this.removeHandler(item);
                Modal.close();
            };
            Modal.confirm(`Yakin ingin menghapus dokumen?`);
        },
        removeHandler(item) {
            this.files = this.files.filter((val) => val.name != item.name);
        },
        confirmUpdate(draft) {
            let message = "Apakah anda yakin ingin mengubah data?";
            if (draft) {
                message = "Apakah anda yakin ingin menyimpan data ke draft?";
            }

            const isValid = this.validation.$validate(this.form);

            Modal.confirm(message);
            Modal.onconfirm = () => {
                if (isValid) this.update(draft);
                else
                    Modal.error({
                        content: "Validation Exception",
                        subcontent: "Pastikan input sudah terisi dengan benar!",
                    });
            };
        },
        async update(draft) {
            try {
                const dataBody = new FormData();

                dataBody.append("_method", "PUT");
                dataBody.append("doh_company", this.form.company);
                dataBody.append("doh_plant", this.form.plant);
                dataBody.append("cat_id", this.form.level_dokumen);
                dataBody.append("doh_docform", this.form.nama_dokumen);
                dataBody.append("doh_tagging", this.form.bentuk_dokumen);
                dataBody.append("doh_type", this.form.tipe_dokumen);
                dataBody.append("doh_title", this.form.no_dokumen);
                dataBody.append("doh_date", this.form.tanggal);
                dataBody.append("doh_note", this.form.deskripsi);
                dataBody.append("revisi", this.form.revisi || "");

                if (draft) dataBody.append("draft", draft);

                this.files.forEach((file) => {
                    if (!file.file_name) {
                        dataBody.append("files[]", file);
                    }
                });

                for (const item in this.file_update) {
                    if (this.file_update[item].active == 1) {
                        dataBody.append("file[active][]", item);
                    } else {
                        dataBody.append("file[inactive][]", item);
                    }
                }

                const data = await Document.updateData(this.id, dataBody, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                Modal.onclose = () => {
                    this.$router.push({ name: "document", replace: true });
                };
                Modal.success(data.message);
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        clearSelectHandler() {
            this.option.list_plant = [];
            this.form.plant = "";
        },
        async selectHandler(value) {
            this.getListPlant([value]);
        },
        selectLevelDocument(value) {
            this.form.bentuk_dokumen = "";
            this.getListDocumentName({ parent: value });
        },
        activatedFileHandler(value) {
            const { id, is_active } = value || [];

            if (id) {
                if (is_active == 1) {
                    this.file_update[id] = { active: is_active };
                } else {
                    this.file_update[id] = { inactive: is_active };
                }
            }
        },
        async getListDocumentName(params) {
            try {
                const { data } = await MReff.getDocumentName(params);
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

                if (!data) throw Error("Dokumen tidak ditemukan");

                this.data = data;

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

                this.files = data.detail.map((v) => ({
                    ...v,
                    name: v.file_name,
                }));
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
