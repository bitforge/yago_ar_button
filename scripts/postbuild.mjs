/**
 * Post-build step: lay out dist/ so a deploy is both stable and identifiable.
 *
 * Produces, from the single bundle Parcel emits:
 *
 *   ar-button.js                     stable entry, what new embeds should use
 *   ar-button.min.js                 identical copy under the legacy filename
 *   ar-button-<version>-<hash>.js    immutable, content-addressed build
 *   version.json                     what is actually deployed here
 *   .htaccess                        per-environment Cache-Control
 *
 * Why a copy and not the old `mv`: production URLs have shipped as
 * ar-button.min.js since the Vue CLI days and are embedded on customer sites,
 * so that name can never disappear. Emitting both lets both environments move
 * to ar-button.js without breaking anything already out there.
 *
 * The hashed copy exists because the stable names cannot be hashed - customers
 * control those references. It gives something immutable to pin, and makes
 * "which build is live?" answerable with one request instead of an
 * investigation into CDN headers.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const env = process.argv[2];
if (env !== 'dev' && env !== 'prod') {
    console.error('usage: node scripts/postbuild.mjs <dev|prod>');
    process.exit(1);
}

const DIST = 'dist';
const ENTRY = join(DIST, 'ar-button.js');

if (!existsSync(ENTRY)) {
    console.error(`✗ ${ENTRY} not found - did the parcel build run?`);
    process.exit(1);
}

const bundle = readFileSync(ENTRY);
const hash = createHash('sha256').update(bundle).digest('hex').slice(0, 8);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const immutable = `ar-button-${pkg.version}-${hash}.js`;

// Legacy filename, kept forever for embeds already in the wild.
copyFileSync(ENTRY, join(DIST, 'ar-button.min.js'));
copyFileSync(ENTRY, join(DIST, immutable));

const htaccess = join('deploy', `htaccess.${env}`);
if (!existsSync(htaccess)) {
    console.error(`✗ ${htaccess} not found`);
    process.exit(1);
}
copyFileSync(htaccess, join(DIST, '.htaccess'));

let commit = 'unknown';
try {
    commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim();
} catch {
    // building outside a git checkout is fine, just less traceable
}

const info = {
    version: pkg.version,
    hash,
    commit,
    env,
    built: new Date().toISOString(),
    files: { latest: 'ar-button.js', legacy: 'ar-button.min.js', immutable },
};
writeFileSync(join(DIST, 'version.json'), JSON.stringify(info, null, 2) + '\n');

console.log(`postbuild (${env}): ${immutable}  commit ${commit}`);
