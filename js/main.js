let idnum = 2;
const app = new Vue({
    el: '#app',
    data() {
        return {
            // 地点の情報
            locations: [
                { id: 0, name: "京都", time: 30 },
                { id: 1, name: "大阪", time: 30 }
            ],
            transitTime: {},
            startTime: 9,
            endTime: "終了時間"
        }
    },
    methods: {
        // 地点の追加
        doAdd: function (event, value) {
            var name = this.$refs.name;
            if (!name.value.length) {
                return;
            }
            this.locations.push({
                id: idnum,
                name: name.value,
                time: 30
            });
            idnum++;
            name.value = '';
            // calcTransitTime();
            searchRoutes();
        },
        // 地点の削除
        doRemove: function (item) {
            var index = this.locations.indexOf(item.value);
            this.locations.splice(index, 1);
            // calcTransitTime();
            searchRoutes();
        },
        changeTime: function (item) {
            console.log('change');
            calcTime();
        }
    }
});

function calcTime() {
    let sumtime = 0;
    // 滞在時間
    for (let i = 0; i < app.locations.length; i++) {
        sumtime += parseInt(app.locations[i].time);
    }
    // 移動時間
    for (let key in app.transitTime) {
        if (app.transitTime[key] == undefined) {
            continue;
        }
        sumtime += parseInt(app.transitTime[key].time);
    }
    console.log(sumtime);

    let hour = app.startTime + parseInt(sumtime / 60);
    let minute = sumtime % 60;
    console.log(hour + ',' + minute);

    let hourStr = ('00' + hour).slice(-2);
    let minuteStr = ('00' + minute).slice(-2);

    app.endTime = hourStr + ':' + minuteStr;
}

// function calcTransitTime() {
//     app.transitTime = {};
//     if (app.locations.length >= 2) {
//         for (let i = 0; i < app.locations.length - 1; i++) {
//             doget(app.locations[i], app.locations[i + 1]);
//         }
//     }
// }

// function doget(origin, destination) {
//     console.log("push");
//     getGoogleMap(origin.name, destination.name).done(function (result) {
//         console.log('end');
//         let min = result.routes[0].legs[0].duration.value / 60;
//         let text = result.routes[0].legs[0].duration.text;
//         console.log(result.routes[0].legs[0].duration.value);
//         app.$set(app.transitTime, String(origin.id), { id: origin.id, origin: origin.name, destination: destination.name, time: min, text: text });
//         console.log(app.transitTime);

//         calcTime();
//     }).fail(function (result) {
//         console.log(result);
//     });
// }

function getGoogleMap(originName, destinationName) {
    return $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        dataType: 'json',
        cache: false,
        data: {
            origin: originName,
            destination: destinationName,
            key: 'AIzaSyAgSs7fjrKUT1qr7vGYULTMaip0dRj31y8'
        }
    });
}
function reqListener() {
    console.log(this.responseText);
}

function searchRoutes() {
    let destination = '';
    let origin = '';
    if(app.locations.length>=2){
        origin = app.locations[0].name;
        destination = app.locations[app.locations.length-1].name;
    }else{
        return;
    }

    let waypoints = [];
    if(app.locations.length>=3){
        for(let i=1;i<app.locations.length-1;i++){
            waypoints.push({location: app.locations[i].name});
        }
    }

    var directionsService = new google.maps.DirectionsService;
    // Optionally create a map
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);

    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            // Pass data to the map
            directionsDisplay.setDirections(response);

            // See the data in the console
            console.log(response);
            calcTransitTime(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function calcTransitTime(response) {
    app.transitTime = {};
    for(let i=0;i<app.locations.length-1;i++){
        let leg = response.routes[0].legs[i];
        let min = parseInt(leg.duration.value / 60);
        let text = leg.duration.text;
        let origin = app.locations[i];
        let destination = app.locations[i+1];

        app.$set(app.transitTime, String(origin.id), { id: origin.id, origin: origin.name, destination: destination.name, time: min, text: text });
    }
    console.log(app.transitTime);
    calcTime();
}

$(window).load(function () {
    var directionsService = new google.maps.DirectionsService;
    // Optionally create a map
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);

    directionsService.route({
        origin: 'tokyo',
        destination: 'osaka',
        waypoints: [
            { location: 'kyoto' }
        ],
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            // Pass data to the map
            directionsDisplay.setDirections(response);

            // See the data in the console
            console.log(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
});
// function initMap() {
//     // ルート検索の条件
//     var request = {
//         origin: new google.maps.LatLng(35.681382,139.766084), // 出発地
//         destination: new google.maps.LatLng(34.73348,135.500109), // 目的地
//         waypoints: [ // 経由地点(指定なしでも可)
//             { location: new google.maps.LatLng(35.630152,139.74044) },
//             { location: new google.maps.LatLng(35.507456,139.617585) },
//             { location: new google.maps.LatLng(35.25642,139.154904) },
//             { location: new google.maps.LatLng(35.103217,139.07776) },
//             { location: new google.maps.LatLng(35.127152,138.910627) },
//             { location: new google.maps.LatLng(35.142365,138.663199) },
//             { location: new google.maps.LatLng(34.97171,138.38884) },
//             { location: new google.maps.LatLng(34.769758,138.014928) },
//         ],
//         travelMode: google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
//     };

//     // マップの生成
//     var map = new google.maps.Map(document.getElementById("map"), {
//         center: new google.maps.LatLng(35.681382,139.766084), // マップの中心
//         zoom: 7 // ズームレベル
//     });

//     var d = new google.maps.DirectionsService(); // ルート検索オブジェクト
//     var r = new google.maps.DirectionsRenderer({ // ルート描画オブジェクト
//         map: map, // 描画先の地図
//         preserveViewport: true, // 描画後に中心点をずらさない
//     });
//     // ルート検索
//     d.route(request, function(result, status){
//         // OKの場合ルート描画
//         if (status == google.maps.DirectionsStatus.OK) {
//             r.setDirections(result);
//         }
//     });
// }