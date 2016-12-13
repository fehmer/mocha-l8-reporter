# mocha l8 smartlight reporter

[![npm version](https://badge.fury.io/js/mocha-l8-reporter.svg)](https://badge.fury.io/js/mocha-l8-reporter)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/24d1fb0af72d4f97a1c9f9c370a77d39)](https://www.codacy.com/app/fehmer/mocha-l8-reporter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fehmer/mocha-l8-reporter&amp;utm_campaign=Badge_Grade)


Reporter using the [L8 Smartlight](http://l8smartlight.com/) as an extreme feedback device for mocha tests.

##Prerequisites

- L8 is accessible, e.g. ```cat /dev/ttyACM0```
- On linux plugin the L8 and see the dmesg output to find the device name
- if you got permission denied add user to the dialout group (ubuntu)
    + ```sudo usermod -a -G dialout $USER```

## Usage

- Install mocha-l8-reporter as a dev depenency with ```npm install --save --dev mocha-l8-reporter``` or install globally with ```npm install -g mocha-l8-reporter```
- enable reporter with ```-R mocha-l8-reporter```
- if your l8 is not accessible via ```/dev/ttyACM0``` use
    + ```mocha [...] -O l8port=/dev/yourDevice```
    + or ```L8_PORT=/dev/yourDevice mocha [...]```

