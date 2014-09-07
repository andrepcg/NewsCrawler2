
var async = require('async');
var CronJob = require('cron').CronJob;
var Noticia = require('./app/models/noticia');
var parsers = require("./app/parsers.js");
var mongoose = require("mongoose");

mongoose.connect("mongodb://andrepcg2:LvhzD0BY4vXz1FhVzVDr@ds045099.mongolab.com:45099/noticias_txt");
/*
mongoose.connection.on('close', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect("mongodb://andrepcg2:LvhzD0BY4vXz1FhVzVDr@ds045099.mongolab.com:45099/noticias_txt", {server:{auto_reconnect:true}});
});
mongoose.connection.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect("mongodb://andrepcg2:LvhzD0BY4vXz1FhVzVDr@ds045099.mongolab.com:45099/noticias_txt", {server:{auto_reconnect:true}});
});
mongoose.connection.on('error', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect("mongodb://andrepcg2:LvhzD0BY4vXz1FhVzVDr@ds045099.mongolab.com:45099/noticias_txt", {server:{auto_reconnect:true}});
});
*/
function Crawler(sites, crontime, tfidf) {
    var self = this;
    console.log("Crawler started");

/*
    parsers.getURLsFromPage("http://www.ojogo.pt/aominuto/", function(err, data){console.log(data);});
    parsers.getURLsFromPage({url: "http://feeds.controlinveste.pt/DV-ultimas", site: "http://dinheirovivo.pt"}, function(err, data){console.log(data);});
    parsers.parseNoticia("http://www.ojogo.pt/opiniao/Cronistas/jorgemaia/interior.aspx?content_id=4102644", function(err, data){console.log(data);});
 */

    var newsParsed;

    var processUrl = function(link, callback){

        Noticia.findOne({$or: [{"alternateUrl": link}, {"url": link}]})
            .exec(function (err, noticia) {
                if (err)
                    callback(err);

                else {
                    if (!noticia) {

                        parsers.parseNoticia(link, function (err1, notres) {
                            if (!err1 && notres) {

                                tfidf.parseNoticia(notres);

                                var n = new Noticia(notres);
                                newsParsed++;

                                n.save(function(err){
                                    // se ja exister noticia com a mesma hash, adiciona link ao alternateUrl
                                    if(err && err.code == 11000){
                                        console.log("duplicate found", notres.url);
                                        Noticia.findOne({'hash': notres.hash})
                                            .exec(function (err, nhash) {

                                                if(nhash){
                                                    if(nhash.alternateUrl.indexOf(link) == -1){
                                                        nhash.alternateUrl.push(link);
                                                        nhash.save(callback);
                                                    }
                                                    else
                                                        callback();
                                                }
                                                else
                                                    callback();
                                            });

                                    }
                                    else
                                        callback();
                                });
                            }

                            if (err1) {
                                callback();
                            }

                        });
                    }
                    else
                        callback();
                }
            });
    };


    var crawler = new CronJob(crontime, function () {
        console.log("Starting cron " + Date());
        newsParsed = 0;
        async.each(sites, function (site, callback1) {
            //console.log("Parsing " + site);

                //TODO implementar timeout


                parsers.getURLsFromPage(site, function (err, urls) {
                    if(err)
                        callback1(err);

                    if (urls) {
                        async.eachLimit(urls, 10, processUrl, function(err){
                            if(err) console.log(err);
                            callback1();
                        });
                    }
                    /*else{
                        console.log("Sem links - ", site);
                        callback1();
                    }*/
                });

            },

            function (err) {
                //if (err)
                    //console.error(err);

                console.log("Finished cron", Date(), "- noticias encontradas: " + newsParsed);

                //console.log("A guardar TFIDF");
                tfidf.saveTerms("tfidf.json");
            });
    }, null, true);
}

module.exports = Crawler;
