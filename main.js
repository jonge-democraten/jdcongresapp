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
    var content = JSON.parse(localStorage.getItem('nieuwsitems'));
    if (content === null) {
        loadDb(loadHomePagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
	}
    document.getElementById('main').innerHTML = '';
    content.forEach(function(nieuwsitem){
        var panel = document.createElement('div');
        panel.setAttribute('class', 'panel panel-default');
        
        var header = document.createElement('div');
        header.setAttribute('class', 'panel-heading');
        header.appendChild(document.createTextNode(nieuwsitem['titel']));
        panel.appendChild(header);
        
        var body = document.createElement('div');
        body.setAttribute('class', 'panel-body');
        body.appendChild(document.createTextNode(nieuwsitem['tekst']));
        panel.appendChild(body);
        
        document.getElementById('main').appendChild(panel);
    });
}

function pad(number) {
    if (number >= 0 && number < 10) {
        return "0"+number.toString();
    }
    else return number.toString();
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
        var date = new Date(day['datum']);
        header.appendChild(document.createTextNode(date.toLocaleDateString()));
        panel.appendChild(header);

        var group = document.createElement('ul');
        group.setAttribute('class', 'list-group');
		day["items"].forEach(function(item) {
            var now = new Date();
            var begintijd = new Date(item['tijd']);
            var eindtijd = new Date(item['eindtijd']);
            if (now > begintijd && now < eindtijd) {
                var html = "<b>" + pad(begintijd.getHours()) + ":" + pad(begintijd.getMinutes()) + " " + item['titel'] + "</b><br/>Locatie: " + item["locatie"];
            }
            else {
                var html = pad(begintijd.getHours()) + ":" + pad(begintijd.getMinutes()) + " " + item['titel'] + "<br/>Locatie: " + item["locatie"];
            }
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
			li.innerHTML = html;
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
            header.setAttribute('data-parent', '#main');
            header.setAttribute('onclick', "$('#collapse"+i.toString()+"').collapse('toggle')")
			header.appendChild(document.createTextNode(key));
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
				var voorstelfooter = document.createElement('div');
				voorstelfooter.setAttribute('class', 'modal-footer');
				var footerclosebutton = document.createElement('button');
				footerclosebutton.setAttribute('class', 'btn btn-default');
				footerclosebutton.setAttribute('data-dismiss', 'modal');
				footerclosebutton.appendChild(document.createTextNode('Sluit'));
				voorstelfooter.appendChild(footerclosebutton);
				voorstelcontent.appendChild(voorstelheader);
				voorstelcontent.appendChild(voorstelbody);
				voorstelcontent.appendChild(voorstelfooter);
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

function transformExtent(coordinates) {
    var onecorner = ol.proj.transform([coordinates[0], coordinates[1]], "EPSG:4326", "EPSG:900913");
    var othercorner = ol.proj.transform([coordinates[2], coordinates[3]], "EPSG:4326", "EPSG:900913");
    return [
        onecorner[0],
        onecorner[1],
        othercorner[0],
        othercorner[1],
    ];
}

function locatiesToExtent(locaties) {
    var lonmin = locaties[0]['long'];
    var lonmax = lonmin;
    var latmin = locaties[0]['lat'];
    var latmax = latmin;
    for (var i in locaties) {
        if (locaties[i]['long'] > lonmax) {
            lonmax = locaties[i]['long'];
        }
        else if (locaties[i]['long'] < lonmin) {
            lonmin = locaties[i]['long'];
        }
        if (locaties[i]['lat'] > latmax) {
            latmax = locaties[i]['lat'];
        }
        else if (locaties[i]['lat'] < latmin) {
            latmin = locaties[i]['lat'];
        }
    }
    
    var new_extent = transformExtent(
        [
            lonmin,
            latmin,
            lonmax,
            latmax,
        ]
    );
    
    return new_extent;
}

var map;
var popup;
function loadLocatiesPagina() {
    'use strict';
    activateMenuItem('locatiesmenuitem');
    var locaties = JSON.parse(localStorage.getItem("locaties"));
	if (locaties === null) {
		loadDb(loadLocatiesPagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
	}
	var mapdiv = document.createElement('div');
    mapdiv.setAttribute('id', 'map');
    document.getElementById('main').innerHTML = '';
    document.getElementById('main').appendChild(mapdiv);
    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', 'popup');
    document.getElementById('main').appendChild(popupdiv);
    
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 32],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'data/icon.png'
        }))
    });
    
    var features = [];

    for (var locatieIndex in locaties) {
        if (locaties[locatieIndex]['naam'] == "midden") {
            center = ol.proj.transform([locaties[locatieIndex]['long'], locaties[locatieIndex]['lat']], "EPSG:4326", "EPSG:900913");
        }
        else {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([locaties[locatieIndex]['long'], locaties[locatieIndex]['lat']], "EPSG:4326", "EPSG:900913")),
                name: locaties[locatieIndex]['naam'],
            });
            iconFeature.setStyle(iconStyle);
            features.push(iconFeature);
        }
    }

    var vectorSource = new ol.source.Vector({
        features: features
    })
        
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    
    var extent = locatiesToExtent(locaties);
    
    map = new ol.Map({
        target: "map",
        view: new ol.View({
            extent: extent,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer            
        ],
    });
    map.getView().fitExtent(extent, map.getSize());
    
    popup = new ol.Overlay(
        { element: document.getElementById('popup') }
    );
    map.addOverlay(popup);
    
    var element = document.getElementById('popup');
    
    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);
            $(element).popover({
                'placement': 'top',
                'html': true,
                'content': feature.get('name')
            });
            $(element).popover('show');
        } else {
            $(element).popover('destroy');
        }
    });
    
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


