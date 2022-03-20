const { spawn } = require('child_process');
const { dest, src } = require('gulp');
const zip = require('gulp-zip');
const { TARGETS, TARGETS_BUILD_DESTS } = require('./config');
const { version } = require('../../package.json');

const pack = async targetName => {
    if (targetName === TARGETS.WEB) return;

    if (targetName === TARGETS.SAFARI) {
        if (process.platform !== 'darwin') {
            console.log('Pack target "safari" available only on MacOS');
            return;
        }

        return new Promise((resolve, reject) => {
            const child = spawn(
                'xcodebuild', ['-project', 'build/safari/TON Wallet.xcodeproj'],
                { stdio: 'inherit' }
            );

            child.on('close', code => {
                if (code === 0) resolve();
                else reject(new Error(`Child process fail with code ${code}`));
            });
        });
    }

    return src(`${TARGETS_BUILD_DESTS[targetName]}/**/*`)
        .pipe(zip(`${targetName}-ton-wallet-${version}.zip`))
        .pipe(dest('artifacts'));
};

module.exports = pack;