function goToHome() {
    window.location.replace('home.html');
}

function getEnderecos() {
    var end = document.getElementById("input").value;
    var result;

    if (end == "") {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [-46.672727, -23.592938],
            zoom: 16
        });

        map.addControl(new mapboxgl.NavigationControl());

        return;
    } else {
        //Open Modal
        document.getElementById('enderecos_modal').style.display = 'block'

        $.ajax({
            type: 'POST',
            data: {
                endereco: end
            },
            url: 'api/[POST]enderecos.php',
            dataType: 'json',
            success: function(r) {
                try {
                    result = JSON.parse(r);
                    if (!result) {
                        window.alert("Erro : Endereço não encontrado");
                        return
                    }
                    showAddressSelectModal(result)
                } catch (error) {
                    window.alert("Erro : Endereço não encontrado");
                }
            },
            error: function(e) {
                window.alert("Erro : Algum erro ocorreu");
            }
        });


        var element = document.getElementById("enderecos_list");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        for (var i = 0; i < result.length; i++) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "radio";
            input.name = "endereco";
            input.value = result[i].endereco + "|" + result[i].latitude + "|" + result[i].longitude;
            var text = document.createTextNode(" " + result[i].endereco);
            label.appendChild(input);
            label.appendChild(text);

            element.appendChild(label);
            element.appendChild(document.createElement("br"));

        }

        var confimationButton = document.createElement("button");
        confimationButton.textContent = "Confirmar";
        confimationButton.id = "mapButton";
        confimationButton.className = "btn";
        confimationButton.onclick = function() {
            plotEndereco();
        };

        element.appendChild(confimationButton);
    }
}

function closeModal() {
    var modal = document.getElementById('enderecos_modal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function plotEndereco(lat, lng) {
    //Close modal if open
    document.getElementById('enderecos_modal').style.display = "none";

    var end
    var iniLat
    var iniLng

    if (lat != null) {
        end = "Você está aqui!"
        iniLat = lat
        iniLng = lng
        mapFlyTo(map, [lng, lat])
    } else {
        var endereco = document.querySelector('input[name=endereco]:checked');
        var item = endereco.value.split("|");
        end = item[0];
        iniLat = item[1];
        iniLng = item[2];

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [iniLng, iniLat],
            zoom: 16
        });

        map.addControl(new mapboxgl.NavigationControl());
    }

    map.flyTo({
        center: [iniLng, iniLat]
    });

    map.loadImage('/assets/imgs/star.png', function(error, image) {
        if (error) throw error;
        map.addImage('star', image);
        map.addLayer({
            "id": "star",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [iniLng, iniLat]
                        }
                    }]
                }
            },
            "layout": {
                "icon-image": "star",
                "icon-size": 0.06
            }
        });
        map.on('click', 'star', function(e) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("Local: " + end)
                .addTo(map);
            map.flyTo({
                center: [iniLng, iniLat]
            });
        });

        map.on('mouseenter', 'star', function() {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'star', function() {
            map.getCanvas().style.cursor = '';
        });
    });
}

function plotLinhas(enabled, lat, lng) {
    removeLayers(true, false);

    if(!enabled && !window.paradas)
        document.getElementById('update-div').style.display = 'none';

    window.linhas = enabled

    if (!enabled) return

    document.getElementById('update-div').style.display = 'block';

    var iniLat = lat;
    var iniLng = lng;

    var linhacoords;

    $.ajax({
        type: 'POST',
        data: {
            latitude: iniLat,
            longitude: iniLng
        },
        url: 'api/[POST]linhas.php',
        dataType: 'json',
        success: function(result) {
            try {
                result = JSON.stringify(result)
                linhacoords = JSON.parse(result);

            } catch (error) {
                window.alert("Erro : Linhas de ônibus não encontradas");
                return
            }

            map.loadImage('/assets/imgs/bus.png', function(error, image) {
                if (error) throw error;
                map.addImage('bus', image);
                map.addLayer(linhacoords);
            });

            map.on('click', 'bus', function(e) {
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.lineCode + ": " + e.features[0].properties.lineName0 + " - " + e.features[0].properties.lineName1)
                    .addTo(map);
                map.flyTo({
                    center: e.features[0].geometry.coordinates
                });
            });

            map.on('mouseenter', 'bus', function() {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'bus', function() {
                map.getCanvas().style.cursor = '';
            });
        },

        error: function() {
            window.alert("Erro : Algum erro aconteceu");
        }
    });

}

function plotParadas(enabled, lat, lng) {

    removeLayers(false, true);

    if(!enabled && !window.linhas)
        document.getElementById('update-div').style.display = 'none';

    window.rotas = enabled

    document.getElementById('update-div').style.display = 'none';
    if (!enabled) return

    document.getElementById('update-div').style.display = 'none';

    var iniLat = lat
    var iniLng = lng

    var paradas;

    $.ajax({
        type: 'POST',
        data: {
            latitude: iniLat,
            longitude: iniLng
        },
        url: 'api/[POST]paradas.php',
        dataType: 'json',

        success: function(result) {
            try {
                paradas = result;
            } catch (error) {
                window.alert("Erro : Paradas de ônibus não encontradas");
                return
            }
            map.loadImage('/assets/imgs/stops.png', function(error, image) {
                if (error) throw error;
                map.addImage('stops', image);
                map.addLayer(paradas);
            });

            console.log()

            map.on('click', 'stops', function(e) {
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.codigo + " - " + e.features[0].properties.endereco + " - " + e.features[0].properties.referencia)
                    .addTo(map);
                map.flyTo({
                    center: e.features[0].geometry.coordinates
                });
            });

            map.on('mouseenter', 'stops', function() {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'stops', function() {
                map.getCanvas().style.cursor = '';
            });
        },

        error: function() {
            window.alert("Erro : Algum erro aconteceu");
        }
    });

}

function updateMap(lat, lng) {
    removeLayers();

    plotLinhas(lat, lng);
}

function centralizeMap(lat, lng) {
    removeLayers();

    var ele = document.getElementsByName("option");
    for (var i = 0; i < ele.length; i++)
        ele[i].checked = false;

    document.getElementById('update-div').style.display = 'none';

    map.flyTo({
        center: [lng, lat],
        zoom: 16
    });

    longitude = lng;
    latitude = lat;
}

function removeLayers(skipStops, skipBus) {
    try {
        if (!skipStops && map.getLayer('stops')) {
            map.removeLayer('stops');
            map.removeSource('stops');
            map.removeImage('stops');
        }
    } catch (err) {}

    try {
        if (!skipBus && map.getLayer('stops')) {
            map.removeLayer('bus');
            map.removeSource('bus');
            map.removeImage('bus');
        }
    } catch (err) {}
}
