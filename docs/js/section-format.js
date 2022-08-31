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
    Global constants
************************************************************/
//icons resources
const icon_dowload = "https://ismael-particle.github.io/report-template/img/download.png"; 
const icon_docs = "https://ismael-particle.github.io/report-template/img/docs.png";
const icon_support = "https://ismael-particle.github.io/report-template/img/support.png";

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
    		html_section_content = "<div id='" + content["content_id"] + "'></div>";
    		break;
  		case "simple-chart":
    		html_section_content = "<div id='" + content["content_id"] + "'></div>";
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

        var table_created = creat_table(content["table_settings"], content["content_id"]);
        creat_csv(table_created, content["section_id"]);
    }

}
