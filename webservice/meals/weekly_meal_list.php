<?php
$userData = array("username" => "freshbox", "password" => "abc@123");
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/integration/admin/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));
 
$token = curl_exec($ch);

$searchCriteria = '{
    "criteria": {
        "filter_groups": [
            {
                "filters": [
                    {
                        "field": "week_no",
                        "value": "6",
                        "condition_type": "eq"
                    }
                ]
            }
        ],
        "current_page": 1,
        "page_size": 10,
        "sort_orders": []
    }
}';

$searchCriteriaString = http_build_query(json_decode($searchCriteria));

						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/weekly/orders?".$searchCriteriaString);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
