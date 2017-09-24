<?php
try{
	$target_url = 'http://freshbox.white-space-studio-dev.com/webservices/fileupload/accept.php';
	
        //This needs to be the full path to the file you want to send.
	$file_name_with_full_path = realpath('pdf-sample.pdf');
	
        /* curl will accept an array here too.
         * Many examples I found showed a url-encoded string instead.
         * Take note that the 'key' in the array will be the key that shows up in the
         * $_FILES array of the accept script. and the at sign '@' is required before the
         * file name.
         */
		$post['file'] = new CurlFile($file_name_with_full_path, 'image/jpg'); 
	//$post = array('extra_info' => '123456','file_contents'=>'@'.$file_name_with_full_path);
 
       $ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$target_url);
	curl_setopt($ch, CURLOPT_POST,1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	$result=curl_exec ($ch);
	curl_close ($ch);
	echo $result;
	}catch(Exception $e){
		echo $e->getMessage();
	}						
						
/*$ch = curl_init("http://freshbox.white-space-studio-dev.com/webservices/fileupload/accept.php");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $slide);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . json_decode($token)));
 
$result = curl_exec($ch);
echo '<pre>';
print_r(json_decode($result)); 
echo '</pre>';

//var_dump($result);
*/