var PodcastDetailView =  Backbone.View.extend({
	el : '#podcaster-main',

	_template: null,     // Plantilla 
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_podcastModel: null, // modelo de podcast

	// Subvistas
	_podcastSummaryView : null, // Vista izquierda detalle de podcast
	_podcastEpisodesListView : null, // Vista lista de episodios
	_podcastEpisodeView : null, //Vista detalle de podcast
	/**
	 * Eventos
	 */
	events : {
		'click #podcast-summary-main' : '_navigateToPodcastDetail',
		'click #episode-link' : '_navigateToEpisodeDetail'
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('podcastDetailView', this._templatePath);
	},

	/**
	* Render de la pantalla
	*/
	render : function(podcastId, episodeId){
		
		this.$el.html('');
    	this.$el.html(this._template());

    	// Instancia detalle de podcast
    	this._podcastSummaryView = new PodcastSummaryView({
			templatePath : this._templatePath,
			getTemplate : this._getTemplate
		});

    	// Si no hay episodio se instancia la vista de la lista
		if(!episodeId){
			this._loadEpisodesListView();
		} else{
			//Se instancia la vista de detalle de episodio
			this._loadEpisodeDetailView();
		}
		// Obtenemos los datos
	    if(!localStorage.getItem('podcast_' + podcastId) || !localStorage.getItem('podcast_' + podcastId).length || this._isExpiredPodcastDetail(podcastId)){
			// Obtenemos los datos
			this._getPodcastFeedData(podcastId, episodeId);
		} else {
			// estan los datos en cache
			var podcastJSON = JSON.parse(localStorage.getItem('podcast_' + podcastId));
			this._podcastModel = new PodcastModel(podcastJSON);
			this._renderSubViews(podcastId, episodeId);
		}
	},
	
	/**
	* Comprueba si ha expirado los datos del podcast
	**/
	_isExpiredPodcastDetail : function(podcastId){
		var podcastDate = parseInt(localStorage.getItem('podcast_' + podcastId + '_date'));
		return new Date().getTime() - podcastDate > CONSTANTS.ONE_DAY_MILIS
	},

	/**
	* Inicializa la vista
	**/
	_loadEpisodesListView : function(){
		this._podcastEpisodesListView = new PodcastEpisodesListView({
			templatePath : this._templatePath,
			getTemplate : this._getTemplate
		});
	},

	/**
	* Inicializa la vista
	**/
	_loadEpisodeDetailView : function(){
		this._podcastEpisodeView = new PodcastEpisodeView({
			templatePath : this._templatePath,
			getTemplate : this._getTemplate
		});
	},	

	/**
	* Llamada ajax
	**/
	_getPodcastFeedData : function (podcastId, episodeId){
		getAJAXCall({
			url: CONSTANTS.GET_PODCAST_DETAIL_URL + podcastId,
			thenFunc: _.bind(this._searchFeedDataSuccess, this, podcastId, episodeId)
		});
	},

	/**
	* En el resultado obtenemos la url para obtener el listado de capitulso
	* Invocacion mediante cliente cors a esa url
	**/
	_searchFeedDataSuccess : function(podcastId, episodeId, response){
		var xmlTextData = getCORSCall({
			feed : response.results[0].feedUrl,
			thenFunc: _.bind(this._CORSSuccess, this, podcastId, episodeId)
		});
	},

	/**
	* Parseamos los datos obtenidos
	**/
	_CORSSuccess: function(podcastId, episodeId, xmlTextData){
		var $data = $(xmlTextData);
		var podcastData = {
			id: podcastId,
			name		: $data.find('title').html(),	// Nombre del podcast
	        author		: $data.find('itunes\\:author').html(),	// Autor
	        img	        : $data.find('itunes\\:image').attr('href'),	// imagen,
	        summary	    : _.unescape($data.find('itunes\\:summary').html()).replace('<!--[CDATA[', '').replace(']]-->', '').replace('<![CDATA[', '').replace(']]>', ''), // descripcion
	        episodesList: this._getEpisodesList($data.find('item'))	// (EpisodesCollection)	
		};

		this._podcastModel = new PodcastModel(podcastData);
		
		localStorage.setItem('podcast_' + podcastId, JSON.stringify(this._podcastModel));
		localStorage.setItem('podcast_' + podcastId + '_date', new Date().getTime());
		
		this._renderSubViews(podcastId, episodeId);
	},
	/**
	* Parseamos los episodios
	**/
	_getEpisodesList : function (episodes){
		var episodesList = [];
		_.each(episodes, function(item){
			var $item = $(item);
			episodesList.push({
				id: $item.find('itunes\\:episode').html() ? $item.find('itunes\\:episode').html() : _.uniqueId('e') ,
				title: $item.find('title').html(),
				publishDate: new Date($item.find('pubDate').html()),
				description: _.unescape($item.find('description').html()).replace('<!--[CDATA[', '').replace(']]-->', '').replace('<![CDATA[', '').replace(']]>', ''),
				duration: $item.find('itunes\\:duration').html(),
				media: $item.find('enclosure').attr('url'),
				mediaType: $item.find('enclosure').attr('type')
			});
		}, this);
		return episodesList;
	},

	/**
	* renderizamos las vistas
	**/
	_renderSubViews : function (podcastId, episodeId){
		
		this._podcastSummaryView.render(this._podcastModel);

		this._renderRightComponents(podcastId, episodeId);
		
	},

	/**
	* decide si renderiza la vista del detalle de un episodio
	* o la lista de episodios del podcast
	**/
	_renderRightComponents: function(podcastId, episodeId){
		// Si hay episodio
		if(episodeId){
			if(this._podcastEpisodeView == null){
				this._loadEpisodeDetailView();
			}

			var episodeModel = this._podcastModel.get('episodesList').find(function(episode){
				return episode.get('id') == episodeId;
			}, this);

			this._podcastEpisodeView.render(episodeModel)
		
		} else {
			if(this._podcastEpisodesListView == null){
				this._loadEpisodesListView();
			}
			this._podcastEpisodesListView.render(this._podcastModel.get('episodesList'));
		}
		loadingIcon(false);
	},

	/**
	* Visualizamos la lista de episodios
	**/
	_navigateToPodcastDetail : function (event){
		loadingIcon(true);
		var podcastId = $(event.currentTarget).data('podcastid');
		podcastAPP.router.navigate('podcast/'+ podcastId, {trigger: true, replace: false});
	},
	/**
	* Entramos en el detalle de un episodio
	**/
	_navigateToEpisodeDetail: function(event){
		loadingIcon(true);
		var episodeId = $(event.currentTarget).closest('tr').data('episodeid');

		podcastAPP.router.navigate(Backbone.history.getFragment() + '/episode/' + episodeId, {trigger: true, replace: false});
	}


});