var request = require('request');
var cheerio = require('cheerio');
var utils = require("../utils");

var moment = require("moment");

module.exports = {
    nome: "Correio da Manha",
    hostname: "cmjornal.xl.pt",

    parseNoticiaHTML: function(html){
        $ = cheerio.load(html);
        var r = {};
        r.titulo = utils.limparTexto($(".NoticiaTituloTxt").text());
        r.subtitulo = utils.limparTexto($(".NoticiaTituloSubTxt").text());

        r.timestamp = moment($(".NoticiaDataDestaque").text(),"DD.MM.YYYY  HH:mm").toDate();

        var i = $(".relative.fotoManchete01 img").attr("src");

        if(i != "/i/ImagemDefaultCM_757_426.jpg")
            r.imgURL = "http://www.cmjornal.xl.pt" + i;

        r.textoNoticia = utils.limparTexto($(".mioloNoticia p").text());

        r.categoria = $(".NoticiaMaisNoticaisPreto").text();

        r.keywords = [];
        $(".mioloNoticiaFooterItens a").each(function(i, item){
            r.keywords.push($(item).text().trim());
        });

        if(r.titulo == "")
            return null;
        else
            return r;
    },

    extractNoticiasFromPage: function(html, cb){
        $ = cheerio.load(html);
        var r = [];

        $("a.tituloTimeline").each(function(i, link){
            var a = $(link).attr('href');

            r.push("http://www.cmjornal.xl.pt" + a);

        });

        cb(r.filter(utils.onlyUnique));



    }

}
