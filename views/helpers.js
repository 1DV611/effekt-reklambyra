var Handlebars = require('handlebars');

module.exports = {
  helpers: {
    isSocialActive: function (value) {
      return value === 'on';
    },
    isFeatureActive: function (value) {
      return value === 'on';
    },
    isNotObject: function (value) {
      if (typeof value !== 'object') {
        return true;
      }
      return false;
    },
    isObject: function (value) {
      if (typeof value === 'object') {
        return true;
      }
      return false;
    },
    isNotEmptyString: function (value) {
      if (value !== '') {
        return true;
      }
      return false;
    },
    createChartTemplate: function (name) {
      name = Handlebars.Utils.escapeExpression(name);

      var chartTemplate = '<div class="card"><div class="header"><h4 class="title">' + name + '</h4></div><canvas id="' + name + '" width="400" height="400"></canvas></div>';
      return new Handlebars.SafeString(chartTemplate);
    }
  },

  defaultLayout: 'main',
}