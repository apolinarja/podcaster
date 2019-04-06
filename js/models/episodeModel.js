var EpisodeModel = Backbone.Model.extend({
    defaults: {
        name		: null,	// Nombre del podcast
        date        : null, // fecha de publicacion del episodio
    },

    /**
	 * Inicializa el objeto
	 */
    initialize: function(options) {
    }
});