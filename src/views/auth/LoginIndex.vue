<template lang="">
    <div class="width-constraint bg-primaryLight">
        <section
            class="flex items-center justify-center lg:gap-6 px-4 md:px-8 h-full"
        >
            <div
                class="bg-white-blur w-full max-w-sm text-center grid gap-6 content-center items-center justify-items-center px-4 md:px-8 py-8 rounded-2xl"
            >
                <div class="flex flex-col gap-1 justify-center items-center">
                    <div class="w-20 h-16">
                        <img
                            :src="logoCpp"
                            class="w-full h-full object-contain"
                        />
                    </div>
                    <h1
                        class="text-xl text-primary uppercase font-bold tracking-widest leading-6 w-72 mt-2"
                    >
                        Selamat Datang
                    </h1>
                </div>

                <div class="grid gap-2 text-left w-full">
                    <BasicInput
                        placeholder="email"
                        v-model="form.email"
                        @keyup.enter="form.email && loginManualHandler()"
                        :error="errors.email"
                        :disabled="loading"
                    />
                    <BasicInput
                        placeholder="password"
                        type="password"
                        v-model="form.password"
                        @keyup.enter="form.password && loginManualHandler()"
                        :error="errors.password"
                        :disabled="loading"
                    />
                    <button
                        class="btn btn-md btn-primary"
                        :disabled="loading"
                        @click="loginManualHandler"
                    >
                        Masuk
                    </button>
                </div>

                <p class="text-center text-darkGray text-sm -my-4">or</p>

                <div class="text-black flex justify-center">
                    <button
                        class="google-btn shadow-primary whitespace-nowrap"
                        alt="Sign In"
                        @click="googleLoginHandler"
                        :disabled="loading"
                    >
                        <IconGoogle width="20px" height="20px" />
                        Masuk dengan Google
                        <MoonLoader
                            :loading="loading"
                            :size="'20px'"
                            class="absolute right-4 text-primaryDark"
                        ></MoonLoader>
                    </button>

                    <GoogleLogin
                        ref="ref_btn"
                        class="hidden"
                        :params="params"
                        :renderParams="renderParams"
                        :success="onsuccess"
                    />
                </div>

                <p class="text-[.6rem] text-darkGray max-w-[18rem]">
                    Copyright © 2024 PT Central Proteina Prima Tbk (CPPrima).
                    All Right Reserved.
                </p>
            </div>
        </section>

        <Transition name="ghost">
            <ModalMain
                v-if="getModalState.show"
                :type="getModalState.type"
                :content="getModalState.content"
                :subcontent="getModalState.subcontent"
                @close="closeModalHandler"
                @proses="getModalState.onconfirm"
            />
        </Transition>
    </div>
</template>

<script>
import IconGoogle from "@/components/icons/page/IconGoogle.vue";
import GoogleLogin from "@/components/button/GoogleLogin.vue";
import Authenticate from "@/apis/Authenticate";
import Modal from "@/controllers/state/ModalController";
import Loading from "@/controllers/state/LoadingController";
import InputValidationController from "@/controllers/state/InputValidationController";
import User from "@/controllers/auth/UserController";
import UserGoogle from "@/controllers/auth/UserGoogleController";
import MoonLoader from "vue-spinner/src/MoonLoader.vue";
import logoCpp from "@/assets/images/logoCpp.png";
import { jwtVerify } from "@/helpers/JwtDecode";

export default {
    data() {
        return {
            logoCpp,
            params: {
                client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
            },
            renderParams: {
                width: 250,
                height: 50,
                longtitle: true,
            },
            form: {
                email: "",
                password: "",
            },
        };
    },
    components: {
        IconGoogle,
        GoogleLogin,
        MoonLoader,
    },
    computed: {
        loading: () => Loading.get(),
        getModalState: () => Modal.get(),
        closeModalHandler: () => Modal.close,
        errors: () => InputValidationController.get(),
    },
    methods: {
        googleLoginHandler() {
            try {
                const btn = this.$refs?.ref_btn?.btn;
                if (btn) btn.click();
                else throw new Error("Hey Login Google Belum Siap!");
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async onsuccess(response) {
            try {
                const id_token = response.credential;
                this.loginHandler(id_token);
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async loginHandler(id_token) {
            try {
                const tokenParse = await jwtVerify(id_token);
                const { data } = await Authenticate.login({
                    email: tokenParse.email,
                    id_token,
                });
                localStorage.setItem("email", tokenParse.email);
                User.set(data.token);
                UserGoogle.set(id_token);
                this.$router.push({ path: "/" });
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        async loginManualHandler() {
            try {
                const { data } = await Authenticate.loginManual({
                    ...this.form,
                    username: this.form.email,
                });
                localStorage.setItem("email", this.form.email);
                User.set(data.token);
                const path = decodeURIComponent(
                    this.$route.query.redirect || "/"
                );
                this.$router.push(path);
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.google-btn {
    @apply w-full px-12 py-2 rounded-md outline-none flex gap-2 items-center justify-center justify-items-center  hover:bg-primary hover:text-white transition-all hover:border-primary bg-white text-sm;
}

.shadow-primary {
    box-shadow: 1px 2px 10px -4px gray;
}
</style>
