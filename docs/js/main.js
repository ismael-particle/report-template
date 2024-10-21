/* --------------> Load data from production environment <--------------- */
if (environment == 'prod') {
	var parameter_selected_obj = datasets.filter(function(d) {
		return d.queryName == "2_PARAMETER_SELECTED";
	})[0].content;
	
	var metered_devices_obj = datasets.filter(function(d) {
		return d.queryName == "3_METERED_DEVICES";
	})[0].content;
	
	var online_devices_obj = datasets.filter(function(d) {
		return d.queryName == "4_ONLINE_DEVICES";
	})[0].content;
	
	var data_ops_obj = datasets.filter(function(d) {
		return d.queryName == "5_DATA_OPS";
	})[0].content;
	
	var cellular_data_obj = datasets.filter(function(d) {
		return d.queryName == "6_CELLULAR_DATA";
	})[0].content;
	
	var data_ops_current_billing_period_obj = datasets.filter(function(d) {
		return d.queryName == "7_DATA_OPS_CURRENT_BILLING_PERIOD";
	})[0].content;
	
	var cellular_data_current_billing_period_obj = datasets.filter(function(d) {
		return d.queryName == "8_CELLULAR_DATA_CURRENT_BILLING_PERIOD";
	})[0].content;
	
	var data_ops_anual_average_obj = datasets.filter(function(d) {
		return d.queryName == "9_DATA_OPS_MONTHLY_AVERAGE";
	})[0].content;
	
	var cellular_data_monthly_averga_obj = datasets.filter(function(d) {
		return d.queryName == "10_CELLULAR_DATA_MONTHLY_AVERAGE";
	})[0].content;
	
	var devices_status_obj = datasets.filter(function(d) {
		return d.queryName == "11_DEVICES_STATUS";
	})[0].content;
	
	var product_details_obj = datasets.filter(function(d) {
		return d.queryName == "12_PRODUCTS_DETAILS";
	})[0].content;
	
	var owned_devices_obj = datasets.filter(function(d) {
		return d.queryName == "13_OWNED_DEVICES";
	})[0].content;
	
	var device_os_version_obj = datasets.filter(function(d) {
		return d.queryName == "14_DEVICE_OS_VERSION";
	})[0].content;
	
	var service_agreement_obj = datasets.filter(function(d) {
		return d.queryName == "15_SERVICE_AGREEMENT";
	})[0].content;
	
	var webhook_obj = datasets.filter(function(d) {
		return d.queryName == "16_WEBHOOK";
	})[0].content;
	
	var unique_online_devices_obj = datasets.filter(function(d) {
		return d.queryName == "17_UNIQUE_ONLINE_DEVICES";
	})[0].content;
	
	var localization_devices_obj = datasets.filter(function(d) {
		return d.queryName == "18_ACTIVE_DEVICES_LOCATION";
	})[0].content;		

	var ota_monthly_obj = datasets.filter(function(d) {
		return d.queryName == "19_OTA_PER_MONTH";
	})[0].content;		

	var stripe_payments_obj = datasets.filter(function(d) {
		return d.queryName == "21_STRIPE";
	})[0].content;		

}

/* --------------> Divide array information per WiFi and Cellular sections <--------------- */  
let metered_cellular_devices_ar = metered_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'cellular';
});

let metered_wifi_devices_ar = metered_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'wifi';
});

let online_wifi_devices_ar = online_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'wifi';
});

let online_cellular_devices_ar = online_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'cellular';
});

let dataops_cellular_ar = data_ops_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'cellular';
});

let dataops_wifi_ar = data_ops_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'wifi';
});

let owned_cellular_devices_ar = owned_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'cellular';
});

let owned_wifi_devices_ar = owned_devices_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'wifi';
});

let product_details_ar = product_details_obj;

let deviceos_details_ar = device_os_version_obj

let cellular_data_ar = cellular_data_obj;

let cellular_data_monthly_average_ar = cellular_data_monthly_averga_obj;

let webhook_ar = webhook_obj;

let unique_online_devices_ar = unique_online_devices_obj;

let wifi_devices_status_ar = devices_status_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'Wi-Fi';
});

let cellular_devices_status_ar = devices_status_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'Cellular';
});

let average_dataops_cellular_ar = data_ops_anual_average_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'cellular';
});

let average_dataops_wifi_ar = data_ops_anual_average_obj.filter( obj => {
	return obj.CONNECTIVITY_TYPE_NAME === 'wifi';
});

let localization_cellular_devices_ar = localization_devices_obj.filter( obj => {
	return obj.BILLING_CONNECTIVITY === 'cellular';
});

let localization_wifi_devices_ar = localization_devices_obj.filter( obj => {
	return obj.BILLING_CONNECTIVITY === 'wifi';
});

let ota_monthly_cellular_ar = ota_monthly_obj.filter( obj => {
	return obj.CONNECTIVITY === 'Cellular';
});

let ota_monthly_wifi_ar = ota_monthly_obj.filter( obj => {
	return obj.CONNECTIVITY === 'Wi-Fi';
});

let stripe_payments_ar = stripe_payments_obj;

/* --------------> General values about commercial segment and mode view <--------------- */
let iswifi_customer = false;
let iscellular_customer = false;

let commercial_model_customer = '';
let display_dasboard = parameter_selected_obj[0]["MODE_VIEW"];

if (owned_cellular_devices_ar?.[0]?.['OWNED_DEVICES_QY'] > 1) { iscellular_customer = true; }    
if (owned_wifi_devices_ar?.[0]?.['OWNED_DEVICES_QY']  > 1) { iswifi_customer = true; }

//Generating commercial model flag
switch(parameter_selected_obj[0]["COMMERCIAL_MODEL_PARAMETER"]) {
	case 'ORGANIZATION':
		if (service_agreement_obj[0]["COMMERCIAL_MODEL_"] == 'GROWTH' ) { 
			commercial_model_customer = 'growth';
		}
        else{
			commercial_model_customer = 'enterprise';
		}   
		break;
	case 'SANDBOX': commercial_model_customer = 'sandbox';  break;
	case 'DOMAIN':  commercial_model_customer = 'domain';   break;
	default: break;
}

//Display tabs according with available metered information (cellular and wifi)
iswifi_customer ? document.getElementById("wifi_tab").style.display = "inline": '';
iscellular_customer ? document.getElementById("cellular_tab").style.display = "inline":'';

//if (datasets[12].state == 'succeeded') {
if (true) {
	document.getElementById("head_section").style.display = "inherit";
	document.getElementById("main_section").style.display = "inherit";
	document.getElementById("loading_section").style.display = "none";
}

//Load JS file according to commercial model and kind of display
switch (environment + '-' + commercial_model_customer + '-' + display_dasboard) {
	case 'dev-enterprise-Basic':
		loadScript("/js/process/enterprise-basic.js", MiArchivoCargado);
		break;
	case 'dev-growth-Basic':
		loadScript("/js/process/growth-basic.js", MiArchivoCargado);
		break;
	case 'dev-domain-Basic':
		loadScript("/js/process/domain-basic.js", MiArchivoCargado);
		break;
	case 'dev-sandbox-Basic':
		loadScript("/js/process/sandbox-basic.js", MiArchivoCargado);
		break;
	case 'prod-enterprise-Basic':
		loadScript("https://ismaelsb.dev/CAD_v2/js/process/enterprise-basic.js", MiArchivoCargado);
		break;
	case 'prod-growth-Basic':
		loadScript("https://ismaelsb.dev/CAD_v2/js/process/growth-basic.js", MiArchivoCargado);
		break;
	case 'prod-domain-Basic':
		loadScript("https://ismaelsb.dev/CAD_v2/js/process/domain-basic.js", MiArchivoCargado);
		break;
	case 'prod-sandbox-Basic':
		loadScript("https://ismaelsb.dev/CAD_v2/js/process/sandbox-basic.js", MiArchivoCargado);
		break;
	default:
		break;
}
