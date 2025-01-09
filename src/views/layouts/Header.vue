<template>
    <header
        class="px-6 py-4 flex gap-8 items-center text-sm justify-between text-gray-dark transition-all"
        :class="{
            'bg-white shadow-lg': isScrolled,
            'bg-primaryDark': view == 'mobile',
        }"
    >
        <div class="flex items-center gap-4 text-xs">
            <button
                @click="$emit('press')"
                class="btn-header"
                :class="
                    view == 'mobile' && !isScrolled
                        ? 'btn-mobile-header'
                        : 'btn-default-header'
                "
            >
                <IconBar width="20px" height="20px" />
            </button>

            <section
                class="hidden sm:flex gap-2 items-center"
                v-if="view != 'mobile'"
            >
                <div
                    class="w-8 h-8 rounded-full overflow-hidden border border-solid border-primary"
                >
                    <img
                        :src="user_img"
                        :srcset="user_img"
                        alt="User Image"
                        referrerpolicy="no-referrer"
                        class="w-full h-full object-contain"
                    />
                </div>
                <div class="whitespace-nowrap">
                    <span class="font-semibold text-sm leading-3">
                        {{ user?.name }}
                    </span>
                    <p class="text-[.7rem] leading-3 text-darkGray">
                        {{ getRole }}
                    </p>
                </div>
            </section>
        </div>

        <section class="flex gap-4 items-center" v-if="user">
            <label
                v-if="false"
                class="w-80 hidden lg:flex items-center gap-2 rounded-lg shadow-xl border border-solid border-softGray px-4 py-2 text-darkGray dark:bg-gray-dark bg-white"
            >
                <input
                    type="search"
                    class="flex-1 outline-none"
                    placeholder="Advance Search"
                />
                <button class="hover:text-primary">
                    <IconSearch width="18px" height="18px" />
                </button>
            </label>

            <div
                class="ml-1.5 flex items-center"
                v-if="role('ADMINISTRATOR') && darkmode"
            >
                <button v-if="mode == 'dark'" @click="changeMode('light')">
                    <IconSun width="20px" height="20px" />
                </button>
                <button v-else @click="changeMode('dark')">
                    <IconMoon width="20px" height="20px" />
                </button>
            </div>

            <label
                class="flex gap-2 items-center mx-4"
                v-if="role('ADMINISTRATOR') && enable_maintenance"
            >
                <div class="switch">
                    <input
                        type="checkbox"
                        v-model="maintenance"
                        @change="handleSwitch"
                    />
                    <span class="slider round"></span>
                </div>
                <span class="text-xs pointer-events-none leading-3">
                    Maintenance
                </span>
            </label>

            <div class="relative flex items-center">
                <button
                    @click="showNotifHandler"
                    class="text-white xs:text-primary hover:text-red-light xs:hover:text-primaryDark"
                >
                    <Icon icon="mdi:bell" width="25px" height="25px" />
                </button>

                <section
                    v-if="show_notif"
                    ref="notifContainer"
                    class="absolute mt-2 top-full right-0 flex flex-col rounded-xl shadow-xl min-w-80 min-h-72 bg-white-blur border border-solid border-gray z-10"
                >
                    <div
                        class="px-6 py-4 flex justify-between items-center border-b border-solid border-gray"
                    >
                        <h4 class="font-semibold tracking-widest">
                            NOTIFIKASI
                        </h4>
                        <button
                            class="text-xs font-medium"
                            @click="closeNotifHandler"
                        >
                            Tutup
                        </button>
                    </div>

                    <div
                        class="flex flex-col justify-center items-center max-h-72"
                    >
                        <p
                            v-if="true"
                            class="text-xs text-darkGray text-center mt-6"
                        >
                            Tidak ada notifikasi.
                        </p>
                        <ul
                            v-else
                            class="divide-y divide-solid divide-gray overflow-auto"
                        >
                            <li
                                class="flex gap-4 items-center px-4 py-3 hover:bg-primaryTransparent cursor-pointer"
                                v-for="(item, index) in 10"
                                :key="index"
                            >
                                <div
                                    class="bg-primary rounded-full p-1 w-8 h-8 text-white flex justify-center items-center"
                                >
                                    <IconDocWaiting
                                        width="20px"
                                        height="20px"
                                    />
                                </div>

                                <p class="text-xs leading-3 flex-1">
                                    Document anda telah disetujui oleh
                                    blablablabla blabla.
                                </p>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <button
                @click="connfirmLogout"
                class="btn-header"
                :class="
                    view == 'mobile' && !isScrolled
                        ? 'btn-mobile-header'
                        : 'btn-default-header'
                "
            >
                <IconLogout width="20px" height="20px" />
            </button>
        </section>

        <section class="flex gap-2 items-center" v-else>
            <button
                @click="router.push({ path: '/login' })"
                class="btn-header"
                :class="
                    view == 'mobile'
                        ? 'btn-mobile-header'
                        : 'btn-default-header'
                "
            >
                <p v-if="view != 'mobile'">Sign In</p>
                <IconLogin width="20px" height="20px" />
            </button>
        </section>

        <Transition name="ghost">
            <ModalMain
                v-if="modal.show"
                :type="modal.type"
                :content="modal.content"
                :subcontent="modal.subcontent"
                @close="Modal.close"
                @proses="Modal.onconfirm"
            />
        </Transition>
    </header>
</template>

<script setup>
import {
    ref,
    onMounted,
    onBeforeUnmount,
    computed,
    getCurrentInstance,
} from "vue";
import { useRouter } from "vue-router";
import IconBar from "@/components/icons/action/IconBar.vue";
import IconSearch from "@/components/icons/action/IconSearch.vue";
import IconLogout from "@/components/icons/action/IconLogout.vue";
import IconLogin from "@/components/icons/action/IconLogin.vue";
import IconSun from "@/components/icons/page/IconSun.vue";
import IconMoon from "@/components/icons/page/IconMoon.vue";
import IconDocWaiting from "@/components/icons/page/IconDocWaiting.vue";
import User from "@/controllers/auth/UserController.js";
import UserGoogle from "@/controllers/auth/UserGoogleController.js";
import Modal from "@/controllers/state/ModalController.js";
import Loading from "@/controllers/state/LoadingController.js";
import SidebarController from "@/controllers/state/SidebarController.js";
import ThemeController from "@/controllers/state/ThemeController.js";
import Maintenance from "@/apis/Maintenance.js";
import avatar from "@/assets/images/default.jpg";

const modal = computed(() => {
    return Modal.get();
});
const user = computed(() => {
    return User.get();
});
const google = computed(() => {
    return UserGoogle.get();
});
const date_info = computed(() => {
    let d = new Date();
    let day_options = {
        timeZone: "Asia/Jakarta",
        dateStyle: "full",
    };
    let formatter = new Intl.DateTimeFormat(["id"], day_options);
    return formatter.format(d);
});
const view = computed(() => {
    return SidebarController.get().view;
});
const darkmode = computed(() => {
    return import.meta.env.VITE_ENABLE_DARKMODE;
});
const enable_maintenance = computed(() => {
    return import.meta.env.VITE_ENABLE_MAINTENANCE;
});

const getRole = computed(() => {
    if (user.value.roles?.length) {
        return user.value.roles.join(", ");
    }

    return user.value?.email;
});

const router = useRouter();
const username = ref("");
const user_img = computed(() => {
    return google.value?.picture || avatar;
});

function connfirmLogout() {
    Modal.logout("Yakin ingin logout?");
    Modal.onconfirm = logoutHandler;
}

function logoutHandler() {
    User.remove();
    UserGoogle.remove();
    Modal.onclose = () => {
        window.location.href = "/";
    };

    Loading.start();
    setTimeout(() => {
        Loading.stop();
        Modal.close();
    }, 2000);
}

const {
    appContext: { config },
} = getCurrentInstance();

const mode = ref("light");
if (
    config.globalProperties.role(config.globalProperties.ADMIN) &&
    darkmode.value
) {
    mode.value = $cookies.get("theme") || "light";
}
const changeMode = (theme) => {
    const html = document.querySelector("html");
    const body = document.querySelector("body");
    body.classList.remove("dark");
    body.classList.remove("light");

    if (!body.classList.contains(theme)) body.classList.add(theme);
    if (html.dataset.theme != theme) html.dataset.theme = theme;

    mode.value = theme;
    $cookies.set("theme", mode.value);
    ThemeController.set(mode.value);
};
changeMode(mode.value);

const isScrolled = ref(false);
const elContainer = ref(null);
const interval = ref(null);
const maintenance = ref(false);

const setDate = () => {
    const el = document.getElementById("date_interval");
    const date = new Date();
    let optionsDays = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    let optionsHours = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Jakarta",
    };
    if (el) {
        el.innerText = new Intl.DateTimeFormat("id-ID", optionsDays).format(
            date
        );
        const time = new Intl.DateTimeFormat("id-ID", optionsHours).format(
            date
        );
        el.innerText += " | " + time.replaceAll(".", ":");
    } else {
        clearInterval(interval.value);
    }
};

const handleSwitch = (e) => {
    const { target } = e;
    postMaintenance(target.checked);
};

const postMaintenance = async () => {
    try {
        if (!enable_maintenance.value) return;
        const { data } = await Maintenance.set();
        maintenance.value = data.maintenance;
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const getMaintenance = async () => {
    try {
        if (!enable_maintenance.value) return;
        const { data } = await Maintenance.get();
        maintenance.value = data.maintenance;
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const show_notif = ref(false);
const notifContainer = ref(null);
const timeout_notif = ref(null);
const showNotifHandler = () => {
    show_notif.value = true;
    clearTimeout(timeout_notif.value);

    timeout_notif.value = setTimeout(() => {
        document.addEventListener("click", closeNotifOutsideHandler);
    }, 0);
};

const closeNotifHandler = () => {
    setTimeout(() => {
        document.removeEventListener("click", closeNotifOutsideHandler);
        show_notif.value = false;
    }, 0);
};

const closeNotifOutsideHandler = (e) => {
    const { target } = e || {};

    if (
        notifContainer.value?.contains &&
        !notifContainer.value.contains(target)
    ) {
        closeNotifHandler();
    }
};

onMounted(() => {
    username.value = localStorage.getItem("email");

    const mainContainer = document.querySelector(".main-container");
    if (mainContainer) {
        elContainer.value = mainContainer;
        elContainer.value.addEventListener("scroll", handleScroll);
    }
    setDate();
    interval.value = setInterval(setDate, 1000);

    getMaintenance();
});

onBeforeUnmount(() => {
    if (elContainer.value) {
        elContainer.value.removeEventListener("scroll", handleScroll);
    }

    clearInterval(interval.value);
});

const handleScroll = () => {
    isScrolled.value = elContainer.value.scrollTop > 0;
};
</script>

<style lang="scss" scoped>
.btn-header {
    @apply rounded-md p-1 transition-all outline-none items-center gap-2 text-xs;
}
.btn-mobile-header {
    @apply hover:bg-primaryLight text-white hover:text-primary;
}
.btn-default-header {
    @apply flex hover:bg-primary text-primary hover:text-white;
}
</style>
