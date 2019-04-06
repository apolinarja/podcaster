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

/*		this._podcastDetailView = new PodcastDetailView({
			getTemplate : this._getTemplate,
			templatePath : this._detailTemplatePath
		});*/
		this._headerView.render();
	},

	_podcastSearch: function(){
		this._searchView.render();

		//alert('todo va bien _podcastSearch');
		//this.navigate('podcast/5', {trigger: true});   --> Esta es la que funciona
		//Backbone.Router.prototype.navigate.call(this, 'podcast/5' , options);
		//Backbone.history.loadUrl('podcast/5', {trigger: true});
	},

	_podcastDetail: function(){
		//alert('todo va bien _podcastDetail');
	},

	_episodeDetail: function(){
		//alert('todo va bien _episodeDetail');
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