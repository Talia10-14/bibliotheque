  const ctx = document.getElementById('myPieChart').getContext('2d');
  const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Nonbre de livres en circulation', 'Emprunts du jour', 'Emprunts de la semaine'],
      datasets: [{
        label: 'Répartition',
        data: [35, 20, 45],
        backgroundColor: [
          'rgba(141, 86, 35, 0.2)',
          'rgba(238, 83, 10, 0.96)',
          'rgba(109, 43, 34, 0.97)'
        ],
        borderColor: [
         'rgba(141, 86, 35, 0.2)',
          'rgba(238, 83, 10, 0.96)',
          'rgba(109, 43, 34, 0.97)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio:false,
         layout: {
         padding: {
         right: 120  
             }
        },
      plugins: {
        legend: {
        position: 'right',
        labels: {
        font: {
        size: 20 
      }, generateLabels: (chart) => {
          const data = chart.data;
          if (!data.datasets.length) return [];
          const dataset = data.datasets[0];
          const total = dataset.data.reduce((a, b) => a + b, 0);

          return data.labels.map((label, i) => {
            const value = dataset.data[i];
            return {
              text: `${label} (${value} )`, 
              fillStyle: dataset.backgroundColor[i],
              strokeStyle: dataset.borderColor ? dataset.borderColor[i] : null,
              lineWidth: 1,
              hidden: isNaN(dataset.data[i]) || chart.getDataVisibility(i) === false,
              index: i
            };
          });
        },
      boxWidth: 60,     
          padding: 20,      
          maxWidth: 200
    }
        },
        title: {
          display: true,
          text: 'Statistiques des emprunts et circulation des livres',
          position: 'bottom',
          font: {
            size:24
          },
          padding:20
        }
      }
    }
  });
