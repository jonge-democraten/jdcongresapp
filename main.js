var activateExport = false;

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
    if (item === 'instellingenmenuitem') {
        $('#instellingenmenuitem')[0].setAttribute('class', 'active');
    } else {
        $('#instellingenmenuitem')[0].setAttribute('class', '');
    }
}


function loadHomePagina() {
    'use strict';
    activateMenuItem('homemenuitem');
    var content = JSON.parse(localStorage.getItem('nieuwsitems'));
    if (content === null) {
        loadDb(loadHomePagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
        return;
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
    'use strict';
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
        return;
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
    'use strict';
	if (voorstelA['id'] < voorstelB['id'])
		return -1;
	if (voorstelA['id'] > voorstelB['id'])
		return 1;
	return 0;
}

function setVoorkeur(voorstelId, voorkeur) {
    'use strict';
    localStorage.setItem('voorkeur-voorstel-'+voorstelId.toString(), voorkeur);
    var voorstelLink = document.getElementById('voorstellistitem'+voorstelId.toString());
    if (voorkeur == "voor") voorstelLink.setAttribute('class', "list-group-item list-group-item-success");
    else if (voorkeur == "tegen") voorstelLink.setAttribute('class', "list-group-item list-group-item-danger");
    else voorstelLink.setAttribute('class', "list-group-item");
}

function saveNote(voorstelId) {
    'use strict';
    var noteTextElement = document.getElementById('voorstel-note-'+voorstelId.toString());
    if (noteTextElement.value != "") {
        localStorage.setItem('voorstel-note-'+voorstelId.toString(), noteTextElement.value);
        voegPenToe(voorstelId);
    }
    else {
        localStorage.removeItem('voorstel-note-'+voorstelId.toString());
        verwijderPen(voorstelId);
    }
}

function openNote(voorstelId, unconditional) {
    'use strict';
    var voorstelNoteText = localStorage.getItem('voorstel-note-'+voorstelId.toString());
    if (voorstelNoteText == null) {
        voorstelNoteText = "";
    }
    
    document.getElementById('voorstel-note-'+ voorstelId.toString()).value = voorstelNoteText;
    $("#voorstel-note-"+voorstelId.toString()).elastic();
    if (voorstelNoteText != "" || unconditional) {
        $('#voorstel'+voorstelId.toString()+' .notetoggleinv').collapse('hide');
        $('#voorstel'+voorstelId.toString()+' .notetoggle').collapse('show');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').html('<span class="glyphicon glyphicon-trash"></span>');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').removeClass('btn-warning').addClass('btn-danger');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').attr('onclick', 'clearNote('+voorstelId.toString()+')');
        $('#voorstel'+voorstelId.toString()+' .footerclosebutton').html('<span class="glyphicon glyphicon-floppy-disk"></span>');
    }
    else {
        $('#voorstel'+voorstelId.toString()+' .notetoggle').collapse('hide');
        $('#voorstel'+voorstelId.toString()+' .notetoggleinv').collapse('show');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').html('<span class="glyphicon glyphicon-pencil"></span>');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').removeClass('btn-danger').addClass('btn-warning');
        $('#voorstel'+voorstelId.toString()+' .footernotebutton').attr('onclick', 'openNote('+voorstelId.toString()+', true)')
        $('#voorstel'+voorstelId.toString()+' .footerclosebutton').html('<span class="glyphicon glyphicon-log-out"></span>');
    }
}

function clearNote(voorstelId) {
    'use strict';
    document.getElementById('voorstel-note-'+ voorstelId.toString()).value = "";
    
    $("#voorstel-note-"+voorstelId.toString()).elastic();
    
    $('#voorstel'+voorstelId.toString()+' .notetoggle').collapse('hide');
    $('#voorstel'+voorstelId.toString()+' .notetoggleinv').collapse('show');
    $('#voorstel'+voorstelId.toString()+' .footernotebutton').html('<span class="glyphicon glyphicon-pencil"></span>');
    $('#voorstel'+voorstelId.toString()+' .footernotebutton').removeClass('btn-danger').addClass('btn-warning');
    $('#voorstel'+voorstelId.toString()+' .footernotebutton').attr('onclick', 'openNote('+voorstelId.toString()+', true)')
    $('#voorstel'+voorstelId.toString()+' .footerclosebutton').html('<span class="glyphicon glyphicon-log-out"></span>');
    
    saveNote(voorstelId);
}

function voegPenToe(voorstelId) {
    'use strict';
    var link = document.getElementById("voorstellistitem"+voorstelId.toString());
    var searchPencil = link.getElementsByTagName('span');
    if (searchPencil.length == 0) {
        var pencil = document.createElement('span');
        pencil.setAttribute('class', 'pull-right glyphicon glyphicon-pencil');
        link.appendChild(pencil);
    }
}

function verwijderPen(voorstelId) {
    'use strict';
    var link = document.getElementById("voorstellistitem"+voorstelId.toString());
    var searchPencil = link.getElementsByTagName('span');
    if (searchPencil.length != 0) {
        link.removeChild(searchPencil[0]);
    }
}

function updatePen(voorstelId) {
    'use strict';
    if (localStorage.getItem('voorstel-note-'+voorstelId.toString()) != null) voegPenToe(voorstelId);
    else verwijderPen(voorstelId);
}

function setAllPens(maxVoorstelId) {
    'use strict';
    for (var i=1; i <= maxVoorstelId; i++) {
        updatePen(i);
    }
}

function loadMotiesPagina() {
	'use strict';

	activateMenuItem('motiesmenuitem');
	var voorstellen = JSON.parse(localStorage.getItem("voorstellen"));
	if (voorstellen === null) {
		loadDb(loadMotiesPagina, function(){alert('Kan database niet laden. Probeer later opnieuw.');});
        return;
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
			collapsible_content.setAttribute('class', 'list-group panel-collapse collapse');
			collapsible_content.setAttribute('id', 'collapse'+i.toString());
			voorstellen[key].sort(compareVoorstellen); // We sorteren de voorstellen op id (want in die volgorde staan ze ook in het congresboek)
            var hasVoorstellen = false;
			voorstellen[key].forEach(function(voorstel) { // Elk voorstel voegen we toe aan het panel (alleen id + titel) en de modal-lijst
                j = j + 1;
                hasVoorstellen = true;
				
                // Toevoegen aan het panel:
				var link = document.createElement('a');
				link.setAttribute('href', '#voorstel' + j.toString());
                link.setAttribute('id', 'voorstellistitem'+ j.toString());
				link.setAttribute('data-toggle', 'modal');
                link.setAttribute('onclick', 'openNote('+j.toString()+', false)');
                if (localStorage.getItem('voorkeur-voorstel-'+j.toString()) == "voor") {
                    link.setAttribute('class', 'list-group-item list-group-item-success');
                }
                else if (localStorage.getItem('voorkeur-voorstel-'+j.toString()) == "tegen") {
                    link.setAttribute('class', 'list-group-item list-group-item-danger');
                }
                else {
                    link.setAttribute('class', 'list-group-item');
                }
				link.innerHTML = voorstel['id'] + " " + voorstel['titel'];
				collapsible_content.appendChild(link);
                // Toevoegen aan de modal-lijst:
                var voorsteltekst = document.createElement('div');
				voorsteltekst.setAttribute('class', 'modal');
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
				
                // Extra veld voor aantekeningen
                var voorstelnote = document.createElement('div');
                voorstelnote.setAttribute('class', 'modal-body notetoggle collapse');
                var voorstelnotetext = document.createElement('textarea');
                voorstelnotetext.setAttribute('id', 'voorstel-note-'+ j.toString());
                voorstelnotetext.setAttribute('class', 'elastictextarea form-control');
                if (localStorage.getItem('voorstel-note-'+j.toString()) != null) voorstelnotetext.innerHTML = localStorage.getItem('voorstel-note-'+j.toString());
                voorstelnote.appendChild(voorstelnotetext);
                
                // We plakken alles in elkaar
				voorstelbody.appendChild(toelichtingterm);
				voorstelbody.appendChild(toelichting);
				
                var voorstelfooter = document.createElement('div');
				voorstelfooter.setAttribute('class', 'modal-footer');
                
                var footernotebutton = document.createElement('button');
                footernotebutton.setAttribute('class', 'btn btn-warning footernotebutton pull-right');
                footernotebutton.setAttribute('onclick', 'openNote('+j.toString()+', true)');
                footernotebutton.innerHTML = '<span class="glyphicon glyphicon-pencil"></span>';
				
                var footerstembuttons = document.createElement('div');
                footerstembuttons.setAttribute('class', 'btn-group pull-left');
                footerstembuttons.setAttribute('data-toggle', 'buttons');
                
                var footervoorbutton = document.createElement('label');
                footervoorbutton.setAttribute('class', 'btn btn-success');
                footervoorbutton.setAttribute('onclick', 'setVoorkeur('+j.toString()+', "voor")');
                footervoorbutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-thumbs-up"></span></label>';
                
                var footerneutraalbutton = document.createElement('label');
                footerneutraalbutton.setAttribute('class', 'btn btn-default');
                footerneutraalbutton.setAttribute('onclick', 'setVoorkeur('+j.toString()+', "neutraal")');
                footerneutraalbutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-ban-circle"></span></label>';
                
                var footertegenbutton = document.createElement('label');
                footertegenbutton.setAttribute('class', 'btn btn-danger');
                footertegenbutton.setAttribute('onclick', 'setVoorkeur('+j.toString()+', "tegen")');
                footertegenbutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-thumbs-down"></span></label>';
                
                footerstembuttons.appendChild(footervoorbutton);
                footerstembuttons.appendChild(footerneutraalbutton);
                footerstembuttons.appendChild(footertegenbutton);
                
                var footerclosebutton = document.createElement('button');
				footerclosebutton.setAttribute('class', 'footerclosebutton btn btn-default pull-right');
				footerclosebutton.setAttribute('data-dismiss', 'modal');
                footerclosebutton.setAttribute('onclick', 'saveNote('+j.toString()+')');
				footerclosebutton.innerHTML = '<span class="glyphicon glyphicon-log-out"></span>';
                
                voorstelfooter.appendChild(footerclosebutton);
                voorstelfooter.appendChild(footernotebutton);
                voorstelfooter.appendChild(footerstembuttons);
				voorstelcontent.appendChild(voorstelheader);
				voorstelcontent.appendChild(voorstelbody);
                voorstelcontent.appendChild(voorstelnote);
				voorstelcontent.appendChild(voorstelfooter);
				voorsteldialog.appendChild(voorstelcontent);
				voorsteltekst.appendChild(voorsteldialog);
				voorstelteksten.appendChild(voorsteltekst);
            });
			panel.appendChild(collapsible_content);
			if (hasVoorstellen) document.getElementById('main').appendChild(panel);
		}
	}
	document.getElementById('main').appendChild(voorstelteksten);
    $('.notetoggle').collapse({ toggle: false });
    $('.notetoggleinv').collapse({ toggle: false });
    setAllPens(j);
}

function transformExtent(coordinates) {
    'use strict';
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
    'use strict';
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
        return;
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
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
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
    if (locaties.length == 1) {
        map.getView().setZoom(18);
    }
    console.debug(map.getView().getZoom());
    
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

function resetLocalStorage() {
    'use strict';
    localStorage.clear();
    location.reload(true);
}

function setFontSize(fontSize) {
    'use strict';
    if (fontSize == 'L') {
        document.getElementById('theBody').style.fontSize = '14px';
    }
    else if (fontSize == 'S') {
        document.getElementById('theBody').style.fontSize = '10px';
    }
    else {
        document.getElementById('theBody').style.fontSize = '12px';
    }
}

function loadInstellingenPagina() {
    'use strict';
    activateMenuItem('instellingenmenuitem');
    document.getElementById('main').innerHTML = '';
    
    // Panel voor tekstgrootte
    var sizePanel = document.createElement('div');
    sizePanel.setAttribute('class', 'panel panel-default');
    
    var sizeHeader = document.createElement('div');
    sizeHeader.setAttribute('class', 'panel-heading');
    sizeHeader.appendChild(document.createTextNode("Tekstformaat"));
    
    sizePanel.appendChild(sizeHeader);
    
    var sizeBody = document.createElement('div');
    sizeBody.setAttribute('class', 'panel-body');
    
    var sizeBodyText = document.createElement('div');
    sizeBodyText.setAttribute('class', 'pull-left');
    sizeBodyText.appendChild(document.createTextNode("Maak de tekst in de app een beetje groter of kleiner."));
    sizeBody.appendChild(sizeBodyText);

    var sizebuttons = document.createElement('div');
    sizebuttons.setAttribute('class', 'btn-group pull-right');
    sizebuttons.setAttribute('data-toggle', 'buttons');
    
    var sizesmallbutton = document.createElement('label');
    sizesmallbutton.setAttribute('class', 'btn btn-default');
    sizesmallbutton.setAttribute('onclick', 'setFontSize("S")');
    sizesmallbutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-chevron-down"></span></label>';
    
    var sizemediumbutton = document.createElement('label');
    sizemediumbutton.setAttribute('class', 'btn btn-default');
    sizemediumbutton.setAttribute('onclick', 'setFontSize("M")');
    sizemediumbutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-minus"></span></label>';
    
    var sizelargebutton = document.createElement('label');
    sizelargebutton.setAttribute('class', 'btn btn-default');
    sizelargebutton.setAttribute('onclick', 'setFontSize("L")');
    sizelargebutton.innerHTML = '<input type="radio" name="options"><span class="glyphicon glyphicon-chevron-up"></span></label>';
    
    sizebuttons.appendChild(sizesmallbutton);
    sizebuttons.appendChild(sizemediumbutton);
    sizebuttons.appendChild(sizelargebutton);
    
    sizeBody.appendChild(sizebuttons);
    
    sizePanel.appendChild(sizeBody);
    
    document.getElementById('main').appendChild(sizePanel);
    
    // Panel voor reset-button
    var resetPanel = document.createElement('div');
    resetPanel.setAttribute('class', 'panel panel-default');
    
    var resetHeader = document.createElement('div');
    resetHeader.setAttribute('class', 'panel-heading');
    resetHeader.appendChild(document.createTextNode("Verwijder lokale informatie"));
    
    resetPanel.appendChild(resetHeader);
    
    var resetBody = document.createElement('div');
    resetBody.setAttribute('class', 'panel-body');
    
    var resetBodyText = document.createElement('div');
    resetBodyText.setAttribute('class', 'pull-left');
    resetBodyText.appendChild(document.createTextNode("Verwijder alle informatie en herlaad deze vanaf de server. Dit verwijdert ook alle aantekeningen en voorkeuren. Dit is nodig om de app voor een nieuw congres klaar te maken."));
    resetBody.appendChild(resetBodyText);

    var resetButton = document.createElement('button');
    resetButton.setAttribute('class', 'btn btn-primary pull-right');
    resetButton.setAttribute('onclick', 'resetLocalStorage()');
    resetButton.innerHTML = '<span class="glyphicon glyphicon-repeat"></span>';
    resetBody.appendChild(resetButton);
    
    resetPanel.appendChild(resetBody);
    
    document.getElementById('main').appendChild(resetPanel);
    
    // Panel voor store-button
    var storePanel = document.createElement('div');
    storePanel.setAttribute('class', 'panel panel-default');
    
    var storeHeader = document.createElement('div');
    storeHeader.setAttribute('class', 'panel-heading');
    storeHeader.appendChild(document.createTextNode("Exporteer aantekeningen en voorkeuren"));
    
    storePanel.appendChild(storeHeader);
    
    var storeBody = document.createElement('div');
    storeBody.setAttribute('class', 'panel-body');
    
    var storeBodyText = document.createElement('div');
    storeBodyText.setAttribute('class', 'pull-left');
    storeBodyText.appendChild(document.createTextNode("Exporteer alle informatie uit de app, inclusief aantekeningen en voorkeuren, naar de server. Met de Importeer-functie kun je deze op een ander apparaat weer inladen. Alle informatie wordt versleuteld voor verzending en is dus niet voor de beheerders in te zien."));
    storeBody.appendChild(storeBodyText);

    var storeButton = document.createElement('button');
    storeButton.setAttribute('class', 'btn btn-primary pull-right');
    storeButton.setAttribute('onclick', 'exportData()');
    storeButton.innerHTML = '<span class="glyphicon glyphicon-cloud-upload"></span>';
    storeBody.appendChild(storeButton);
    
    storePanel.appendChild(storeBody);
    
    if (activateExport) {
        document.getElementById('main').appendChild(storePanel);
    }
    
    // Panel voor restore-button
    var restorePanel = document.createElement('div');
    restorePanel.setAttribute('class', 'panel panel-default');
    
    var restoreHeader = document.createElement('div');
    restoreHeader.setAttribute('class', 'panel-heading');
    restoreHeader.appendChild(document.createTextNode("Importeer aantekeningen en voorkeuren"));
    
    restorePanel.appendChild(restoreHeader);
    
    var restoreBody = document.createElement('div');
    restoreBody.setAttribute('class', 'panel-body');
    
    var restoreBodyText = document.createElement('div');
    restoreBodyText.setAttribute('class', 'pull-left');
    restoreBodyText.appendChild(document.createTextNode("Importeer geëxporteerde informatie vanaf de server."));
    restoreBody.appendChild(restoreBodyText);

    var restoreButton = document.createElement('button');
    restoreButton.setAttribute('class', 'btn btn-primary pull-right');
    restoreButton.setAttribute('data-toggle', 'collapse');
    restoreButton.setAttribute('data-target', '#enterexportcode');
    restoreButton.innerHTML = '<span class="glyphicon glyphicon-cloud-download"></span>';
    restoreBody.appendChild(restoreButton);
    
    var enterExportCode = document.createElement('div');
    enterExportCode.setAttribute('class', 'panel-body collapse');
    enterExportCode.setAttribute('id', 'enterexportcode');
    enterExportCode.innerHTML = 'Voer de exportcode in: <input type="text" id="exportcodeinvoer" class="form-control"><button class="btn btn-primary" onclick="importData()"><span class="glyphicon glyphicon-ok"></span></button>';
    restoreBody.appendChild(enterExportCode);
    
    restorePanel.appendChild(restoreBody);
    restorePanel.appendChild(enterExportCode);
    
    if (activateExport) {
        document.getElementById('main').appendChild(restorePanel);
    }
    
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

function exportData() {
    'use strict';
    var storedInfo = stringifyLocalStorage();
    
    console.debug(storedInfo['ciphertext']);
    console.debug(storedInfo['iv']);
    console.debug(storedInfo['salt']);
    console.debug(storedInfo['passphrase']);
    
    var ciphertext = storedInfo['ciphertext'];
    var iv = storedInfo['iv'];
    var salt = storedInfo['salt'];
    var passphrase = storedInfo['passphrase'];
    storedInfo['passphrase'] = '';
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'export.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = function(e) {
        if (this.status === 200) {
            var data = this.responseText;
            if (!document.getElementById('codepopup')) {
                var codePopup = document.createElement('div');
                codePopup.setAttribute('class', 'modal');
                codePopup.setAttribute('id', 'codepopup');
                codePopup.setAttribute('tabindex', '-1'); // For Esc key to work
                
                var codePopupDialog = document.createElement('div');
                codePopupDialog.setAttribute('class', 'modal-dialog');
                
                var codePopupContent = document.createElement('div');
                codePopupContent.setAttribute('class', 'modal-content');
                
                var codePopupHeader = document.createElement('div');
                codePopupHeader.setAttribute('class', 'modal-header');
                
                var closebutton = document.createElement('button');
                closebutton.setAttribute('type', 'button');
                closebutton.setAttribute('class', 'close');
                closebutton.setAttribute('data-dismiss', 'modal');
                closebutton.appendChild(document.createTextNode('\u00d7'));
                
                codePopupHeader.appendChild(closebutton);
                codePopupHeader.appendChild(document.createTextNode("Exporteren succesvol"));
                
                var codePopupBody = document.createElement('div');
                codePopupBody.setAttribute('class', 'modal-body');
                codePopupBody.setAttribute('id', 'exportcode');
                
                codePopupContent.appendChild(codePopupHeader);
                codePopupContent.appendChild(codePopupBody);
                codePopupDialog.appendChild(codePopupContent);
                codePopup.appendChild(codePopupDialog);
                document.getElementById('main').appendChild(codePopup);
            }
            
            document.getElementById('exportcode').innerHTML = '';
            document.getElementById('exportcode').appendChild(document.createTextNode("Export is succesvol verlopen. Kopieer onderstaande code om de geëxporteerde informatie op een ander apparaat te importeren."));
            
            var codeField = document.createElement('div');
            codeField.innerHTML = '<input type="text" class="form-control" readonly="readonly" value="'+data+passphrase+'">';
            
            document.getElementById('exportcode').appendChild(codeField);
            $('#codepopup').modal('show');
        }
    };
    xhr.send('data='+JSON.stringify(storedInfo));
}

function stringifyLocalStorage() {
    'use strict';
    
    var passphrase = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    
    var storedInfo = {};
    
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var content = localStorage.getItem(key);
        storedInfo[key] = content;
    }
    
    var message = JSON.stringify(storedInfo);
    
    var encryptedInfo = CryptoJS.AES.encrypt(message, passphrase);
    
    return {
        ciphertext: encryptedInfo.ciphertext.toString(CryptoJS.enc.Hex),
        iv: encryptedInfo.iv.toString(),
        salt: encryptedInfo.salt.toString(),
        passphrase: passphrase
    };
}

function importData() {
    'use strict';
    
    var exportcode = document.getElementById('exportcodeinvoer').value;
    var index = exportcode.slice(0,32);
    var passphrase = exportcode.slice(32,64);
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'export.php?iv='+index, true);
    
    xhr.onload = function(e) {
        if (this.status === 200) {
            var data = JSON.parse(this.responseText);
            
            console.debug(data['ciphertext']);
            console.debug(data['iv']);
            console.debug(data['salt']);
            console.debug(passphrase);
            
            restoreLocalStorage(data['ciphertext'], passphrase, data['iv'], data['salt']);
            
            if (!document.getElementById('importpopup')) {
                var importPopup = document.createElement('div');
                importPopup.setAttribute('class', 'modal');
                importPopup.setAttribute('id', 'importpopup');
                importPopup.setAttribute('tabindex', '-1'); // For Esc key to work
                
                var importPopupDialog = document.createElement('div');
                importPopupDialog.setAttribute('class', 'modal-dialog');
                
                var importPopupContent = document.createElement('div');
                importPopupContent.setAttribute('class', 'modal-content');
                
                var importPopupHeader = document.createElement('div');
                importPopupHeader.setAttribute('class', 'modal-header');
                
                var closebutton = document.createElement('button');
                closebutton.setAttribute('type', 'button');
                closebutton.setAttribute('class', 'close');
                closebutton.setAttribute('data-dismiss', 'modal');
                closebutton.appendChild(document.createTextNode('\u00d7'));
                
                importPopupHeader.appendChild(closebutton);
                importPopupHeader.appendChild(document.createTextNode("Importeren succesvol"));
                    
                var importPopupBody = document.createElement('div');
                importPopupBody.setAttribute('class', 'modal-body');
                
                importPopupBody.appendChild(document.createTextNode("Importeren is gelukt."));
                
                importPopupContent.appendChild(importPopupHeader);
                importPopupContent.appendChild(importPopupBody);
                importPopupDialog.appendChild(importPopupContent);
                importPopup.appendChild(importPopupDialog);
                document.getElementById('main').appendChild(importPopup);
            }
            
            $('#enterexportcode').collapse('hide');
            $('#importpopup').modal('show');
        }
    };
    
    xhr.send();    
}

function restoreLocalStorage(ciphertext, passphrase, iv, salt) {
    'use strict';
    
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
        iv: CryptoJS.enc.Hex.parse(iv),
        salt: CryptoJS.enc.Hex.parse(salt)
    });
    
    var decrypted = CryptoJS.AES.decrypt(cipherParams, passphrase);
    var infoStringToRestore = decrypted.toString(CryptoJS.enc.Utf8);

    localStorage.clear();
    
    var infoToRestore = JSON.parse(infoStringToRestore);
    
    for (var key in infoToRestore) {
        if (infoToRestore.hasOwnProperty(key)) {
            localStorage.setItem(key, infoToRestore[key]);
        }
    }
}
