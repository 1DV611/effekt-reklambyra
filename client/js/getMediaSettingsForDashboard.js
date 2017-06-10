//  Ej klar, använd för att avgöra vilka som ska visas i rapport baserat på accessapi-objektet

function getMediaSettingsForDashboard(userId) {
  // Ny XMLHttpRequest.
  var request = new XMLHttpRequest();

  // Hantera state förändring
  request.onreadystatechange = function () {

    if (request.readyState === 4) {
      if (request.status === 200) {
        var jsonOptions = JSON.parse(request.responseText).medias;

        jsonOptions.forEach(function (item) {
          console.log(item.name);
          console.log(item.isActive);
        });

      }
    }
  };

// Hantera state förändring
  request.open('GET', '/user/' + userId + '/access', true);
  request.send();
}

function getActiveMedia() {
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
    getMediaSettingsForDashboard(choosenFromDataList);
  }
}

document.getElementById('customer').addEventListener('input', getActiveMedia, false);
