var EpisodeModel = Backbone.Model.extend({
    defaults: {
        id: null,
		title: null,
		publishDate: null,
		description: null,
		duration: null,
		media: null,
		mediaType: null
    },

     initialize: function(options) {
    	if(options && options.publishDate){
			this.set('publishDate', new Date(options.publishDate));
    	}
    }
});