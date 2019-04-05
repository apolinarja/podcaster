 var PodcastApplication = function(options) {
};

_.extend(PodcastApplication.prototype, {

	initialize : function(options) {
		this.router = new PodcasterRouter();
		// Registrar la historia en las urls con sin #
		//Backbone.history.start();
		// Registrar la historia en las urls con # y navigate (explícito)
		Backbone.history.start({
			root: 'podcaster',
			pushState: true
			//silent: false
		});
	},

	navigate: function() {
		//this.router.navigate(url, options);
		Backbone.history.loadUrl(Backbone.history.location.pathname, {trigger: true});
	},
});
window.podcastAPP = new PodcastApplication(this);
//PodcastApplication.initialize.apply(this, options);

TemplateManager = function() {};

_.extend(TemplateManager.prototype, {

	templates : {},

	// Carga una plantilla de una vista mediante AJAX.
	_loadTemplate : function(templateUrl) {

		var textContent = null;

		$.ajax({
			context: this,
			async : false,
			type: 'GET',
			url : 'js/' + templateUrl,
			success : function(result) {

				textContent = result;

			},
			dataType: 'html'
		});

		if (!textContent) {
			throw 'Error loading template: ' + templateUrl;
		}

		return textContent;

	},

	// Devuelve un proxy de la plantilla compilada de una vista, que retrasa
	// la creación de ésta (si es que todavía no estaba creada) hasta el primer
	// momento que en que se necesite usar.
	getTemplate : function(viewName, baseUrl) {

		return _.bind(function () {

			var templateUrl = baseUrl + viewName + '.tmpl';
			var template = this.templates[templateUrl];

			if (!template) {
				template = _.template(this._loadTemplate(templateUrl));
				this.templates[templateUrl] = template;
			}

			return template.apply(null, arguments);

		}, this);

	}

});

//Inicia la única instancia del template manager
window.templateManager = new TemplateManager();
// Arranca la app
window.podcastAPP = new PodcastApplication(this);
podcastAPP.initialize();
//podcastAPP.navigate(Backbone.history.location.pathname);
//podcastAPP.navigate();