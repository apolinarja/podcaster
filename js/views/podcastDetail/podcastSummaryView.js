var PodcastSummaryView =  Backbone.View.extend({
	el : '#podcastSummary',

	_template: null,     // Plantilla 
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	_podcastModel: null, // podcast en detalle

	/**
	 * Eventos
	 */
	events : {
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('podcastSummaryView', this._templatePath);
	},

	/**
	* Render de la pantalla
	*/
	render : function(model){
		this._podcastModel = model;
		
		this.$el.html('');
    	this.$el.html(this._template({
    		id : this._podcastModel.get('id'),
    		name: this._podcastModel.get('name'),
    		src : this._podcastModel.get('img'),
    		alt : this._podcastModel.get('name'),
    		author: this._podcastModel.get('author'),
    		summary: this._podcastModel.get('summary')
    	}));

    	
	}

});