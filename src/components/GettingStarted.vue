<template lang="">
    <section class="flex gap-8 relative">
        <div class="flex-1">
            <h2 class="text-2xl font-bold" id="getting-started">
                Getting Started
            </h2>
            <p class="">
                This template should help get you started developing with Vue 3
                in Vite.
            </p>

            <hr class="border-gray my-6" />

            <p>
                This is an example of how you may give instructions on setting
                up your project locally. To get a local copy up and running
                follow these simple example steps.
            </p>

            <h3 class="text-xl font-bold" id="prerequisites">Prerequisites</h3>
            <p>
                This is an example of how to list things you need to use the
                software and how to install them.
            </p>

            <ul class="list-disc pl-4">
                <li>Node.js</li>
                <i>
                    Minimum version >= 18 or you can use the latest version of
                    NPM</i
                >
                <Code>
                    <em>$</em>&nbsp;
                    <b> npm install npm@latest -g </b>
                </Code>
            </ul>

            <h3 class="text-xl font-bold" id="installation">Installation</h3>
            <p>
                Below is an example of how you can instruct your audience on
                installing and setting up your app. This template doesn't rely
                on any external dependencies or services.
            </p>

            <ol class="list-decimal pl-4">
                <li>Clone the repo</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>
                        git clone
                        https://github.com/mubaroqRifky/vue_fe_boilerplate.git
                    </b>
                </Code>

                <li>Install NPM packages</li>
                <Code> <em>$</em>&nbsp; <b>npm install</b> </Code>

                <li>Create .env file</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>cp .env.example .env</b>
                </Code>

                <li>Setup your environment in .env file</li>
                <i>
                    You can get API boilerplate from
                    <a
                        href="https://github.com/tebeiksan/laravel_api_boilerplate"
                        target="_blank"
                    >
                        https://github.com/tebeiksan/laravel_api_boilerplate
                    </a>
                </i>
                <Code>
                    VITE_API_URL=[YOUR_API_URL]
                    <br />
                    VITE_GOOGLE_OAUTH_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
                </Code>
                <i class="-mt-2 mb-2 block">
                    For Google login you have to setup OAuth 2.0 Client IDs and
                    add your URL in your credentials to Authorized JavaScript
                    origins.
                </i>

                <li>Compile and Hot-Reload for Development</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>npm run dev</b>
                </Code>

                <li>Compile and Minify for Production</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>npm run build </b>
                </Code>
            </ol>

            <h3 class="text-xl font-bold" id="contributing">Contributing</h3>
            <p>
                Contributions are what make the open source community such an
                amazing place to learn, inspire, and create. Any contributions
                you make are greatly appreciated.
            </p>
            <hr class="border-gray my-6" />
            <p>
                If you have a suggestion that would make this better, please
                fork the repo and create a pull request. You can also simply
                open an issue with the tag "enhancement". Don't forget to give
                the project a star! Thanks again!
            </p>

            <ol class="list-decimal pl-4">
                <li>Fork the Project</li>
                <li>Create your Feature Branch</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>git checkout -b feature/AmazingFeature </b>
                </Code>

                <li>Commit your Changes</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>git commit -m "Add some AmazingFeature" </b>
                </Code>

                <li>Push to the Branch</li>
                <Code>
                    <em>$</em>&nbsp;
                    <b>git push origin feature/AmazingFeature </b>
                </Code>

                <li>Open a Pull Request</li>
            </ol>

            <hr class="border-gray my-6" />

            <h3 class="text-xl font-bold" id="license">License</h3>
            <p>
                Distributed under the
                <a href="https://opensource.org/license/MIT" target="_blank"
                    >MIT</a
                >
                License. See LICENSE.txt for more information.
            </p>
            <p>Copyright &copy; 2024, ICT. Mubaroq Rifky</p>

            <hr class="border-gray my-6" />

            <h3 class="text-xl font-bold" id="contact">Contact</h3>
            <p>
                Mubaroq Rifky -
                <a href="mailto:mubaroq.rifki92@gmail.com">
                    mubaroq.rifki92@gmail.com
                </a>
            </p>
            <p>
                Tubagus Iksan -
                <a href="mailto:tebeiksan@gmail.com"> tebeiksan@gmail.com </a>
            </p>

            <h3 class="text-xl font-bold" id="acknowledgments">
                Acknowledgments
            </h3>
            <p>
                Use this space to list resources you find helpful and would like
                to give credit to. I've included a few of my favorites to kick
                things off!
            </p>

            <ul class="list-disc pl-4">
                <li>Vue3 Easy Data Table</li>
                <li>Icones</li>
                <li>Iconify Vue</li>
                <li>Tailwind Css</li>
                <li>Vuex</li>
                <li>Vue Select</li>
            </ul>
        </div>

        <div
            class="w-[11rem] h-min max-h-5xl sticky top-[0rem] text-sm hidden md:block p-4 dark:bg-primaryTransparent"
        >
            <h4 class="font-bold mb-4">On This Page</h4>
            <ul class="nav-panel">
                <li>
                    <a href="#getting-started"> Getting Started </a>
                </li>
                <li>
                    <a href="#prerequisites"> Prerequisites </a>
                </li>
                <li>
                    <a href="#installation"> Installation </a>
                </li>
                <li>
                    <a href="#contributing"> Contributing </a>
                </li>
                <li>
                    <a href="#license"> License </a>
                </li>
                <li>
                    <a href="#contact"> Contact </a>
                </li>
                <li>
                    <a href="#acknowledgments"> Acknowledgments </a>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import Code from "@/components/container/Code.vue";

export default {
    components: {
        Code,
    },
    mounted() {
        document
            .querySelectorAll('.nav-panel a[href^="#"]')
            .forEach((anchor) => {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();

                    document
                        .querySelector(this.getAttribute("href"))
                        .scrollIntoView({
                            behavior: "smooth",
                        });
                });
            });
    },
};
</script>

<style lang="scss" scoped>
p,
ul,
ol {
    @apply my-6 leading-6 dark:text-gray-dark text-darkGray text-sm;
}

i {
    @apply dark:text-gray-dark text-darkGray text-sm;
}

h3 {
    @apply mt-10 dark:text-primary;
}

a {
    @apply text-success;
}

h2,
h3 {
    @apply dark:text-primary;
    scroll-margin: 1rem;
}

.nav-panel {
    @apply grid gap-2 content-start text-darkGray;
    a {
        @apply dark:text-gray-dark text-darkGray;
    }
}
</style>
