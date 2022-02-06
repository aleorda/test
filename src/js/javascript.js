var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var years = []
var applications = []

var performance_issues = {}
var service_disruptions = {}
var total_downtime = {}

var month_picker_selector = document.getElementById('month')
month_picker_selector.onchange = () => {plot()}

var year_picker_selector = document.getElementById('year')
year_picker_selector.onchange = () => {plot()}

var app_picker_selector = document.getElementById('application')
app_picker_selector.onchange = () => {plot()}

months.forEach(month => {
    var node = document.createElement("option")
    node.value = month.toLowerCase()
    node.append(document.createTextNode(month))

    month_picker_selector.append(node)
})

fake = () => {
    var fake_data = {"data": []}

    Array("A","B","C","D").forEach(app => {
        Array(12).fill(0).map((_, i) => i+1).forEach(i => {
            Array(6).fill(0).map((_, i) => i+2018).forEach(j => {
                fake_data['data'][fake_data['data'].length] = {
                    "application":  app,
                    "date":  i + "/01/" + j,
                    "performance_issues":  parseInt(Math.random() * 10),
                    "service_disruptions": parseInt(Math.random() * 10),
                    "total_downtime": parseInt(Math.random() * 10),
                }
            })
        })
    })
    return fake_data
  }

fetch_data = () => {
    return load_data(fake())
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
    plot()
}

plot = () => {
    var year = year_picker_selector.value || Math.max(...years)

    plot_performance_issues(year)
    plot_service_disruptions(year)
    plot_total_downtime(year)
}

plot_performance_issues = (year) => {
    var data = [
      {
        x: months,
        y: performance_issues[year],
        name:"Performance Issues",
        type: 'bar'
      }
    ];

    Plotly.newPlot('performance_issues', data);
}

plot_service_disruptions = (year) => {
    var data = [
      {
        x: months,
        y: service_disruptions[year],
        name:"Service Disruptions",
        type: 'bar'
      }
    ];

    Plotly.newPlot('service_disruptions', data);
}

plot_total_downtime = (year) => {
    var data = [
      {
        x: months,
        y: total_downtime[year],
        name:"Total Downtime",
        type: 'bar'
      }
    ];

    Plotly.newPlot('total_downtime', data);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fetch_data()
})