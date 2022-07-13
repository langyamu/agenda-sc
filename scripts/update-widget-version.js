/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const resolve = (p) => path.resolve(__dirname, p);

const getPkg = () =>
    JSON.parse(
        fs.readFileSync(resolve('../package.json'), { encoding: 'utf-8' }),
    );

const getWidget = () =>
    JSON.parse(
        fs.readFileSync(resolve('../public/widget.json'), {
            encoding: 'utf-8',
        }),
    );

const writeWidget = (json) =>
    fs.writeFileSync(resolve('../public/widget.json'), JSON.stringify(json));

const pkg = getPkg();
const widget = getWidget();

console.log('__:🍥🍥🍥:Previous version:🍥🍥🍥:____');
console.log('pkg::', pkg.version);
console.log('widget::', widget.version);

widget.version = pkg.version;
writeWidget(widget);

console.log('__:🍥🍥🍥:Current version:🍥🍥🍥:____');
console.log(
    'pkg::',
    JSON.parse(
        fs.readFileSync(resolve('../package.json'), { encoding: 'utf-8' }),
    ).version,
);
console.log(
    'widget::',
    JSON.parse(
        fs.readFileSync(resolve('../public/widget.json'), {
            encoding: 'utf-8',
        }),
    ).version,
);
