
//  Visar månader för vilka det finns rapporter beroende på vilket år som är valt
function getSelected() {
  var year = document.getElementById('years');
  var months = document.getElementById('months');

  console.log(year.options[year.selectedIndex].value);

  for (var i = 0; i < months.options.length; i ++) {
    if (months.options[i].classList.contains(year.options[year.selectedIndex].value)) {
      months.options[i].style.display = '';
    } else {
      months.options[i].style.display = 'none';
    }
    console.log(months.options[i]);
  }
}

document.getElementById('years').addEventListener('change', getSelected, false);
