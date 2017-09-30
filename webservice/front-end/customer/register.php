 <?php
 $customerData = [
        'customer' => [
            "email" => "johnwilliamsethan+1@gmail.com",
            "firstname" => "John",
            "lastname" => "Doe",
            "storeId" => 1,
            "websiteId" => 1
        ],
        "password" => "Riaz@123"
    ];

    $ch = curl_init("http://freshbox.white-space-studio-dev.com/api/index.php/rest/V1/customers");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($customerData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));

    $result = curl_exec($ch);

    $result = json_decode($result, 1);
    echo '<pre>';print_r($result);