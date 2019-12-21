function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    d3.json("samples.json").then(function(sample){
    var metadata = sample.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
  var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

    })
  })
};

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
 // var url = `/samples/${sample}`;
  d3.json("samples.json").then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data

    var samples = data.samples;
    // Filter the data for the object with the desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var idValues = result.otu_ids;
    var sampleValues = result.sample_values;
    var labels = result.otu_labels;
    //

    var trace_bubble = {
      x: idValues,
      y: sampleValues,
      text: labels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: idValues,
      }
    };
    var bubbleLayout = {    
        title: "Bacteria Cultures Per Sample",  
            margin: { t: 0 },     
            hovermode: "closest",      
            xaxis: { title: "OTU ID" },      
            margin: { t: 30}    };
    var data = [trace_bubble];


    Plotly.newPlot('bubble', data, bubbleLayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });

    
  var pieValue = sampleValues.slice(0,10);
  var pielabel = idValues.slice(0, 10);
  var pieHover = labels.slice(0, 10);

  var data = [{
    values: pieValue,
    labels: pielabel,
    hovertext: pieHover,
    type: "pie"
  }];
  var pieLayout = {
    margin: { t: 0, l: 0 }
  };
  Plotly.newPlot('pie', data, pieLayout);

};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
