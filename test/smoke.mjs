/**
 * Smoke test: load the built bundle in a real browser and check the component
 * actually renders with its styles applied.
 *
 * Guards the regression where ArButton overrode `static observedAttributes`
 * without calling super. That getter is what triggers Lit's finalize(), which
 * builds elementStyles from `static styles`. Without it the element got no
 * stylesheet at all, so `.hidden { display: none }` never applied and the QR /
 * browser-unsupported popups rendered permanently on top of the host page.
 *
 * The bundle still builds perfectly when this breaks, so building is not
 * enough - it has to be rendered to be caught.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const BUNDLE = process.env.SMOKE_BUNDLE ?? 'dist/ar-button.js';

if (!existsSync(BUNDLE)) {
    console.error(`✗ Missing ${BUNDLE} - run \`yarn build:dev\` first.`);
    process.exit(1);
}

const browser = await chromium.launch();

try {
    const page = await browser.newPage();
    await page.setContent('<ar-button id="probe" qr-size="300"></ar-button>');
    await page.addScriptTag({ path: BUNDLE });

    await page.waitForFunction(
        () => document.getElementById('probe')?.shadowRoot?.querySelector('ar-modal'),
        null,
        { timeout: 30000 }
    );
    await page.evaluate(() => document.getElementById('probe').updateComplete);

    const result = await page.evaluate(() => {
        const ctor = customElements.get('ar-button');
        const el = document.getElementById('probe');
        const modal = el.shadowRoot.querySelector('ar-modal');
        const link = el.shadowRoot.querySelector('a.ar-link');
        return {
            elementStyles: ctor.elementStyles?.length ?? 0,
            adoptedStyleSheets: el.shadowRoot.adoptedStyleSheets.length,
            styleTags: el.shadowRoot.querySelectorAll('style').length,
            qrModalDisplay: getComputedStyle(modal).display,
            buttonDisplay: link ? getComputedStyle(link).display : '(no button)',
        };
    });

    console.log('ar-button smoke test:', result);

    assert.ok(
        result.elementStyles >= 1,
        '`static styles` were never finalized into elementStyles - does ArButton ' +
            'override observedAttributes without calling super.observedAttributes?'
    );
    assert.ok(
        result.adoptedStyleSheets + result.styleTags >= 1,
        'shadow root has no stylesheet attached, the component will render unstyled'
    );
    assert.equal(
        result.qrModalDisplay,
        'none',
        'QR popup should be hidden until the button is activated'
    );
    assert.equal(
        result.buttonDisplay,
        'inline-flex',
        'AR button is not picking up its own styles'
    );

    console.log('✅ ar-button renders with its styles applied');

    // qr-size must size the QR code itself, not only the popup around it.
    // The QR options used to be built before attributes were applied, so the
    // code always rendered at the default 276px whatever qr-size said.
    for (const size of [200, 300, 500]) {
        const qrPage = await browser.newPage();
        // No model config: exercise the attribute without a project qr_config.
        await qrPage.route('**/api/models/**', (route) => route.fulfill({ status: 404, body: '{}' }));
        await qrPage.setContent(`<ar-button id="probe" qr-size="${size}"></ar-button>`);
        await qrPage.addScriptTag({ path: BUNDLE });
        await qrPage.waitForFunction(() => document.getElementById('probe')?.showButton, null, {
            timeout: 30000,
        });

        // Desktop has no AR support, so activating the button opens the QR popup.
        const qr = await qrPage.evaluate(async () => {
            const el = document.getElementById('probe');
            el.shadowRoot.querySelector('a.ar-link').click();
            await el.updateComplete;
            const svg = el.shadowRoot.querySelector('.qr-element svg');
            return {
                popupWidth: el.shadowRoot.querySelector('.qr-element').parentElement.style.width,
                qrWidth: svg?.getAttribute('width'),
                qrHeight: svg?.getAttribute('height'),
            };
        });
        await qrPage.close();

        console.log(`qr-size="${size}":`, qr);

        assert.equal(qr.popupWidth, `${size}px`, 'QR popup is not sized from qr-size');
        assert.equal(qr.qrWidth, String(size - 24), `QR code width ignores qr-size="${size}"`);
        assert.equal(qr.qrHeight, String(size - 24), `QR code height ignores qr-size="${size}"`);
    }

    console.log('✅ qr-size sizes the QR code');
} finally {
    await browser.close();
}
