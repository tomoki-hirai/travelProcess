let idnum = 2;
const app = new Vue({
    el: '#app',
    data(){
        return {
            // 地点の情報
            locations: [
                { id: 0, name: "清水寺", time: 30 },
                { id: 1, name: "二条城", time: 30 }
            ],
            // 地点の個数
            locationsnum: 2
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
            this.locationsnum++;
        },
        // 地点の削除
        doRemove: function (item) {
            var index = this.locations.indexOf(item.value);
            this.locations.splice(index, 1);
            this.locationsnum--;
        }
    },
    watch: {
        // 地点の追加、削除があった場合
        locationsnum: {
            handler (newVal, oldVal){
                console.log(newVal + ',' + oldVal);
            }
        },
        // 地点の滞在時間の変更
        locations: {
            handler (newVal, oldVal) {
                console.log('更新前のネストされたデータ：' + JSON.stringify(oldVal));
                console.log('更新後のネストされたデータ：' + JSON.stringify(newVal));
            },
            deep: true
        }
    }
});

console.log(app.locations);

function doget() {
    console.log("push");
    getGoogleMap(origin, distination).done(function (result) {
        console.log('end');
        let min = result.routes[0].legs[0].duration.value / 60;
        console.log(result.routes[0].legs[0].duration.value);
        alert('所要時間は' + min + '分です');
    }).fail(function (result) {
        console.log(result);
    });
}

function getGoogleMap(origin, destination) {
    return $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        dataType: 'json',
        cache: false,
        data: {
            origin: origin,
            destination: destination,
            key: 'AIzaSyAgSs7fjrKUT1qr7vGYULTMaip0dRj31y8'
        }
    });
}