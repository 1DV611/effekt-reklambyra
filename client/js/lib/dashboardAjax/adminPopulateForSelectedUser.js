function getReportMonths(userId, year) {
  // Ny XMLHttpRequest.
  var request = new XMLHttpRequest();
  var monthsArray = [];

  // Hantera state förändring
  request.onreadystatechange = function() {
    var months = document.getElementById('months');

    months.options.length = 0;

    if (request.readyState === 4) {
      if (request.status === 200) {
        var jsonOptions = JSON.parse(request.responseText).reports;

        jsonOptions.forEach(function (item) {
          monthsArray.push(new Date(item.startDate).getMonth());
        });

        var uniqueMonths = monthsArray.filter(function (item, index) {
          return monthsArray.indexOf(item) === index;
        });

        uniqueMonths.sort(function (a, b) {
          return b - a
        });

        var namesOf = ['januari', 'februari', 'mars', 'april', 'maj', 'juni',
          'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

        // Loop over the JSON array.
        uniqueMonths.forEach(function (item) {
          var option = document.createElement('option');
          option.setAttribute('id', item);
          option.value = item;
          option.appendChild(document.createTextNode(namesOf[item]));
          months.appendChild(option);
        });
      }
    }
  };

  // Gör request.
  request.open('GET', '/user/' + userId + '/reports/' + year, true);
  request.send();
}

function getReportYears(userId) {
  // Ny XMLHttpRequest.
  var request = new XMLHttpRequest();
  var yearArray = [];

  // Hantera state förändring
  request.onreadystatechange = function () {
    var years = document.getElementById('years');

    if (request.readyState === 4) {
      if (request.status === 200) {
        if (years.options.length === 0) {
          // Parse the JSON
          var jsonOptions = JSON.parse(request.responseText).reports;

          jsonOptions.forEach(function (item) {
            yearArray.push(new Date(item.startDate).getFullYear());
          });

          var uniqueYears = yearArray.filter(function (item, index) {
            return yearArray.indexOf(item) === index;
          });

          uniqueYears.sort(function (a, b) {
            return b - a;
          });

          uniqueYears.forEach(function (item) {
            var option = document.createElement('option');
            option.setAttribute('id', item);
            option.value = item;
            option.appendChild(document.createTextNode(item));
            years.appendChild(option);
          });
        }

        years
          .addEventListener('change', getReportMonths(userId,
            years.options[years.selectedIndex].value), false);
      }
    }
  };

  // Gör request.
  request.open('GET', '/user/' + userId + '/reports', true);
  request.send();
}

function getSelected() {
  var input = document.getElementById('customer');
  var choosenFromDataList = '';


  function checkExists() {
    var dataList = document.getElementById('customer-datalist');
    var i;
    var match;
    for (i = 0; i < dataList.options.length; i += 1) {
      if (input.value === dataList.options[i].value) {
        choosenFromDataList = dataList.options[i].id;
        match = true;
      }
    }
    return match;
  }

  if (checkExists(input.value) === true) {
    getReportYears(choosenFromDataList);
  }
}

document.getElementById('customer').addEventListener('input', getSelected, false);
document.getElementById('years').addEventListener('change', getSelected, false);
