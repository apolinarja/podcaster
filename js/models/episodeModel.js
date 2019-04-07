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
});