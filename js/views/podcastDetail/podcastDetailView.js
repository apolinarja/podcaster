var PodcastDetailView =  Backbone.View.extend({
	el : '#podcaster-main',

	_template: null,     // Plantilla del header
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_podcastModel: null, // podcast en detalle

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
    	this._getPodcastFeedData(podcastId, episodeId);
	},

	_loadEpisodesListView : function(){
		this._podcastEpisodesListView = new PodcastEpisodesListView({
			templatePath : this._templatePath,
			getTemplate : this._getTemplate
		});
	},

	_loadEpisodeDetailView : function(){
		this._podcastEpisodeView = new PodcastEpisodeView({
			templatePath : this._templatePath,
			getTemplate : this._getTemplate
		});
	},	

	_getPodcastFeedData : function (podcastId, episodeId){
		getAJAXCall({
			url: CONSTANTS.GET_PODCAST_DETAIL_URL + podcastId,
			thenFunc: _.bind(this._searchFeedDataSuccess, this, podcastId, episodeId)
		});
	},

	_searchFeedDataSuccess : function(podcastId, episodeId, response){
		var xmlTextData = getCORSCall({
			feed : response.results[0].feedUrl,
			thenFunc: _.bind(this._CORSSuccess, this, podcastId, episodeId)
		});
	},

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

		this._renderSubViews(podcastId, episodeId);
	},

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

	_renderSubViews : function (podcastId, episodeId){
		
		this._podcastSummaryView.render(this._podcastModel);

		this._renderRightComponents(podcastId, episodeId);
	},

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
	},

	_navigateToPodcastDetail : function (event){
		var podcastId = $(event.currentTarget).data('podcastid');
		podcastAPP.router.navigate('podcast/'+ podcastId, {trigger: true});
	},

	_navigateToEpisodeDetail: function(event){
		var episodeId = $(event.currentTarget).closest('tr').data('episodeid');
		podcastAPP.router.navigate(Backbone.history.getFragment() + '/episode/' + episodeId, {trigger: true});	
	}


});