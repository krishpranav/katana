const packager = require('electron-packager')

// system specs
const options = {
    platform: ['darwin'],
    arch: 'x64',
    icon: './app/static/images/icon',
    dir: '.',
    ignore: ['build'],
    out: './build/Release',
    overwrite: true,
    prune: true
}

// package functions
packager(options, (error, path) => {
    if (error) {
        return (
            console.log(`Error: ${error}`)
        )
    }

    console.log(`Package created, path: ${path}`)
})