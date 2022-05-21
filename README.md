# Yago AR Button

A simple WebComponent to launch AR experiences on iOS and Android directly or show a QR code on desktop to switch to supported devices.

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
    qr-text="Scan the QR Code with your smartphone to place the model in your space."
    project-color="#ff0000">
</ar-button>
```

Property               |Type   |Description
-----------------------|-------|---------------------------------------------------------------
model                  |string |The slug (Short-URL) of your yago model. Usually 8 characters.
text                   |string |Text in the AR Button. Default is 'Place in your space'.
qr-size                |number |Size of the QR Code in the modal popup window.
qr-title               |string |Title text in the modal popup window.
qr-text                |string |Call to action text in the modal popup window.
project-color          |string |Color to override project color from yago.


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

# Tracking

If you want to use your own analytics tracking, you can track clicks by listening to the `ar-button-clicked` event.
Check `event.detail` to detect which `<ar-button>` has fired the event.

```javascript
document.addEventListener('ar-button-click', function (e) {
    console.log(e.detail.arButtonId); // Logs the id of the ar button. This will be ar-button-<your model id>.
    console.log(e.detail.modelId); // logs the slug / id of your model.

    // Your Analytics code will go here.
}, false);
```

The `event.detail` object will look like this:
```javascript
{
    arButtonId: ar-button-modelId,
    modelId: modelId,
}
```


# Development

To start hacking:

```shell
yarn install
yarn serve
```

Issues and pull requests are highly welcome!
