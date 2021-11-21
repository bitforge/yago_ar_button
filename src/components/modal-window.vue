<template>
    <transition name="modal-fade">
        <div :class="[{ 'ar-button-modal': true }, modalClass]">
            <div class="modal-inner" role="dialog" v-on:click.stop>
                <div class="ar-modal-header">
                    <slot name="header"></slot>
                    <button type="button" class="button-close" @click="close">✕</button>
                </div>
                <section class="ar-modal-body">
                    <slot></slot>
                </section>
                <div class="ar-modal-footer">
                    <p>
                        Powered by
                        <a href="https://ar-webshop.com/">Genie AR</a>
                        <img src="@/assets/genie_icon.png" />
                    </p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ModalWindow extends Vue {
    @Prop({ default: '' })
    private modalClass!: string;

    private close() {
        this.$emit('close');
    }
}
</script>

<style>
.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.ar-button-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 10px;
}

.ar-button-modal .modal-inner {
    display: flex;
    flex-direction: column;
    border-radius: 1em;
    background: #ffffff;
    box-shadow: 1px 1px 20px 1px #838383;
    overflow-x: auto;
    /*flex: 1;
    max-width: 520px;*/
}

.ar-button-modal .ar-modal-header {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
}

.ar-button-modal .button-close {
    border: none;
    font-size: 38px;
    cursor: pointer;
    color: #a99fa4;
    background: transparent;
    font-weight: normal;
    margin: 0;
    padding: 0;
}

.ar-button-modal .button-close:focus {
    outline: none;
}

.ar-button-modal .ar-modal-body {
    position: relative;
    margin: 20px 60px;
}

.ar-button-modal .ar-modal-footer {
    color: #000000;
    border-top: 1px solid #888888;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
}

@media (-webkit-min-device-pixel-ratio: 2) {
    .ar-button-modal .ar-modal-footer {
        border-top: 0.5px solid #888888;
    }
}

.ar-button-modal .ar-modal-footer a {
    color: inherit;
    text-decoration: none;
}

.ar-button-modal .ar-modal-footer img {
    position: relative;
    top: 2px;
    margin: 0 4px;
    height: 16px;
}

.ar-button-modal .ar-modal-footer p {
    font-family: var(--font-family, Avenir, Helvetica, Arial, sans-serif);
    font-size: 16px;
    margin: 0;
    padding: 16px 0;
}
</style>
