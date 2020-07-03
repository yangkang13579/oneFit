const replace = require('replace-in-file');

console.log('替换版本号...');

const version = process.env.BUILD_VERSION;

console.log('版本:', version);

if (!version) {
    console.log('未定义版本号，编译终止!');
    console.log('BUILD_VERSION=1.00 npm run-script build');
    process.exit(-1);
}
try {
    const options = {
        files: './dist/lib/app.js',
        from: /_VERSION_/g,
        to: version
    };
    const changes = replace.sync(options);
    console.log('已替换:', changes.join(', '));
} catch (error) {
    console.error('版本号替换失败:', error);
}
