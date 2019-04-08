var PodcasterRouter = Backbone.Router.extend({
	/**
     * Definicion de las rutas
     */
    routes : {
    	'' 											: '_podcastSearch',
    	'podcast/:podcastId'						: '_podcastDetail',
    	'podcast/:podcastId/episode/:episodeId' 	: '_episodeDetail' 
    },


    _templatePath: 'templates/',
    _searchTemplatePath: 'templates/search/',
    _detailTemplatePath: 'templates/podcastDetail/',

    _headerView : null,
    _searchView : null,
    _podcastDetailView : null,


	initialize : function(options) {
		//Inicializo las vistas y renderizo la cabecera
		this._headerView = new HeaderView({
			getTemplate : this._getTemplate,
			templatePath : this._templatePath
		});

		this._searchView = new SearchView({
			getTemplate : this._getTemplate,
			templatePath : this._searchTemplatePath
		});

		this._podcastDetailView = new PodcastDetailView({
			getTemplate : this._getTemplate,
			templatePath : this._detailTemplatePath
		});
		this._headerView.render();
	},

	_podcastSearch: function(){
		loadingIcon(true);
		this._searchView.render();
	},

	_podcastDetail: function(podcastId){
		loadingIcon(true);
		this._podcastDetailView.render(podcastId);
	},

	_episodeDetail: function(podcastId, episodeId){
		loadingIcon(true);
		this._podcastDetailView.render(podcastId, episodeId);
	},

    /**
     * Recupera una plantilla
     * - name: nombre de la plantilla sin extension
     * - url: url de la plantilla
     */
    _getTemplate : function(name, url) {
        return window.templateManager.getTemplate(name, url);
    }
});