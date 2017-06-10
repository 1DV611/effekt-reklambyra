// För inloggad icke-admin användare
// Visar månader för vilka det finns rapporter för beroende på vilket år som är valt
function getSelected() {
  var year = document.getElementById('years');
  var months = document.getElementById('months');

  for (var i = 0; i < months.options.length; i += 1) {
    if (months.options[i].classList.contains(year.options[year.selectedIndex].value)) {
      months.options[i].style.display = '';
    } else {
      months.options[i].style.display = 'none';
    }
  }
}

document.getElementById('years').addEventListener('change', getSelected, false);
