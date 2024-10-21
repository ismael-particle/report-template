/* --------------------> Print Title and subtitule <------------------------ */
document.getElementById('organization_name').innerHTML = service_agreement_obj[0]["ORG_NAME"]
document.getElementById('organization_service').innerHTML = service_agreement_obj[0]["COMMERCIAL_MODEL_"]

/* --------------> Printing Service agreement details table <--------------- */
let block_model = ( service_agreement_obj[0]["COMMERCIAL_MODEL_"] == 'EP2021') ? 'tier': 'package';
let wifi_block_label = 'WiFi ' + block_model;
let cellular_block_label = 'Cellular ' + block_model;

let wifi_block_value =
    (service_agreement_obj[0]["COMMERCIAL_MODEL_"]=='EP2021') ? 
    service_agreement_obj[0]["WIFI_SERVICE_PLAN_CATEGORY"]: 
    service_agreement_obj[0]["WIFI_BLOCKS"];

let cellular_block_value =
    (service_agreement_obj[0]["COMMERCIAL_MODEL_"]=='EP2021') ? 
    service_agreement_obj[0]["CELLULAR_SERVICE_PLAN_CATEGORY"]: 
    service_agreement_obj[0]["CELLULAR_BLOCKS"];

data_service_details_arr = [
    ['Organization name:', service_agreement_obj[0]["ORG_NAME"]],    
    ['Organization ID', service_agreement_obj[0]["ORG_ID"]],
    ['Commercial model:',service_agreement_obj[0]["COMMERCIAL_MODEL_"]],
    [wifi_block_label, wifi_block_value ],
    ['Service agreement ID:',service_agreement_obj[0]["SERVICE_AGREEMENT_ID"]],
    ['WiFi max devices (per month):', (service_agreement_obj[0]["WIFI_METERED_DEVICES_LIMIT"]).toLocaleString("en-US")],
    ['Org owner email:', service_agreement_obj[0]["EMAIL_ORG_OWNER"]],
    ['WiFi data operations limit in billing period', (service_agreement_obj[0]["WIFI_DATAOPS_LIMIT"]).toLocaleString("en-US")],
    ['Billing period start:',service_agreement_obj[0]["BILLING_PERIOD_START_DATE"].trim().substring(0, 10)],
    [cellular_block_label,  cellular_block_value],
    ['Billing period end:',service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)],
    ['Cellular max devices (per month):', (service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"]).toLocaleString("en-US") ],
    ['Agreement date start:', service_agreement_obj[0]["SERVICE_AGREEMENT_START_DATE"].trim().substring(0, 10)],
    ['Celular data operations limit in billing period', (service_agreement_obj[0]["CELLULAR_DATAOPS_LIMIT"]).toLocaleString("en-US") ],
    ['Agreement date end:',service_agreement_obj[0]["SERVICE_AGREEMENT_END_DATE"].trim().substring(0, 10) ],
    ['Celular data limit in billing period [Gb]', ( (service_agreement_obj[0]["CELLULAR_DATA_LIMIT"])/(1000000000) ).toLocaleString("en-US")],
    ['Service paused',  service_agreement_obj[0]["DEVICES_PAUSED"]]
]

print_table_service_details( data_service_details_arr, "table_service_id");

/* --------------------------> Cellular section <--------------------------- */
if (iscellular_customer) {
	//	->	Metered devices		***		Cellular	***		enterprise-Basic	 ***
	let cellular_metered_devices_current_biling_period = filter_date( 
		metered_cellular_devices_ar, 
		'BILLING_USAGE_MONTH_START_DATE', 
		service_agreement_obj[0]["BILLING_PERIOD_START_DATE"]
		);

	cellular_metered_devices_current_biling_period = simple_clasification(
		cellular_metered_devices_current_biling_period, 
		'QTY_METERED_DEVICES', 
		service_agreement_obj[0]['CELLULAR_METERED_DEVICES_LIMIT'], 
		[0.80,0.90,1.0]
		);

	let last_month_celular = 
		new moment(metered_cellular_devices_ar[metered_cellular_devices_ar.length -1]["BILLING_USAGE_MONTH_START_DATE"]);

	let end_billing_period = new moment(service_agreement_obj[0]["BILLING_PERIOD_END_DATE"])

	//generating prediction until billing date cellular
	let metered_cellular_device_projection = 
	line_projection(
		metered_cellular_devices_ar, 
		end_billing_period.diff(last_month_celular, 'months'), 
		'QTY_METERED_DEVICES', 
		'BILLING_USAGE_MONTH_START_DATE');
	
	//Set up color per percentage of metered devices in cellular devices
	let cellular_metered_devices_current_biling_period_projection_color = projection_clasification(
		metered_cellular_device_projection,
		'value',
		service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"],
		[0.75,0.80,0.90]
		);


	//	->	Online devices		***		Cellular	***		enterprise-Basic	 ***
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

	//	-> Online vs Metered devices		***		Cellular	***		enterprise-Basic	 ***
	let online_metered_cellular_devices = combine_objects(
		metered_cellular_devices_ar,//objectA,
		online_cellular_devices_ar,//objectB,
		'BILLING_USAGE_MONTH_START_DATE', //commonA_data, 
		'BILLING_USAGE_MONTH_START_DATE', //commonB_data, 
		'QTY_METERED_DEVICES',//saveA, 
		'DEVICE_ONLINE_QY' //saveB
		);

	//	->	Data operation		***		Cellular	***		enterprise-Basic	 ***
	//dataops_cellular_current_period_ar
	let cellular_data_ops_current_biling_period = 
		filter_date( dataops_cellular_ar,'BILLING_PERIOD_START_DATE', service_agreement_obj[0]["BILLING_PERIOD_START_DATE"]);

	//	->	Data operation acumulative		***		Cellular	***		enterprise-Basic	 ***
	let dataops_acumulative_cellular = summary_object ( 
		cellular_data_ops_current_biling_period, 'BILLING_PERIOD_START_DATE', 'MONTHLY_DATA_OPS_QY');

	//Set up color per data ops acumulation
	dataops_acumulative_cellular = simple_clasification(
		dataops_acumulative_cellular, 
		'acumulative', 
		service_agreement_obj[0]["CELLULAR_DATAOPS_LIMIT"], 
		[0.6,0.85,0.95]
		);


	//	->	Cellular data		***		Cellular	***		enterprise-Basic	 ***
	let cellular_data_current_biling_period = 
		filter_date( cellular_data_ar,'BILLING_PERIOD_START_DATE', service_agreement_obj[0]["BILLING_PERIOD_START_DATE"]);

	let data_acumulative_cellular = summary_object ( 
		cellular_data_current_biling_period, 'BILLING_PERIOD_START_DATE', 'MONTHLY_CELLULAR_DATA_QY_MB');

	data_acumulative_cellular	= simple_clasification(
		data_acumulative_cellular, 
		'acumulative', 
		(service_agreement_obj[0]["CELLULAR_DATA_LIMIT"] / 1024)/1024, 
		[0.6,0.85,0.95]
		);

	//	->	Device status	*** 	Cellular	***		enterprise-Basic	 ***
	let summary_celllar_device_status = summary_device_status( cellular_devices_status_ar, 'DEVICE_OPERATIVE_STATUS');
	
	//	->	Data ops average	*** 	Cellular	***		enterprise-Basic	 ***
	let cellular_package_recomendation = calculate_package(
		monthly_data = average_dataops_cellular_ar, 
		column_average = 'AVG_DATA_OPS_QY');

	//	->	Localization	*** 	Cellular	***		enterprise-Basic	 ***

	//Table per country
	localization_cellular_devices_per_country = summary_per_country(localization_cellular_devices_ar);
    
	//convert code into country_code_alpha_3 
    convert_country_code( localization_cellular_devices_per_country, 'COUNTRY_CODE');

	//	->	Hardware projection	***		Cellular	***		enterprise-Basic	 ***
	let hardware_projection_normal_model_cellular = line_projection(
		online_cellular_devices_ar, 
		24, 
		'DEVICE_ONLINE_QY', 
		'BILLING_USAGE_MONTH_START_DATE'
		);

	hardware_projection_normal_model_cellular = hardware_projection_normal_model_cellular.filter( obj => {
		return obj.source  === 'projection';
	});
	
	hardware_projection_normal_model_cellular.unshift(
		{
			date: online_cellular_devices_ar[online_cellular_devices_ar.length - 1]['BILLING_USAGE_MONTH_START_DATE'],
			value: online_cellular_devices_ar[online_cellular_devices_ar.length - 1]['DEVICE_ONLINE_QY'],
			source: 'fact'
		}
	);

	let offline_deployed_devices_qty_cellular = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_celllar_device_status, 
		category_list = ["OFFLINE_DEPLOYED_1-6_MONTHS","OFFLINE_DEPLOYED_7-12_MONTHS","OFFLINE_DEPLOYED_13-24_MONTHS"]) 
	
	let online_deployed_devices_qty_cellular = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_celllar_device_status, 
		category_list = ["ONLINE_LAST_MONTH"]); 

	let hardware_projection_optimiztic_model_cellular = array_scaling_factor(
		factor = (offline_deployed_devices_qty_cellular + online_deployed_devices_qty_cellular) / online_deployed_devices_qty_cellular,
		column_factor = 'value', 
		column_propierty_filter = 'source',
		value_filter = 'projection',
		object_array = hardware_projection_normal_model_cellular );

	let cellular_reserve_stock_limit  = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_celllar_device_status, 
		category_list = ["ONLINE_LAST_MONTH","OFFLINE_PRE-FACTORY","OFFLINE_INVENTORY"]); 

	//	->	Hardware projection notes	***		Cellular	***		enterprise-Basic	 ***
	let normal_hw_opp_cellular =  hardware_projection_normal_model_cellular[hardware_projection_normal_model_cellular.length-1]['value'] -cellular_reserve_stock_limit;
	let optimistic_hw_opp_cellular =  hardware_projection_optimiztic_model_cellular[hardware_projection_optimiztic_model_cellular.length-1]['value'] -cellular_reserve_stock_limit;
	
	let normal_growth_slope_cellular = 
		hardware_projection_normal_model_cellular[hardware_projection_normal_model_cellular.length-1]['value']-
		hardware_projection_normal_model_cellular[hardware_projection_normal_model_cellular.length-2]['value'];

	let optimistic_growth_slope_cellular = 
		hardware_projection_optimiztic_model_cellular[hardware_projection_optimiztic_model_cellular.length-1]['value']-
		hardware_projection_optimiztic_model_cellular[hardware_projection_optimiztic_model_cellular.length-2]['value'];

	let normal_deplecation_month_cellular = found_intersection (
		column_propierty = 'value',
		value = cellular_reserve_stock_limit, 
		column_date = 'date', 
		object_array = hardware_projection_normal_model_cellular);

	let optimistic_deplecation_month_cellular = found_intersection (
		column_propierty = 'value',
		value = cellular_reserve_stock_limit, 
		column_date = 'date', 
		object_array = hardware_projection_optimiztic_model_cellular);

	let hardware_projection_note_cellular = hardware_projection_notes_test( 
		op_deplecation_month = optimistic_deplecation_month_cellular,
		op_hw_opp = optimistic_hw_opp_cellular,
		op_reserve_stock_limit = cellular_reserve_stock_limit,
		op_growth_slope = optimistic_growth_slope_cellular,
		nor_deplecation_month = normal_deplecation_month_cellular,
		nor_hw_opp = normal_hw_opp_cellular,
		nor_reserve_stock_limit = cellular_reserve_stock_limit,
		nor_growth_slope = normal_growth_slope_cellular );

	document.querySelector('#note_cellular_hardware_projection').insertAdjacentHTML('beforebegin',hardware_projection_note_cellular);

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
		subtitle: "Metered Device Count in current billing period and limit", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_metered_devices_current_biling_period,
			x_column: 'BILLING_USAGE_MONTH_START_DATE',
			y_column: 'QTY_METERED_DEVICES',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v',
			line_value: service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"],
			line_text_label: ('Device limit: ' + service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"] 
				+ ' devices, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)  )
		}
	},
	{
		section_id: "chart_metered_devices_cellular_3", //It is use to the section_i and CSV download_id 
		subtitle: "Metered Device Count in current billing period, projection and limit", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_metered_devices_current_biling_period_projection_color,
			x_column: 'date',
			y_column: 'value',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of metered devices',
			orientation: 'v',
			line_value: service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"],
			line_text_label: ('Device limit: ' + service_agreement_obj[0]["CELLULAR_METERED_DEVICES_LIMIT"] 
				+ ' devices, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10) )
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
		subtitle: "Cellular Data Operations Consumption (Current Billing Period)", //Section subtitle
		tooltip_content: "Data operatios consumed per month in the current billing period.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_data_ops_current_biling_period,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data operations',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_cellular_3", //It is use to the section_i and CSV download_id 
		subtitle: "Cumulative Cellular Data Operations Consumption (Current Billing Period Against Current Limit)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: dataops_acumulative_cellular,
			x_column: 'date',
			y_column: 'acumulative',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data operations',
			orientation: 'v',
			line_value: service_agreement_obj[0]["CELLULAR_DATAOPS_LIMIT"],
			line_text_label: ('Data operation limit: ' + (service_agreement_obj[0]["CELLULAR_DATAOPS_LIMIT"]).toLocaleString("en-US") 
				+ ' data operation, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)  )
		}
	},
	{
		section_id: "chart_general_dataops_consumption_cellular_4", //It is use to the section_i and CSV download_id 
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
		section_id: "chart_general_data_consumption_cellular_2", //It is use to the section_i and CSV download_id 
		subtitle: "Cellular Data (MB) Consumption (Current Billing Period)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of cellular data per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: cellular_data_current_biling_period,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_CELLULAR_DATA_QY_MB',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'MB Consumed',
			orientation: 'v'
	 	}
	},
	{
		section_id: "chart_general_data_consumption_cellular_3", //It is use to the section_i and CSV download_id 
		subtitle: "Cumulative Cellular Data (MB) Consumption (Current Billing Period Against Current Limit)", //Section subtitle
		tooltip_content: "Contain all the available information about quantity of metered devices per month.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: data_acumulative_cellular,
			x_column: 'date',
			y_column: 'acumulative',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'MB Consumed',
			orientation: 'v',
			line_value: (service_agreement_obj[0]["CELLULAR_DATA_LIMIT"] / 1024)/1024,
			line_text_label: ('Cellular data limit: ' + ((service_agreement_obj[0]["CELLULAR_DATA_LIMIT"] / 1024)/1024).toLocaleString("en-US") 
				+ ' data operation, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)  )
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
	},
	{
		section_id: "chart_cellular_hardware_projection_1", //It is use to the section_i and CSV download_id 
		subtitle: "Hardware projection", //Section subtitle
		tooltip_content: "Hardware projection in the next coming 24 months",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-hardware-projection", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			chart_data: hardware_projection_normal_model_cellular,
			x_column: 'date',
			y_column: 'value',
			chart_2_data: hardware_projection_optimiztic_model_cellular,
			x_2_column: 'date',
			y_2_column: 'value',
			chart_legend: 'Normal',
			chart_legend_2: 'Optimiztic',
			x_label: 'Month',
			y_label: 'Qty of devices',
			reserve_stock: cellular_reserve_stock_limit,
			colors: '',
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
		Data operation - WiFi - enterprise-Basic
	************************************************************/
	let wifi_data_ops_current_biling_period = 
		filter_date( dataops_wifi_ar,'BILLING_PERIOD_START_DATE', service_agreement_obj[0]["BILLING_PERIOD_START_DATE"]);

	/**********************************************************
		Data operation acumulative - WiFi - enterprise-Basic
	************************************************************/
	let dataops_acumulative_wifi = summary_object ( 
		wifi_data_ops_current_biling_period, 'BILLING_PERIOD_START_DATE', 'MONTHLY_DATA_OPS_QY');
	
	dataops_acumulative_wifi = simple_clasification(
		dataops_acumulative_wifi, 
		'acumulative', 
		service_agreement_obj[0]["WIFI_DATAOPS_LIMIT"], 
		[0.6,0.85,0.95])
	/**********************************************************
		Device status - WiFi - enterprise-Basic
	************************************************************/
	let summary_wifi_device_status = summary_device_status( wifi_devices_status_ar, 'DEVICE_OPERATIVE_STATUS');

	//	->	Data ops average	*** 	WiFi	***		enterprise-Basic	 ***
	let wifi_package_recomendation = calculate_package(
		monthly_data = average_dataops_wifi_ar, 
		column_average = 'AVG_DATA_OPS_QY');

	//	->	Hardware projection	***		WiFi	***		enterprise-Basic	 ***
	let hardware_projection_normal_model_wifi = line_projection(
		online_wifi_devices_ar, 
		24, 
		'DEVICE_ONLINE_QY', 
		'BILLING_USAGE_MONTH_START_DATE'
		);

		hardware_projection_normal_model_wifi = hardware_projection_normal_model_wifi.filter( obj => {
		return obj.source  === 'projection';
	});
	
	hardware_projection_normal_model_wifi.unshift(
		{
			date: online_wifi_devices_ar[online_wifi_devices_ar.length - 1]['BILLING_USAGE_MONTH_START_DATE'],
			value: online_wifi_devices_ar[online_wifi_devices_ar.length - 1]['DEVICE_ONLINE_QY'],
			source: 'fact'
		}
	);

	let offline_deployed_devices_qty_wifi = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_wifi_device_status, 
		category_list = ["OFFLINE_DEPLOYED_1-6_MONTHS","OFFLINE_DEPLOYED_7-12_MONTHS","OFFLINE_DEPLOYED_13-24_MONTHS"]) 
	
	let online_deployed_devices_qty_wifi = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_wifi_device_status, 
		category_list = ["ONLINE_LAST_MONTH"]); 

	let hardware_projection_optimiztic_model_wifi = array_scaling_factor(
		factor = (offline_deployed_devices_qty_wifi + online_deployed_devices_qty_wifi) / online_deployed_devices_qty_wifi,
		column_factor = 'value', 
		column_propierty_filter = 'source',
		value_filter = 'projection',
		object_array = hardware_projection_normal_model_wifi );

	let wifi_reserve_stock_limit  = summary_per_category(
		column_category = 'category', 
		column_summary = 'qty_devices',
		main_list = summary_wifi_device_status, 
		category_list = ["ONLINE_LAST_MONTH","OFFLINE_PRE-FACTORY","OFFLINE_INVENTORY"]); 

	//	->	Hardware projection notes	***		WiFi	***		enterprise-Basic	 ***
	let normal_hw_opp_wifi =  hardware_projection_normal_model_wifi[hardware_projection_normal_model_wifi.length-1]['value'] - wifi_reserve_stock_limit;
	let optimistic_hw_opp_wifi =  hardware_projection_optimiztic_model_wifi[hardware_projection_optimiztic_model_wifi.length-1]['value'] -wifi_reserve_stock_limit;
	
	let normal_growth_slope_wifi = 
		hardware_projection_normal_model_wifi[hardware_projection_normal_model_wifi.length-1]['value']-
		hardware_projection_normal_model_wifi[hardware_projection_normal_model_wifi.length-2]['value'];

	let optimistic_growth_slope_wifi = 
		hardware_projection_optimiztic_model_wifi[hardware_projection_optimiztic_model_wifi.length-1]['value']-
		hardware_projection_optimiztic_model_wifi[hardware_projection_optimiztic_model_wifi.length-2]['value'];

	let normal_deplecation_month_wifi = found_intersection (
		column_propierty = 'value',
		value = wifi_reserve_stock_limit, 
		column_date = 'date', 
		object_array = hardware_projection_normal_model_wifi);

	let optimistic_deplecation_month_wifi = found_intersection (
		column_propierty = 'value',
		value = wifi_reserve_stock_limit, 
		column_date = 'date', 
		object_array = hardware_projection_optimiztic_model_wifi);

	let hardware_projection_note_wifi = hardware_projection_notes_test( 
		op_deplecation_month = optimistic_deplecation_month_wifi,
		op_hw_opp = optimistic_hw_opp_wifi,
		op_reserve_stock_limit = wifi_reserve_stock_limit,
		op_growth_slope = optimistic_growth_slope_wifi,
		nor_deplecation_month = normal_deplecation_month_wifi,
		nor_hw_opp = normal_hw_opp_wifi,
		nor_reserve_stock_limit = wifi_reserve_stock_limit,
		nor_growth_slope = normal_growth_slope_wifi );

	document.querySelector('#note_wifi_hardware_projection').insertAdjacentHTML('beforebegin',hardware_projection_note_wifi);

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
				+ ' devices, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)  )
		}
	},
	{
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
	},
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
		subtitle: "Cellular Data Ops Consumption (Time Series)", //Section subtitle
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
		subtitle: "WiFi Data Operations Consumption (Current Billing Period)", //Section subtitle
		tooltip_content: "Data operatios consumed per month in the current billing period.",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-bar", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: wifi_data_ops_current_biling_period,
			x_column: 'BILLING_PERIOD_START_DATE',
			y_column: 'MONTHLY_DATA_OPS_QY',
			colors: '', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data operations',
			orientation: 'v'
		}
	},
	{
		section_id: "chart_general_dataops_consumption_wifi_3", //It is use to the section_i and CSV download_id 
	  	subtitle: "Cumulative WiFi Data Operations Consumption (Current Billing Period Against Current Limit)", //Section subtitle
	  	tooltip_content: "Contain all the available information about quantity of metered devices per month.",
	  	dowload_boolean: false, //true,false
	  	url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
	  	content_type: "simple-chart-bar-and-horizontal-line", //simple-table,simple-chart,
	  	table_settings: {},
	  	chart_settings: {
		  	//COUNT_DEVICES,TIME_OFFLINE,STAGE,COLOR_STATE
			chart_data: dataops_acumulative_wifi,
			x_column: 'date',
			y_column: 'acumulative',
			colors: 'COLOR_STATE', //If NULL this display blue
			x_label: 'Month',
			y_label: 'Qty of data operations',
			orientation: 'v',
			line_value: service_agreement_obj[0]["WIFI_DATAOPS_LIMIT"],
			line_text_label: ('Data operation limit: ' + (service_agreement_obj[0]["WIFI_DATAOPS_LIMIT"]).toLocaleString("en-US") 
				+ ' data operation, until: ' + service_agreement_obj[0]["BILLING_PERIOD_END_DATE"].trim().substring(0, 10)  )
	  }
	},
	{
		section_id: "chart_general_dataops_consumption_wifi_4", //It is use to the section_i and CSV download_id 
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
	},
	{
		section_id: "chart_wifi_hardware_projection_1", //It is use to the section_i and CSV download_id 
		subtitle: "Hardware projection", //Section subtitle
		tooltip_content: "Hardware projection in the next coming 24 months",
		dowload_boolean: false, //true,false
		url_docs: "https://www.notion.so/particle/Consumption-activity-dashboard-3897d4e7a75346568440f7dde3764240",
		content_type: "simple-chart-hardware-projection", //simple-table,simple-chart,
		table_settings: {},
		chart_settings: {
			chart_data: hardware_projection_normal_model_wifi,
			x_column: 'date',
			y_column: 'value',
			chart_2_data: hardware_projection_optimiztic_model_wifi,
			x_2_column: 'date',
			y_2_column: 'value',
			chart_legend: 'Normal',
			chart_legend_2: 'Optimiztic',
			x_label: 'Month',
			y_label: 'Qty of devices',
			reserve_stock: wifi_reserve_stock_limit,
			colors: '',
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
