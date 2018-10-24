function setEndereco()
{
    localStorage.setItem("iEndereco", document.getElementById('initialInput').value);
    
    window.location.replace('home.html');
}

function getEnderecos()
{
    var end = document.getElementById("input").value;
    var result;

    if(end == "")
    {
        map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/streets-v9', 
            center: [-46.672727, -23.592938],
            zoom: 16 
        });
        
        map.addControl(new mapboxgl.NavigationControl());

        return;
    }
    else
    {
        //Open Modal
        document.getElementById('enderecos_modal').style.display='block'
        
        $.ajax({
            type: 'POST',
            data: { endereco: end },
            url: 'api/[POST]enderecos.php',
            dataType: 'json',
            async: false,
    
            success: function(r){
                try {
                    result = JSON.parse(r);
                } catch (error) {
                    window.alert("Erro : Endereço não encontrado");
                }
            },
            error: function(e){
                window.alert("Erro : Algum erro ocorreu");
            }
        });
    
    
        var element = document.getElementById("enderecos_list");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    
        for(var i = 0; i < result.length; i++)
        {
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
        confimationButton.onclick = function() { plotEndereco(); };
    
        element.appendChild(confimationButton);
    }  
}

function closeModal()
{
    var modal = document.getElementById('enderecos_modal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function plotEndereco(lat, lng)
{
    //Close modal if open
    document.getElementById('enderecos_modal').style.display = "none";  

    var end;
    var iniLat;
    var iniLng;

    if(lat != null)
    {
        end = "Você está aqui!"
        var iniLat = lat
        var iniLng = lng
    }
    else
    {
        var endereco = document.querySelector('input[name=endereco]:checked');
        var item = endereco.value.split("|"); 
        var end = item[0];
        var iniLat = item[1];
        var iniLng = item[2];

        map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/streets-v9', 
            center: [iniLng, iniLat],
            zoom: 16 
        });
    
        map.addControl(new mapboxgl.NavigationControl());
    }

    map.flyTo({center: [iniLng, iniLat]});
 
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
        map.on('click', 'star', function (e) {
            new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Local: " + end)
            .addTo(map);
            map.flyTo({center: [iniLng, iniLat]});
        });

        map.on('mouseenter', 'star', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'star', function () {
            map.getCanvas().style.cursor = '';
        });
    });
}

function plotLinhas()
{
    var mapLayer = map.getLayer('bus');

    document.getElementById('update-div').style.display = 'block';

    if(typeof mapLayer !== 'undefined') 
        return;

    var endereco = document.querySelector('input[name=endereco]:checked');
    
    try {
        var item = endereco.value.split("|"); 
    } catch (error) {
        alert(error);
        return;
    }

    var iniLat = item[1];
    var iniLng = item[2];

    var linhacoords;

    $.ajax({
        type: 'POST',
        data: 
            { 
                latitude: iniLat,
                longitude: iniLng
            },
        url: 'api/[POST]linhas.php',
        dataType: 'json',
        async: false,

        success: function(result){
            try {
                linhacoords = JSON.parse(result);
            } catch (error) {
                window.alert("Erro : Linhas de ônibus não encontradas");
            }    
        },

        error: function(){
            window.alert("Erro : Algum erro aconteceu");
        }
    });

    map.loadImage('/assets/imgs/bus.png', function(error, image) {
        if (error) throw error;
        map.addImage('bus', image);
        map.addLayer(linhacoords);
    });
    
    map.on('click', 'bus', function (e) {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.lineCode + ": " + e.features[0].properties.lineName0 + " - " + e.features[0].properties.lineName1)
        .addTo(map);
        map.flyTo({center: e.features[0].geometry.coordinates});
    });

    map.on('mouseenter', 'bus', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'bus', function () {
        map.getCanvas().style.cursor = '';
    });
}

function plotParadas(){

    var mapLayer = map.getLayer('stops');

    if(typeof mapLayer !== 'undefined') 
        return;

    document.getElementById('update-div').style.display = 'none';
    
    var endereco = document.querySelector('input[name=endereco]:checked');
    var item = endereco.value.split("|"); 

    var end = item[0];
    var iniLat = item[1];
    var iniLng = item[2];

    var paradas;

    $.ajax({
        type: 'POST',
        data: 
            { 
                endereco: end,
                latitude: iniLat,
                longitude: iniLng 
            },
        url: 'api/[POST]paradas.php',
        dataType: 'json',
        async: false,

        success: function(result){
            try {
                paradas = JSON.parse(result);
            } catch (error) {
                window.alert("Erro : Paradas de ônibus não encontradas");
            }    
        },

        error: function(){
            window.alert("Erro : Algum erro aconteceu");
        }
    });

    map.loadImage('/assets/imgs/stops.png', function(error, image) {
        if (error) throw error;
        map.addImage('stops', image);
        map.addLayer(paradas);
    });
    
    map.on('click', 'stops', function (e) {
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.codigo + " - " + e.features[0].properties.endereco + " - ")
        .addTo(map);
        map.flyTo({center: e.features[0].geometry.coordinates});
    });

    map.on('mouseenter', 'stops', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'stops', function () {
        map.getCanvas().style.cursor = '';
    });
}

function updateMap()
{
    var endereco = document.querySelector('input[name=endereco]:checked');
    var item = endereco.value.split("|"); 

    var iniLat = item[1];
    var iniLng = item[2];

    map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/streets-v9', 
        center: [iniLng, iniLat],
        zoom: 16 
    });

    map.addControl(new mapboxgl.NavigationControl());

    var mapLayer = map.getLayer('star');

    if(typeof mapLayer === 'undefined')
        plotEndereco();

    plotLinhas();

}