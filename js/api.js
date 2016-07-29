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
            this.execute = function (onSuccess, onError, parameters, onComplete, rawResponseProcessor, preProcessor, xhrBuilder, xhrSender) {
                var onSuccessWrapper = function(res, xhr) {
                    if(onSuccess) onSuccess(res, xhr);
                };
                var onErrorWrapper = function(e, xhr) {
                    if(onError) onError(e, xhr);
                };
                var onCompleteWrapper = function() {
                    if(onComplete) onComplete();
                };
                var builtUrl = objectBeingConstructed.buildUrl(parameters);
                var xhr;
                //Override XHR creation
                if(xhrBuilder) {
                    xhr = xhrBuilder(builtUrl);
                }
                if(!xhr) {
                    xhr = new XMLHttpRequest();
                    xhr.open("GET", builtUrl, true);
                }
                xhr.onload = function () {
                    try {
                        if (rawResponseProcessor) {
                            rawResponseProcessor(xhr);
                        } else {
                            var res = JSON.parse(xhr.responseText);
                            if (res.success) {
                                onSuccessWrapper(res, xhr);
                            } else {
                                console.error("API error!", res.error);
                                onErrorWrapper(res.error);
                            }
                        }
                    }
                    catch (e) {
                        console.error("Error processing API response!", e);
                        onErrorWrapper(e);
                    }
                    onCompleteWrapper();
                };
                xhr.onerror = function (e) {
                    console.error("Error getting API response!", e);
                    onErrorWrapper(e, xhr);
                    onCompleteWrapper();
                };
                if (preProcessor) {
                    preProcessor(xhr);
                }
                //Override XHR sending
                if(xhrSender) {
                    xhrSender(xhr);
                } else {
                    xhr.send();
                }
            }
        }

        //Add API commands
        new ApiCommand("Cover", "/cover", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId;
        });
        new ApiCommand("Library", "/library");
        new ApiCommand("MangaInfo", "/manga_info", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId;
        });
        new ApiCommand("Chapters", "/chapters", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId;
        });
        new ApiCommand("PageCount", "/page_count", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId + "/" + parameters.chapterId;
        });
        new ApiCommand("RestoreFile", "/restore_file");
        new ApiCommand("Backup", "/backup");
        new ApiCommand("Favorite", "/fave", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId + "?fave=" + parameters.favorite;
        });
        new ApiCommand("ReadingStatus", "/reading_status", function(parameters) {
            var currentUrl = this.endpoint() + "/" + parameters.mangaId + "/" + parameters.chapterId;
            var usedQuestionMark = false;
            if (parameters.read !== undefined && parameters.read !== null) {
                currentUrl += usedQuestionMark ? "&" : "?";
                currentUrl += "read=" + parameters.read;
                usedQuestionMark = true;
            }
            if (parameters.lastReadPage !== undefined && parameters.lastReadPage !== null) {
                currentUrl += usedQuestionMark ? "&" : "?";
                currentUrl += "lp=" + parameters.lastReadPage;
            }
            return currentUrl;
        });
        new ApiCommand("Update", "/update", function(parameters) {
            return this.endpoint() + "/" + parameters.mangaId + "/" + parameters.updateType;
        });
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
        new ApiCommand("Download", "/download", function (parameters) {
            var builtUrl = this.endpoint() + "/" + parameters.mangaId + "/" + parameters.chapterId;
            if (parameters.del) {
                builtUrl += "?delete=true";
            }
            return builtUrl;
        });
        new ApiCommand("DownloadsOperation", "/downloads_op", function (parameters) {
            return this.endpoint() + "/" + parameters.operation;
        });
        new ApiCommand("GetDownloads", "/get_downloads");
        new ApiCommand("SetFlag", "/set_flag", function (parameters) {
            return this.endpoint() + "/" + parameters.mangaId + "/" + parameters.flag + "/" + parameters.state;
        });
        return built;
    }
}.init();