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
            ]"
        >
            <span class="input-label" v-if="label">
                {{ label }}
                <i v-if="required" class="text-danger">*</i>
            </span>
            <div class="flex gap-2 items-center p-0">
                <div
                    class="relative border border-solid dark:border-primary border-primary w-5 h-5 rounded-sm flex justify-center items-center dark:text-gray-dark text-white"
                    :class="value == valueTrue ? 'bg-primary' : ''"
                >
                    <input
                        hidden
                        type="checkbox"
                        :checked="value == valueTrue"
                        :disabled="disabled"
                        @change="inputHandler"
                    />
                    <IconCheck width="16px" />
                </div>
                <span>
                    {{ placeholder }}
                </span>
            </div>
        </label>

        <p v-if="!noValidity" class="text-danger text-[.6rem] -mt-0.5">
            {{ invalid?.message || "&nbsp;" }}
        </p>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import IconCheck from "@/components/icons/action/IconCheck.vue";

const emit = defineEmits(["update:value"]);

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
    error: {
        default: function () {
            return {};
        },
    },
    valueTrue: {
        default: true,
    },
    valueFalse: {
        default: false,
    },
    value: {
        default: false,
    },
});

const validity = ref(props.error);
const invalid = computed({
    get: () => validity.value,
    set: () => (validity.value = {}),
});

watch(
    () => props.value,
    () => (invalid.value = {})
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

const inputHandler = (e) => {
    const value = e.target.checked ? props.valueTrue : props.valueFalse;
    emit("update:value", value);
};
</script>

<style lang="scss" scoped>
.input-base {
    @apply px-2 py-[.4rem] w-full outline-none border border-lightGray rounded-md outline outline-offset-[1.5px];
}

.input-wrapper {
    @apply grid gap-1 content-start items-center text-xs w-full md:min-w-[14rem];

    &.primary {
        input,
        textarea {
            &:disabled {
                @apply bg-softGray;
            }
        }
    }

    &.danger {
        input,
        textarea {
            @apply border-danger;

            &:disabled {
                @apply bg-softGray;
            }
        }
    }

    &.focus-primary {
        input,
        textarea {
            &.input-base:focus {
                @apply outline-primaryOutline border-primaryDark;

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
        @apply text-[.7rem] whitespace-normal font-semibold;
    }
}
</style>
