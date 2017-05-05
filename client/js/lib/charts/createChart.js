
  function createChart(type, canvas, data) {
    var options;
    var myChart;

    switch (type) {
      case 'bar':
        options = {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }
            ]
          }
        };
        break;
      case 'pie':
      case 'doughnut':
      default:
        options = {
          animation: {
            animateScale: true
          }
        };
        break;

    }

    myChart = new Chart(canvas, {
      type: type,
      data: data,
      options: options
    });

    return myChart;
  }

