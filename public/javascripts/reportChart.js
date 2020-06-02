window.onload = function(){

    var chartLabel = label
    this.console.log(chartLabel)
    var timeFormat = "MM/DD/YYYY HH:mm"
    var countArray = JSON.parse(count)
    var rawDateArray = JSON.parse(date)

    var data = []
    for(var i = 0;i<countArray.length; i++){
        data.push({x: new this.Date(rawDateArray[i]), y: countArray[i] })
    }

    this.console.log(data)

    var ctx = document.getElementById("reportChart").getContext('2d')
    var config = {
        type: 'line',
        data: {
            datasets: [{
                label: 'Responses',
                backgroundColor: "red",
                borderColor: "red",
                data: data, 
                fill: false,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: chartLabel 
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    display: true,
                    time:{
                        timeParser: timeFormat,
                        unit: 'month'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Responses'
                    }
                }]
            }
        }
    };
    window.myLineChart = new Chart(ctx,config) 
}