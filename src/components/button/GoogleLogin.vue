<template lang="">
    <div id="google_btn"></div>
</template>
<script>
export default {
    data() {
        return {
            btn: null,
            readyState: false,
        };
    },
    watch: {
        readyState() {
            this.initialGoogleLogin();

            const btn = document.querySelector("[role=button]");
            this.btn = btn;
        },
    },
    expose: ["btn"],
    props: {
        success: {
            type: Function,
            default: function () {},
        },
        params: {
            type: Object,
            required: true,
            default: function () {
                return {};
            },
        },
        renderParams: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    methods: {
        initialGoogleLogin() {
            try {
                google.accounts.id.initialize({
                    ...this.params,
                    callback: this.success,
                });

                const parent = document.getElementById("google_btn");
                google.accounts.id.renderButton(parent, this.renderParams);
            } catch (error) {
                console.error(error, "error google initial");
                this.$emit("error", error);
            }
        },
    },
    created() {
        try {
            let googleLoginScript = document.createElement("script");
            googleLoginScript.setAttribute(
                "src",
                "https://accounts.google.com/gsi/client"
            );

            googleLoginScript.async = true;
            googleLoginScript.defer = true;
            googleLoginScript.onload = () => {
                this.readyState = true;
            };

            document.head.appendChild(googleLoginScript);
        } catch (error) {
            console.error(error, "error google login");
        }
    },
    mounted() {},
};
</script>
<style lang=""></style>
