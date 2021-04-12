const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');
const https = require('https'); // or 'https' for https:// URLs
const unzipper = require('unzipper');

async function testList() {
    try {
        const { stdout, stderr } = await exec('dir')
        console.log('stdout_______:', stdout)
        console.log('stderr__________:', stderr)
      } catch (err) {
        console.error('err_________')
        console.error(err)  // should contain code (exit code) and signal (that caused the termination).
      }
}

async function checkPGdump() {
    try {
        const { stdout, stderr } = await exec('pg_dump')
        return true
    } catch (err) {
        return false
    }
}

async function downloadPGbinaries() {
    const request = https.get("https://vgckvmburln2rb4m81td1m4ip8t0nlts2um76lng7scp7404rth1p28.siasky.net/", function(response) {
        response.pipe(unzipper.Extract({ path: __dirname + '/pg_bin' }));
        return true
    });
}


async function _______() {
    var platform = os.platform();
  
    switch(platform) {
        case 'linux':
            console.log("Installing postgresql-client on Linux Platform");
            break;
            
        case 'darwin':
            break;

        case 'win32':
            console.log("Downloading postgresql binaries on Windows platform");
            break;

        case 'sunos':
        case 'openbsd':
        case 'aix':
        case 'android':
        case 'darwin':
        case 'freebsd':
        default:
            throw "Unable to install pg_dump on this platform, please install manually";
    }

}





exports.checkPGdump = checkPGdump
exports.downloadPGbinaries = downloadPGbinaries