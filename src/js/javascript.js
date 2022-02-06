var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var years = []
var applications = []

var performance_issues = {}
var service_disruptions = {}
var total_downtime = {}

var month_picker_selector = document.getElementById('month')
var year_picker_selector = document.getElementById('year')
var app_picker_selector = document.getElementById('application')

months.forEach(month => {
    var node = document.createElement("option")
    node.value = month.toLowerCase()
    node.append(document.createTextNode(month))

    month_picker_selector.append(node)
})

fetch_data = () => {
    return load_data({
            "data": [
              {"application":  "A", "date":  "01/01/2022", "performance_issues":  Math.random() * 20, "service_disruptions": Math.random() * 20, "total_downtime": Math.random() * 20 },
              {"application":  "B", "date":  "01/01/2022", "performance_issues":  Math.random() * 20, "service_disruptions": Math.random() * 20, "total_downtime": Math.random() * 20 },
              {"application":  "C", "date":  "01/01/2021", "performance_issues":  Math.random() * 20, "service_disruptions": Math.random() * 20, "total_downtime": Math.random() * 20 },
              {"application":  "D", "date":  "02/01/2022", "performance_issues":  Math.random() * 20, "service_disruptions": Math.random() * 20, "total_downtime": Math.random() * 20 },
              {"application":  "D", "date":  "03/01/2021", "performance_issues":  Math.random() * 20, "service_disruptions": Math.random() * 20, "total_downtime": Math.random() * 20 },
            ]
          })
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
        var month = date.getMonth()

        if (!years.includes(year)) {
            years[years.length] = year
            performance_issues[year] = Array(months.length).fill(0)
            service_disruptions[year] = Array(months.length).fill(0)
            total_downtime[year] = Array(months.length).fill(0)
        }

        if(!applications.includes(record['application'])) {
            applications[applications.length] = record['application']
        }

        performance_issues[year][month] += record['performance_issues']
        service_disruptions[year][month] += record['service_disruptions']
        total_downtime[year][month] += record['total_downtime']
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
    plot_service_disruptions()
}

plot_performance_issues = () => {
    var selected_year = year_picker_selector.value;
    var y = performance_issues[
        Object.keys(performance_issues)[Object.keys(performance_issues).length - 1]
    ]

    if (selected_year != null && selected_year != "") {
        y = performance_issues[selected_year]
    }

    var data = [
      {
        x: months,
        y: y,
        name:"Performance Issues",
        type: 'bar'
      }
    ];

    Plotly.newPlot('performance_issues', data);
}

plot_service_disruptions = () => {
    var selected_year = year_picker_selector.value;
    var y = service_disruptions[
        Object.keys(service_disruptions)[Object.keys(service_disruptions).length - 1]
    ]

    if (selected_year != null && selected_year != "") {
        y = service_disruptions[selected_year]
    }

    var data = [
      {
        x: months,
        y: y,
        name:"Service Disruptions",
        type: 'bar'
      }
    ];

    Plotly.newPlot('service_disruptions', data);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fetch_data()
})