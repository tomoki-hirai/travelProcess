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
            calcTransitTime();
        },
        // 地点の削除
        doRemove: function (item) {
            var index = this.locations.indexOf(item.value);
            this.locations.splice(index, 1);
            calcTransitTime();
        },
        changeTime: function(item){
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
    for(let key in app.transitTime){
        if(app.transitTime[key] == undefined){
            continue;
        }
        sumtime += parseInt(app.transitTime[key].time);
    }
    console.log(sumtime);
    
    let hour = app.startTime + parseInt(sumtime/60);
    let minute = sumtime%60;
    console.log(hour + ',' + minute);

    let hourStr = ( '00' + hour ).slice( -2 );
    let minuteStr = ( '00' + minute ).slice( -2 );

    app.endTime = hourStr + ':' + minuteStr;
}

function calcTransitTime(){
    app.transitTime = {};
    if(app.locations.length>=2){
        for(let i=0;i<app.locations.length-1;i++){
            doget(app.locations[i],app.locations[i+1]);
        }
    }
}

function doget(origin,destination) {
    console.log("push");
    getGoogleMap(origin.name, destination.name).done(function (result) {
        console.log('end');
        let min = result.routes[0].legs[0].duration.value / 60;
        let text = result.routes[0].legs[0].duration.text;
        console.log(result.routes[0].legs[0].duration.value);
        app.$set(app.transitTime,String(origin.id),{id: origin.id , origin: origin.name, destination: destination.name,time: min,text: text});
        console.log(app.transitTime);

        calcTime();
    }).fail(function (result) {
        console.log(result);
    });
}

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