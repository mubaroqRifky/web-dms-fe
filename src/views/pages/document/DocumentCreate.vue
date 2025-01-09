<template lang="">
    <div class="grid content-start gap-6">
        <h2 class="text-primary font-semibold">UPLOAD DOCUMENT</h2>

        <div class="grid md:grid-cols-2 gap-x-10 gap-y-1">
            <InputSelect
                label="Perusahaan"
                placeholder="Perusahaan"
                :required="validation.company"
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
                v-model="form.nama_dokumen"
                v-model:error="validation.$errors.nama_dokumen"
            />

            <InputSelect
                label="Tipe Dokumen"
                placeholder="Tipe Dokumen"
                :required="validation.tipe_dokumen"
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
                v-model="form.no_dokumen"
                v-model:error="validation.$errors.no_dokumen"
            />

            <BasicDate
                dir="row"
                label="Tanggal Efektif"
                placeholder="Tanggal Efektif"
                :required="validation.tanggal"
                v-model="form.tanggal"
                :error="validation.$errors.tanggal"
            />

            <InputText
                label="Deskripsi"
                placeholder="Deskripsi"
                type="textarea"
                v-model="form.deskripsi"
            />

            <InputText
                label="Revisi"
                placeholder="Revisi"
                type="number"
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
                :revision-name="form.revisi"
                @delete="confirmRemove"
            />

            <div class="md:col-span-2 flex gap-2 justify-end my-10">
                <button
                    v-if="false"
                    class="btn btn-md btn-primary"
                    @click="confirmSave(true)"
                >
                    Save Draft
                </button>
                <button
                    class="btn btn-md btn-primary"
                    :disabled="!files.length"
                    @click="confirmSave()"
                >
                    Simpan
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive } from "vue";
import InputFileUpload from "@/components/input/InputFileUpload.vue";
import Modal from "@/controllers/state/ModalController";
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

            dokumen: "",
            list_dokumen: [],
            meta_dokumen: {
                hasNext: false,
                total: 0,
                loading: false,
            },
            params_dokumen: {
                page: 1,
                per_page: 10,
                search: "",
            },
        };
    },
    components: { InputFileUpload },
    computed: {
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
        confirmSave(draft = false) {
            let message = "Apakah anda yakin ingin menyimpan data?";
            if (draft) {
                message = "Apakah anda yakin ingin menyimpan data ke draft?";
            }

            const isValid = this.validation.$validate(this.form);

            Modal.confirm(message);
            Modal.onconfirm = () => {
                if (isValid) this.store(draft);
                else
                    Modal.error({
                        content: "Validation Exception",
                        subcontent: "Pastikan input sudah terisi dengan benar!",
                    });
            };
        },
        async store(draft = false) {
            try {
                const dataBody = new FormData();

                dataBody.append("company", this.form.company);
                dataBody.append("plant", this.form.plant);
                dataBody.append("kategori", this.form.level_dokumen);
                dataBody.append("doh_docform", this.form.nama_dokumen);
                dataBody.append("tag", this.form.bentuk_dokumen);
                dataBody.append("tipe_dokumen", this.form.tipe_dokumen);
                dataBody.append("nama_dokumen", this.form.no_dokumen);
                dataBody.append("tanggal", this.form.tanggal);
                dataBody.append("deskripsi", this.form.deskripsi);
                dataBody.append("revisi", this.form.revisi);

                if (draft) dataBody.append("draft", draft);

                this.files.forEach((file) => {
                    dataBody.append("files[]", file);
                });

                const data = await Document.store(dataBody);

                Modal.success(data.message);
                Modal.onclose = () => {
                    this.$router.push({ name: "document", replace: true });
                };
            } catch (error) {
                throw new ErrorHandler(error);
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
                this.loadingData = true;
                const { data } = await Document.getListOption();

                this.option.list_company = data.list_company || [];
                this.option.list_tipe_dokumen = data.list_tipe_dokumen || [];

                this.form.tipe_dokumen = "PC";
            } catch (error) {
                throw new ErrorHandler(error);
            } finally {
                this.loadingData = false;
            }
        },
        clearSelectHandler() {
            this.option.list_plant = [];
            this.form.plant = "";
        },
        selectHandler(value) {
            this.getListPlant([value]);
        },
        selectLevelDocument(value) {
            this.form.bentuk_dokumen = "";
            this.getListDocumentName({ parent: value });
        },
        async getDokumen() {
            try {
                this.meta_dokumen.loading = true;
                const { data } = await Document.getAll(this.params_dokumen);
                this.list_dokumen = data.data;

                this.meta_dokumen.hasNext = data?.to < data?.total;
                this.meta_dokumen.total = data.total || 0;
            } catch (error) {
                throw new ErrorHandler(error);
            } finally {
                this.meta_dokumen.loading = false;
            }
        },
        searchDokumenHandler() {},
        scrollDokumenHandler() {},
    },
    created() {
        this.getDokumen();
        this.getListOption();
        this.getListDocumentName();
        this.getListDocumentLevel();
    },
    mounted() {},
};
</script>

<style lang="scss" scoped></style>
