var request = require('request');
var cheerio = require('cheerio');
var utils = require("../utils");
var moment = require("moment");

module.exports = {
    nome: "A Bola",
    hostname: "abola.pt",

    parseNoticiaHTML: function(html){
        $ = cheerio.load(html);
        var r = {};

        r.titulo = utils.limparTexto($("#a5g2").text());
        r.timestamp = moment($("#a5x").text(), "hh:mm - DD-MM-YYYY").toDate();
        r.imgURL = $("#a5g1 img").attr("src");
        r.textoNoticia = utils.limparTexto($("#noticiatext").text());
        //r.categoria = "Desporto";

        if(r.titulo == "")
            return null;
        else
            return r;
    },

    extractNoticiasFromPage: function(html, cb){
        $ = cheerio.load(html);
        var r = [];

        $("#a5i a[href*='ver']").each(function(i, link){
            var a = $(link).attr('href');

            if($(link).attr("id").indexOf("mundos") >= 0)
                r.push("http://www.abola.pt/mundos/" + a);
            else
                r.push("http://www.abola.pt/nnh/" + a);

        });

        cb(r.filter(utils.onlyUnique));
    },

    categoriaFromUrl: function(url){
        url = url.replace("http://");
        var split = url.split("/");
        if(split[1] == "nnh")
            return "Desporto";
        else
            return "Mundos";
    }

}
