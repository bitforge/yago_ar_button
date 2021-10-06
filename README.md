# Genie AR Button

WebComponent to directly launch the AR view of Genie AR models.

More Details on Genie AR here: https://ar-webshop.com/

##  Installation

### Via npm

Use your favorite package manager:

```shell
npm install genie-ar-button
# OR:
yarn add genie-ar-button
```

Link the source in your script:

```javascript
import '@bitforgehq/genie-ar-button';
```

### Via CDN

Add these two javascript files at the end of your document or in your `<head>`:

```html
<script src="https://unpkg.com/vue@2.6.12/dist/vue.min.js"></script>
<script type="module" src="https://dist.genie-ar.ch/ar-button/ar-button.min.js"></script>
```
## Usage

Include the WebComponent in your Website where the button should appear.

```html
<ar-button
    model="<genie-slug>"
    text="Place"
    qr-size="300"
    qr-title="This is the Title"
    qr-text="And this is the Text of your QR code!">
</ar-button>
```

Property               |Type   |Description
-----------------------|-------|---------------------------------------------------------------
model                  |string |The slug (Short-URL) of your genie model. Usually 8 characters.
text                   |string |Text in the AR Button. Default is 'Place in your space'.
qr-size                |number |Size of the QR Code in the modal popup window.
qr-title               |string |Title text in the modal popup window.
qr-text                |string |Call to action text in the modal popup window.


# Styling

You can style Genie AR button with global CSS variables:

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

If you want to style further details, you need to customize the code and deploy Genie Button yourself.


# Develop

To start hacking:

```shell
yarn install
yarn serve
```