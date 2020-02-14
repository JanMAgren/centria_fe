'user strict';

const src_url = 'https://newsapi.org/v2/sources?apiKey=7f23e3c36ac44b33af63aa1ae194c1b1';


function getNewsFromAPI(url, callback)
{

	var req = new Request(url);
	var promise = new Promise(function(resolve, reject){
		fetch(req)
		.then(function(response) {
			resolve(response.json());
		});
	}).then(function(values){
		callback(values.articles);
	})
}

function returnToMainPage()
{
	$("#carouselDiv").fadeOut('fast');
	$("#sourceDiv").fadeIn('slow');
	$("#navbarCollapse").collapse('hide');
}

function getSourcesFromAPI(callback)
{
	var req = new Request(src_url);
	var promise = new Promise(function(resolve, reject){
		fetch(req)
		.then(function(response) {
			resolve(response.json());
		});
	}).then(function(values){
		callback(values.sources);
	});
}

async function showNews(ele)
{
	let id = $(ele).data("source");
	getNews(id);
	$("#sourceDiv").fadeOut('fast');
	$("#carouselDiv").fadeIn('slow');
}



async function getNews(id)
{
	var url = 'https://newsapi.org/v2/top-headlines?' +
						'sources='+id+'&' +
						'apiKey=7f23e3c36ac44b33af63aa1ae194c1b1';
	getNewsFromAPI(url, async function(data){
		let news = await data;
		handleNews(news);
	})
}

function getSources()
{
	getSourcesFromAPI(function(data){
		handleSources(data);
	})
}

function handleNews(json)
{
	let carousel = $("#innerCarousel");

	if($(carousel).html() != ""){
		$(carousel).empty();
	}

	if (json != null && json != undefined && json != null)
	{
		for (var i = 0; i < json.length; i++) {
			let itemdiv = document.createElement('div');
			let img = document.createElement('img');
			let captiondiv = document.createElement('div');
			let captionh4 = document.createElement('h4');
			let captiontext = document.createElement('p');
			let authortext = document.createElement('p');
			let datetext = document.createElement('p');
			let linktext = document.createElement('a');
			let spantext = document.createElement('p');

			if(i == 0){
				$(itemdiv).addClass('carousel-item active');
			}
			else{
				$(itemdiv).addClass('carousel-item');
			}
			$(img).addClass('img-fluid');
			$(captiondiv).addClass('carousel-caption text-center');

			if(json[i].urlToImage == "null"){
				$(img).attr('src','img/placeholder.jpg');
			}
			else{
				$(img).attr('src',json[i].urlToImage);
			}

			$(spantext).addClass('lead');
			$(linktext).addClass('lead');
			$(captiontext).addClass('lead');
			$(linktext).attr('href', json[i].url);
			$(linktext).html('Link');
			$(captionh4).html(json[i].title);
			$(captiontext).html(json[i].description);

			if(json[i].author.includes('http') || json[i].author.includes('https') || json[i].author == 'null'){
				$(authortext).html("Author: " + json[i].source.name);
			}
			else{
				$(authortext).html("Author: " + json[i].author);
			}

			let date = moment(json[i].publishedAt).format('DD.MM.YYYY HH:mm');
			$(datetext).html("published: " + date);

			$(spantext).append($(authortext).html() + ", " + $(datetext).html());
			$(captiondiv).prepend(captionh4);
			$(captiondiv).append(captiontext);
			$(captiondiv).append(linktext);
			$(captiondiv).append(spantext);

			$(itemdiv).prepend(img);
			$(itemdiv).append(captiondiv);

			$("#innerCarousel").append(itemdiv);
		}
	}
}

function handleSources(json)
{
	if (json != null && json != undefined && json != null)
	{
		for (var i = 0; i < json.length; i++) {
			let containerdiv = document.createElement('div');
			let card = document.createElement('div');
			let cardbody = document.createElement('div');
			let cardheader = document.createElement('div');
			let cardfooter = document.createElement('div');
			let cardtext = document.createElement('p');
			let urltext = document.createElement('a');
			let headertext = document.createElement('h5');

			$(containerdiv).addClass('col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4');
			$(card).addClass('card m-3 shadow');
			$(cardbody).addClass('card-body text-center');
			$(cardheader).addClass('card-header text-center');
			$(cardfooter).addClass('card-footer text-center');

			$(headertext).addClass('card-title');
			$(headertext).html(json[i].name);

			$(cardtext).addClass('card-text');
			$(cardtext).html(json[i].description);

			$(urltext).html(json[i].url);

			$(cardheader).prepend(headertext);
			$(cardbody).append(cardtext);
			$(cardfooter).append(urltext);
			$(cardbody).attr('data-source', json[i].id);

			$(card).click(function(){
				showNews(cardbody);
			});

			$(card).prepend(cardheader);
			$(card).append(cardbody);
			$(card).append(cardfooter);

			$(containerdiv).append(card);
			$("#albumRow").append(card);
		}
	}
}

$(document).ready(function(){
	getSources();

	$('.carousel').carousel("pause");

	//$("#carouselDivm .carousel-inner, .carousel-item, .carousel-control-prev, .carousel-control-next").height($(window).innerHeight()*0.9);
})
