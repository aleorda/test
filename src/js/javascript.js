var stored_data = null

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var years = []
var applications = []

var performance_issues = Array(months.length).fill(0)
var service_disruptions = Array(months.length).fill(0)
var total_downtime = Array(months.length).fill(0)

var month_picker_selector = document.getElementById('month')
var selected_month = month_picker_selector.value

month_picker_selector.onchange  = () => {
   var new_value = month_picker_selector.value
   if (new_value != selected_month) {
       selected_month = month_picker_selector.value
       plot()
   }
}

var year_picker_selector = document.getElementById('year')
var selected_year = year_picker_selector.value

year_picker_selector.onchange = () => {
    var new_value = year_picker_selector.value
    if (new_value != selected_year) {
        selected_year = year_picker_selector.value
        plot()
    }
}

var app_picker_selector = document.getElementById('application')
var selected_app = app_picker_selector.value

app_picker_selector.onchange = () => {
    var new_value = app_picker_selector.value
    if (new_value != selected_app) {
        selected_app = app_picker_selector.value
        plot()
    }
}


var performance_issues_total_count = document.getElementById('performance_issues_total_count')
performance_issues_total_count.textContent = 0
var service_disruptions_total_count = document.getElementById('service_disruptions_total_count')
service_disruptions_total_count.textContent = 0
var total_downtime_total_count = document.getElementById('total_downtime_total_count')
total_downtime_total_count.textContent = 0

months.forEach(month => {
    var node = document.createElement("option")
    node.value = month
    node.append(document.createTextNode(month))

    month_picker_selector.append(node)
})

fake = () => {
    var fake_data = {"data": []}
    Array("A","B","C","D").forEach(app => {
        Array(12).fill(0).map((_, i) => i+1).forEach(i => {
            Array(6).fill(0).map((_, i) => i+2017).forEach(j => {
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
    stored_data = fake()
    return load_data()

    try {
        return $.get("data.json", function(data, status) {
            console.log(data, status)
        })
    } catch (err) {
        console.log(err)
    }
}

load_data = () => {
    stored_data.data.forEach(record => {
        var date = new Date(record['date'])

        var year = date.getFullYear()
        var month = date.getMonth()

        if(!applications.includes(record['application'])) {
            applications[applications.length] = record['application']
        }

        if (!years.includes(year)) {
            years[years.length] = year
        }
    })

    applications.forEach(application => {
        var node = document.createElement("option")
        node.value = application
        node.append(document.createTextNode(application))

        app_picker_selector.append(node)
    })

    years.forEach(year => {
        var node = document.createElement("option")
        node.value = year
        node.append(document.createTextNode(year))

        year_picker_selector.append(node)
    })

    selected_year = Math.max(...years)

    plot()
}

clear = () => {
    performance_issues = Array(months.length).fill(0)
    service_disruptions = Array(months.length).fill(0)
    total_downtime = Array(months.length).fill(0)
}

apply_filter = () => {
    var filtered = stored_data.data.filter(record => {
        var app_filter = true
        var year_filter = true
        var month_filter = true

        if (selected_app != null && selected_app != '')
            app_filter = (record['application'] == selected_app)
        if (selected_year != null && selected_year != '')
            year_filter = (new Date(record['date']).getFullYear() == selected_year)
        if (selected_month != null && selected_month != '')
            month_filter = (new Date(record['date']).getMonth() == months.indexOf(selected_month))

        return app_filter && year_filter && month_filter
    })

    filtered.forEach(record => {
        var month = new Date(record['date']).getMonth()

        performance_issues[month] += record['performance_issues']
        service_disruptions[month] += record['service_disruptions']
        total_downtime[month] += record['total_downtime']
    })

    performance_issues_total_count.textContent = performance_issues.reduce((partialSum, a) => partialSum + a, 0);
    service_disruptions_total_count.textContent = service_disruptions.reduce((partialSum, a) => partialSum + a, 0);
    total_downtime_total_count.textContent = total_downtime.reduce((partialSum, a) => partialSum + a, 0);
}

plot = () => {
    clear()
    apply_filter()

    plot_performance_issues()
    plot_service_disruptions()
    plot_total_downtime()
}

plot_performance_issues = () => {
    var x = months
    var y = performance_issues

    if (selected_month != null && selected_month != '') {
        x = [selected_month]
        y = y.filter(value => value > 0)
    }

    var data = [
      {
        x: x,
        y: y,
        type: 'bar'
      }
    ]
    var layout = {
        // title:"Performance Issues",
        showlegend: false,
        yaxis: {
            rangemode: 'tozero',
        },
        xaxis: {
            rangemode: 'tozero',
        },
    }

    Plotly.newPlot('performance_issues', data, layout, {displaylogo: false, responsive: true});
}

plot_service_disruptions = () => {
    var x = months
    var y = service_disruptions

    if (selected_month != null && selected_month != '') {
        x = [selected_month]
        y = y.filter(value => value > 0)
    }

    var data = [
      {
        x: x,
        y: y,
        type: 'bar'
      }
    ]
    var layout = {
        // title:"Service Disruptions",
        showlegend: false,
        yaxis: {
            rangemode: 'tozero',
        },
        xaxis: {
            rangemode: 'tozero',
        },
    }

    Plotly.newPlot('service_disruptions', data, layout, {displaylogo: false, responsive: true});
}

plot_total_downtime = () => {
    var x = months
    var y = total_downtime

    if (selected_month != null && selected_month != '') {
        x = [selected_month]
        y = y.filter(value => value > 0)
    }

    var data = [
      {
        x: x,
        y: y,
        type: 'bar'
      }
    ]
    var layout = {
        // title:"Total Downtime",
        showlegend: false,
        yaxis: {
            rangemode: 'tozero',
        },
        xaxis: {
            rangemode: 'tozero',
        },
    }

    Plotly.newPlot('total_downtime', data, layout, {displaylogo: false, responsive: true});
}

document.addEventListener("DOMContentLoaded", function(event) {
    fetch_data()
})