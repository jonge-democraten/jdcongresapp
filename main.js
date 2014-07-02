function activateMenuItem(item) {
    'use strict';
    if (item === 'homemenuitem') {
        $('#homemenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#homemenuitem')[0].setAttribute('class', '');
    }
    if (item === 'agendamenuitem') {
        $('#agendamenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#agendamenuitem')[0].setAttribute('class', '');
    }
    if (item === 'motiesmenuitem') {
        $('#motiesmenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#motiesmenuitem')[0].setAttribute('class', '');
    }
    if (item === 'locatiesmenuitem') {
        $('#locatiesmenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#locatiesmenuitem')[0].setAttribute('class', '');
    }
    if (item === 'twittermenuitem') {
        $('#twittermenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#twittermenuitem')[0].setAttribute('class', '');
    }
}


function loadHomePagina() {
	'use strict';
    activateMenuItem('homemenuitem');
	var content = JSON.parse(localStorage.getItem('homepagina'));
	if (content === null) {
		loadDb(loadHomePagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
	}
	document.getElementById('main').innerHTML = content;
}

function loadAgendaPagina() {
	'use strict';
    activateMenuItem('agendamenuitem');
	var agenda = JSON.parse(localStorage.getItem("agenda"));
	if (agenda === null) {
		loadDb(loadAgendaPagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
	}
	document.getElementById('main').innerHTML = '';
	agenda.forEach(function(day) {
		var panel = document.createElement('div');
        panel.setAttribute('class', 'panel panel-default');
        var header = document.createElement('div');
        header.setAttribute('class', 'panel-heading');
        header.appendChild(document.createTextNode(day['datum']));
        panel.appendChild(header);

        var group = document.createElement('ul');
        group.setAttribute('class', 'list-group');
		day["items"].forEach(function(item) {
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
			li.innerHTML = item["tijd"] + " " + item["titel"] + "<br/>Locatie: " + item["locatie"];
			group.appendChild(li);
		});
		panel.appendChild(group);
		document.getElementById('main').appendChild(panel);
	});
}

var map;
function loadLocatiesPagina() {
    'use strict';
    activateMenuItem('locatiesmenuitem');
    var mapdiv = document.createElement('div');
    mapdiv.setAttribute('id', 'map');
    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(mapdiv);
    map = new OpenLayers.Map({
        div: "map",
        //theme: null,
        projection: new OpenLayers.Projection("EPSG:900913"),
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ]
    });
    map.setCenter(new OpenLayers.LonLat(0, 0), 3);
}

function loadTwitterPagina() {
	'use strict';
    activateMenuItem('twittermenuitem');
	var html = '<a class="twitter-timeline" href="https://twitter.com/hashtag/jdcongres" ';
	html += 'data-chrome="nofooter transparent" data-widget-id="479729190476845056">#jdcongres';
	html += ' Tweets</a>';
	document.getElementById('main').innerHTML = html;
	var script = document.createElement('script');
	script.setAttribute('src','https://platform.twitter.com/widgets.js');
	document.getElementById('main').appendChild(script);
}

function loadDb(onload, onerr) {
	'use strict';
	// Get the database
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'data.json', true);
	xhr.onload = function(e) {
		if (this.status === 200) {
			var data = JSON.parse(this.responseText);
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					localStorage.setItem(key, JSON.stringify(data[key]));
				}
			}
			if (onload !== null) {
				onload();
			}
		} else {
			if (onerr !== null) {
				onerr();
			}
		}
	};
	xhr.send();
}


