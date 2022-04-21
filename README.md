# Yago AR Button

A simple WebComponent to launch AR experiences on supported platforms directly or show a QR code to switch to supported devices.  

More details and examples on https://yago.cloud/

##  Installation

### Via npm

Use your favorite package manager:

```shell
npm install @bitforgehq/yago-ar-button
# OR:
yarn add @bitforgehq/yago-ar-button
```

Link the source in your script:

```javascript
import '@bitforgehq/yago-ar-button';
```

### Via CDN

Add these two javascript files at the end of your document or in your `<head>`:

```html
<script src="https://unpkg.com/vue@2/dist/vue.min.js"></script>
<script type="module" src="https://dist.yago.cloud/ar-button/ar-button.min.js"></script>
```
## Usage

Include the WebComponent in your Website where the button should appear.

```html
<ar-button
    model="<yago-slug>"
    text="Place in your space"
    qr-size="300"
    qr-title="Here we go!"
    qr-text="Scan the QR Code with your smartphone to place the model in your space.">
</ar-button>
```

Property               |Type   |Description
-----------------------|-------|---------------------------------------------------------------
model                  |string |The slug (Short-URL) of your yago model. Usually 8 characters.
text                   |string |Text in the AR Button. Default is 'Place in your space'.
qr-size                |number |Size of the QR Code in the modal popup window.
qr-title               |string |Title text in the modal popup window.
qr-text                |string |Call to action text in the modal popup window.


# Styling

You can style Yago AR button with global CSS variables:

```css
ar-button {
    --font-family: "Comic Neue";
    --background-color: black;
    --color: white;
    --border: 1px solid black;
    --border-radius: 8px;
    --padding: 16px;
    --ar-icon-height: 24px;
    --ar-icon-width: 24px;
    --qr-code-border-color: black;
}
```

If you want to style further details, you need to customize the code and deploy Yago Button yourself.


# Development

To start hacking:

```shell
yarn install
yarn serve
```

Issues and pull requests are highly welcome!
