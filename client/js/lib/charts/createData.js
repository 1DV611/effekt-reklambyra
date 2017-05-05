  function createData(labels, values, label) {
    var data;

    data = {
      labels: labels,
      datasets: [{
        label: label,
        data: values,
        backgroundColor: [
          'black',
          'lightgrey',
          'darkgrey',
          'dimgray',
          'silver',
          'darkslategrey',
          'lightslategrey',
          'slategrey'
        ],
        borderColor: [
          'black',
          'black',
          'black',
          'black',
          'black',
          'black',
          'black',
          'black'
        ],
        borderWidth: 0.5
      }
      ]
    };
    return data;
  }
