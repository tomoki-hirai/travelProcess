const app = new Vue({
    el: '#app',
    data: {
        // 使用するデータ
        locations: [
            { id: 0, name: "清水寺", time: 30 },
            { id: 1, name: "二条城", time: 30 }
        ]
    },
    methods: {
        // 使用するメソッド
        doAdd: function (event, value) {
            var name = this.$refs.name;
            if(!name.value.length){
                return;
            }
            this.locations.push({
                id: this.locations.length,
                name: name.value,
                time: 30
            });
            name.value = '';
        }
    }
})