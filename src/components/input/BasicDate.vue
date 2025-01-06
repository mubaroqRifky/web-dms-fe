<template>
    <div class="relative">
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
                <VueDatePicker
                    v-model="value"
                    :range="range"
                    :multi-calendars="multiCalendars"
                    :enable-time-picker="false"
                    :auto-apply="true"
                    :auto-position="true"
                    :disabled="disabled"
                    :day-names="[
                        'Sen',
                        'Sel',
                        'Rab',
                        'Kam',
                        'Jum',
                        'Sab',
                        'Min',
                    ]"
                    :format="'dd MMMM yyyy'"
                    :placeholder="placeholder"
                    @update:model-value="selectDateRangeHandler"
                />

                <p v-if="!noValidity" class="text-danger text-[.6rem] -mt-0.5">
                    {{ invalid?.message || "&nbsp;" }}
                </p>
            </div>
        </label>
    </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";

import { ref, nextTick, computed, watch, defineModel } from "vue";

const props = defineProps({
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
    range: {
        type: Boolean,
        default: false,
    },
    multiCalendars: {
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

const emit = defineEmits([]);
const value = defineModel();

watch(value, () => {
    validity.value = {};
});

const selectDateRangeHandler = (date) => {
    try {
        if (!props.range) {
            const formatter = new Intl.DateTimeFormat("fr-CA");
            const result = formatter.format(date);
            value.value = result;
        } else {
            let [from, to] = date;
            if (!to) to = from;

            const formatter = new Intl.DateTimeFormat("fr-CA");
            from = formatter.format(from);
            to = formatter.format(to);

            value.value = [from, to];
        }
    } catch (error) {
        if (props.range) {
            value.value = date || [];
        } else {
            value.value = date;
        }
    }
};
</script>

<style lang="scss">
.input-wrapper {
    .dp__input {
        background: white;
        box-shadow: 0 0 5px -2px #d2a92a;
        border-radius: 0.375rem;
        border-width: 1px;
        border-color: var(--primaryOutline);
        padding: 9.9px 35px 9.9px 35px;
        font-size: 13px;

        &:hover {
            border-color: var(--primaryOutline);
            box-shadow: 0 0 5px 0px #d2a92a;
        }

        &::placeholder {
            color: #9ca3af;
        }
    }
}
</style>
