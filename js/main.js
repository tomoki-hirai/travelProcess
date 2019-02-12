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
            // 変更前の地点の情報
            oldLocations: [],
            transitTime: []
        }
    },
    methods: {
        // 変更前の配列を保持
        setValue: function() {
            this.oldLocations = _.cloneDeep(this.locations);
          },
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
        },
        // 地点の削除
        doRemove: function (item) {
            var index = this.locations.indexOf(item.value);
            this.locations.splice(index, 1);
        }
    },
    mounted(){
        this.setValue();
    },
    watch: {
        // 地点の滞在時間の変更
        locations: {
            handler(newVal, oldVal) {
                oldVal = this.oldLocations;
                this.setValue();

                // 要素の追加だろう
                if(oldVal.length != newVal.length){
                    console.log(oldVal.length);
                    calcTransitTime();
                }

                console.log('更新前のネストされたデータ：' + JSON.stringify(oldVal));
                console.log('更新後のネストされたデータ：' + JSON.stringify(newVal));
                calcTime();
            },
            deep: true
        }
    }
});

function calcTime() {
    let sumtime = 0;
    for (let i = 0; i < app.locations.length; i++) {
        sumtime += parseInt(app.locations[i].time);
    }
    console.log(sumtime);
}

function calcTransitTime(){
    if(app.locations.length>=2){
        for(let i=0;i<app.locations.length-1;i++){
            doget(app.locations[0],app.locations[1])
        }
    }
}

function doget(origin,destination) {
    console.log("push");
    getGoogleMap(origin.name, destination.name).done(function (result) {
        console.log('end');
        let min = result.routes[0].legs[0].duration.value / 60;
        console.log(result.routes[0].legs[0].duration.value);
        // alert('所要時間は' + min + '分です');
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