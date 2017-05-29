/**
 * Funktion för att skapa ett diagram (http://www.chartjs.org/docs/latest/), just nu stödjs
 * enbart stapel-diagram, paj-diagram och munk-diagram.
 * @param type ('bar'/'pie'/'doughnut')
 * @param canvas (canvas-elementet i DOM:en)
 * @param data (datan som ska in i diagrammet skapad med hjälp av createData.js)
 * @returns {Chart}
 */

function createChart(type, canvas, data) {
  var options = {};
  var myChart;

  switch (type) {
    case 'bar':
      options = {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          },
          ],
        },
      };
    break;
    case 'pie':
    case 'doughnut':
    default:
    break;
  }

  options.animation = false;

  myChart = new Chart(canvas, {
    type: type,
    data: data,
    options: options,
  });

  return myChart;
}
