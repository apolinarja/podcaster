var SearchView =  Backbone.View.extend({
	el : '#podcaster-main',

	_template: null,     // Plantilla del header
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_podcastCollection: null,

	_podcastItemView: null,

	/**
	 * Eventos
	 */
	events : {
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('searchView', this._templatePath);
	},

	/**
	*
	*/
	render : function(options){

		this._searchPodcasts();
	},

	/**
	*
	*/
	_searchPodcasts : function(){
		if(!localStorage.getItem('podcastList') || !localStorage.getItem('podcastList').length || this._isExpiredPodcastList()){
			this._callGetPodcast();
		} else {
			this._generateListItems();
		}
	},

	/**
	* Comprueba si ha pasado un dia desde que se busco la lista de podcast
	* La fecha de busqueda esta almacenada en milisegundos.
	*/
	_isExpiredPodcastList : function(){
		var listSearchDate = parseInt(localStorage.getItem('listSearchDate'));
		return new Date().getTime() - listSearchDate > CONSTANTS.ONE_DAY_MILIS
	},

	/**
	* 
	*/
	_callGetPodcast: function(){
		getAJAXCall({
			url: CONSTANTS.GET_PODCAST_LIST_URL,
			thenFunc: _.bind(this._searchSuccess, this)
		});
	},

	_searchSuccess : function(response){
		var podcastListJSON = this._parsePodcastData(response.feed.entry);
		if(podcastListJSON.length){
			localStorage.setItem('podcastList',JSON.stringify(podcastListJSON));
			localStorage.setItem('listSearchDate', new Date().getTime());
		}

		var rows = this._generateListItems();

		this.$el.html('');
    	this.$el.html(this._template({
    		resultsCount : 100,
    		rows: rows
    	}));

	},

	_parsePodcastData : function(itunesPodcastList){
		var podcastList = [];
		_.each(itunesPodcastList, function(item){
			podcastList.push({
				id          : parseInt(item.id.attributes['im:id']), // id del podcast
		        name		: item['im:name'].label,	// Nombre del podcast
		        author		: item['im:artist'].label,	// Autor
		        img	        : _.pluck(item['im:image'], 'label')[2],	// imagen,
		        summary	    : item.summary, // descripcion
		        episodesList: null	// (EpisodesCollection)	
			})
		}, this);

		return podcastList;
	},

	/**
	* Coge la lista que hay almacenada en el localstorage. Esta guardado como json 
	* genera la coleccion y la recorre pasandosela para generar cada item de la lista
	*/
	_generateListItems : function(){
		if(!this._podcastCollection){
			this._podcastCollection = new PodcastCollection(JSON.parse(localStorage.getItem('podcastList')));
		}

		this._podcastItemView = new PodcastItemView({
			getTemplate : this._getTemplate,
			templatePath: this._templatePath
		});

		var row = '';

		this._podcastCollection.each(function(model){
			row += this._podcastItemView.render(model);
		}, this);

		return row;
	}

});