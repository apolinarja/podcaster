var HeaderView =  Backbone.View.extend({
	el : '#podcaster-header',

	_template: null,     // Plantilla del header
	_getTemplate: null,  // Metodo para obtener la plantilla
	_templatePath: null, // url de la plantilla

	initialize : function (options){
		this._getTemplate = options.getTemplate;
		this._templatePath = options.templatePath;
		this._template = this._getTemplate('headerView', this._templatePath);
	},

	render : function(options){
		this.$el.html('');
    	this.$el.append(this._template({
    		prueba : 'texto de prueba'
    	}));
	}

});