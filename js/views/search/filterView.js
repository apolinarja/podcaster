var FilterView =  Backbone.View.extend({
	el : '#podcastFilterView',

	_template: null,     // Plantilla
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	/**
	 * Eventos
	 */
	events : {
	},

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('filterView', this._templatePath);
	},

	/**
	* Renderiza la vista del filtro
	*/
	render : function(options){
		this.$el.html('');
    	this.$el.html(this._template());
	},

	setCount: function(count){
		this.$el.find('#podcastNumber').html(count);
	}
});