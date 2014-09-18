var request = require('request');
var cheerio = require('cheerio');
var utils = require("../utils");

var moment = require("moment");

module.exports = {
    nome: "Destak",
    hostname: "destak.pt",

    parseNoticiaHTML: function(html){
        $ = cheerio.load(html);
        var r = {};
        r.titulo = utils.limparTexto($("#article #col1 h2").text());

        r.timestamp = moment($("#article #col1 .date").text(),"DD | MM | YYYY   HH.mm[H]").toDate();

        //debugger;
        var imgs = $("#article #col2 img[width]").attr("src");
        if(imgs != undefined)
            r.imgURL = "http://www.destak.pt" + imgs;
        r.textoNoticia = utils.limparTexto($("#article #col1 .text").text());

        var s = $("#article #col2 h2").text().split(" ");
        if(s.length == 4)
            r.categoria = s[3];
        else
            r.categoria = s.slice(3).join(" ");

        r.keywords = [];
        $("#article #col1 #tags li").each(function(i, item){
            r.keywords.push($(item).text().replace("|","").trim());
        });

        if(r.titulo == "")
            return null;
        else
            return r;
    },

    extractNoticiasFromPage: function(html, cb){
        $ = cheerio.load(html);
        var r = [];

        var links = $('a[href*="artigo"]');
        $(links).each(function(i, link){
            var a = $(link).attr('href');

            if(a.indexOf("#comments") == -1)
                r.push((a.indexOf("http") >= 0) ? "" : ((a.indexOf("/") == 0) ? "http://destak.pt" + a : "http://destak.pt/" + a));

        });

        cb(r.filter(utils.onlyUnique));



    }

}
