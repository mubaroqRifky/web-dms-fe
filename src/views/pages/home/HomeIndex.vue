<template>
    <div class="flex flex-col gap-8 w-full h-full">
        <section class="grid lg:grid-cols-2 gap-4">
            <div class="pdf-container scroll-hidden">
                <embed :src="docs + '#toolbar=0&navpanes=0&scrollbar=0'" />
                <div class="pdf-overlay" @click.self="preview = true"></div>
                <div v-if="preview" class="bg-blur pdf-preview">
                    <div class="w-full h-full">
                        <embed :src="docs" width="100%" height="100%" />
                    </div>
                    <button class="btn-close-frame" @click="preview = false">
                        <IconClose />
                    </button>
                </div>
            </div>

            <div
                class="flex flex-col justify-between w-full gap-8 p-4 bg-primary management-section"
                :class="loadData ? 'skeleton' : ''"
            >
                <div class="flex justify-center px-5 slogan" v-if="!loadData">
                    <span> " </span>
                    <h3
                        class="text-center text-2xl font-semibold"
                        :contenteditable="isCanEdit"
                    >
                        {{
                            data?.message || "Management Message is placed here"
                        }}
                    </h3>
                    <span> " </span>
                </div>
                <div class="stakeholder-container">
                    <div
                        class="flex flex-col items-center justify-center gap-2"
                    >
                        <div v-if="!loadData" class="photo">
                            <img :src="data?.boardname1?.url || avatar" />
                        </div>
                        <div v-if="!loadData">
                            <p class="name">
                                {{
                                    data?.boardname1?.boardname ||
                                    "Hendri Laiman"
                                }}
                            </p>
                            <p class="position">
                                {{
                                    data?.boardname1?.boardtitle ||
                                    "Board of Director"
                                }}
                            </p>
                        </div>
                    </div>
                    <div
                        class="flex flex-col items-center justify-center gap-2"
                    >
                        <div v-if="!loadData" class="photo">
                            <img
                                v-if="!loadData"
                                :src="data.boardname2?.url || avatar"
                            />
                        </div>
                        <div v-if="!loadData">
                            <p class="name">
                                {{ data?.boardname2?.boardname }}
                            </p>
                            <p class="position">
                                {{ data?.boardname2?.boardtitle }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="flex-1 grid content-start grid-cols-2 gap-x-4 gap-y-4 mt-2"
            style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))"
        >
            <div
                class="rounded-xl h-32 flex flex-col justify-between p-4 dark:text-gray-dark text-white cursor-pointer"
                :class="loadData ? 'skeleton opacity-70' : ''"
                v-for="(item, index) in items"
                :key="index"
                :style="{ background: getBackground(item.kd_reff) }"
                @click="goToDocument(item)"
            >
                <div class="flex gap-3 items-center">
                    <div class="flex flex-col gap-2">
                        <IconMenuDocs v-if="!loadData" />
                        <h2 class="max-w-48 leading-4 text-sm">
                            {{ item.nm_reff }}
                        </h2>
                    </div>
                </div>
                <h3 class="text-6xl leading-[3rem] font-semibold text-right">
                    {{ item.count }}
                </h3>
            </div>
        </section>

        <div class="grid content-start flex-1">
            <h3 class="font-semibold text-sm">Terakhir Dilihat</h3>
            <div
                class="p-2 text-xs grid content-start gap-2 max-h-full overflow-auto scrollbar-secondary mb-8"
            >
                <article
                    v-if="loadData"
                    class="bg-white pt-2 px-2 relative shadow-md border-l-4 border-solid border-primary"
                    v-for="(v, i) in 7"
                    :key="i"
                >
                    <p class="skeleton max-w-52"></p>
                    <p class="skeleton max-w-24"></p>
                </article>
                <article
                    v-else
                    class="bg-white pt-2 pb-2 px-2 min-h-12 relative shadow-md border-l-4 border-solid border-primary"
                    v-for="(item, index) in last_seen"
                    :key="index"
                >
                    <p>
                        {{ item }}
                    </p>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
import IconMenuDocs from "@/components/icons/menu/IconMenuDocs.vue";
import IconClose from "@/components/icons/action/IconClose.vue";
import Dashboard from "@/apis/Dashboard";
import docs from "@/assets/docs/policy.pdf";

export default {
    data() {
        return {
            data: {},
            loadData: true,
            last_seen: [],
            items: [],
            docs,
            preview: false,
            avatar: null,
        };
    },
    components: { IconMenuDocs, IconClose },
    computed: {
        isCanEdit() {
            return false;
        },
    },
    methods: {
        getBackground(key) {
            if (this.loadData) return "#e9ce6c";

            switch (key) {
                case "MN":
                    return "#d2a92a";
                case "PS":
                    return "#1dc8b3";
                case "KB":
                    return "#578df6";
                case "OS":
                    return "#f97f7f";
                case "QC":
                    return "#e74949";
                default:
                    return "#2ad251";
            }
        },
        async getDataDashboard() {
            try {
                this.loadData = true;
                const { data } = await Dashboard.index();
                this.data = data;
                this.last_seen = data.last_seen;
                this.items = data.documents;
            } catch (error) {
                throw new ErrorHandler(error);
            } finally {
                this.loadData = false;
            }
        },
        goToDocument(item) {
            this.$router.push({
                name: "document",
                query: {
                    form: [item.kd_reff],
                },
            });
        },
    },
    created() {
        this.items = Array.from({ length: 3 }).map(() => ({}));
    },
    mounted() {
        this.getDataDashboard();
    },
};
</script>

<style lang="scss" scoped>
.pdf-container {
    position: relative;
    width: 320px;
    height: 240px;
    overflow: auto;

    > embed {
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
        width: 300px;
        height: 424px;
        margin: 5px;
    }

    @media only screen and (max-width: 1024px) {
        width: 100%;

        embed {
            width: 100%;
        }
    }
}
.pdf-overlay {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: pointer;
}
.pdf-preview {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn-close-frame {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #323639;
    color: white;
    position: absolute;
    top: 0.8rem;
    right: 1.05rem;
    z-index: 11111;
    border-radius: 100%;

    &:hover {
        background: #44484c;
    }
}

.management-section {
    .slogan {
        margin: auto;

        span {
            font-size: 2rem;
            font-weight: bold;
            margin: 0 -0.1rem;
        }
    }

    .stakeholder-container {
        display: flex;
        justify-content: space-between;

        .photo {
            width: 50px;
            height: 50px;
            border-radius: 100%;
            background: gray;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .name {
            font-weight: bold;
            font-size: 1rem;
            line-height: 1rem;
            margin: 0;
            text-align: center;
        }
        .position {
            font-size: 1rem;
            line-height: 1rem;
            margin: 0;
            text-align: center;
        }
    }
}
</style>
