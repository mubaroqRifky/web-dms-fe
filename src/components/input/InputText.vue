<template>
    <div class="flex flex-col relative h-full">
        <label
            class="input-wrapper"
            :class="[
                dir == 'col'
                    ? 'grid gap-1 content-start items-center'
                    : 'grid sm:flex sm:gap-4',
            ]"
        >
            <span
                class="text-[.7rem] whitespace-normal font-medium"
                :class="[dir != 'col' && 'w-52 mt-1']"
                v-if="label"
            >
                {{ label }}
                <i v-if="required" class="text-danger">*</i>
            </span>

            <div class="relative w-full">
                <template
                    v-if="
                        type == 'text' ||
                        type == 'search' ||
                        type == 'number' ||
                        type == 'time'
                    "
                >
                    <input
                        :disabled="disabled"
                        :type="type"
                        class="w-full outline-none border border-solid border-primary"
                        :class="[
                            theme == 'primary'
                                ? `${getPaddingPrimary} ${getRoundedPrimary} text-xs`
                                : `${getPadding} ${getRounded} text-sm`,
                            disabled
                                ? 'bg-lightGray'
                                : `bg-white shadow-[0px_0px_5px_-2px_#d2a92a] hover:shadow-[0px_0px_5px_0px_#d2a92a] `,
                            error && 'input-error',
                        ]"
                        :placeholder="placeholder"
                        v-model="value"
                        :min="min"
                        :max="max"
                        ref="input"
                        @wheel="wheelHandler"
                        @change="handleInputChange"
                    />
                </template>

                <template v-else-if="type == 'tel'">
                    <input
                        :disabled="disabled"
                        :type="type"
                        class="w-full outline-none border border-solid border-primary"
                        :class="[
                            theme == 'primary'
                                ? `${getPaddingPrimary} ${getRoundedPrimary} text-xs`
                                : `${getPadding} ${getRounded} text-sm`,
                            disabled
                                ? 'bg-lightGray'
                                : `bg-white shadow-[0px_0px_5px_-2px_#d2a92a] hover:shadow-[0px_0px_5px_0px_#d2a92a] `,
                            error && 'input-error',
                        ]"
                        :placeholder="placeholder"
                        :value="value"
                        ref="input"
                        @input="validationPhoneNumber"
                        @change="handleInputChange"
                    />
                </template>
                <template v-else-if="type == 'textarea'">
                    <textarea
                        :disabled="disabled"
                        class="w-full outline-none border border-solid border-primary h-full min-h-32 max-h-32"
                        :class="[
                            theme == 'primary'
                                ? `${getPaddingPrimary} ${getRoundedPrimary} text-xs`
                                : `${getPadding} ${getRounded} text-sm`,
                            disabled
                                ? 'bg-lightGray'
                                : `bg-white shadow-[0px_0px_5px_-2px_#d2a92a] hover:shadow-[0px_0px_5px_0px_#d2a92a] `,
                            error && 'input-error',
                        ]"
                        :placeholder="placeholder"
                        v-model="value"
                        rows="5"
                    />
                </template>

                <p
                    v-if="!noValidity"
                    class="text-danger text-[.6rem] -mt-0.5 mx-1 flex-1"
                >
                    {{ error?.message || error || "&nbsp;" }}
                </p>
            </div>
        </label>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineModel } from "vue";

const props = defineProps({
    dir: {
        type: String,
        default: "row",
    },
    type: {
        type: String,
        default: "text",
    },
    theme: {
        type: String,
        default: "primary",
    },
    label: {
        type: String,
        default: "",
    },
    labelColor: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    error: {
        type: String,
        default: "",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    noValidity: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: true,
    },
    size: {
        type: String,
        default: "small",
    },
    min: {
        default: "",
    },
    max: {
        default: "",
    },
});

const value = defineModel();
const emit = defineEmits(["update:error", "update:modelValue", "input:change"]);
const input = ref(null);

defineExpose({ input });

const getPaddingPrimary = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-[.6rem]";
        case "extra-small":
            return "px-3 py-1.5 text-xs";
        default:
            return "px-5 py-3.5";
    }
});
const getRoundedPrimary = computed(() => {
    if (props.rounded) return "rounded-md";
});

const getPadding = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-2.5";
        case "extra-small":
            return "px-3 py-1.5 text-xs";
        default:
            return "px-5 py-3";
    }
});
const getRounded = computed(() => {
    if (props.rounded) return "rounded-xl";
});

watch(
    () => value,
    () => emit("update:error"),
    { deep: true }
);

const validationPhoneNumber = (e) => {
    const { target } = e;
    const regex = new RegExp("[0-9]");

    if (e.data && !regex.test(e.data)) target.value = value.value || "";
    else emit("update:modelValue", target.value);
};

const handleInputChange = (e) => {
    const { target } = e;

    if (props.min) validateMinimumValue(target.value);
    if (props.max) validateMaximumValue(target.value);

    emit("input:change", e);
};

const wheelHandler = (e) => {
    if (props.type == "number") e.preventDefault();
};

const validateMinimumValue = (value) => {
    if (value < props.min) {
        const message = `Nilai tidak boleh kurang dari ${props.min}`;
        emit("update:error", message);
    }
};

const validateMaximumValue = (value) => {
    if (value > props.max) {
        const message = `Nilai tidak boleh lebih dari ${props.max}`;
        emit("update:error", message);
    }
};
</script>

<style lang="scss" scoped>
.input-error {
    border-color: red !important;
    /* outline-color: #ff000038 !important; */
    /* background: #ff00000d !important; */

    /* @apply placeholder:text-danger; */
}
</style>
