var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var years = []
var applications = []

var performance_issues = []
var service_disruptions = []
var total_downtime = []

var month_picker_selector = $('#month')
var year_picker_selector = $('#year')
var app_picker_selector = $('#application')

months.forEach(month => {
    var node = document.createElement("option")
    node.value = month.toLowerCase()
    node.append(document.createTextNode(month))

    month_picker_selector.append(node)
})

fetch_data = () => {
    try {
        return $.get("data.json", function(data, status) {
            console.log(data, status)
            load_data(result)
        })
    } catch (err) {
        console.log(err)
    }
}

load_data = json => {
    json.data.forEach(record => {
        var date = new Date(record['date'])
        var year = date.getFullYear()

        if (!years.includes(year)) {
            years[years.length] = year
        }

        if(!applications.includes(record['application'])){
            applications[applications.length] = record['application']
        }
    })

    years.forEach(year => {
        var node = document.createElement("option")
        node.value = year
        node.append(document.createTextNode(year))

        year_picker_selector.append(node)
    })

    applications.forEach(application => {
        var node = document.createElement("option")
        node.value = application.toLowerCase()
        node.append(document.createTextNode(application))

        app_picker_selector.append(node)
    })
    plot_performance_issues()
}

plot_performance_issues = (x, y) => {
    var data = [
      {
        x: months,
        y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        name:"Performance Issues",
        type: 'bar'
      }
    ];

    Plotly.newPlot('performance_issues', data);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fetch_data()
})