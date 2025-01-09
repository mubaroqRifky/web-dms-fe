<template>
    <div class="relative min-w-52">
        <label
            class="input-wrapper"
            :class="[
                invalid?.message
                    ? 'danger focus-error'
                    : 'primary focus-primary',
                dir == 'col'
                    ? 'grid gap-1 content-start items-center'
                    : 'grid sm:flex sm:gap-4',
            ]"
        >
            <span
                class="input-label"
                :class="[dir != 'col' && 'w-52 mt-1']"
                v-if="label"
            >
                {{ label }}
                <i v-if="required" class="text-danger">*</i>
            </span>

            <div class="w-full">
                <v-select
                    :label="optionLabel"
                    :reduce="reduce"
                    :placeholder="placeholder"
                    :options="options"
                    :loading="loadingData"
                    :disabled="disabled"
                    :clearable="!loadingData"
                    :get-option-key="getOptionKey"
                    :multiple="multiple"
                    :position="'auto'"
                    v-model="value"
                    :close-on-select="closeOnSelect"
                    :dropdown-should-open="dropdownShouldOpen"
                    @open="onOpen"
                    @close="onClose"
                    @search="onSearch"
                    @option:selected="selectedHandler"
                >
                    <template #option="item">
                        <p class="whitespace-break-spaces">
                            {{ item[optionLabel] }}
                        </p>
                    </template>
                    <template #selected-option="item">
                        <p :title="item[optionLabel]" class="flex-1">
                            {{ item[optionLabel] }}
                        </p>
                    </template>
                    <template #no-options>
                        <p>Sorry, no matching options.</p>
                    </template>
                    <template v-if="mode == 'server'" #list-footer>
                        <li
                            v-show="hasNextPage"
                            ref="load"
                            class="loader px-5 text-gray flex"
                        >
                            Loading more options...
                        </li>
                    </template>
                    <template #spinner="{ loading }">
                        <div
                            v-if="loading"
                            class="vs__spinner w-4 h-4 border-l-primary"
                        >
                            The .vs__spinner class will hide the text for me.
                        </div>
                    </template>
                </v-select>

                <p v-if="!noValidity" class="text-danger text-[.6rem] -mt-0.5">
                    {{ invalid?.message || "&nbsp;" }}
                </p>
            </div>
        </label>
    </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, watch, defineModel } from "vue";

const props = defineProps({
    mode: {
        type: String,
        default: "client",
    },
    dir: {
        type: String,
        default: "row",
    },
    label: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    noValidity: {
        type: Boolean,
        default: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    closeOnSelect: {
        type: Boolean,
        default: true,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    dropdownShouldOpen: {
        type: Function,
        default({ noDrop, open, mutableLoading }) {
            return noDrop ? false : open && !mutableLoading;
        },
    },
    hasNextPage: {
        type: Boolean,
        default: false,
    },
    total: {
        type: Number,
        default: 0,
    },
    options: {
        type: Array,
        default: function () {
            return [];
        },
    },
    optionLabel: {
        type: String,
        default: "text",
    },
    optionKey: {
        type: String,
        default: "value",
    },
    reduce: {
        type: Function,
        default: function (val) {
            return val;
        },
    },
    getOptionKey: {
        type: Function,
        default(option) {
            if (typeof option === "object" && option.id) {
                return option.id;
            } else {
                try {
                    return JSON.stringify(option);
                } catch (e) {
                    return null;
                }
            }
        },
    },
    error: {
        default: function () {
            return {};
        },
    },
});

const validity = ref(props.error);
const invalid = computed({
    get: () => validity.value,
    set: () => (validity.value = {}),
});

const loadingData = ref(props.loading);
watch(
    () => props.loading,
    async (newValue) => {
        await nextTick();
        loadingData.value = newValue;
        if (load.value) observer.value.observe(load.value);
    },
    {
        deep: true,
    }
);

watch(
    () => props.error,
    (value) => {
        if (typeof value == "string") {
            validity.value = { message: value };
        } else {
            validity.value = value;
        }
    }
);

const emit = defineEmits([
    "open",
    "close",
    "search",
    "cleared",
    "scrolling",
    "option:selected",
    "option:deselected",
]);

const hasNextPage = computed(() => {
    return props.total > props.options.length;
});

const load = ref(null);
const observer = ref(null);

const onOpen = async () => {
    if (hasNextPage.value && props.mode == "server") {
        await nextTick();
        observer.value.observe(load.value);
    }
};
const onClose = () => {
    if (props.mode == "server") {
        observer.value.disconnect();
    }
};
const onSearch = async (value, loading) => {
    emit("search", value, loading);
};
const infiniteScroll = async ([{ isIntersecting, target }]) => {
    if (isIntersecting && props.mode == "server") {
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        ul.scrollTop = scrollTop;
        await nextTick();
        emit("scrolling");
    }
};

const value = defineModel();

const selectedHandler = (value) => {
    emit("option:selected", value);
};

watch(
    () => props.mode,
    (newValue) => {
        if (newValue == "server") {
            observer.value = new IntersectionObserver(infiniteScroll);
        } else {
            observer.value.disconnect();
        }
    }
);

watch(value, (newValue) => {
    if (Array.isArray(newValue)) {
        if (!newValue.length) emit("cleared");
    } else {
        if (!newValue) emit("cleared");
    }
    validity.value = {};
});

onMounted(() => {
    if (props.mode == "server") {
        observer.value = new IntersectionObserver(infiniteScroll);
    }
});
</script>

<style lang="scss">
.input-wrapper {
    .v-select {
        background: white;
        box-shadow: 0 0 5px -2px #d2a92a;
        border-radius: 5px;

        .vs__selected-options {
            @apply relative min-h-7;

            .vs__search {
                @apply absolute top-0 left-0 right-0 bottom-0 w-full z-[0];
            }
        }

        .vs__dropdown-toggle {
            width: 100%;
            border-radius: 0.375rem;
            border-width: 1px;
            border-color: var(--primaryOutline);
            padding: 4px 5px;
            outline: 2px solid transparent;
            outline-style: solid;
            outline-offset: 1.5px;

            input::placeholder {
                color: #9ca3af;

                &:focus {
                    box-shadow: 0 0 5px 0px #d2a92a;
                }
            }
        }
    }

    .vs--disabled {
        > div {
            background: var(--lightGray);
        }

        .vs__dropdown-toggle {
            border-color: var(--gray);
        }

        .vs__open-indicator {
            background: var(--lightGray);
        }
    }

    .vs__selected {
        pointer-events: none;
        z-index: 1;

        button {
            pointer-events: visible;
        }
    }
}
</style>
