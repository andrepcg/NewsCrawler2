var request = require('request');
var cheerio = require('cheerio');
var utils = require("../utils");

var moment = require("moment");

module.exports = {
    nome: "Radio Renascenca",
    hostname: "rr.sapo.pt",

    parseNoticiaHTML: function(html){
        $ = cheerio.load(html);
        var r = {};
        r.titulo = utils.limparTexto($("#newsContainer #mainNewsTitle").text());
        r.subtitulo = utils.limparTexto($("#newsContainer #mainLead").text());
        if(!r.subtitulo)
            r.subtitulo = utils.limparTexto($("#newsContainer #mainLeadNoCaixaMultimedia").text());

        if($("#newsContainer #dateSignature").length > 0)
            r.timestamp = moment($("#newsContainer #dateSignature").text(),"DD-MM-YYYY HH:mm").toDate();
        else
            r.timestamp = moment($("#newsContainer #dateSignatureNoCaixaMultimedia").text(),"DD-MM-YYYY HH:mm").toDate();

        var i = $("#newsContainer .imgNews img").attr("src");
        var i2 = $("#newsContainer .imgNews").text().match(/http:\/\/mediaserver2.rr.pt\/newrr\/\w+.jpg/);
        if(i)
            r.imgURL = i;
        else if(i2)
            r.imgURL = i2[0];


        var m = $(".imgNews").text().match(/http:\/\/mediaserver2.rr.pt\/newrr\/\w+.mp4/);
        if(m)
            r.media = m[0];

        r.textoNoticia = utils.limparTexto($("#newsContainer #textNews").text());
        r.categoria = $(".subNenuContainer a img[src*='On.gif']").attr("id");
        if(!r.categoria)
            r.categoria = "N/A"


        if(r.titulo == "")
            return null;
        else
            return r;
    },

    extractNoticiasFromPage: function(html, cb){
        $ = cheerio.load(html);
        var r = [];

        $("#mainNewsTitle a[href*='informacao_detalhe']").each(function(i, link){
            var a = $(link).attr('href');
            r.push("http://rr.sapo.pt/" + a);
        });

        cb(r.filter(utils.onlyUnique));



    }

}
