/**
 * Post Controller Helper
 *
 * @module blog/helpers/controller/post
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 **/

var async  = require('async');
var moment = require('moment');
var crypto = require('crypto');

/**
 * @constructor
 */
var PostHelper = function()
{
    this.key = greppy.helper.get('cache').key;
    this.cache = require('memory-cache');
    this.pepper = 'twopocvik';
};

/**
 * Build the post archive.
 *
 * @param {Function} callback - Function to call on finish
 */
PostHelper.prototype.fetchArchive = function(callback)
{
    var self   = this;
    var result = null;
    var key    = this.key({
        helper  : 'PostHelper',
        method  : 'fetchArchive'
    });

    if (result = this.cache.get(key)) {
        return callback && callback(null, result.iterateable, result.archive);
    }

    var archive = {};

    greppy.db.get('mongodb.blog').getORM(function(orm, models) {

        models.Post.find({deleted_at: null}, function(err, documents) {

            if (err) {
                return callback && callback(err);
            }

            async.each(documents, function(document, callback) {

                var createdAt = moment(document.created_at);
                var year      = createdAt.year();
                var month     = createdAt.format('MMMM');

                if (!archive[year]) {
                    archive[year] = {};
                }

                if (!archive[year][month]) {
                    archive[year][month] = {
                        count: 0,
                        month: createdAt.month() + 1
                    };
                }

                archive[year][month].count++;
                callback && callback();

            }, function(err) {

                if (err) {
                    return callback && callback(err);
                }

                var iterateable = [];

                Object.keys(archive).sort().reverse().forEach(function(yearValue) {

                    var year = {
                        year: yearValue,
                        count: 0,
                        months: []
                    };

                    Object.keys(archive[yearValue]).forEach(function(monthName) {

                        var month = {
                            name: monthName,
                            index: archive[yearValue][monthName].month,
                            count: archive[yearValue][monthName].count
                        }

                        year.months.push(month);
                        year.count += month.count;
                    });

                    year.months = year.months.sort(function(a, b) {
                        return (a.index - b.index) * -1;
                    });

                    iterateable.push(year);
                });

                self.cache.put(key, {
                    iterateable : iterateable,
                    archive     : archive
                }, 5 * 60 * 1000);

                callback && callback(null, iterateable, archive);
            });
        });
    });
};

/**
 * Generate captcha and save it on the session.
 *
 * @param {Object} req - The request object
 * @param {Function} callback - Function to call on finish
 */
PostHelper.prototype.generateCaptcha = function(req, callback)
{
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var solution = getRandomInt(9, 12);
    var a = 9 - getRandomInt(1, 8);
    var b = solution - a;

    var captcha = {
        question: '%s + %s'.format(a, b),
        solution: solution
    };

    captcha.hash = crypto.createHash('md5').update(
        this.pepper + ':' + req.cookies.greppyUserSess + ':' + captcha.solution
    ).digest("hex");

    // console.log(captcha);
    // console.log({
    //     a: a,
    //     b: b,
    //     solution: solution
    // });

    req.session.captcha = captcha;

    callback && callback(null, captcha);
};

/**
 * Validate the solution of a session captcha.
 *
 * @param {Integer} solution - The solution of the captcha
 * @param {Object} req - The request object
 * @param {Function} callback - Function to call on finish
 */
PostHelper.prototype.validateCaptcha = function(solution, req, callback)
{
    if (!req.session || !req.session.captcha) {
        return callback && callback(new Error('NO_CAPTCHA'));
    }

    var invalid = new Error('INVALID_CAPTCHA');
    var captcha = req.session.captcha;

    // First check the solutions, this is the cheapest check
    // So we dont waste CPU time to calculate hashes etc
    var desired = captcha.solution;
    var actual = solution;

    if (desired !== actual) {
        return callback && callback(invalid);
    }

    // The user has proven to be able to solve
    // ultra complex additions of small numbers - great!
    // So lets check the hashes to proof the identity of
    // the request in combination with the solution
    var desired = captcha.hash;
    var actual = crypto.createHash('md5').update(
        this.pepper + ':' + req.cookies.greppyUserSess + ':' + solution
    ).digest("hex");

    if (desired !== actual) {
        return callback && callback(invalid);
    }

    // Wow, we got a math prof which has proven to be
    // the real solver of the question. Lets accept the
    // captcha, its valid.
    callback && callback();
};

module.exports = PostHelper;

