var maxNativeZoom_1656_ysk_mae = 6, maxZoom_1656_ysk_mae = 6, image_width_1656_ysk_mae = 4096, image_height_1656_ysk_mae = 5632;
var minZoom_1656_ysk_mae = 3;
var map_1656_ysk_mae = L.map('map_1656_ysk_mae', {
    crs: L.CRS.Simple,
    minZoom: minZoom_1656_ysk_mae,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    wheelPxPerZoomLevel: 80
});

$(function () {
    var mapId = 'map_1656_ysk_mae';
    const sidebarId = 'sidebar_1656_ysk_mae'
    const map = map_1656_ysk_mae;
    const maxNativeZoom = maxNativeZoom_1656_ysk_mae;
    const maxZoom = maxZoom_1656_ysk_mae;
    const minZoom = minZoom_1656_ysk_mae;
    const image_width = image_width_1656_ysk_mae;
    const image_height = image_height_1656_ysk_mae;

    var t_map = { map_1656_ysk_mae:"1656_吉田新田埋立開墾前横浜図", map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
    var z_map = { map_1656_ysk_mae: 3, map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 4, map_1868_ymzz: 3, map_now: 16 };
    const geojson_spot = "spot_1656_ ysk_mae.geojson";
    var Map_b = {
    };

    var nw = map.unproject([0, 0], maxNativeZoom);
    var se = map.unproject([image_width, image_height], maxNativeZoom);
    var bounds = L.latLngBounds(nw, se);
    map.setMaxBounds(bounds);
    map.fitBounds(bounds.pad(0.1));

    /*map3.setView([16384,1536], 4);*/
    map.setView([0, 0], 3);
    //map3.setView(bounds.getCenter(), 4);

    L.tileLayer('tiles/' + mapId + '/{z}/{x}/{y}.jpg', {
        maxZoom: maxZoom,
        minZoom: minZoom,
        bounds: bounds,
        attribution: "<a href='https://www.ndl.go.jp/jp/use/reproduction/index.html' target='_blank'>国立国会図書館デジタルコレクション</a>"
    }).addTo(map);

    //sidebar
    var sidebar = L.control.sidebar(sidebarId, {
        position: 'right'
    });
    map.addControl(sidebar);

    if (window.location.href.indexOf("debug") > 0) {
            var pointer = L.marker(bounds.getCenter(), {
            draggable: true
        }).on('drag', function (e) {
            update_coord_references(map, this, e.latlng);
        }).bindPopup().addTo(map);

        map.on('zoomend', function (e) {
            var z = map.getZoom();
            var w = Math.ceil(image_width / Math.pow(2, (maxNativeZoom - z)));
            var h = Math.ceil(image_height / Math.pow(2, (maxNativeZoom - z)));
            console.log('zoom level: %d, image size: %dx%d', z, w, h);
        });
    };


    // functions ----------------------------------------------------------

    /*
    function point2latLng(point) {
        if (L.Util.isArray(point[0])) {
            var latLngs = [];
            for (var i = 0, len = point.length; i < len; i++) {
                latLngs[i] = map.unproject(point[i], maxNativeZoom);
            }
            return latLngs;
        }
        return map.unproject(point, maxNativeZoom);
    }
    */

    function digit_format(num) {
        return (('    ') + num.toFixed(2)).substr(-8);
    }

     function update_coord_references(map, marker, latLng) {
        var p = map.project(latLng, map.getZoom());
        var pMax = map.project(latLng, maxNativeZoom);
        var content = '<pre class="coords">'
    //            + 'lng: ' + ', ' + 'lat: ' + '\n'
            + digit_format(latLng.lng) + ',' + digit_format(latLng.lat) + '\n'
    //            + '  x: ' + ', ' + '  y: ' + '\n'
            + digit_format(p.x) + ',' + digit_format(p.y) + '\n'
    //            + '  X: ' + ', ' + '  Y: ' + '\n'
            + digit_format(pMax.x) + ',' + digit_format(pMax.y)
            + '</pre>';
        marker.getPopup().setContent(content).openOn(map);
    }


    // Point style
    var stationStyle = {
        opacity: 0.9,
        fillOpacity: 0.7
    };

//    L.control.scale({ maxWidth: 250, imperial: false }).addTo(map);

    function onGetJson(data, marker, layerName) {
        var overlay = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var imgContainer = $(feature.properties.URL);
                    var img = imgContainer.find("img");
                    img.load(function () {
                        var hover_bubble = L.responsivePopup({ hasTip: false })
                            .setContent(feature.properties.pid + "<br>"
                                + feature.properties.spot + "<br>"
                                + feature.properties.URL + "<br>"
                                + feature.properties.author + "【" + feature.properties.publication_year + "】" + "<br>"
                                + feature.properties.volume + "<br>"
                                + "転載元：" + feature.properties.source)
                            .setLatLng(e.latlng)
                            .openOn(map);
                    });
                });

                //        layer.on('mouseout', function(e){ map.closePopup() });
                /*
                            layer.on('click', function (e) {
                                document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
                                sidebar.show();
                            });
                */
            }
            , pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: marker });
            }
        });
        overlay.addTo(map);
        control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
    }

/*
    function titleOverlay(data, layerName) {
        var title_geoj = L.geoJSON(data, {
            style: function (feature) { return feature.properties.style },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var imgContainer = $(feature.properties.URL);
                    var img = imgContainer.find("img");
                    img.load(function () {
                        var hover_bubble = L.responsivePopup({ hasTip: false })
                            .setContent(feature.properties.title + "<br>"
                                + feature.properties.URL + "<br>"
                                + feature.properties.author + "<br>"
                                + feature.properties.publication_year + "<br>"
                                + "転載元：" + feature.properties.source + "<br>"
                                + feature.properties.description
                                )
                            .setLatLng(e.latlng)
                            .openOn(map);
                    });
                });
*/
                //            layer.on('mouseout', function (e) { map.closePopup() });
/*
            }
        });
        title_geoj.addTo(map)
        control.addOverlay(title_geoj, layerName); // Add the layer to the Layer Control.
    }
*/

/*
    $.getJSON("./gj/" + geojson_title, function (data) {
        titleOverlay(data, "標題")
    });
*/
    function spotOverlay(data, layerName) {
        var spot_geoj = L.geoJSON(data, {
            style: function (feature) { return feature.properties.style },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var breaks = feature.properties.description.length > 0 ? "<br><br>" : "";
                    var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                        .setContent(feature.properties.name + breaks + feature.properties.description)
                        .setLatLng(e.latlng)
                        .openOn(map);
                });
                //            layer.on('mouseout', function (e) { map.closePopup() });
            }
        });
        spot_geoj.addTo(map)
        control.addOverlay(spot_geoj, layerName); // Add the layer to the Layer Control.
    }


    var layerName_chimei = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">地名等コメント</span>";
    $.getJSON("./gj/" + geojson_spot, function (data) {
        spotOverlay(data, layerName_chimei)
    });

    // Create the control and add it to the map;
    var control = L.control.layers(Map_b); // Grab the handle of the Layer Control, it will be easier to find.
    control.addTo(map);
});