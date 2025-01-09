<template>
    <span
        v-if="open && view != 'desktop'"
        class="bg-blur fixed top-0 left-0 right-0 bottom-0 z-20"
        @click="SidebarController.close()"
    />

    <aside
        class="flex flex-col text-xs transition-all dark:bg-softGray bg-white z-20 top-0 bottom-0 rounded-tr-3xl shadow-2xl"
        :class="open ? 'w-[15rem]' : 'w-[5rem]'"
        :style="styleContainer"
        @mouseover="!open && mouseHandler('open')"
        @mouseleave="open && mouseHandler('close')"
    >
        <div
            class="flex gap-2 items-center px-6 pt-4 pb-4 cursor-pointer text-primary overflow-hidden"
            :class="open ? 'justify-start' : 'justify-center'"
            @click="$router.push('/')"
        >
            <IconMain width="45px" height="45px" />
            <article class="flex flex-col" v-if="open">
                <h1
                    class="uppercase font-bold text-lg leading-5 whitespace-nowrap"
                >
                    Document
                </h1>
                <p class="text-xs leading-3 whitespace-nowrap">
                    Management System
                </p>
            </article>
        </div>

        <ul class="list-container scrollbar-secondary">
            <template v-for="(item, index) in menu_filtering" :key="index">
                <template v-if="item.child">
                    <div
                        class="parent-container"
                        :class="
                            isMenuActive(item)
                                ? 'dark:bg-primaryTransparent bg-primaryLight'
                                : ''
                        "
                    >
                        <ListMenuVue
                            :item="item"
                            :open="open"
                            @press="showChildHandler(item)"
                        />
                        <div
                            :style="
                                isMenuActive(item)
                                    ? '--height: 100%'
                                    : '--height: 0px'
                            "
                            class="child-container transition-all"
                            :class="isMenuActive(item) ? 'mt-2' : 'mt-0'"
                        >
                            <ul
                                class="flex-1 flex flex-col gap-2 overflow-hidden h-full"
                            >
                                <template
                                    v-for="(child, i) in item.child"
                                    :key="i"
                                >
                                    <ChildMenuVue
                                        v-if="rulePermitMenu(child.permit)"
                                        :item="child"
                                        :open="open"
                                    />
                                </template>
                            </ul>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <ChildMenuVue
                        v-if="rulePermitMenu(item.permit)"
                        :item="item"
                        :open="open"
                    />
                </template>
            </template>
        </ul>
    </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import menu from "@/static/menu";
import IconMain from "@/components/icons/page/IconMain.vue";
import SidebarController from "@/controllers/state/SidebarController.js";
import ListMenuVue from "@/components/sidebar/ListMenu.vue";
import ChildMenuVue from "@/components/sidebar/ChildMenu.vue";

const list_menu = ref(menu);
const route = useRoute();

const showChildHandler = (menu) => {
    menu.show = !menu.show;
};

let props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

const isCurrentOpen = ref(!props.open);

const mouseHandler = (type) => {
    if (type == "open") {
        SidebarController.open();
        isCurrentOpen.value = true;
    } else if (type == "close" && isCurrentOpen.value) {
        SidebarController.close();
        isCurrentOpen.value = false;
    }
};

const view = computed(() => {
    return SidebarController.get().view;
});

const styleContainer = computed(() => {
    const position = view.value != "desktop" ? "fixed" : "relative";
    const transform =
        view.value == "mobile" && !props.open
            ? "translateX(-100%)"
            : "translateX(0)";

    return {
        transition: "all .25s ease",
        position,
        transform,
    };
});

const setViewMobile = (windowElement) => {
    if (windowElement.innerWidth > 768) {
        SidebarController.view("desktop");
    } else if (windowElement.innerWidth > 425) {
        SidebarController.view("tablet");
        SidebarController.close();
    } else {
        SidebarController.view("mobile");
        SidebarController.close();
    }
};
const resizeHandler = (evt) => {
    setViewMobile(evt.target);
};

const isMenuActive = (item) => {
    return item.show || route.name.match(item.name);
};

const {
    appContext: { config },
} = getCurrentInstance();

const rulePermitMenu = (permit) => {
    if (!permit || !permit.length) return true;

    if (typeof permit == "object" && permit.hasOwnProperty("length")) {
        return config.globalProperties.can(...permit);
    } else if (typeof permit == "string") {
        return config.globalProperties.can(permit);
    }

    return false;
};

const menu_filtering = computed(() => {
    const menu = list_menu.value.filter((item) => {
        const result = !item.child
            ? rulePermitMenu(item.permit)
            : item.child.some((val) => rulePermitMenu(val.permit));

        return result;
    });

    return menu;
});

onMounted(() => {
    window.addEventListener("resize", resizeHandler);
    setViewMobile(window);
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
});
</script>

<style lang="scss">
.list-container {
    @apply grid content-start flex-1 flex-col pt-4 pb-4 overflow-y-auto gap-2 text-gray-dark;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        max-width: 240px;
        height: 200px;
        background-image: url("../../assets/bg-motif.svg");
        background-repeat: no-repeat;

        @media only screen and (max-width: 426px) {
            bottom: -2em;
        }

        @media only screen and (max-width: 768px) {
            max-width: 85px;
        }
    }
}
.parent-container {
    @apply flex flex-col;
}
.child-container {
    height: var(--height);
}

.list-menu {
    a {
        &.router-link-active,
        &.router-link-exact-active {
            background: linear-gradient(
                90deg,
                rgba(210, 169, 42, 0.1) 50%,
                rgba(210, 169, 42, 0.0590674) 66.61%,
                rgba(210, 169, 42, 0.0481064) 69.2%,
                rgba(210, 169, 42, 0) 83.39%
            );
            color: #d2a92a;
        }
    }

    @apply transition-all cursor-pointer flex items-center;

    &:hover {
        @apply text-primary dark:bg-primaryLight;
        background: linear-gradient(
            90deg,
            rgba(210, 169, 42, 0.1) 50%,
            rgba(210, 169, 42, 0.0590674) 66.61%,
            rgba(210, 169, 42, 0.0481064) 69.2%,
            rgba(210, 169, 42, 0) 83.39%
        );
        span {
            @apply font-medium;
        }
    }

    &.show {
        @apply whitespace-nowrap;

        > a {
            @apply px-6 py-3;
        }
    }

    &.close {
        @apply justify-center;

        > a {
            @apply px-3.5 py-3;
        }
    }

    > a {
        @apply flex items-center gap-2 flex-1;

        &:focus {
            @apply outline-none;
            background: linear-gradient(
                90deg,
                rgba(210, 169, 42, 0.1) 50%,
                rgba(210, 169, 42, 0.0590674) 66.61%,
                rgba(210, 169, 42, 0.0481064) 69.2%,
                rgba(210, 169, 42, 0) 83.39%
            );
            color: #d2a92a;
        }
    }

    span {
        @apply font-normal;
    }
}
</style>
