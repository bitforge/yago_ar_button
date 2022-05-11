<template>
    <div id="app">
        <h1>Yago AR Button</h1>

        <ar-button
            :model="model"
            text="Im Raum platzieren"
            qr-size="400"
            qr-title="Los geht's"
            qr-text="QR Code mit dem Smartphone scannen, um das Produkt im Raum zu platzieren"
            project-color="#2c3e50"
        />

        <footer>Made with ❤️ by <a href="https://www.bitforge.ch/">Bitforge</a>.</footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ARButton from './components/ar-button.vue';

@Component({
    components: { 'ar-button': ARButton },
})
export default class App extends Vue {
    private model = process.env.VUE_APP_GENIE_MODEL;
}
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 40px;
}

/* Example of AR button styling */
/* In the real world, when using the WebComponent, these vars should be defined for `ar-button` instead of `:root` */

:root {
    /* --background-color: #01662a;
    --color: #ffffff;
    --padding: 6px 12px;
    --border: 4px solid #004400;
    --border-radius: 4px;
    --ar-icon-width: 40px;
    --ar-icon-height: 40px;
    --qr-code-border-color: #01662a; */
}

#app > footer {
    margin-top: 40px;
}
</style>
