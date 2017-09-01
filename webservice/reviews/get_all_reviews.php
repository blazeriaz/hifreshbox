<?php
$userData = array("username" => "admin", "password" => "admin@123");
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
                        "field": "title",
                        "value": "%",
                        "condition_type": "like"
                    }
                ]
            }
        ],
        "current_page": 1,
        "page_size": 10,
        "sort_orders": [
				{
					"field":"review_id",
					"direction":"DESC"
					
				}]
    }
}';

$searchCriteriaString = http_build_query(json_decode($searchCriteria));
 
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/review/search?".$searchCriteriaString );
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);

echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';
 /*
 [items] => Array
        (
            [0] => stdClass Object
                (
                    [review_id] => 9 					 //  review id
                    [created_at] => 2017-08-26 10:33:17  //   created  date
                    [entity_id] => 1
                    [entity_pk_value] => 2081             // product id
                    [status_id] => 1                       // review Status
                    [detail_id] => 9                       // relation id for detail table you dont need this because i have the detail value
                    [title] => test title                  // title
                    [week_no] => 23                         // week no
                    [detail] => test detail                 // review description 
                    [nickname] => nickname                 // review description
                    [customer_id] =>                       // Empty Means Guest, Id present then Customer
                    [entity_code] =>                  
                    [ravitng_votes] => Array
                        (
                            [0] => stdClass Object
                                (
                                    [vote_id] => 7
                                    [option_id] => 4
                                    [remote_ip] => 160.153.91.70
                                    [remote_ip_long] => 2694404934
                                    [customer_id] => 
                                    [entity_pk_value] => 2081
                                    [rating_id] => 1
                                    [review_id] => 9
                                    [percent] => 80                  // rating value in percentage
                                    [value] => 4                    // rating value in number
                                )

                        )

                )
*/

//var_dump($result);