<template>
    <div class="relative">
        <label
            class="input-wrapper"
            :class="[
                invalid?.message
                    ? 'danger focus-error'
                    : theme == 'primary'
                    ? 'primary focus-primary'
                    : 'primary focus-secondary',
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

            <div class="relative w-full">
                <input
                    v-if="
                        ['text', 'number', 'email', 'password'].includes(type)
                    "
                    :type="type"
                    ref="input"
                    class="input-base"
                    :class="search ? 'pr-7' : ''"
                    :placeholder="placeholder"
                    v-model="value"
                    :disabled="disabled"
                    @keyup.enter="emit('searchEnter')"
                    @change="emit('value:change', value)"
                />

                <input
                    v-else-if="['search'].includes(type)"
                    :type="type"
                    ref="input"
                    class="input-base"
                    :class="search ? 'pr-7' : ''"
                    :placeholder="placeholder"
                    v-model="value"
                    :disabled="disabled"
                    @search="emit('searchEnter')"
                />

                <textarea
                    v-else-if="type == 'textarea'"
                    cols="20"
                    rows="5"
                    class="input-base"
                    :placeholder="placeholder"
                    v-model="value"
                    :disabled="disabled"
                ></textarea>
                <slot v-if="type == 'file'" name="file"></slot>

                <p v-if="!noValidity" class="text-danger text-[.6rem] -mt-0.5">
                    {{ invalid?.message || "&nbsp;" }}
                </p>
            </div>
        </label>

        <IconSearch
            v-if="search"
            className="absolute text-gray right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary"
            width="20px"
            @click="emit('searchEnter')"
        />
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import IconSearch from "@/components/icons/action/IconSearch.vue";

const emit = defineEmits(["searchEnter", "value:change"]);

const props = defineProps({
    required: {
        type: Boolean,
        default: false,
    },
    noValidity: {
        type: Boolean,
        default: false,
    },
    theme: {
        default: "primary",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    search: {
        type: Boolean,
        default: false,
    },
    info: {
        default: "",
    },
    label: {
        default: false,
    },
    type: {
        default: "text",
    },
    placeholder: {
        default: "",
    },
    dir: {
        default: "col",
    },
    error: {
        default: function () {
            return {};
        },
    },
});

const input = ref(null);

defineExpose({ input });

const validity = ref(props.error);
const invalid = computed({
    get: () => validity.value,
    set: () => (validity.value = {}),
});

watch(
    () => props.value,
    () => {
        invalid.value = {};
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

const value = defineModel();

watch(
    () => value.value,
    () => {
        invalid.value = {};
    }
);
</script>

<style lang="scss">
.input-base {
    @apply px-3 py-[.4rem] w-full outline-none border border-primaryOutline rounded-md outline outline-offset-[1.5px] dark:text-white;
    box-shadow: 0 0 5px -2px #d2a92a;
}

.input-wrapper {
    @apply text-sm w-full md:min-w-[14rem];

    input::placeholder,
    textarea::placeholder {
        font-size: 13px;
    }

    &.primary {
        input,
        textarea {
            &:disabled {
                @apply bg-lightGray;
            }
        }
    }

    &.danger {
        input,
        textarea {
            @apply border-danger;

            &:disabled {
                @apply bg-lightGray;
            }
        }

        .vs__search {
            position: absolute !important;
            border: none !important;
        }

        .vs__dropdown-toggle,
        .dp__input_reg {
            border: 1px solid #ca3333 !important;
        }
    }

    &.focus-primary {
        input,
        textarea {
            &.input-base:focus {
                box-shadow: 0 0 5px 0px #d2a92a;

                & + span {
                    @apply text-primary;
                }
            }
        }
    }
    &.focus-secondary {
        input,
        textarea {
            &.input-base:focus {
                @apply outline-secondaryOutline border-secondaryDark;

                & + span {
                    @apply text-secondary;
                }
            }
        }
    }

    &.focus-error {
        input,
        textarea {
            &.input-base:focus,
            &.input-border {
                @apply outline-dangerOutline;
            }
        }
    }

    .input-label {
        @apply text-[.7rem] whitespace-normal font-medium;
    }
}
</style>
