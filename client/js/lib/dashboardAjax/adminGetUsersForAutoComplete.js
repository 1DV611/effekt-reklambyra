var dataList = document.getElementById('customer-datalist');
var input = document.getElementById('customer');

// Ny XMLHttpRequest.
var request = new XMLHttpRequest();

// Hantera state förändring
request.onreadystatechange = function () {
  if (request.readyState === 4) {
    if (request.status === 200) {
      var jsonOptions = JSON.parse(request.responseText).users;

      jsonOptions.forEach(function (item) {
        var option = document.createElement('option');
        option.setAttribute('id', item.profileId);
        option.value = item.displayName;
        dataList.appendChild(option);
      });

      input.placeholder = 'Välj kund';
    } else {
      input.placeholder = 'Hittade inga kunder';
    }
  }
};

input.placeholder = 'Hämtar kunder...';

request.open('GET', '/user/users', true);
request.send();
