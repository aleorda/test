var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var years = []
var month_picker_selector = $('#month');
var year_picker_selector = $('#year');

months.forEach(month => {
    var node = document.createElement("option");
    node.value = month.toLowerCase();
    node.append(document.createTextNode(month));

    month_picker_selector.append(node);
})

fetch_data = async () => {
    try {
        return await $.getJSON('./data.json')
    } catch (err) {
        console.log(err)
    }
};

load_data = json => {
    json.data.forEach(field => {
        var date = new Date(field['date'])
        var year = date.getFullYear()

        if (!years.includes(year)) {
            years[years.length] = year
        }
    })

    years.forEach(year => {
        var node = document.createElement("option");
        node.value = year;
        node.append(document.createTextNode(year));

        year_picker_selector.append(node);
    })
}

plot = data => {
}

document.addEventListener("DOMContentLoaded", function(event) {
    fetch_data().then(data => load_data(data))
});