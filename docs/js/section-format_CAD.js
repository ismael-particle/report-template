/* --------------------------> Global constants <--------------------------- */
//icons resources
const icon_dowload = "https://ismael-particle.github.io/report-template/img/download.png"; 
const icon_docs = "https://ismael-particle.github.io/report-template/img/docs.png";
const icon_support = "https://ismael-particle.github.io/report-template/img/support.png";

//General colors code
const color_red     = "#F45151"; //4
const color_orange  = "#FF993D"; //3
const color_yellow  = "#FAD51D"; //2
const color_green   = "#3AD599"; //1
const color_blue    = "#00E1FF";
const color_neutral = "#E2E4EB"; 
const color_blue_dark = "#00334F"; 

//Random colors code
const color_random_0 = '#9ACD32';
const color_random_1 = '#00489C';
const color_random_2 = '#FFB200';
const color_random_3 = '#0099CC';
const color_random_4 = '#778899';
const color_random_5 = '#009974';
const color_random_6 = '#FAEBD7';
const color_random_7 = '#FF69B4';
const color_random_8 = '#6F4E37';
const color_random_9 = '#01FFA1';
const color_random_10 = '#65318E';
const color_random_11 = '#ADD8E6';
const color_random_12 = '#E9967A';
const color_random_13 = '#D15CFF';
const color_random_14 = '#008000';
const color_random_15 = '#D2691E';
const color_random_16 = '#A52A2A';
const color_random_17 = '#FFE200';

const solid_value = 1.0
const shadow_value = 0.3

/* ------------------------------->  Build consts for cards    <-------------------------------- */
const card_actions_background = {
    0: color_green,
    1: color_yellow,
    2: color_orange,
    3: color_red,
    4: color_blue,
    5: color_neutral
}

const color_status_pocked = {
    colores: {
        //name:                 color, opacity
        "neutral_blue_solid":   [color_blue,    solid_value],
        "neutral_grey_solid":   [color_neutral, solid_value],
        "clear_solid":          [color_green,   solid_value],    
        "warning_solid":        [color_yellow,  solid_value],
        "minor_solid":          [color_orange,  solid_value],
        "major_solid":          [color_red,     solid_value],
        "neutral_blue_shadow":  [color_blue,    shadow_value],
        "neutral_grey_shadow":  [color_neutral, shadow_value],
        "clear_shadow":         [color_green,   shadow_value],
        "warning_shadow":       [color_yellow,  shadow_value],
        "minor_shadow":         [color_orange,  shadow_value],
        "major_shadow":         [color_red,     shadow_value],
        "color_random_1_solid": [color_random_1, solid_value],
        "color_random_2_solid": [color_random_2, solid_value],
        "color_random_3_solid": [color_random_3, solid_value],
        "color_random_4_solid": [color_random_4, solid_value],
        "color_random_5_solid": [color_random_5, solid_value],
        "color_random_6_solid": [color_random_6, solid_value],
        "color_random_7_solid": [color_random_7, solid_value],
        "color_random_8_solid": [color_random_8, solid_value],
        1:[color_random_1, solid_value],
        2:[color_random_2, solid_value],
        3:[color_random_3, solid_value],
        4:[color_random_4, solid_value],
        5:[color_random_5, solid_value],
        6:[color_random_6, solid_value],
        7:[color_random_7, solid_value],
        8:[color_random_8, solid_value],
        9:[color_random_9, solid_value],
        10:[color_random_10, solid_value],
        11:[color_random_11, solid_value],
        12:[color_random_12, solid_value],
        13:[color_random_13, solid_value],
        14:[color_random_14, solid_value],
        15:[color_random_15, solid_value],
        16:[color_random_16, solid_value],
        17:[color_random_17, solid_value]
    },
    get_color(_statu_color){   
        try {
            return this.colores[_statu_color][0];   
        } catch (e) {
            return this.colores['neutral_blue_solid'][0];   
        }
    },
    get_opacity(_statu_color){  
        try {
            return this.colores[_statu_color][1];   
        } catch (e) {
            return this.colores['neutral_blue_solid'][1];   
        }
    }    
}

function generate_action_color(action_number) {
  return card_actions_background[ action_number ] || card_actions_background[4];
}

const card_actions_texts = {
    0: "Good",
    1: "Fair",
    2: "Keep Watch",
    3: "Take Action",
    4: "Error"
}

function generate_action_text(action_number) {
  return card_actions_texts[ action_number ] || card_actions_texts[4];
}

/* --------------------------->  Random html ID cards generation    <--------------------------- */
// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex (dec) {
  return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
function generateId (len) {
  var arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

function generate_card_id(){
    return "card_id_" + generateId(20);
}

/* ------------------------------------>  Building charts    <---------------------------------- */
function generate_id(text,type){
    switch(type){
        case 'chart':   return ( "chart_".concat(text.slice(4,text.length)) );    break;
        case 'tab':     return ( "tab_".concat(text.slice(4,text.length)) );      break;
        case 'chart_a':   return ( "chart_a_".concat(text.slice(4,text.length)) );    break;
        case 'chart_b':   return ( "chart_b_".concat(text.slice(4,text.length)) );    break;
        case 'chart_1_':   return ( "chart_1_".concat(text.slice(4,text.length)) );    break;
        case 'chart_2_':   return ( "chart_2_".concat(text.slice(4,text.length)) );    break;
    }
}

const creat_chart_bar_groups = (arr, {x,y,name,type,orientation,color_groups}) => arr.reduce ((acc,curr) => {
    const indexOfCurr = acc.findIndex((item) => item.name === curr[name]);
  
    if(indexOfCurr !== -1 ){
        acc[indexOfCurr].x.push(curr[x]);
        acc[indexOfCurr].y.push(curr[y]);
        return acc;
    }
    var warning_color = color_neutral;
    var element_color = color_groups.find((item_group) => item_group.group_name == curr[name]);
    
    if ( element_color != null) {
        warning_color = color_status_pocked.get_color( element_color.color );
    } else {
        warning_color = color_status_pocked.get_color( Math.floor(Math.random() * 17));
    }

    return [...acc, {
        x: [curr[x]], 
        y: [curr[y]],
        name: curr[name], 
        textposition: 'inside',
        texttemplate:"  %{y:,}",
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

  var min_limit = Math.floor( Math.min.apply(null,x_data) );
  var max_limit = Math.ceil( Math.max.apply(null,x_data) );

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
    var x_total = new Array();

    arr.forEach(function(item,index, array){ 
        switch(item[color_groups]){
            case '0': x_data_color_0.push(item[x]);  break;
            case '1': x_data_color_1.push(item[x]);  break;
            case '2': x_data_color_2.push(item[x]);  break;
            case '3': x_data_color_3.push(item[x]);  break;
        }
        x_total.push(item[x]);
    });

    var min_limit = Math.floor( Math.min.apply(null,x_total) );
    var max_limit = Math.ceil( Math.max.apply(null,x_total) );

    var array_data = [
        {
            x: x_data_color_0, 
            type: 'histogram',
            marker: { color:color_green ,line:{width:0.5}},
            xbins: { 
                end: max_limit, 
                size: histogram_size, 
                start: min_limit
                },
            name: 'Good'
        },
        {
            x: x_data_color_1, 
            type: 'histogram',
            marker: { color:color_yellow ,line:{width:0.5}},
            xbins: { 
                end: max_limit, 
                size: histogram_size, 
                start: min_limit
                },
            name: 'Fair'
        },
        {
            x: x_data_color_2, 
            type: 'histogram',
            marker: { color:color_orange ,line:{width:0.5}},
            xbins: { 
                end: max_limit, 
                size: histogram_size, 
                start: min_limit
                },
            name: 'Keep watch'
        },
        {
            x: x_data_color_3, 
            type: 'histogram',
            marker: { color:color_red ,line:{width:0.5}},
            xbins: { 
                end: max_limit, 
                size: histogram_size, 
                start: min_limit
                },
            name: 'Take action'       
        }
    ]


    return array_data;
}

function creat_chart_double_bar (arr, {x,y_A,y_B,y_C,y_A_name,y_B_name,y_C_name,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data_A = new Array();    
    var y_data_B = new Array();    
    var y_data_C = new Array();    

    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data_A.push(item[y_A]);      
        y_data_B.push(item[y_B]);      
        y_data_C.push(item[y_C]);      
    });

    return [ 
    {
        x: x_data, 
        y: y_data_A,
        text: y_data_A.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: 'bar',
        marker: { color:color_neutral, opacity:1.0, line:{width:0.5}},
        orientation: orientation,
        name: y_A_name
    },
    {
        x: x_data, 
        y: y_data_B,
        text: y_data_B.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: 'bar',
        marker: { color:color_blue, opacity:1.0, line:{width:0.5}},
        orientation: orientation,
        name: y_B_name
    },
    {
        x: x_data, 
        y: y_data_C,
        text: y_data_C.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: 'line',
        yaxis: 'y2',
        marker: { color:color_random_2, opacity:1.0, line:{width:0.5}},
        orientation: orientation,
        name: y_C_name
    }
    ];
} 

function creat_chart_line (arr, {x,y,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data = new Array();    
    var color = new Array();
    var opacity = new Array();

    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data.push(item[y]);      
        
        color.push(  color_status_pocked.get_color(item[color_groups]) );
        opacity.push(  color_status_pocked.get_opacity(item[color_groups]) );
    });

    return [ {
        x: x_data, 
        y: y_data,
        text: y_data.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: type,
        marker: { color, opacity, line:{width:0.5}},
        orientation: orientation
    }]
} 

function creat_chart_bar (arr, {x,y,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data = new Array();    
    var color = new Array();
    var opacity = new Array();

    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data.push(item[y]);      
        
        color.push(  color_status_pocked.get_color(item[color_groups]) );
        opacity.push(  color_status_pocked.get_opacity(item[color_groups]) );
    });

    return [ {
        x: x_data, 
        y: y_data,
        text: y_data.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: type,
        marker: { color, opacity, line:{width:0.5}},
        orientation: orientation
    }]
} 

function creat_chart_bar_and_line (arr, {x,y,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data = new Array();    
    var color = new Array();
    
    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data.push(item[y]);

        color.push(  color_status_pocked.get_color(item[color_groups]) );
        opacity.push(  color_status_pocked.get_opacity(item[color_groups]) );
    });

    return [ {
        x: x_data, 
        y: y_data,
        text: y_data.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: type,
        marker: { color, opacity, line:{width:0.5}},
        orientation: orientation
    }]
} 

function creat_chart_bar_staked (arr, {x,y,type,orientation,color_groups}){
    var x_data = new Array();    
    var y_data = new Array();    
    var color = new Array();
    var opacity = new Array();

    arr.forEach(function(item,index, array){ 
        x_data.push(item[x]);
        y_data.push(item[y]);      
        
        color.push(  color_status_pocked.get_color(item[color_groups]) );
        opacity.push(  color_status_pocked.get_opacity(item[color_groups]) );
    });

    return [ {
        x: x_data, 
        y: y_data,
        text: y_data.map(String),
        textposition: 'inside',
        texttemplate:"  %{y:,}",
        type: type,
        marker: { color, opacity, line:{width:0.5}},
        orientation: orientation
    }]
} 

function creat_chart_pie (arr, {value_column, label_colum, color_groups} ){
    var values_data = new Array();    
    var labels_data = new Array();    
    var color = new Array();
    var opacity = new Array();
    
    arr.forEach(function(item,index, array){ 
        values_data.push(item[value_column]);
        labels_data.push(item[label_colum]);
        color.push(  color_status_pocked.get_color(item[color_groups]) );
        opacity.push(  color_status_pocked.get_opacity(item[color_groups]) );
    });

    return [ {
        values: values_data, 
        labels: labels_data,
        type: 'pie',
        sort: false,
        textinfo: "label+percent+value",
        textposition: "outside",
        marker: { colors:color, opacity:opacity, line:{width:0.5}}
    }]
} 

function creat_map(arr,{qyt, country_code, country_name, label_legend}){
    var loc_code = new Array();    
    var loc_name = new Array();    
    var loc_qyt = new Array();

    arr.forEach(function(item,index, array){ 
        if (item[country_code] != null) {
            loc_code.push(item[country_code]);
            loc_name.push(item[country_name]);      
            loc_qyt.push(item[qyt]);                  
        }
    });

    return [{
        type: 'choropleth',
        locationmode: 'ISO-3',
        locations: loc_code,//loc_code, //location code
        z: loc_qyt, //qty to display
        text: loc_name, //location name
        zmin: 0,
        zmax: Math.max(loc_qyt)*1.05,
        colorscale: [
            [0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],
            [0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],
            [0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']
        ],
        autocolorscale: false,
        reversescale: true,
        tick0: 0,
        dtick: 1000,
        colorbar: {
            autotic: false,
            title: label_legend,
            thickness: 12.0
        }
    }];
}

/* ------------------------------------>  Creat CSV file    <---------------------------------- */
//trigger download of data.csv file
function creat_csv(table_reference, html_id){
    var id_button = "dow_" + html_id;
    var file = html_id + ".csv";

    document.getElementById(id_button).addEventListener("click", function(){
        table_reference.download("csv", html_id);
    });    
}

/* ------------------------------------>   Creating tables    <---------------------------------- */
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

/* ------------------------------------>   Building sections    <---------------------------------- */
function creat_section(data_id,colection_data,html_element){
	//Content array
	var content = colection_data.find( element => element.section_id == data_id );
		
	var html_original_content = html_element.content.cloneNode(true);
	
	//Chosing tooltip length base in tooltip content
	var tooltip_length = content["tooltip_content"].length;
	var tooltip_segment = "";

	if ( tooltip_length < 30 ) {
		tooltip_segment = "small";	
	} else if (tooltip_length < 50) {
		tooltip_segment = "medium";
	} else if (tooltip_length < 100) {
		tooltip_segment = "large";
	}else{
		tooltip_segment = "extra-large";
	}
	
	//building section content
	var html_section_content;
    
    var kill_funtion = false;

	switch (content["content_type"]) {
  		case "simple-table":
            kill_funtion = Object.entries(content["table_settings"]["table_data"]).length === 0;

    		html_section_content = "<div id='" + generate_id(content["section_id"],"tab") + "'></div>";
    		break;
        case "double-chart-histogram-color-and-pie":
            kill_funtion = Object.entries(content["chart_settings"]["histogram_data"]).length === 0;

            html_section_content = "<div class='container_content_double'><div class='container_content_python_chart_a' id='" + generate_id(content["section_id"],"chart_a") + "'></div>";
            html_section_content += "<div class='container_content_python_chart_b' id='" + generate_id(content["section_id"],"chart_b") + "'></div></div>";
            break;
        case "double-chart-bar-mono-color-bar-line":
            kill_funtion = Object.entries(content["chart_settings"]["chart_data"]).length === 0;

            html_section_content = "<div class='container_content_double'><div class='container_content_python_chart_1' id='" + generate_id(content["section_id"],"chart_1_") + "'></div>";
            html_section_content += "<div class='container_content_python_chart_2' id='" + generate_id(content["section_id"],"chart_2_") + "'></div></div>";
            break;           
        case "simple-global-map":
  		case "simple-chart":
        case "simple-chart-bar-groups":
        case "simple-chart-bar":
        case "simple-chart-double-bar":
        case "simple-chart-histogram-mono-color":
        case "simple-chart-pie":
        case "simple-chart-histogram-multi-color":
        case "simple-chart-bar-and-multi-line":
        case "simple-chart-bar-and-horizontal-line":
        case "simple-chart-hardware-projection":
            kill_funtion = Object.entries(content["chart_settings"]["chart_data"]).length === 0;

    		html_section_content = "<div class='container_content_python_chart' id='" + generate_id(content["section_id"],"chart") + "'></div>";
   	 		break;
  		default:
    		html_section_content = "<p> This is not a valid section type</p>";
    		break;
	};

    if (kill_funtion) { return 0;}

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

	html_element.insertAdjacentHTML('beforebegin',new_html_text);
	

    //Creating table in the section
    if ( content["table_settings"]["table_data"]!= null) {
        var table_created = creat_table(content["table_settings"], generate_id(content["section_id"],"tab"));
        creat_csv(table_created, content["section_id"]);
    }

    switch(content["content_type"]){
        case "simple-chart-bar-groups":
            var chart_bar_data = creat_chart_bar_groups(
                content["chart_settings"]["chart_data"], {
                    x: content["chart_settings"]["x_column"],
                    y: content["chart_settings"]["y_column"],
                    name: content["chart_settings"]["group"],
                    type: 'bar',
                    orientation: content["chart_settings"]["orientation"],
                    color_groups: content["chart_settings"]["group_color"]
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
        case "simple-chart-double-bar":
            var chart_bar_data = creat_chart_double_bar(content["chart_settings"]["chart_data"], {
                x: content["chart_settings"]["x_column"],
                y_A: content["chart_settings"]["y_column_barA"],
                y_B: content["chart_settings"]["y_column_barB"],
                y_C: content["chart_settings"]["y_column_lineC"],
                y_A_name: content["chart_settings"]["y_A_group_name"] + "     ",
                y_B_name: content["chart_settings"]["y_B_group_name"] + "     ",
                y_C_name: content["chart_settings"]["y_C_group_name"] + "     ",
                type: 'bar',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });
            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                yaxis2: {
                    title: content["chart_settings"]["y_label_2"],
                    overlaying: 'y',
                    side: 'right',
                    range: [0, 100]
                  },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'}
                }; 
            
            Plotly.newPlot( generate_id(content["section_id"],"chart"), chart_bar_data, layout, {responsive: true, displaylogo: false} );
            
            break;
        case "simple-chart-bar-and-horizontal-line":
            var chart_bar_data = creat_chart_bar(content["chart_settings"]["chart_data"], {
                x: content["chart_settings"]["x_column"],
                y: content["chart_settings"]["y_column"],
                type: 'bar',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });

            var line_limit = content["chart_settings"]["line_value"];
            var min_value = chart_bar_data[0]['x'][0];
            var max_value = chart_bar_data[0]['x'][ chart_bar_data[0]['x'].length -1 ] ;

            //place for annotation of line 
            var annotation_place = 
                content["chart_settings"]["chart_data"].length < 4? 
                content["chart_settings"]["chart_data"].length - 1:
                3;

            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                shapes: [
                    {
                        type: 'line',
                        x0: min_value,
                        y0: line_limit,
                        x1: max_value,
                        y1: line_limit,
                        line: {
                            color: color_red,
                            width: 4,
                            dash: 'dashdot'
                        }
                    }
                ],
                annotations: [
                    {
                        x: chart_bar_data[0]['x'][annotation_place],
                        y: line_limit,
                        xref: 'x',
                        yref: 'y',
                        text: content["chart_settings"]['line_text_label'],
                        showarrow: true,
                        arrowhead: 12,
                        ax: -30,
                        ay: -30
                    }
                ]
            }; 
            
            Plotly.newPlot( 
                generate_id(content["section_id"],"chart"), 
                chart_bar_data, 
                layout, 
                {responsive: true, displaylogo: false} );
            
            break;
        case "simple-chart-bar-and-multi-line":
            var chart_bar_data = creat_chart_bar(content["chart_settings"]["chart_data"], {
                x: content["chart_settings"]["x_column"],
                y: content["chart_settings"]["y_column"],
                type: 'bar',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });
            
                //place for annotation of line 
            var annotation_place = 
                content["chart_settings"]["chart_data"].length < 4? 
                content["chart_settings"]["chart_data"].length - 1:
                5;

            var shapes_ar = []
            content["chart_settings"]["line_values"].forEach(function(item,index, array){
                shapes_ar.push({
                    type: 'line',
                    x0: chart_bar_data[0]['x'][0],
                    y0: item,
                    x1: chart_bar_data[0]['x'][ chart_bar_data[0]['x'].length -1 ],
                    y1: item,
                    line: {
                        color: color_orange,
                        width: 2,
                        dash: 'dashdot'
                    }
                })
            })
            var annotation_ar = [];
            content["chart_settings"]["line_text_labels"].forEach(function(item,index, array){
                annotation_ar.push({
                    x: chart_bar_data[0]['x'][annotation_place + index + 1] ,
                    y: content["chart_settings"]["line_values"][index],
                    xref: 'x',
                    yref: 'y',
                    text: item,
                    showarrow: true,
                    arrowhead: 12,
                    ax: -30,
                    ay: -20
                });
            })
            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                shapes: shapes_ar,
                annotations: annotation_ar
            }; 
            
            Plotly.newPlot( 
                generate_id(content["section_id"],"chart"), 
                chart_bar_data, 
                layout, 
                {responsive: true, displaylogo: false} );
            
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

            Plotly.newPlot( 
                generate_id(content["section_id"],"chart"), 
                chart_pie_data, 
                layout, 
                {responsive: true, displaylogo: false} );         

            break;
        case "double-chart-histogram-color-and-pie":

            var chart_histogram_data = creat_histogram_multi_color(content["chart_settings"]["histogram_data"],{
                x: content["chart_settings"]["histogram_column"],
                color_groups: content["chart_settings"]["histogram_color"],
                histogram_size: content["chart_settings"]["histogram_width"]
            });

            var chart_histogram_layout = {
                xaxis: {title: {text: content["chart_settings"]["histogram_x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["histogram_y_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                barmode: "overlay"
            };    

            var chart_pie_data = creat_chart_pie(content["chart_settings"]["pie_data"],{ 
                value_column: content["chart_settings"]["pie_value_column"],
                label_colum: content["chart_settings"]["pie_label_column"],
                color_groups: content["chart_settings"]["pie_colors_column"]
            });


            var chart_pie_layout = {
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'}
            };    

            Plotly.newPlot( 
                generate_id(content["section_id"],"chart_a"), 
                chart_histogram_data, 
                chart_histogram_layout, 
                {responsive: true, displaylogo: false} );         
            Plotly.newPlot( 
                generate_id(content["section_id"],"chart_b"), 
                chart_pie_data, 
                chart_pie_layout, 
                {responsive: true, displaylogo: false} );         

            break;
        case "double-chart-bar-mono-color-bar-line":
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
            
            Plotly.newPlot( generate_id(content["section_id"],"chart_1_"), chart_bar_data, layout, {responsive: true, displaylogo: false} );
            
            var chart_bar_data = creat_chart_bar(content["chart_settings"]["chart_2_data"], {
                x: content["chart_settings"]["x_2_column"],
                y: content["chart_settings"]["y_2_column"],
                type: 'bar',
                orientation: content["chart_settings"]["orientation_2"],
                color_groups:content["chart_settings"]["colors_2"] });

            var line_limit = content["chart_settings"]["chart_2_data"][0][content["chart_settings"]["line_value_2"]];
            var min_value = 0;
            var max_value = chart_bar_data[0]['x'].length;

            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_2_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_2_label"],standoff:20}, automargin: true },
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                shapes: [
                    {
                        type: 'line',
                        x0: -1,
                        y0: line_limit,
                        x1: max_value,
                        y1: line_limit,   
                        line: {
                            color: color_red,
                            width: 4,
                            dash: 'dashdot'
                        }
                    }
                ]
            }; 
            
            Plotly.newPlot( generate_id(content["section_id"],"chart_2_"), chart_bar_data, layout, {responsive: true, displaylogo: false} );
            break;
        case "simple-global-map":
            var char_data_map = creat_map(
                    arr = content['chart_settings']['chart_data'],
                    {   
                        qyt: content['chart_settings']['location_quantity'],
                        country_code: content['chart_settings']['location_code'], 
                        country_name: content['chart_settings']['location_name'],
                        label_legend: content['chart_settings']['label_legend'],
                    }
                );
            
            var layout = {
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                geo:{
                    showframe: false, //frame around map
                    showcoastlines: true, //lineas continents
                    projection:{
                        type: 'wagner6' //wagner6
                    },
                    showland: true,
                    showcountries: true,
                    landcolor: 'rgb(250,250,250)',
                    subunitcolor: 'rgb(217,217,217)', //state line
                    countrycolor: 'rgb(217,217,217)', //country color line
                    coastlinecolor: 'rgb(0,0,0)', //cost line
                    countrywidth: 0.5,
                    subunitwidth: 0.5,
                    coastlineswidth: 0.2
                },
                autosize: false,
                width: 1200,
                height: 600,              
                margin: {
                    l: 10,
                    r: 10,
                    b: 10,
                    t: 10,
                    pad: 4
                }
            };

            Plotly.newPlot( generate_id(content["section_id"],"chart"), char_data_map, layout, {responsive: true, displaylogo: false} );
            break;
        case "simple-chart-hardware-projection":
            var chart_bar_data_1 = creat_chart_bar(content["chart_settings"]["chart_data"], {
                x: content["chart_settings"]["x_column"],
                y: content["chart_settings"]["y_column"],
                type: 'scatter',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });
            chart_bar_data_1[0]['name'] = content["chart_settings"]["chart_legend"] + "   ";
            
            var chart_bar_data_2 = creat_chart_bar(content["chart_settings"]["chart_2_data"], {
                x: content["chart_settings"]["x_2_column"],
                y: content["chart_settings"]["y_2_column"],
                type: 'scatter',
                orientation: content["chart_settings"]["orientation"],
                color_groups:content["chart_settings"]["colors"] });
            chart_bar_data_2[0]['name'] = content["chart_settings"]["chart_legend_2"] + "   ";

            var line_limit = content["chart_settings"]["reserve_stock"];
            var min_value = chart_bar_data_1[0]['x'][0];
            var max_value = chart_bar_data_1[0]['x'][ chart_bar_data_1[0]['x'].length -1 ] ;


            var layout = {
                xaxis: {title: {text: content["chart_settings"]["x_label"],standoff:20}, automargin: true },
                yaxis: {title: {text: content["chart_settings"]["y_label"],standoff:20}, automargin: true, rangemode: 'tozero'},
                font: {family:'MD IO 0.4', size: 13, color: '#00334F'},
                showlegend: true,
                legend: {
                    x: 0,
                    y: 1,
                    traceorder: 'normal',
                    itemsizing: 'trace',
                    font: {
                      family: 'MD IO 0.4',
                      size: 13,
                      color: '#00334F'
                    },
                    bgcolor: color_neutral,
                    bordercolor: '#00334F',
                    borderwidth: 0
                },
                shapes: [
                    {
                        type: 'line',
                        x0: min_value,
                        y0: line_limit,
                        x1: max_value,
                        y1: line_limit,
                        line: {
                            color: color_blue_dark,
                            width: 4,
                            dash: 'dashdot'
                        }
                    }
                ]
            }; 
            var two_data = [chart_bar_data_1[0], chart_bar_data_2[0]];

            Plotly.newPlot( 
                generate_id(content["section_id"],"chart"), 
                two_data, 
                layout, 
                {responsive: true, displaylogo: false} );
            break;
    }
}

function creat_cards(colection_data,html_element){
    colection_data.sort((a, b) => {
        return b.status - a.status ;
    });

    var html_cards = '';

    var card_id_html_array = new Array();

    colection_data.forEach( function(item,index){
        var card_total = item.total;
        var card_title = item.title;
        var card_main_quantity = (item.main_quantity).toLocaleString('en-US');
        var card_porcentaje = 0;

        if (card_total != 0) {
            card_porcentaje =  ((item.main_quantity/item.total)*100).toFixed(2);
        }

        var card_color = generate_action_color(item.status);
        var card_action_text = generate_action_text(item.status);
        var card_html_id = generate_card_id();

        card_id_html_array.push({card_id_html:card_html_id,card_id_porcentage:card_porcentaje});
            
        card_total = card_total.toLocaleString('en-US');
 
        html_cards += `<div class='card_general_box'><div class='card_action_box' style='background-color:${card_color};'><p class='card_action_font'>${card_action_text}</p></div>`;
        html_cards += `<div class='card_container_box'><div class='card_title_box'> <p class='card_title_font'>${card_title}</p> </div>`;
        html_cards += `<div class='card_chart_box'><div id='${card_html_id}'><vc-donut v-bind='props'></vc-donut></div></div><div class='card_empty_box'></div>`;
        html_cards += `<div class='card_quantity_box'><p class='card_quantity_font'>${card_main_quantity}</p></div>`;        
        html_cards += `<div class='card_detail_box'><p class='card_detail_font'>${card_porcentaje}% of ${card_total} total devices</p>  </div></div></div>`;

    });

    html_element.insertAdjacentHTML('beforebegin',html_cards);
    

    Vue.use(vcdonut.default);

    card_id_html_array.forEach( function(card,index){

        new Vue({
          el: "#"+card.card_id_html,
          data() {
            return {
              props: {
                size: 130,
                sections: [
                    { value: parseInt(card.card_id_porcentage), color: '#00E1FF' }
                  ],
                thickness: 30, // set this to 100 to render it as a pie chart instead
                hasLegend: false,
                // specify more props here
              }
            };
          }
        });
    });

}

/* ------------------------------------>   Order json    <---------------------------------- */
function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
 }
