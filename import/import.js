

exports.generate = async function generate(config)  {
    let indexFile = download(config.importUrl + '/index.txt')
    let indexLines = indexFile.split('\n')
    for (let index = 0; index < indexLines.length; index++) {
        const line = array[index]
        postgres_import()
    }
}