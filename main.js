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

function compareVoorstellen(voorstelA, voorstelB) {
	if (voorstelA['id'] < voorstelB['id'])
		return -1;
	if (voorstelA['id'] > voorstelB['id'])
		return 1;
	return 0;
}

function loadMotiesPagina() {
	'use strict';
	activateMenuItem('motiesmenuitem');
	var voorstellen = JSON.parse(localStorage.getItem("voorstellen"));
	if (voorstellen === null) {
		loadDb(loadMotiesPagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
	}
	document.getElementById('main').innerHTML = '';
	var i = 0; // Index voor groepen
	var j = 0; // Index voor voorstellen
	var voorstelteksten = document.createElement('div'); // We slaan de voorstelteksten buiten de collapse-structuur op
	voorstelteksten.setAttribute('id', 'voorstelteksten');
	
	for (var key in voorstellen) { // We lopen over de verschillende groepen voorstellen heen
		if (voorstellen.hasOwnProperty(key)) {
			// Per voorstelgroep hebben we een collapsible panel dat standaard dicht staat
			i = i+1;
			var panel = document.createElement('div');
			panel.setAttribute('class', 'panel panel-default');
			var header = document.createElement('div');
			header.setAttribute('class', 'panel-heading');
			var headerlink = document.createElement('a');
			headerlink.setAttribute('data-toggle', 'collapse');
			headerlink.setAttribute('data-parent', '#main');
			headerlink.setAttribute('href', '#collapse'+i.toString());
			headerlink.appendChild(document.createTextNode(key));
			header.appendChild(headerlink);
			panel.appendChild(header);
			
			// De voorsteltitels worden in het panel opgenomen, standaard ingeklapt
			var collapsible_content = document.createElement('div');
			collapsible_content.setAttribute('class', 'panel-collapse collapse');
			collapsible_content.setAttribute('id', 'collapse'+i.toString());
			var group = document.createElement('div');
			group.setAttribute('class', 'list-group');
			voorstellen[key].sort(compareVoorstellen); // We sorteren de voorstellen op id (want in die volgorde staan ze ook in het congresboek)
			voorstellen[key].forEach(function(voorstel) { // Elk voorstel voegen we toe aan het panel (alleen id + titel) en de modal-lijst
				j = j + 1;
				// Toevoegen aan het panel:
				var link = document.createElement('a');
				link.setAttribute('href', '#voorstel' + j.toString());
				link.setAttribute('class', 'list-group-item');
				link.setAttribute('data-toggle', 'modal');
				link.innerHTML = voorstel['id'] + " " + voorstel['titel'];
				group.appendChild(link);
				// Toevoegen aan de modal-lijst:
				var voorsteltekst = document.createElement('div');
				voorsteltekst.setAttribute('class', 'modal fade');
				voorsteltekst.setAttribute('id', 'voorstel' + j.toString());
				voorsteltekst.setAttribute('tabindex', '-1'); // For Esc key to work
				var voorsteldialog = document.createElement('div');
				voorsteldialog.setAttribute('class', 'modal-dialog');
				var voorstelcontent = document.createElement('div');
				voorstelcontent.setAttribute('class', 'modal-content');
				var voorstelheader = document.createElement('div');
				voorstelheader.setAttribute('class', 'modal-header');
				var closebutton = document.createElement('button');
				closebutton.setAttribute('type', 'button');
				closebutton.setAttribute('class', 'close');
				closebutton.setAttribute('data-dismiss', 'modal');
				closebutton.appendChild(document.createTextNode('\u00d7'));
				voorstelheader.appendChild(closebutton);
				voorstelheader.appendChild(document.createTextNode(voorstel['id'] + " " + voorstel['titel']));
				var voorstelbody = document.createElement('div');
				voorstelbody.setAttribute('class', 'modal-body');
				// De inhoud staat opgesomd in een dl-opsomming
				var voorstelopsomming = document.createElement('dl');
				voorstelopsomming.setAttribute('class', 'dl-horizontal');
				var woordvoerderterm = document.createElement('dt');
				woordvoerderterm.appendChild(document.createTextNode("Woorvoerder"));
				var woordvoerder = document.createElement('dd');
				woordvoerder.appendChild(document.createTextNode(voorstel['woordvoerder']));
				var indienersterm = document.createElement('dt');
				indienersterm.appendChild(document.createTextNode("Indieners"));
				var indieners = document.createElement('dd');
				indieners.appendChild(document.createTextNode(voorstel['indieners'].join(', ')));
				voorstelbody.appendChild(woordvoerderterm);
				voorstelbody.appendChild(woordvoerder);
				voorstelbody.appendChild(indienersterm);
				voorstelbody.appendChild(indieners);
				// De acties staan in een array
				for (var actie in voorstel['inhoud']) {
					var actietype = document.createElement('dt');
					console.debug(actie);
					actietype.appendChild(document.createTextNode(voorstel['inhoud'][actie][0]));
					var actietekst = document.createElement('dd');
					// Elke actie kan bullets bevatten, afhankelijk daarvan is het een array of niet
					if (voorstel['inhoud'][actie][1] instanceof Array) {
						var actiebullets = document.createElement('ul');
						for (var k in voorstel['inhoud'][actie][1]) {
							var actiebullet = document.createElement('li');
							actiebullet.appendChild(document.createTextNode(voorstel['inhoud'][actie][1][k]));
							actiebullets.appendChild(actiebullet);
						}
						actietekst.appendChild(actiebullets);
					}
					else {
						actietekst.appendChild(document.createTextNode(voorstel['inhoud'][actie][1]));
					}
					voorstelbody.appendChild(actietype);
					voorstelbody.appendChild(actietekst);
				}
				var toelichtingterm = document.createElement('dt');
				toelichtingterm.appendChild(document.createTextNode("Toelichting"));
				var toelichting = document.createElement('dd');
				toelichting.appendChild(document.createTextNode(voorstel['toelichting']));
				// We plakken alles in elkaar
				voorstelbody.appendChild(toelichtingterm);
				voorstelbody.appendChild(toelichting);
				voorstelcontent.appendChild(voorstelheader);
				voorstelcontent.appendChild(voorstelbody);
				voorsteldialog.appendChild(voorstelcontent);
				voorsteltekst.appendChild(voorsteldialog);
				voorstelteksten.appendChild(voorsteltekst);
			});
			collapsible_content.appendChild(group);
			panel.appendChild(collapsible_content);
			document.getElementById('main').appendChild(panel);
		}
	}
	document.getElementById('main').appendChild(voorstelteksten);
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


