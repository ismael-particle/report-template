/* --------------------> Print Title and subtitule <------------------------ */
document.getElementById('organization_name').innerHTML = service_agreement_obj[0]["ORG_NAME"]
document.getElementById('organization_service').innerHTML = 'Growth'

/* --------------> Printing Service agreement details table <--------------- */
data_service_details_arr = [
    ['Organization name', service_agreement_obj[0]["ORG_NAME"]],  
    ['WiFi blocks', service_agreement_obj[0]["WIFI_BLOCKS"] ],
    ['Organization ID', service_agreement_obj[0]["ORG_ID"]],
    ['WiFi max devices (per month)',
        (service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"]).toLocaleString("en-US")],
    ['Commercial model:',service_agreement_obj[0]["COMMERCIAL_MODEL_"]],
    ['WiFi data operations limit in billing period',
        (service_agreement_obj[0]["WIFI_DATAOPS_LIMIT"]).toLocaleString("en-US")],
    ['Service agreement ID:',service_agreement_obj[0]["SERVICE_AGREEMENT_ID"]],
    ['Cellular blocks',  service_agreement_obj[0]["CELLULAR_BLOCKS"]],
    ['Org owner email', service_agreement_obj[0]["EMAIL_ORG_OWNER"]],
    ['Cellular max devices (per month)',
        (service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"]).toLocaleString("en-US") ],
    ['Monthly billing period start',service_agreement_obj[0]["BILLING_PERIOD_START_DATE"].trim().substring(0, 10)],
    ['Celular data limit in billing period [Gb]', 
        ( (service_agreement_obj[0]["CELLULAR_DATA_LIMIT"])/(1000000000) ).toLocaleString("en-US")],
    ['Monthly billing period end',service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)],
    ['Celular data operations limit in billing period', 
        (service_agreement_obj[0]["CELLULAR_DATAOPS_LIMIT"]).toLocaleString("en-US") ],
    ['Org created date',  
        service_agreement_obj[0]["SERVICE_AGREEMENT_START_DATE"].trim().substring(0, 10)],
    ['Service paused',  service_agreement_obj[0]["DEVICES_PAUSED"]]
]

print_table_service_details( data_service_details_arr, "table_service_id");

/* --------------------------> Cellular section <--------------------------- */
if (iscellular_customer) {
	//	->	Metered devices		***		Cellular	***		Growth-Basic	 ***
	//Set up color per percentage of metered devices in cellular devices
	let cellular_metered_devices_color = projection_clasification(
		metered_cellular_devices_ar,
		'QTY_METERED_DEVICES',
		service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"],
		[0.80,0.85,0.90]
		);

	//	->	Online devices		***		Cellular	***		Growth-Basic	 ***
	//Generating projection of celular online devices - 24 months
	let online_cellular_devices_projection = line_projection(
		online_cellular_devices_ar, 
		24, 
		'DEVICE_ONLINE_QY', 
		'BILLING_USAGE_MONTH_START_DATE'
		);

	let cellular_online_devices_projection_color = [];

	let cellular_monthly_growth = percetage_growth( online_cellular_devices_projection, 'value');

	online_cellular_devices_projection.forEach(function(item,index, array){
		var color_warning;
		switch (true) {
			case ( cellular_monthly_growth < 0 ):			
				color_warning = (item["source"] == 'fact') ? 'major_solid': 'major_shadow';
				break;
			case ( cellular_monthly_growth >= 0 && cellular_monthly_growth <= 0.25 ):			
				color_warning = (item["source"] == 'fact') ? 'minor_solid': 'minor_shadow';
				break;
			case ( cellular_monthly_growth > 0.25 && cellular_monthly_growth <= 0.5 ):			
				color_warning = (item["source"] == 'fact') ? 'warning_solid': 'warning_shadow';
				break;
			case ( cellular_monthly_growth > 0.5 ):			
				color_warning = (item["source"] == 'fact') ? 'clear_solid': 'clear_shadow';
				break;
			default:
				color_warning = 'major_solid';			
				break;
		}	
		cellular_online_devices_projection_color.push ( {
			'COLOR_STATE': color_warning,
			'BILLING_USAGE_MONTH_START_DATE': item["date"],
			"DEVICE_ONLINE_QY": item["value"],
			'SOURCE':item["source"]
		});
	});	

	//	-> Online vs Metered devices		***		Cellular	***		Growth-Basic	 ***
	let online_metered_cellular_devices = combine_objects(
		metered_cellular_devices_ar,//objectA,
		online_cellular_devices_ar,//objectB,
		'BILLING_USAGE_MONTH_START_DATE', //commonA_data, 
		'BILLING_USAGE_MONTH_START_DATE', //commonB_data, 
		'QTY_METERED_DEVICES',//saveA, 
		'DEVICE_ONLINE_QY' //saveB
		);

	//	->	Device status	*** 	Cellular	***		Growth-Basic	 ***
	let summary_celllar_device_status = summary_device_status( cellular_devices_status_ar, 'DEVICE_OPERATIVE_STATUS');

	//	->	Data ops average	*** 	Cellular	***		Growth-Basic	 ***
	let cellular_package_recomendation = calculate_package(
		monthly_data = average_dataops_cellular_ar, 
		column_average = 'AVG_DATA_OPS_QY');

	//	->	Localization	*** 	Cellular	***		Growth-Basic	 ***
	//Table per country
	localization_cellular_devices_per_country = summary_per_country(localization_cellular_devices_ar);
    //convert code into country_code_alpha_3 
    convert_country_code( localization_cellular_devices_per_country, 'COUNTRY_CODE');
	
	//Cellular section template
	template_cellular_section_array = [
	{
		section_id: "chart_metered_devices_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count (Time Series)", //Section subtitle
		tooltip_content: "Raw Count of Unique Metered Devices / Mo.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: metered_cellular_devices_ar,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'QTY_METERED_DEVICES',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_metered_devices_cellular_2", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count and limit", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_metered_devices_color,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'QTY_METERED_DEVICES',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v',
			line_value: service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"],
			line_text_label: ('Device limit: ' + service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"] 
				+ ' devices' )
		}
	},
	{
		section_id: "chart_online_devices_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Online Cellular Devices (Time Series)", //Section subtitle
		tooltip_content: "Breakdown of unique devices online within a given month",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: online_cellular_devices_ar,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'DEVICE_ONLINE_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_online_devices_cellular_2", //It is use to the section_i and CSV download_id 
		subtitle: 
			"Online Cellular Devices with 24 Month Projection (Approx Growth: "+ cellular_monthly_growth.toFixed(2)+"% MoM)",
		tooltip_content: "Projections based on linear regression against <= 2 years of growth.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_online_devices_projection_color,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'DEVICE_ONLINE_QY',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_online_metered_comparative_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Cellular Online vs. Metered Ratio", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-double-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: online_metered_cellular_devices,
			x_column: 'date',
			y_column_barA: 'data_A', //bar
			y_column_barB: 'data_B', //bar
			y_column_lineC: 'percentage', //line
			y_A_group_name: 'Metered devices',
			y_B_group_name: 'Online devices',
			y_C_group_name: '% of use',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of devices',
			y_label_2: 'Percentage of use',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Cellular Data Ops Consumption (Time Series)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of data operations consumed per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: dataops_cellular_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data ops',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_cellular_2", //It is use to the section_i and CSV download_id 
		subtitle: "Data Operations Average Consumption per Year per Device", //Section subtitle
		tooltip_content: "Projection of average of consumption per device each year",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: average_dataops_cellular_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'AVG_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Average data ops consumed per month',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_cellular_3", //It is use to the section_i and CSV download_id 
		subtitle: "Data Operations Average Consumption per Year per Device (EP2023 Pro projection)", //Section subtitle
		tooltip_content: "Projection of average of consumption per device each year",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-multi-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: average_dataops_cellular_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'AVG_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Average data ops consumed per month',
			orientation: 'v',
			line_values: cellular_package_recomendation[0],
			line_text_labels: cellular_package_recomendation[1]
		}
	},
	{
		section_id: "chart_general_data_consumption_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Cellular Data (MB) Consumption (Time Series)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of cellular data per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_data_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_CELLULAR_DATA_QY_MB',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'MB Consumed',
			orientation: 'v'
	  	}
	},
	{
		section_id: "chart_device_status_cellular_1", //It is use to the section_i and CSV download_id 
		subtitle: "Device Status", //Section subtitle
		tooltip_content: "Commercial status for each device",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-pie", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: summary_celllar_device_status,
			x_column: 'qty_devices',
			y_column: 'category',
			colors: 'color_status'
		}
	},
	{
		section_id: "chart_device_status_cellular_2", //It is use to the section_i and CSV download_id 
		subtitle: "Device Status details", //Section subtitle
		tooltip_content: "Commercial status of each devices in cellular fleat",
		dowload_boolean: true, //true,false
		url_docs: "", //notion url
		content_type: "simple-table", //simple-table,simple-chart,
		table_settings: {
			//"DEVICE_ID","LAST_CONNECTION", "FIRST_CONNECTION", "PRODUCT_ID"
			//"CONNECTIVITY_TYPE_NAME", "DAYS_DIFERENCE", "DEVICE_OPERATIVE_STATUS"
			table_data: cellular_devices_status_ar,
			order_by: [{
				column: "DEVICE_OPERATIVE_STATUS",
				dir: "desc"
			}], //it could be more that one column
			columns: [ //define the table columns
			{
				title: "Device ID",
				field: "DEVICE_ID",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Product ID",
				field: "PRODUCT_ID",
				hozAlign: "left",
				width: 150
			},
			{
				title: "First connection",
				field: "FIRST_CONNECTION",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Last connection",
				field: "LAST_CONNECTION",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Product Description",
				field: "DEVICE_OPERATIVE_STATUS",
				hozAlign: "left"
			}
			]
		}
	},
	{
		section_id: "map_cellular_devices_per_country", //It is use to the section_i and CSV download_id 
		subtitle: "Devices online in the last 90 days per country", //Section subtitle
		tooltip_content: "Devices online per country",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-global-map", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: localization_cellular_devices_per_country,
			location_code: 'COUNTRY_CODE',
			location_name: 'COUNTRY_NAME',
			location_quantity: 'QYT_DEVICES',
			label_legend: 'Qyt of devices',
			orientation: 'v'
	 	}
	},
	{
		section_id: "table_cellular_devices_per_country", //It is use to the section_i and CSV download_id 
		subtitle: "Devices online in the last 90 days per country", //Section subtitle
		tooltip_content: "Details of quantity of devices per country",
		dowload_boolean: true, //true,false
		url_docs: "", //notion url
		content_type: "simple-table", //simple-table,simple-chart,
		table_settings: {
			//"QYT_DEVICES","DIM_COUNTRY_CODE","COUNTRY_NAME","BILLING_CONNECTIVITY","SKU_FAMILY"
			table_data: localization_cellular_devices_per_country,
			order_by: [{
				column: "QYT_DEVICES",
				dir: "asc"
			}], //it could be more that one column
			columns: [ //define the table columns
			{
				title: "Country name",
				field: "COUNTRY_NAME",
				hozAlign: "left",
				width: 450
			},
			{
				title: "Qty of devices",
				field: "QYT_DEVICES",
				hozAlign: "left"
			}
			]
		}
	},
	{
		section_id: "table_cellular_devices_per_country_per_sku_family", //It is use to the section_i and CSV download_id 
		subtitle: "Devices online in the last 90 days per country and sku family", //Section subtitle
		tooltip_content: "Details of quantity of devices per country and sku family online",
		dowload_boolean: true, //true,false
		url_docs: "", //notion url
		content_type: "simple-table", //simple-table,simple-chart,
		table_settings: {
			//"QYT_DEVICES","DIM_COUNTRY_CODE","COUNTRY_NAME","BILLING_CONNECTIVITY","SKU_FAMILY"
			table_data: localization_cellular_devices_ar,
			order_by: [{
				column: "QYT_DEVICES",
				dir: "asc"
			}], //it could be more that one column
			columns: [ //define the table columns
			{
				title: "Country name",
				field: "COUNTRY_NAME",
				hozAlign: "left",
				width: 450
			},
			{
				title: "Qty of devices",
				field: "QYT_DEVICES",
				hozAlign: "left",
				width: 300
			},
			{
				title: "SKU family",
				field: "SKU_FAMILY",
				hozAlign: "left"
			}
			]
		}
	},
	{
		section_id: "chart_cellular_ota_1", //It is use to the section_i and CSV download_id 
		subtitle: "OTA attempts in the last 12 months", //Section subtitle
		tooltip_content: "OTA attempts group by success or fail",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-groups", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			chart_data: ota_monthly_cellular_ar,
			x_column: 'MONTLY_OTA_DATE',
			y_column: 'QYT_OTA_ATTEMPS',
			group: 'OTA_SUCCESS_', //If NULL this display blue
			group_color:[
				{group_name: 'FAIL',color:'major_solid'}, 
				{group_name: 'SUCCESS',color:'clear_solid'}	
			],
			x_label: 'Month',
			y_label: 'Qty of OTA attempts',
			orientation: 'v'
		}
	}
	
	]; //End var - template_cellular_section_array

	template_cellular_section_array.forEach(print_sections);
}

/* ----------------------------> WiFi section <----------------------------- */
if (iswifi_customer) {
	/**********************************************************
		Metered devices - WiFi - enterprise-Basic
	************************************************************/
	let wifi_metered_devices_current_biling_period = filter_date( 
		metered_wifi_devices_ar, 
		'BILLING_USAGE_MONTH_START_DATE', 
		service_agreement_obj[0]["BILLING_PERIOD_START_DATE"])
	
	wifi_metered_devices_current_biling_period = simple_clasification(
		wifi_metered_devices_current_biling_period, 
		'QTY_METERED_DEVICES', 
		service_agreement_obj[0]['WIFI_METERED_DEVICES_LIMIT'], 
		[0.80,0.90,1.0]);

	let last_month_wifi = 
		new moment(metered_wifi_devices_ar[metered_wifi_devices_ar.length -1]["BILLING_USAGE_MONTH_START_DATE"])
	let end_billing_period = new moment(service_agreement_obj[0]["BILLING_PERIOD_END_DATE"])

	//generating prediction until billing date cellular
	let metered_wifi_device_projection = 
		line_projection(
			metered_wifi_devices_ar, 
			end_billing_period.diff(last_month_wifi, 'months'), 
			'QTY_METERED_DEVICES', 
			'BILLING_USAGE_MONTH_START_DATE');
	
	let wifi_metered_devices_current_biling_period_projection_color = projection_clasification(
		metered_wifi_device_projection,
		'value',
		service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"],
		[0.75,0.80,0.90]
	)
	/**********************************************************
		Online devices	- WiFi - enterprise-Basic
	************************************************************/
	//Generating projection of WiFi online devices - 24 months
	let online_wifi_devices_projection = 
		line_projection(
			online_wifi_devices_ar, 
			24, 
			'DEVICE_ONLINE_QY', 
			'BILLING_USAGE_MONTH_START_DATE');

	let wifi_online_devices_projection_color = [];

	let wifi_monthly_growth = percetage_growth( online_wifi_devices_projection, 'value');

	online_wifi_devices_projection.forEach(function(item,index, array){
		let color_warning;
		
		switch (true) {
			case ( wifi_monthly_growth < 0 ):			
				color_warning = (item["source"] == 'fact') ? 'major_solid': 'major_shadow';
				break;
			case ( wifi_monthly_growth >= 0 && wifi_monthly_growth <= 0.25 ):			
				color_warning = (item["source"] == 'fact') ? 'minor_solid': 'minor_shadow';
				break;
			case ( wifi_monthly_growth > 0.25 && wifi_monthly_growth <= 0.5 ):			
				color_warning = (item["source"] == 'fact') ? 'warning_solid': 'warning_shadow';
				break;
			case ( wifi_monthly_growth > 0.5 ):			
				color_warning = (item["source"] == 'fact') ? 'clear_solid': 'clear_shadow';
				break;
			default:
				color_warning = 'major_solid';			
				break;
		}
		wifi_online_devices_projection_color.push ( {
			'COLOR_STATE': color_warning,
			'BILLING_USAGE_MONTH_START_DATE': item["date"],
			"DEVICE_ONLINE_QY": item["value"],
			'SOURCE':item["source"]
		});
	});	

	/**********************************************************
		Online vs metered devices - WiFi - enterprise-Basic
	************************************************************/
	let online_metered_wifi_devices = combine_objects(
		metered_wifi_devices_ar,//objectA,
		online_wifi_devices_ar,//objectB,
		'BILLING_USAGE_MONTH_START_DATE', //commonA_data, 
		'BILLING_USAGE_MONTH_START_DATE', //commonB_data, 
		'QTY_METERED_DEVICES',//saveA, 
		'DEVICE_ONLINE_QY' //saveB
		)

	/**********************************************************
		Device status - WiFi - enterprise-Basic
	************************************************************/
	let summary_wifi_device_status = summary_device_status( wifi_devices_status_ar, 'DEVICE_OPERATIVE_STATUS');

	//	->	Data ops average	*** 	Cellular	***		enterprise-Basic	 ***
	let wifi_package_recomendation = calculate_package(
		monthly_data = average_dataops_wifi_ar, 
		column_average = 'AVG_DATA_OPS_QY');

	//WiFI section template
	template_wifi_section_array = [
	{
		section_id: "chart_metered_devices_wifi_1", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count (Time Series)", //Section subtitle
		tooltip_content: "Raw Count of Unique Metered Devices / Mo.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: metered_wifi_devices_ar,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'QTY_METERED_DEVICES',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'			
		}
	},
	{
		  section_id: "chart_metered_devices_wifi_2", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count in current billing period and limit", //Section subtitle
		tooltip_content: "Count of Unique Metered Devices / Mo",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: wifi_metered_devices_current_biling_period,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'QTY_METERED_DEVICES',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v',
			line_value: service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"],
			line_text_label: ('Device limit: ' + service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"] 
				+ ' devices')
		}
	},
	/*{
		section_id: "chart_metered_devices_wifi_3", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count in current billing period, projection and limit", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: wifi_metered_devices_current_biling_period_projection_color,
			x_column: 'date',
			y_column: 'value',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v',
			line_value: service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"],
			line_text_label: ('Device limit: ' + service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"] 
				+ ' devices, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10) )
		}
	},*/
	{
		section_id: "chart_online_devices_wifi_1", //It is use to the section_i and CSV download_id 
		subtitle: "Online WiFi Devices (Time Series)", //Section subtitle
		tooltip_content: "Breakdown of unique devices online within a given month",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: online_wifi_devices_ar,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'DEVICE_ONLINE_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_online_devices_wifi_2", //It is use to the section_i and CSV download_id 
		subtitle: ("Online WiFi Devices with 24 Month Projection (Approx Growth: " + wifi_monthly_growth.toFixed(2)+ "% MoM)"),
		tooltip_content: "projections based on linear regression against <= 2 years of growth",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: wifi_online_devices_projection_color,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'DEVICE_ONLINE_QY',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_online_metered_comparative_wifi_1", //It is use to the section_i and CSV download_id 
		subtitle: "WiFi Online vs. Metered Ratio", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-double-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: online_metered_wifi_devices,
			x_column: 'date',
			y_column_barA: 'data_A', //bar
			y_column_barB: 'data_B', //bar
			y_column_lineC: 'percentage', //line
			y_A_group_name: 'Metered devices',
			y_B_group_name: 'Online devices',
			y_C_group_name: '% of use',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of devices',
			y_label_2: 'Percentage of use',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_wifi_1", //It is use to the section_i and CSV download_id 
		subtitle: "WiFi Data Ops Consumption (Time Series)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of data operations consumed per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: dataops_wifi_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data operations',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_wifi_2", //It is use to the section_i and CSV download_id 
		subtitle: "Data Operations Average Consumption per Year per Device", //Section subtitle
		tooltip_content: "Projection of average of consumption per device each year",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: average_dataops_wifi_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'AVG_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Average data ops consumed per month',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_wifi_3", //It is use to the section_i and CSV download_id 
		subtitle: "Data Operations Average Consumption per Year per Device (EP2023 Pro projection)", //Section subtitle
		tooltip_content: "Projection of average of consumption per device each year",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-multi-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: average_dataops_wifi_ar,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'AVG_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Average data ops consumed per month',
			orientation: 'v',
			line_values: wifi_package_recomendation[0],
			line_text_labels: wifi_package_recomendation[1]
		}
	},
	{
		section_id: "chart_device_status_wifi_1", //It is use to the section_i and CSV download_id 
		subtitle: "Device Status", //Section subtitle
		tooltip_content: "Commercial status for each device",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-pie", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: summary_wifi_device_status,
			x_column: 'qty_devices',
			y_column: 'category',
			colors: 'color_status'
		}
	},
	{
		section_id: "chart_device_status_wifi_2", //It is use to the section_i and CSV download_id 
		subtitle: "Device Status details", //Section subtitle
		tooltip_content: "Commercial status of each devices in wifi fleat",
		dowload_boolean: true, //true,false
		url_docs: "", //notion url
		content_type: "simple-table", //simple-table,simple-chart,
		table_settings: {
			//"DEVICE_ID","LAST_CONNECTION", "FIRST_CONNECTION", "PRODUCT_ID"
			//"CONNECTIVITY_TYPE_NAME", "DAYS_DIFERENCE", "DEVICE_OPERATIVE_STATUS"
			table_data: wifi_devices_status_ar,
			order_by: [{
				column: "DEVICE_OPERATIVE_STATUS",
				dir: "desc"
			}], //it could be more that one column
			columns: [ //define the table columns
			{
				title: "Device ID",
				field: "DEVICE_ID",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Product ID",
				field: "PRODUCT_ID",
				hozAlign: "left",
				width: 150
			},
			{
				title: "First connection",
				field: "FIRST_CONNECTION",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Last connection",
				field: "LAST_CONNECTION",
				hozAlign: "left",
				width: 300
			},
			{
				title: "Product Description",
				field: "DEVICE_OPERATIVE_STATUS",
				hozAlign: "left"
			}
			]
		}
	},
	{
		section_id: "chart_wifi_ota_1", //It is use to the section_i and CSV download_id 
		subtitle: "OTA attempts in the last 12 months", //Section subtitle
		tooltip_content: "OTA attempts group by success or fail",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-groups", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			chart_data: ota_monthly_wifi_ar,
			x_column: 'MONTLY_OTA_DATE',
			y_column: 'QYT_OTA_ATTEMPS',
			group: 'OTA_SUCCESS_', //If NULL this display blue
			group_color:[
				{group_name: 'FAIL',color:'major_solid'}, 
				{group_name: 'SUCCESS',color:'clear_solid'}	
			],
			x_label: 'Month',
			y_label: 'Qty of OTA attempts',
			orientation: 'v'
		}
	}
	]

	template_wifi_section_array.forEach(print_sections);
}

/* ---------------------> General information section <--------------------- */
template_general_information_array = [
{
	section_id: "table_product_details", //It is use to the section_i and CSV download_id 
	subtitle: "Details by Product ID", //Section subtitle
	tooltip_content: "Product Overview",
	dowload_boolean: true, //true,false
	url_docs: "", //notion url
	content_type: "simple-table", //simple-table,simple-chart,
	table_settings: {
		//  "PRODUCT_ID", "PRODUCT_NAME", "PRODUCT_DESCRIPTION",  "SKU_FAMILY", "OWNED_DEVICES_QY"
		table_data: product_details_ar,
		order_by: [{
			column: "PRODUCT_ID",
		  	dir: "desc"
		}], //it could be more that one column
		columns: [ //define the table columns
		{
			title: "Product ID",
			field: "PRODUCT_ID",
			hozAlign: "left",
			width: 130
		},
		{
			title: "Product Name",
			field: "PRODUCT_NAME",
			hozAlign: "left"
		},
		{
			title: "Product Description",
			field: "PRODUCT_DESCRPTION",
			hozAlign: "left"
		},
		{
			title: "Device Count",
			field: "OWNED_DEVICES_QY",
			hozAlign: "left",
			width: 150
		},
		{
			title: "SKU Family",
			field: "SKU_FAMILY",
			hozAlign: "left",
			width: 130
		}
		]
	}
},
{
	section_id: "table_devices_os_version", //It is use to the section_i and CSV download_id 
	subtitle: "Device OS Version by SKU Family", //Section subtitle
	tooltip_content: "Details about all product Ids owned by a customer",
	dowload_boolean: true, //true,false
	url_docs: "", //notion url
	content_type: "simple-table", //simple-table,simple-chart,
	table_settings: {
		//"DEVICES_QY", "DEVICE_OS_VERSION", "SKU_FAMILY_"	  
	  	table_data: deviceos_details_ar,
		order_by: [{
			column: "SKU_FAMILY_",
			dir: "desc"
		}], //it could be more that one column
		columns: [ //define the table columns
		{
			title: "SKU Family",
			field: "SKU_FAMILY_",
			hozAlign: "left",
			width: 150
		},
		{
			title: "Device OS Version",
			field: "DEVICE_OS_VERSION",
			hozAlign: "left"
		},
		{
			title: "# Devices",
			field: "DEVICES_QY",
			hozAlign: "left"
		}
		]
	}
},
{
	section_id: "table_webhooks", //It is use to the section_i and CSV download_id 
	subtitle: "Webhook Details", //Section subtitle
	tooltip_content: "Details about all webhook on each organization",
	dowload_boolean: true, //true,false
	url_docs: "", //notion url
	content_type: "simple-table", //simple-table,simple-chart,
	table_settings: {
		//"DEVICES_QY", "DEVICE_OS_VERSION", "SKU_FAMILY_"	  
	  	table_data: webhook_ar,
		order_by: [{
			column: "ID_PRODUCT",
			dir: "desc"
		}], //it could be more that one column
		columns: [ //define the table columns
		{
			title: "Product ID",
			field: "ID_PRODUCT",
			hozAlign: "left",
			width: 120
		},
		{
			title: "Integration name",
			field: "HOOK_NAME",
			hozAlign: "left",
			width: 300
		},
		{
			title: "Type of integration",
			field: "DIM_INTEGRATION_TYPE",
			hozAlign: "left",
			width: 150
		},
		{
			title: "Request type",
			field: "DIM_REQUEST_TYPE",
			hozAlign: "left",
			width: 120
		},
		{
			title: "URL",
			field: "URL",
			hozAlign: "left",
			width: 450
		},
		{
			title: "Status",
			field: "STATUS",
			hozAlign: "left",
			width: 120
		},
		{
			title: "Creation date",
			field: "TS_CREATED_AT",
			hozAlign: "left"
		}
		]
	}
},
{
	section_id: "table_unique_online_devices", //It is use to the section_i and CSV download_id 
	subtitle: "Unique Online Devices", //Section subtitle
	tooltip_content: "Unique online devices online in different time periods",
	dowload_boolean: true, //true,false
	url_docs: "", //notion url
	content_type: "simple-table", //simple-table,simple-chart,
	table_settings: {
		//"DEVICES_QY", "DEVICE_OS_VERSION", "SKU_FAMILY_"	  
	  	table_data: unique_online_devices_ar,
		order_by: [{
			column: "CONNECTIVITY_TYPE",
			dir: "desc"
		}], //it could be more that one column
		columns: [ //define the table columns
		{
			title: "Connectivity type",
			field: "CONNECTIVITY_TYPE",
			hozAlign: "left",
			width: 300
		},
		{
			title: "Qyt of unique devices last year",
			field: "QYT_UNIQUE_ONLINE_DEVICES_LAST_YEAR",
			hozAlign: "left",
			width: 300
		},
		{
			title: "Qyt of unique devices last 6 months",
			field: "QYT_UNIQUE_ONLINE_DEVICES_LAST_6MONTHS",
			hozAlign: "left",
			width: 300
		},
		{
			title: "Qyt of unique devices last 3 months",
			field: "QYT_UNIQUE_ONLINE_DEVICES_LAST_3MONTHS",
			hozAlign: "left",
		}
		]
	}
},
{
	section_id: "table_owned_devices", //It is use to the section_i and CSV download_id 
	subtitle: "Devices Owned per Connectivity Type", //Section subtitle
	tooltip_content: "Quantity of claimed devices per connectivity type",
	dowload_boolean: true, //true,false
	url_docs: "", //notion url
	content_type: "simple-table", //simple-table,simple-chart,
	table_settings: {
		//"DEVICES_QY", "DEVICE_OS_VERSION", "SKU_FAMILY_"	  
	  	table_data: owned_devices_obj,
		order_by: [{
			column: "CONNECTIVITY_TYPE_NAME",
			dir: "desc"
		}], //it could be more that one column
		columns: [ //define the table columns
		{
			title: "Connectivity type",
			field: "CONNECTIVITY_TYPE_NAME",
			hozAlign: "left",
			width: 300
		},
		{
			title: "Qyt of devices ",
			field: "OWNED_DEVICES_QY",
			hozAlign: "left"
		}
		]
	}
},
{
	section_id: "chart_stripe_payment", //It is use to the section_i and CSV download_id 
	subtitle: "Stripe payments", //Section subtitle
	tooltip_content: "Historical payments by stripe",
	dowload_boolean: false, //true,false
	url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
	content_type: "simple-chart-bar", //simple-table,simple-chart,
	table_settings: {},
	chart_settings: {
		//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
		chart_data: stripe_payments_ar,
		x_column: 'PAYMENT_MONTH',
		y_column: 'MONTHLY_AMOUNT',
		colors: '', //If NULL this display blue
		x_label: 'Month',
		y_label: 'amount pay by month',
		orientation: 'v'
	}
}
]

template_general_information_array.forEach(print_sections);
/* ------------------------> Devices status notes  <------------------------ */
let note_content = "<div class='list'><p>Notes: </br> </p><div class='row'> <div class='little_box_neutral'></div>\
	<p> OFFLINE_PRE-FACTORY: devices have never connected, it was only added to the account</p></div><div class='row'> \
	<div class='little_box_neutral'></div> <p>   OFFLINE_INVENTORY: devices have ever online in less than one day and \
	less than 3, and the difference between the first connection and the last connection is less than 7 days</p> \
	</div><div class='row'><div class='little_box_green'></div> <p>ONLINE_LAST_MONTH: devices have been online in \
	the last 30 days</br> </p></div><div class='row'><div class='little_box_green'></div> <p>OFFLINE_DEPLOYED_1-6_MONTHS: \
	 devices have been online in the last 6 months, but have more than 30 days offline</br> </p></div><div class='row'> \
	<div class='little_box_yellow'></div> <p>OFFLINE_DEPLOYED_7-12_MONTHS:  devices have been online in the last 12 months,\
	 but have been offline more than 6 months</br></p></div><div class='row'><div class='little_box_orange'></div>\
	 <p>OFFLINE_DEPLOYED_13-24_MONTHS:  devices have been online in the last 24 months, but have been offline more \
	 than 13 months</br></p></div><div class='row'><div class='little_box_red'></div> <p>OFFLINE_DEPLOYED_MORE_24_MONTHS:\
	devices have been more than 2 years offline</br></p></div></div>";

document.querySelector('#cellular_devices_status_notes').insertAdjacentHTML('beforebegin',note_content);
document.querySelector('#wifi_devices_status_notes').insertAdjacentHTML('beforebegin',note_content);