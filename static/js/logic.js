// Create Leaflet Map
var myMap = L.map('map', {
    center: [39.833332,-98.58336],
    zoom: 5
});

// Add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Get the data from website
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get the earthquakes data
d3.json(url).then(function(data) {
    for (var i = 0; i < data.features.length; i++) {
        let longitude = data.features[i].geometry.coordinates[0];
        let latitude = data.features[i].geometry.coordinates[1];
        let depth = data.features[i].geometry.coordinates[2];
        let mag = data.features[i].properties.mag;
        let location = data.features[i].properties.place;

        //Create depth color -10 to 90
        function depthColor(depth) {
            switch (true) {
                case depth > 90:
                    return "red";
                case depth > 70:
                    return "orangered";
                case depth > 50:
                    return "orange";
                case depth > 30:
                    return "yellow";
                case depth > 10:
                    return "lightgreen";
                case depth > -10:
                    return "green";

            }
        }   

        // Add earthquake markers to map
        var quakes = L.circleMarker([latitude, longitude],{
            color: "black",
            fillColor: depthColor(depth),
            radius: mag**2,
            opacity: 1,
            fillOpacity: 1,
            weight: 1
        });
        quakes.addTo(myMap);
        quakes.bindPopup((`<h1>${mag} magnitude earthquake struck ${location}. </h1> <br> <h2> Lat,Lng: ${latitude},${longitude} </h2>`));
    }
    
    // Add a legend
    var legend = L.control({position: "bottomright"});

legend.onAdd = function(map){
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<h4>Depth Range</h4>";
    var range = ['<10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    for (var i = 0; i < range.length; i++) {
        div.innerHTML += '<i style="background:' + depthColor((i+1)*20-10) + '"></i><span>' + range[i] + '</span><br>';
    }

    return div;
};
legend.addTo(myMap);
        
    });