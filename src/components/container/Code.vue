<template lang="">
    <div class="code-container">
        <pre class="terminal">
            <code>
                <slot />
            </code>
        </pre>
        <ButtonCopy @copy="copyHandler" />
    </div>
</template>

<script>
import ButtonCopy from "@/components/button/ButtonCopy.vue";

export default {
    components: {
        ButtonCopy,
    },
    methods: {
        copyHandler(e) {
            // Get the text field
            let textCode = e.previousSibling.firstElementChild.innerText;
            textCode = textCode.replaceAll("$", "").trim();

            // Copy the text inside the text field
            navigator.clipboard.writeText(textCode);
        },
    },
};
</script>

<style lang="scss">
.code-container {
    position: relative;
    overflow: auto;
    font-size: 0.8rem;
    margin: 0.2rem 0 1rem;
}

.terminal {
    @apply dark:bg-primaryTransparent bg-[#292d3e] dark:text-gray-dark;
    border-radius: 10px;
    white-space: pre-line;
    padding: 0 1rem;
    color: #bfc7d5;
}

/* arrow tag */
i {
    color: rgb(140, 140, 140);
    font-style: normal;
}

/* tag name */
q {
    color: rgb(94, 169, 255);
}

/* attribute */
u {
    text-decoration: none;
    color: rgb(151, 236, 255);
}

/* value attribute */
s {
    color: rgb(255, 186, 75);
    text-decoration: none;
}

/* function */
em {
    color: rgb(255, 253, 119);
    text-decoration: none;
    font-style: normal;
}

/* normal text */
b {
    font-weight: normal;
}

/* import keyword */
var {
    color: rgb(236, 140, 255);
    font-style: normal;
}

/* import keyword */
bdi {
    color: rgb(75, 143, 220);
    font-style: normal;
}
</style>
