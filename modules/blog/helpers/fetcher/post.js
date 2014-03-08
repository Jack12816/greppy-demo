/**
 * Post Fetcher Helper
 *
 * @module blog/helpers/fetcher/post
 * @author Hermann Mayer <hermann.mayer92@gmail.com>
 **/

var async = require('async');
var moment = require('moment');

/**
 * @constructor
 */
var PostHelper = function()
{
    this.key = greppy.helper.get('cache').key;
    this.cache = require('memory-cache');
};

/**
 * Build the post archive.
 *
 * @param {Function} callback - Function to call on finish
 * @return void
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

module.exports = PostHelper;

