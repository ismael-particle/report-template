/**********************************************************
    Global constants
************************************************************/
//icons resources
const icon_dowload = "https://ismael-particle.github.io/report-template/img/download.png"; 
const icon_docs = "https://ismael-particle.github.io/report-template/img/docs.png";
const icon_support = "https://ismael-particle.github.io/report-template/img/support.png";

const color_red     = "#F45151";
const color_orange  = "#FF993D";
const color_yellow  = "#FAD51D";
const color_green   = "#3AD599";
const color_blue    = "#00E1FF";

/**********************************************************
    Building charts
************************************************************/
function generate_id(text,type){
    switch(type){
        case 'chart':   return ( "chart_".concat(text.slice(4,text.length)) );    break;
        case 'tab':     return ( "tab_".concat(text.slice(4,text.length)) );      break;
    }
}

const creat_chart_bar_groups = (arr, {x,y,name,type,orientation,color_groups}) => arr.reduce ((acc,curr) => {
    const indexOfCurr = acc.findIndex((item) => item.name === curr[name]);
  
    if(indexOfCurr !== -1 ){
        acc[indexOfCurr].x.push(curr[x]);
        acc[indexOfCurr].y.push(curr[y]);
        return acc;
    }
    var warning_color = color_red;
    
    switch(curr[color_groups]){
        case '0': warning_color = color_green;  break;
        case '1': warning_color = color_yellow; break;
        case '2': warning_color = color_orange; break;
        case '3': warning_color = color_red;    break;
    }
    
    return [...acc, {
        x: [curr[x]], 
        y: [curr[y]],
        name: curr[name], 
        type: type,
        marker: { color:warning_color, line:{width:0.5} },
        orientation: orientation
        }]
},[]);


function creat_histogram_mono_color ( arr, {x, histogram_size, chart_color}){
    var x_data = new Array();    
    
    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
    });

    var max_limit = Math.ceil( Math.max(x_data) );
    var min_limit = Math.floor( Math.min(x_data) );

    return [ {
        x: x_data, 
        type: 'histogram',
        marker: { color:chart_color ,line:{width:0.5}},
        xbins: { 
            end: max_limit, 
            size: histogram_size, 
            start: min_limit
        }
    }]
}

function creat_histogram_multi_color ( arr, {x, histogram_size, color_groups}){
    var x_data_color_0 = new Array();    
    var x_data_color_1 = new Array();    
    var x_data_color_2 = new Array();    
    var x_data_color_3 = new Array();    
    
    arr.forEach(function(item,index, array){ 
        switch(item[color_groups]){
            case '0': x_data_color_0.push(item[x]);  break;
            case '1': x_data_color_1.push(item[x]);  break;
            case '2': x_data_color_2.push(item[x]);  break;
            case '3': x_data_color_3.push(item[x]);  break;
        }

    });

    var max_limit = Math.ceil( Math.max(arr[x]) );
    var min_limit = Math.floor( Math.min(arr[x]) );

    var array_data = [
        {
            x: x_data_color_0, 
            type: 'histogram',
            marker: { color:color_green ,line:{width:0.5}},
            xbins: { 
                end: 0.00, 
                size: histogram_size, 
                start: -21
                },
            name: 'Good'
        },
        {
            x: x_data_color_1, 
            type: 'histogram',
            marker: { color:color_yellow ,line:{width:0.5}},
            xbins: { 
                end: 0.00, 
                size: histogram_size, 
                start: -21
                },
            name: 'Fair'
        },
        {
            x: x_data_color_2, 
            type: 'histogram',
            marker: { color:color_orange ,line:{width:0.5}},
            xbins: { 
                end: 0.00, 
                size: histogram_size, 
                start: -21
                },
            name: 'Keep watch'
        },
        {
            x: x_data_color_3, 
            type: 'histogram',
            marker: { color:color_red ,line:{width:0.5}},
            xbins: { 
                end: 0.00, 
                size: histogram_size, 
                start: -21
                },
            name: 'Take action'       
        }
    ]


    return array_data;
}


function creat_chart_bar (arr, {x,y,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data = new Array();    
    var color = new Array();
    
    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data.push(item[y]);
        switch(item[color_groups]){
            case '0': color.push(color_green);  break;
            case '1': color.push(color_yellow); break;
            case '2': color.push(color_orange); break;
            case '3': color.push(color_red);    break;
            case 'NULL': color.push(color_blue);    break;
            default: color.push(color_blue);    break;
        }
    });
    return [ {
        x: x_data, 
        y: y_data,
        type: type,
        marker: { color ,line:{width:0.5}},
        orientation: orientation
    }]
} 


function creat_chart_pie (arr, {value_column,  label_colum, color_groups} ){
    var values_data = new Array();    
    var labels_data = new Array();    
    var color_data = new Array();
    
    arr.forEach(function(item,index, array){ 
        values_data.push(item[value_column]);
        labels_data.push(item[label_colum]);
        switch(item[color_groups]){
            case '0': color_data.push(color_green);  break;
            case '1': color_data.push(color_yellow); break;
            case '2': color_data.push(color_orange); break;
            case '3': color_data.push(color_red);    break;
            case 'NULL': color_data.push(color_blue);    break;
            default: color_data.push(color_blue);    break;
        }
    });

    return [ {
        values: values_data, 
        labels: labels_data,
        type: 'pie',
        marker: { colors:color_data ,line:{width:0.5}}
    }]
} 

/**********************************************************
    Creat CSV file
************************************************************/
  //trigger download of data.csv file
function creat_csv(table_reference, html_id){
    var id_button = "dow_" + html_id;
    var file = html_id + ".csv";

    document.getElementById(id_button).addEventListener("click", function(){
        table_reference.download("csv", html_id);
    });    
}

/**********************************************************
    Creating tables
***********************************************************/

function creat_table (table_parameters,html_id){
    var id = "#" + html_id;
    
    var table = new Tabulator(id, {
        data:table_parameters["table_data"],    //load row data from array
        layout:"fitColumns",                    //fit columns to width of table
        responsiveLayout:"hide",                //hide columns that dont fit on the table
        addRowPos:"top",                        //when adding a new row, add it to the top of the table
        history:true,                           //allow undo and redo actions on the table
        pagination:"local",                     //paginate the data
        paginationSize:25,                      //allow # rows per page of data
        paginationCounter:"rows",               //display count of paginated rows in footer
        movableColumns:true,                    //allow column order to be changed
        initialSort:table_parameters["order_by"],
        columns:table_parameters["columns"],
    });
    return table;           
}

/**********************************************************
    Building sections
************************************************************/
function creat_section(data_id,colection_data,html_element){

	//Content array
	var content = colection_data.find( element => element.section_id == data_id );
		
	var html_original_content = html_element.content.cloneNode(true);
	

	//Chosing tooltip length base in tooltip content
	var tooltip_length = content["tooltip_content"].length;
	var tooltip_segment = "";

	if ( tooltip_length < 40 ) {
		tooltip_segment = "small";	
	} else if (tooltip_length < 80) {
		tooltip_segment = "medium";
	} else if (tooltip_length < 160) {
		tooltip_segment = "large";
	}else{
		tooltip_segment = "extra-large";
	}
	
	//building section content
	var html_section_content;

	switch (content["content_type"]) {
  		case "simple-table":
    		html_section_content = "<div id='" + generate_id(content["section_id"],"tab") + "'></div>";
    		break;
  		case "simple-chart":
        case "simple-chart-bar-groups":
        case "simple-chart-bar":
        case "simple-chart-histogram-mono-color":
        case "simple-chart-pie":
        case "simple-chart-histogram-multi-color":
    		html_section_content = "<div class='container_content_python_chart' id='" + generate_id(content["section_id"],"chart") + "'></div>";
   	 		break;
  		default:
    		html_section_content = "<p> This is not a valid section type</p>";
    		break;
	};

	//building html section
	var new_html_text = "<div class='simple_container'><div class='container_head'><div class='container_head_title'>";
	new_html_text += "<h2 class='subtitle'> " + content["subtitle"] + "</h2></div><div class='container_head_tooltip'>";
	new_html_text += "<button aria-label=' " + content["tooltip_content"] + " ' data-microtip-position='right' data-microtip-size= ' " + tooltip_segment + "' role='tooltip'>";
	new_html_text += "<img src=' " + icon_support +" '></button></div><div class='container_head_separator'></div>";
    		
    if (content["dowload_boolean"]) {
    	new_html_text += "<div class='container_head_download'>";
    	new_html_text += "<button aria-label='Save as CSV file' data-microtip-position='left' data-microtip-size='csv-file' role='tooltip' id='dow_"+ content["section_id"] + "'>"; 
    	new_html_text += "<img src =' " + icon_dowload + " '> </button></div>";
    }

    new_html_text += "<div class='container_head_docs'> <a href=' " + content["url_docs"] + "' target='_blank'> <img src =' " + icon_docs + " '> </a></div>"; 
    new_html_text += "</div> <!-- END container_head --> <div class='container_content'>";
	
	//section content
	new_html_text += html_section_content; 

	new_html_text += "</div> <!-- END container_content --></div> <!-- END simple_container -->";

	console.log(new_html_text);
	html_element.insertAdjacentHTML('beforebegin',new_html_text);
	//document.body.appendChild(html_original_content);
	//html_element.insertAdjacentHTML('afterend',"</div> <!-- END container_content --></div> <!-- END simple_container -->");

    //Creating table in the section
    if ( content["table_settings"]["table_data"]!= null) {
        console.log( content["table_settings"]  );

        var table_created = creat_table(content["table_settings"], generate_id(content["section_id"],"tab"));
        creat_csv(table_created, content["section_id"]);
    }

    //Creating charts content["chart_settings"]
    switch(content["content_type"]){
        case "simple-chart-bar-groups":
            var chart_bar_data = creat_chart_bar_groups(content["chart_settings"]["chart_data"], {
                                x: content["chart_settings"]["x_column"],
                                y: content["chart_settings"]["y_column"],
                                name: content["chart_settings"]["group"],
                                type: 'bar',
                                orientation: content["chart_settings"]["orientation"],
                                color_groups: content["chart_settings"]["colors"]
                                });
            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                barmode: 'stack'
                };

            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_bar_data, layout, {responsive: true, displaylogo: false} );
            break;

        case "simple-chart-bar":
            var chart_bar_data = creat_chart_bar(content["chart_settings"]["chart_data"], {
                x: content["chart_settings"]["x_column"],
                y: content["chart_settings"]["y_column"],
                type: 'bar',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });

            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'}
                }; 
            
            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_bar_data, layout, {responsive: true, displaylogo: false} );
            
            break;

        case "simple-chart-histogram-mono-color":
            var chart_histogram_data = creat_histogram_mono_color(content["chart_settings"]["chart_data"],{
                x: content["chart_settings"]["x_column"],
                chart_color: color_blue,
                histogram_size: content["chart_settings"]["histogram_width"]
            });

            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'}
            };    

            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_histogram_data, layout, {responsive: true, displaylogo: false} );         
            break;

        case "simple-chart-histogram-multi-color":

            var chart_histogram_data = creat_histogram_multi_color(content["chart_settings"]["chart_data"],{
                x: content["chart_settings"]["x_column"],
                color_groups: content["chart_settings"]["groups"],
                histogram_size: content["chart_settings"]["histogram_width"]
            });

            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                barmode: "overlay"
            };    

            console.log(chart_histogram_data);
            console.log(layout);

            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_histogram_data, layout, {responsive: true, displaylogo: false} );         
            break;

        case "simple-chart-pie":
            var chart_pie_data = creat_chart_pie(content["chart_settings"]["chart_data"],{ 
                value_column: content["chart_settings"]["x_column"],
                label_colum: content["chart_settings"]["y_column"],
                color_groups: content["chart_settings"]["colors"]
            });
            var layout = {
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'}
            };    

            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_pie_data, layout, {responsive: true, displaylogo: false} );         

            break;


    }

}

