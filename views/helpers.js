var Handlebars = require('handlebars');

module.exports = {
  helpers: {
    optionTemplate: function (year, months) {
      var allOptions = '';
      var namesOf = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
        'juli', 'augusti', 'september', 'oktober', 'november', 'december', ];

      var uniqueArray = months.filter(function (item, index) {
        return months.indexOf(item) === index;
      });

      uniqueArray.forEach(function (month) {
        var option = '<option class="' + year + '" value="' + month + '" selected>' + namesOf[month] + '</option>';
        allOptions += option;
      });

      return new Handlebars.SafeString(allOptions);
    },
  },
  defaultLayout: 'main',
};
