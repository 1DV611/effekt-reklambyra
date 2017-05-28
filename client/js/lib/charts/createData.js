/**
 * Funktion för att skapa ett dataset till ett diagram (http://www.chartjs.org/docs/latest/).
 * @param labels (Etiketterna för de olika värdena som en string-array)
 * @param values (numeriska värden som en array)
 * @param label (titeln för diagrammet)
 * @returns {{labels: *, datasets: [*]}|*}
 */

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
        'slategrey',
      ],
      borderColor: [
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
      ],
      borderWidth: 0.5,
    },
    ],
  };
  return data;
}
