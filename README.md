<<<<<<< HEAD
# Yago AR Button

A simple WebComponent to launch AR experiences directly or show a QR code on desktop to switch to supported devices.

More details and examples on https://yago.cloud/

##  Installation

### Via npm

Use your favorite package manager:
=======
# Ar-Button Lit
>>>>>>> 2bbdbdf (lit component is now on root of folder structure)

install packages:
```shell
yarn
```

to watch files:
```shell
yarn watch
```

<<<<<<< HEAD
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

=======
to serve:
>>>>>>> 2bbdbdf (lit component is now on root of folder structure)
```shell
yarn serve
```

Note: Watch and serve have to both run.