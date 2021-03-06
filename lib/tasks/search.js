var utils = require('../utils'),
    format = require('../utils/format'),
    github = require('../utils/github'),
    async = require('async');


exports.summary = 'Search GitHub for matching repository name';

exports.usage = '<query>';

exports.options = {
    "r" : {
        alias : 'repository'
        ,describe : 'source repository URL'
    },
    "l" : {
        alias : 'limit'
        ,default : 10
        ,describe : 'Maximum number of results to return'
    }
};

exports.run = function (opt, callback) {

    var limit = opt.limit;
    var query = opt.query;
    exports.searchGitHub(query, limit, callback);

};


exports.searchGitHub = function (query, limit, callback) {
    github.repos.search(query, function (err, data) {
        if (err) {
            return callback(err);
        }
        var repos = data.repositories.slice(0, limit);
        repos.forEach(function (r) {
            var desc = format.truncate(r.description.split('\n')[0], 76);
            console.log(
                ('github'.yellow + ": " + r.owner.cyan + '/' + r.name.green) + '\n' +
                //(' ' + r.version + '\n').yellow + //TODO get latest tag?
                '   ' + desc.grey
            );
        });

        callback(null, 'About ' + repos.length + ' results  (limit: ' + limit + ')');
    });
};
