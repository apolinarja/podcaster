var PodcastModel = Backbone.Model.extend({
    defaults: {
        id          : null, // id del podcast
        name		: null,	// Nombre del podcast
        author		: null,	// Autor
        img	        : null,	// imagen,
        summary	    : null, // descripcion
        episodesList: null	// (EpisodesCollection)	
    },

    /**
	 * Inicializa el objeto
	 */
    initialize: function(options) {
    	if(options && options.episodesList){
			this.set('episodesList', new EpisodesCollection(options.episodesList));
    	}
    }
});