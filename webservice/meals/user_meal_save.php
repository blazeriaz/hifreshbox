<?php
$userData = ["username" => "riaintouc008@gmail.com", "password" => "Admin@123"];
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/rest/V1/integration/customer/token");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Content-Lenght: " . strlen(json_encode($userData))));

$token = curl_exec($ch);



$meal_preference_setting = json_encode(array(
							array('question_id' => 1,'option_id'=>1,'qty'=>2), // Meal Option Id  and quantity
							array('question_id' => 1,'option_id'=>2,'qty'=>1),
							array('question_id' => 2,'option_id'=>5,'qty'=>2),
							array('question_id' => 2,'option_id'=>6,'qty'=>1)
							));

$n_slide = json_encode(['subscribepreference' => [
						'meal_preference_setting' => $meal_preference_setting,
						'howmuch_meals_week'=> 2,
						'howmany_people'=>4,
						'meal_extra_notes'=>'extra notes 444444'												
						]]);
						
						
$ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/meal-settings");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $n_slide); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
 $result = curl_exec($ch);
 


echo '<pre>';
print_r($result);
print_r(json_decode($result)); 
echo '</pre>'; 
//var_dump($result);
