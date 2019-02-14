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
            var index = this.locations.indexOf(item);
            this.locations.splice(index, 1);
            // calcTransitTime();
            searchRoutes();
        },
        // 滞在時間・開始時間の変更
        changeTime: function () {
            console.log('change');
            calcTime();
        }
    }
});

// 時間を計算
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

    let hour = parseInt(app.startTime) + parseInt(sumtime / 60);
    let minute = sumtime % 60;
    console.log(hour + ',' + minute);

    let hourStr = ('00' + hour).slice(-2);
    let minuteStr = ('00' + minute).slice(-2);

    app.endTime = hourStr + ':' + minuteStr;
}

// 経路検索
function searchRoutes() {
    // 出発地・目的地
    let destination = '';
    let origin = '';
    if(app.locations.length>=2){
        origin = app.locations[0].name;
        destination = app.locations[app.locations.length-1].name;
    }else{
        return;
    }
    // 経由地
    let waypoints = [];
    if(app.locations.length>=3){
        for(let i=1;i<app.locations.length-1;i++){
            waypoints.push({location: app.locations[i].name});
        }
    }

    // 地図の生成
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

// responseをもとに経路の時間を計算
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

// とりあえず地図セット
$(window).load(function () {
    searchRoutes();
});