// Client side options API
var OptionsApi = {};
(function () {
    TWApi.Commands.GetPrefs.execute(function (resp) {
        var options = resp.prefs;
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            OptionsApi[key] = options[key].v;
        }
    });

    OptionsApi.pref_default_viewer_key = "left_to_right";
})();