/**
 * Module dependencies.
 */
var Base = require('mocha').reporters.Base;
var inherits = require('mocha').utils.inherits;

var L8 = require('l8smartlight').L8;
var MatrixBuilder = require('l8smartlight').MatrixBuilder;

//colors for fail and pass
var status = {
    fail: {
        r: 15,
        g: 0,
        b: 0
    },
    pass: {
        r: 0,
        g: 15,
        b: 0
    }
}


// images for fail and pass
var results = {
    pass: new MatrixBuilder()
        .rectangle(status.pass, 0, 4, 0, 5)
        .rectangle(status.pass, 1, 5, 1, 6)
        .rectangle(status.pass, 2, 6, 2, 7)
        .rectangle(status.pass, 3, 5, 3, 7)
        .rectangle(status.pass, 4, 4, 4, 6)
        .rectangle(status.pass, 5, 3, 5, 5)
        .rectangle(status.pass, 6, 2, 6, 4)
        .rectangle(status.pass, 7, 1, 7, 3),
    fail: new MatrixBuilder()
        .rectangle(status.fail, 0, 1, 0, 1)
        .rectangle(status.fail, 0, 6, 0, 6)
        .rectangle(status.fail, 1, 0, 1, 2)
        .rectangle(status.fail, 1, 5, 1, 7)
        .rectangle(status.fail, 2, 1, 2, 6)
        .rectangle(status.fail, 3, 2, 4, 5)
        .rectangle(status.fail, 5, 1, 5, 6)
        .rectangle(status.fail, 6, 0, 6, 2)
        .rectangle(status.fail, 6, 5, 6, 7)
        .rectangle(status.fail, 7, 1, 7, 1)
        .rectangle(status.fail, 7, 6, 7, 6)
}



/**
 * Expose `L8Reporter`.
 */

exports = module.exports = L8Reporter;

/**
 * Initialize a new `L8Reporter` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function L8Reporter(runner, options) {
    var self = this;
    Base.call(this, runner);

    //determine l8 port, default to /dev/ttyACM0
    var reporterOptions = options.reporterOptions || {};
    var serialPort = process.env.L8_PORT || reporterOptions.l8port || '/dev/ttyACM0';


    runner.l8 = this;
    this.l8 = new L8(serialPort, null, 400);
    this.matrix = new MatrixBuilder();
    this.portReady = false;
    var l8 = this.l8;


    //connecto to l8,
    this.l8.open()
        .then(function() {
            //clear front
            return self.l8.clearMatrix();
        })
        .then(function() {
            //clear back led
            return self.l8.clearSuperLED();
        })
        .then(function() {
            //set port ready, emit event
            self.portReady = true;
        }).catch(function(error) {
            self.portReady = true;
            console.error(error);

        });

    //on end print summary
    runner.on('end', function(test) {
        runner.l8.epilogue.call(runner.l8);
    });

}

L8Reporter.prototype.done = function(failures, fn) {
    var self = this;
    var resultStatus = failures > 0 ? 'fail' : 'pass';

    if (this.portReady) {
        //directly call setDisplay
        this.setDisplay(resultStatus, function() {
            fn(failures);
        });
    } else {
        //port not ready, wait for portReady event, thenn call setDisplay
        setTimeout(function() {
            self.done(failures, fn);
        }, 200);

    }
}

L8Reporter.prototype.setDisplay = function(resultStatus, cb) {
    var l8 = this.l8;
    l8.open()
        .then(function() {
            return l8.setMatrix(results[resultStatus].toMatrix())
        }).then(function() {
            return l8.setSuperLED(status[resultStatus]);
        }).then(function() {
            return l8.close();
        }).then(function() {
            return cb();
        })
        .catch(function(error) {
            console.error(error);
            return cb();
        });
}

inherits(L8Reporter, Base);