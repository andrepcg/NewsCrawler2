var Crawler = require('./crawler');

// TODO tfidf guardado na BD

var tfidf = require("./tfidf");
tfidf.loadTerms("tfidf.json");
exports.tfidf = tfidf;


var sites = ["http://www.publico.pt/ultimas",
             "http://www.jornaldenegocios.pt/noticias_no_minuto.html",
             "http://www.ionline.pt/ultimas",
             "http://economico.sapo.pt",
             "http://www.tsf.pt/PaginaInicial/Ultimas.aspx",
             "http://exameinformatica.sapo.pt",
             "http://sicnoticias.sapo.pt/noticias",
             "http://www.abola.pt/nnh",
             "http://www.jn.pt/paginainicial/ultimas",
             "http://visao.sapo.pt/gen.pl?sid=vs.sections/23412",
             "http://expresso.sapo.pt/gen.pl?p=arquivo",
             "http://observador.pt",
             "http://tek.sapo.pt",
             "http://blitz.sapo.pt/gen.pl?p=lastnews",
             "http://www.pcguia.pt/category/noticias",
             "http://www.zerozero.pt/noticias.php",
             "http://maisfutebol.iol.pt/ultimas",
             "http://t3.sapo.pt/noticias",
             "http://www.rtp.pt/noticias/index.php",
             "http://www.dn.pt/inicio",
             "http://oje.pt",
             "http://www.record.xl.pt/ultimas/default.aspx",
             {url: "http://feeds.feedburner.com/P3rss?format=xml", site: "http://p3.publico.pt"},
             {url: "http://feeds.feedburner.com/P3Cultura?format=xml", site: "http://p3.publico.pt"},
             {url: "http://feeds.feedburner.com/P3Actualidade?format=xml", site: "http://p3.publico.pt"},
             {url: "http://feeds.feedburner.com/P3Vicios?format=xml", site: "http://p3.publico.pt"},
             "http://www.deco.proteste.pt/nt/noticia/lista",
             "http://diariodigital.sapo.pt/ultimas_noticias.asp",
             {url: "http://feeds.controlinveste.pt/DV-ultimas", site: "http://dinheirovivo.pt"},
             "http://www.ojogo.pt/aominuto",
             "http://www.noticiasaominuto.com"
            ];

// TODO computerworld.com.pt pt.euronews.com tvi24.iol.pt menshealth.com.pt
// TODO myway.pt.msn.com lazer.publico.pt cinema.sapo.pt adorocinema.com cinemas.nos.pt
// TODO cmjornal.xl.pt querosaber.sapo.pt superinteressante.pt lux.iol.pt marketeer.pt bit.pt maxima.xl.pt
// TODO revista21.net publituris.pt fugas.publico.pt autohoje.com desporto.sapo.pt
// TODO destak.pt

var c = new Crawler(sites, '*/5 * * * *', tfidf);
