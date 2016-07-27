var TWApi = {
    //Setup the API
    init: function () {
        this.Commands = this.Commands();
        delete this.init;
        return this;
    },
    //API Endpoints
    Endpoints: {
        Root: "/api"
    },
    Commands: function () {
        var that = this;
        var built = {};

        function ApiCommand(name, endpoint, customUrlBuilder) {
            endpoint = that.Endpoints.Root + endpoint;
            this.endpoint = function () {
                return that.Endpoints[name];
            };
            that.Endpoints[name] = endpoint;
            built[name] = this;
            var objectBeingConstructed = this;
            //Setup URL builder
            if (!customUrlBuilder) {
                customUrlBuilder = function () {
                    return objectBeingConstructed.endpoint();
                }
            }
            this.buildUrl = customUrlBuilder;
            //API Request function
            this.execute = function (onSuccess, onError, parameters, onComplete, rawResponseProcessor, preProcessor) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", objectBeingConstructed.buildUrl(parameters), true);
                xhr.onload = function () {
                    try {
                        if (rawResponseProcessor) {
                            rawResponseProcessor(xhr);
                        } else {
                            var res = JSON.parse(xhr.responseText);
                            if (res.success) {
                                onSuccess(res, xhr);
                            } else {
                                onError(res.error);
                            }
                        }
                    }
                    catch (e) {
                        console.error("Error processing API response!", e);
                        onError(e);
                    }
                    onComplete();
                };
                xhr.onerror = function (e) {
                    console.error("Error getting API response!", e);
                    onError(e, xhr);
                    onComplete();
                };
                if (preProcessor) {
                    preProcessor(xhr);
                }
                xhr.send();
            }
        }

        //Add API commands
        new ApiCommand("Cover", "/cover", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId;
        });
        new ApiCommand("Library", "/library");
        new ApiCommand("MangaInfo", "/manga_info");
        new ApiCommand("Chapters", "/chapters");
        new ApiCommand("PageCount", "/page_count");
        new ApiCommand("RestoreFile", "/restore_file");
        new ApiCommand("Backup", "/backup");
        new ApiCommand("Favorite", "/fave");
        new ApiCommand("ReadingStatus", "/reading_status");
        new ApiCommand("Update", "/update");
        new ApiCommand("Sources", "/sources");
        new ApiCommand("Catalogue", "/catalogue", function (parameters) {
            var currentUrl = this.endpoint() + "/" + parameters.sourceId + "/" + parameters.page;
            var usedQuestionMark = false;
            if (parameters.lastUrl) {
                currentUrl += usedQuestionMark ? "&" : "?";
                currentUrl += "lurl=" + encodeURIComponent(parameters.lastUrl);
                usedQuestionMark = true;
            }
            if (parameters.query) {
                currentUrl += usedQuestionMark ? "&" : "?";
                currentUrl += "query=" + encodeURIComponent(parameters.query);
            }
            return currentUrl;
        });
        new ApiCommand("LoginSources", "/list_login_sources");
        new ApiCommand("SourceLogin", "/source_login", function (parameters) {
            return this.endpoint() + "/" + parameters.sourceId
                + "?username=" + encodeURIComponent(parameters.username)
                + "&password=" + encodeURIComponent(parameters.password);
        });
        return built;
    }
}.init();