var SearchView =  Backbone.View.extend({
	el : '#podcaster-main',

	_template: null,     // Plantilla 
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_podcastCollection: null,


	_filterView: null,
	_resultsView: null,


	/**
	 * Eventos
	 */
	events : {
		'click .podcast-card' : '_navigatePodcastDetail',
		'keyup #nameFilter' : '_filterResults'
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('searchView', this._templatePath);
	},

	/**
	* Render
	*/
	render : function(options){
		this.$el.html('');
    	this.$el.html(this._template());

		this._filterView = new FilterView({
			getTemplate : this._getTemplate,
			templatePath : this._templatePath
		});

		this._filterView.render();

		this._resultsView = new ResultView({
			getTemplate : this._getTemplate,
			templatePath : this._templatePath
		})

		// comprueba la cache
		if(!localStorage.getItem('podcastList') || !localStorage.getItem('podcastList').length || this._isExpiredPodcastList()){
			this._callGetPodcast();
		} else {
			if(!this._podcastCollection){
				this._podcastCollection = new PodcastCollection(JSON.parse(localStorage.getItem('podcastList')));
			}
			this._renderPodcastList(this._podcastCollection);
			loadingIcon(false);
		}


	},

	// Renderiza las subvistas
	_renderPodcastList : function(collection){

		this._filterView.setCount(collection.length);

		this._resultsView.render({collection: collection});
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
	* Llamada para obtener los datos de los podcast
	*/
	_callGetPodcast: function(){
		getAJAXCall({
			url: CONSTANTS.GET_PODCAST_LIST_URL,
			thenFunc: _.bind(this._searchSuccess, this)
		});
	},

	/**
	* Busqueda success de la lista de podcast
	**/
	_searchSuccess : function(response){
		var podcastListJSON = this._parsePodcastData(response.feed.entry);
		if(podcastListJSON.length){
			localStorage.setItem('podcastList',JSON.stringify(podcastListJSON));
			localStorage.setItem('listSearchDate', new Date().getTime());
		}
		this._renderPodcastList(new PodcastCollection(podcastListJSON));
		loadingIcon(false);
	},

	/**
	* Formateamos el resultado
	**/
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
	* maneja el evento de insercion del input para filtrar
	**/
	_filterResults : function (event){
		var inputText = $(event.currentTarget).val();
		if(inputText.length = 0){
			this._renderPodcastList(this._podcastCollection);
		} else {
			var filteredCollection = this._podcastCollection.filter(function(model){
				return model.get('name').toUpperCase().includes(inputText.toUpperCase())
				 || model.get('author').toUpperCase().includes(inputText.toUpperCase());
			}, this);

			this._renderPodcastList(new PodcastCollection(filteredCollection));
		}
	},

	/**
	* Navega al detalle de un podcast
	**/
	_navigatePodcastDetail : function(event){
		loadingIcon(true);
		var podcastId = $(event.currentTarget).data('podcastid');
		podcastAPP.router.navigate('podcast/'+ podcastId, {trigger: true});
	}

});