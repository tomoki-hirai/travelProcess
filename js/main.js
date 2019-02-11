let idnum = 2;
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
        doRemove: function (item) {
            var index = this.locations.indexOf(item.value)
            this.locations.splice(index, 1)
        }
    }
})