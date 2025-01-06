<template>
    <div class="flex w-screen h-screen bg-primaryLight">
        <Sidebar :open="isSidebarOpen" />
        <main
            class="flex-1 flex flex-col text-gray-dark overflow-hidden"
            :class="view != 'desktop' ? 'side-collapse' : ''"
        >
            <Header @press="sidebarHandler" />
            <section
                class="px-6 py-4 flex-1 overflow-auto main-container grid content-start"
            >
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </section>
            <footer
                v-if="false"
                class="px-4 py-2 text-center text-[.7rem] text-darkGray border-t border-solid border-lightGray"
            >
                <p>
                    Copyright © 2024 PT Central Proteina Prima Tbk (CPPrima).
                    All Right Reserved.
                </p>
            </footer>
        </main>
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
    </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

import ModalMain from "@/components/modal/ModalMain.vue";
import Modal from "@/controllers/state/ModalController";
import SidebarController from "@/controllers/state/SidebarController";

export default {
    data() {
        return {
            modal: Modal.get,
        };
    },
    components: { Sidebar, ModalMain, Header },
    computed: {
        isSidebarOpen() {
            return SidebarController.get().open;
        },
        view() {
            return SidebarController.get().view;
        },
    },
    methods: {
        sidebarHandler() {
            if (this.isSidebarOpen) {
                SidebarController.close();
            } else {
                SidebarController.open();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.side-collapse {
    margin-left: 0rem;
    @media only screen and (min-width: 426px) {
        margin-left: 5rem;
    }
}
</style>
