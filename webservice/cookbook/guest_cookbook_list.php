<?php

$searchCriteria = '{
    "criteria": {
        "filter_groups": [
            {
                "filters": [
                    {
                        "field": "title",
                        "value": "%",
                        "condition_type": "like"
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

//echo "http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/cookbook/search?".$searchCriteriaString;
//exit;
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/cookbook/guestsearch?".$searchCriteriaString);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
//var_dump($result);
