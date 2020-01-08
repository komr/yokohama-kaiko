//タイルレイヤーを取得
var t_attr = "<a href='https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>";
/*
var t_std = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
*/
var t_pale = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});

var t_ort = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});

/*
var t_blank = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
*/

var o_std = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
});

var m_mono = new L.tileLayer('https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png', {
    attribution: "Maptiles by <a href='https://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='https://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
});

var kanto_rapid = new L.tileLayer('https://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
    attribution: "<a href='https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>出典: 農研機構</a> <a href='https://www.finds.jp/siteinfo/c_tou.html.ja' target='_blank'>CC BY</a>",
    maxZoom: 17
});

var kanto_rapid_L = new L.tileLayer('https://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', { opacity: 0.8, maxNativeZoom: 17, attribution: t_attr });

var t_relief_L = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png', { opacity: 0.5, maxNativeZoom: 15, attribution: t_attr });
var t_hillshademap_L = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', { opacity: 0.5, maxNativeZoom: 16, attribution: t_attr });

var Map_b = {
    //    "地理院地図 標準": t_std,
    "地理院地図 淡色": t_pale,
    "地理院地図 オルソ": t_ort,
    //    "地理院地図 白地図": t_blank,
    "MIERUNE MONO": m_mono,
    "OpenStreetMap": o_std,
    "迅速測図(1881年)": kanto_rapid,
};

var Map_b2 = {
};

var Map_u = {
};

var Map_L = {
    "迅速測図（明治14年(1881)）": kanto_rapid_L,
    "色別標高図": t_relief_L,
    "陰影起伏図": t_hillshademap_L
};

var map_now = L.map('map_now', {
    center: [35.4477678, 139.6403494],
    zoom: 14,
    layers: [t_pale]
});

$(function () {
    var mapId = 'map_now';
    const sidebarId = 'sidebar_now';
    const map = map_now;
    var t_map = { map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
    var z_map = { map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 3, map_1868_ymzz: 3, map_now: 16 };

    function onGetJson(mapId, data, marker, layerName) {
        function showPopup(e, feature) {
            var imgContainer = $(feature.properties.URL);
            var img = imgContainer.find("img");

            var break_year = feature.properties.author.length > 30 ? "<br>" : "";
            var break_volume = feature.properties.volume == null ? "" : "<br>";
            var break_description = feature.properties.description == null ? "" : "<br><br>";
            var content = feature.properties.pid + "<br>"
                + feature.properties.spot + "<br>"
                + feature.properties.URL + "<br>"
                + feature.properties.author + break_year + "【" + feature.properties.publication_year + "】" + "<br>"
                + (feature.properties.volume || "") + break_volume
                + "転載元：" + feature.properties.source
                + break_description + (feature.properties.description || "");

            var buttons = []

            for (var mapKey in feature.properties.map_coordinates) {
                if (mapKey != mapId) {
                    var jumpCoordinates = feature.properties.map_coordinates[mapKey];
                    // Create ボタン
                    var lon = jumpCoordinates[0];
                    var lat = jumpCoordinates[1];

                    var originalMapInfo = btoa(JSON.stringify({
                        mapId: mapId,
                        lat: feature.properties.map_coordinates[mapId][1],
                        lon: feature.properties.map_coordinates[mapId][0]
                    }));


                    buttons.push(
                        "<button class='button' type='button' onclick='gotoMap(\"" + mapKey + "\"," + lat + "," + lon + "," + z_map[mapKey] + ", \""
                        + btoa(unescape(encodeURIComponent(content))) + "\", \"" + originalMapInfo
                        + "\");'>" + t_map[mapKey] + "</button><br>");

                }
            }

            img.load(function () {
                hover_bubble = L.responsivePopup({ hasTip: false })
                    .setContent(content
                        + "<br>"
                        + buttons.join("")
                    )
                    .setLatLng(e.latlng)
                    .openOn(map);

            });
        }

        function showSidebar(e, feature) {
            document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
            sidebar.show();
        }

        var overlay = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                if (isMobile.any()) {
                    var clickTimer = null;                    
                    layer.on('click', function (e) {
                        e.originalEvent.stopPropagation();
                        e.originalEvent.preventDefault();
                        if (clickTimer == null) {
                            clickTimer = setTimeout(function () {
                                showPopup(e, feature);
                                clickTimer = null;
                            }, 500);
                        }
                        else {
                            showSidebar(e, feature);
                            clearTimeout(clickTimer);
                            clickTimer = null;
                        }
                    });
                }
                else {
                    layer.on('mouseover', function (e) { showPopup(e, feature) });
                    // layer.on('mouseout', function (e) { map.closePopup() });
                    //                    layer.on('click', function (e) { showSidebar(e, feature) });
                }
            }
            , pointToLayer: function (feature, latlng) {
                var coords = feature.properties.map_coordinates[mapId];
                if (coords != null) {
                    latlng = new L.LatLng(coords[1], coords[0]);
                    marker = L.divIcon({ className:feature.properties.icon_style, iconSize: [15, 15] });             
                    return L.marker(latlng, { icon: marker, className:feature.properties.icon_style  });
                }
            }
        });
        overlay.addTo(map);
        control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
    }

    // kaikou_mae_1833-1858
    var layerName_1 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1833-1858:開港前</span>"
        + "<br>"
        + "<table>"
        + "<tr><td width=10></td><td><div class=\"circle_t53\"></div></td><td>1834_東海道五十三次</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_ss\"></div></td><td>1855_ペリー提督横浜上陸の図</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_m53\"></div></td><td>1855_五十三次名所図会</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_edo\"></div></td><td>1858_名所江戸百景</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_f36\"></div></td><td>1858_冨士三十六景</td></tr>"
        + "</table>";
    var kaikou_maeMarker = L.divIcon({ className: 'circle_kaikou_mae', iconSize: [15, 15] });
    $.getJSON("./gj/kaikou_mae_1833-1858.geojson", function (data) {
        onGetJson(mapId, data, kaikou_maeMarker, layerName_1);
    });
 
    // kaikou_chokugo_1859-1865
    var layerName_2 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1859-1865:開港直後</span>"
        + "<br>"
        + "<table>"
        + "<tr><td width=10></td><td><div class=\"circle_at\"></td><td>1860_新田間橋</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_ym\"></td><td>1860_横浜名所一覧</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_yh\"></td><td>1860_横浜本町之図</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_ky\"></td><td>1860_神名川横浜新開港図</td></tr>"
        + "<tr><td width=10></td><td><div class=\"circle_ykk\"></td><td>1862_横浜開港見聞誌</td></tr>"
        + "</table>";
    var kaikou_chokugoMarker = L.divIcon({ className: 'circle_kaikou_chokugo', iconSize: [15, 15] });
    $.getJSON("./gj/kaikou_chokugo_1859-1865.geojson", function (data) {
        onGetJson(mapId, data, kaikou_chokugoMarker, layerName_2);
    });
 

    function wayOverlay(data, layerName) {
        var way_geoj = L.geoJSON(data, {
            style: function (feature) { return feature.properties.style },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var breaks = feature.properties.description.length > 0 ? "<br>" : "";
                    var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                        .setContent(feature.properties.name + breaks + feature.properties.description)
                        .setLatLng(e.latlng)
                        .openOn(map);
                });
                //            layer.on('mouseout', function (e) { map.closePopup() });
            }
        });
        way_geoj.addTo(map)
        control.addOverlay(way_geoj, layerName); // Add the layer to the Layer Control.
    }


    var layerName_3 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">旧街道</span>"
    + "<br>"
    + "<table>"
    + "<tr><td width=10></td><td><hr width=\"10\" size=\"3\" color=\"#ff0000\" noshade></td><td>東海道</td></tr>"
    + "<tr><td width=10></td><td><hr width=\"10\" size=\"3\" color=\"#00ff00\" noshade></td><td>保土ヶ谷道</td></tr>"
    + "<tr><td width=10></td><td><hr width=\"10\" size=\"3\" color=\"#0000ff\" noshade></td><td>横浜道</td></tr>"
    + "</table>";
    $.getJSON("./gj/ways_u.geojson", function (data) {
        wayOverlay(data, layerName_3)
    });

    function wayOverlay2(data, layerName) {
        var way_geoj = L.geoJSON(data, {
            style: function (feature) { return feature.properties.style },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var breaks = feature.properties.description.length > 0 ? "<br>" : "";
                    var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                        .setContent(feature.properties.name + breaks + feature.properties.description)
                        .setLatLng(e.latlng)
                        .openOn(map);
                });
                //            layer.on('mouseout', function (e) { map.closePopup() });
            }
        });
        //way_geoj.addTo(map)
        // way_geoj.options.name = layerName;

        // way_geoj
        Map_L[layerName] = way_geoj;

        // Create the control and add it to the map;
        var appearanceControl = L.control.appearance(Map_b, Map_u, Map_L, {
            "opacity": true,
            "remove": false,
            "color": false
        });
        appearanceControl.addTo(map);

        //appearanceControl.addOverlay(way_geoj); // Add the layer to the Layer Control.
    }

    $.getJSON("./gj/old_coastline_u.geojson", function (data) {
        wayOverlay2(data, "迅速測図海岸線（1881年）")
    });

    function pointOverlay(data, marker, layerName) {
        var point_geoj = L.geoJSON(data, {
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
            , pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: marker });
            }
        });
        point_geoj.addTo(map);
        control.addOverlay(point_geoj, layerName); // Add the layer to the Layer Control.
    }

    // tokaido_shuku
    var layerName_4 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">東海道宿</span>"
    + "<br>"
    + "<table>"
    + "<tr><td width=10></td><td><div class=\"square_tsh\"></td><td>宿</td></tr>"
    + "</table>";
    var tokaido_shukuMarker = L.divIcon({ className: 'square_tsh', iconSize: [12, 12] });
    $.getJSON("./gj/tokaido_shuku_u.geojson", function (data) {
        pointOverlay(data, tokaido_shukuMarker, layerName_4);
    });

    var control = L.control.layers(Map_b2); // Grab the handle of the Layer Control, it will be easier to find.
    control.addTo(map);

    L.control.scale({ maxWidth: 250, imperial: false }).addTo(map_now);
});
