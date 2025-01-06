<template lang="">
    <div
        class="fixed top-0 left-0 right-0 bottom-0 bg-blur flex justify-center items-center z-50"
        @click.self.stop="!loading && $emit('close')"
        @keyup.escape="!loading && $emit('close')"
    >
        <div
            class="modal-body modal-glass relative flex flex-col justify-center px-5 md:px-10 py-5 pt-5"
        >
            <button
                class="absolute -top-2 -right-2 bg-primary dark:text-gray-dark text-white rounded-full p-1.5 text-xs"
                @click.stop="$emit('close')"
                :disabled="loading"
                alt="Cancel"
            >
                <IconClose width="8px" height="8px" />
            </button>

            <div class="gap-5 flex flex-col items-center">
                <IconSuccess width="100px" v-if="type == MODAL.SUCCESS" />
                <IconError width="100px" v-if="type == MODAL.ERROR" />
                <IconWarning width="100px" v-if="type == MODAL.WARNING" />
                <IconQuestion
                    width="100px"
                    v-if="type == MODAL.CONFIRM"
                    hidden
                />
                <IconLogout
                    width="100px"
                    class="text-primary"
                    v-if="type == MODAL.LOGOUT"
                />

                <div
                    class="grid gap-1 content-start w-full max-h-[60vh] overflow-auto"
                >
                    <h2
                        class="text-primary text-base font-bold text-center"
                        :class="type == MODAL.ERROR ? '' : 'hidden'"
                    >
                        {{ content }}
                    </h2>

                    <p
                        class="text-center text-sm font-semibold dark:text-white text-gray-dark text-elipsis elipsis-3"
                        :title="subcontent"
                        v-if="subcontent"
                    >
                        {{ subcontent }}
                    </p>
                </div>

                <slot
                    name="content"
                    v-if="type == MODAL.CONFIRM || type == MODAL.LOGOUT"
                ></slot>

                <div
                    class="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3 md:gap-4 items-center justify-end"
                    v-if="
                        (type == MODAL.CONFIRM || type == MODAL.LOGOUT) &&
                        !$slots.action
                    "
                >
                    <button
                        class="btn btn-md btn-tertiary w-full md:w-36 justify-center"
                        @click.stop="$emit('close')"
                        :disabled="loading"
                        alt="Cancel"
                    >
                        Tidak
                    </button>
                    <button
                        class="btn btn-md btn-primary w-full md:w-36 justify-center gap-4"
                        @click.stop="!loading && $emit('proses')"
                        :disabled="loading"
                        id="confirm_yes"
                        alt="Confirm"
                    >
                        Iya
                        <BounceLoaderVue
                            :loading="loading"
                            :color="'white'"
                            :size="'20px'"
                            class="absolute right-3"
                        ></BounceLoaderVue>
                    </button>
                </div>

                <slot
                    name="action"
                    v-if="type == MODAL.CONFIRM || type == MODAL.LOGOUT"
                ></slot>
            </div>
        </div>
    </div>
</template>

<script>
import IconClose from "../icons/action/IconClose.vue";
import IconSuccess from "../icons/modal/IconSuccess.vue";
import IconError from "../icons/modal/IconError.vue";
import IconWarning from "../icons/modal/IconWarning.vue";
import IconQuestion from "../icons/modal/IconQuestion.vue";
import IconLogout from "../icons/modal/IconLogout.vue";

import BounceLoaderVue from "vue-spinner/src/BounceLoader.vue";

import { MODAL } from "@/store/states/modalState";
import Loading from "@/controllers/state/LoadingController";

export default {
    data() {
        return {
            MODAL,
        };
    },
    components: {
        IconSuccess,
        IconError,
        IconWarning,
        IconQuestion,
        IconLogout,
        IconClose,
        BounceLoaderVue,
    },
    watch: {
        selected(newVal, oldVal) {
            this.data_selected = newVal;
        },
    },
    props: {
        content: {
            type: String,
            default: "Success",
        },
        type: {
            type: String,
            default: "success",
        },
        subcontent: {
            type: String,
            default: "",
        },
    },
    computed: {
        loading() {
            return Loading.get();
        },
    },
    methods: {
        selectHandler(value) {
            this.data_selected = value;
            this.$emit("selected", this.data_selected);
        },
        btnYesFocus() {
            const btnYes = document.getElementById("confirm_yes");
            if (btnYes) {
                btnYes.focus();
            }
        },
        closeModal(e) {
            if (e.key == "Escape" && !this.loading) this.$emit("close");
        },
    },
    mounted() {
        this.btnYesFocus();
        document.body.addEventListener("keydown", this.closeModal);
    },
    unmounted() {
        document.body.removeEventListener("keydown", this.closeModal);
    },
};
</script>

<style lang="scss" scoped>
.modal-glass {
    background: linear-gradient(
        148.05deg,
        rgba(255, 255, 255, 0.8) 9.93%,
        rgba(255, 255, 255, 0.5) 91.86%
    );
    backdrop-filter: blur(10px);
}
.modal-body {
    @apply w-full max-w-md dark:bg-gray-dark bg-white border border-solid rounded-xl border-primary;

    .btn-close-modal {
        @apply bg-gray-dark text-white rounded-full p-1 w-6 h-6 flex justify-center items-center -top-2 -right-2 absolute;
    }
}
</style>
