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
    optionTemplate: function (year, months) {
      var allOptions = '';
      var namesOf = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
        'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

      var uniqueArray = months.filter(function (item, index) {
        return months.indexOf(item) === index;
      });

      uniqueArray.forEach(function (month) {
        var option = '<option class="' + year + '" value="' + month + '" selected>' + namesOf[month] + '</option>';
        allOptions += option;
      });

      return new Handlebars.SafeString(allOptions);
    }
  },
  defaultLayout: 'main'
}
