/**
 * Created by v_chenqianming on 2015/11/4.
 */
var fs = require('fs');

var res_config = fs.readFileSync('config/resources.json');
var res_json = JSON.parse(res_config);

var finder = {
    find: function (res_code) {
        if (res_code.length != 16) return;
        var dir_code = res_code.substring(0, 8);
        var name_code = res_code.substring(8, 16);
        return res_json[dir_code].target + "/" + res_json[dir_code].files[name_code].path;
    },
    list: function () {
        var list = [];
        for (var dir_code in res_json) {
            var dir = res_json[dir_code];
            for (var file_code in  dir.files) {
                var file = dir.files[file_code];
                list.push({id: dir_code + file_code, name: file.name, description: file.path})
            }
        }
        return list;
    }
};

module.exports = finder;