<?php
namespace Freshbox\Configurations\Api;


/**
 * Interface ConfigRepositoryInterface
 * @package Freshbox\Configurations\Api
 */
interface ConfigRepositoryInterface
{
	/**
     * Save data.
     * @param mixed $adminsettings
     * @return array
     *
     */
	public function getadminsettings($adminsettings);
	
	/**
     * get config data.
     * @return array
     *
     */
	public function getsiteinformation();
	
	/**
     * Save data.
     * @param mixed $siteinfo
     * @return array
     *
     */
	public function updatesiteinformation($siteinfo);
	
	/**
     * get config data.
     * @return array
     *
     */
	public function getemailinformation();
	
	/**
     * Save data.
     * @param mixed $email_address
     * @return array
     *
     */
	public function emailupdate($email_address);
	
	/**
     * get forgot email
	 * @param string $email
     * @return array
     *
     */
	public function forgotemail($email);
	
	/**
     * validate email link.
     * @param mixed $email_validation 
     * @return array
     *
     */
	public function forgotemailvalidate($email_validation);
	
	/**
     * Save data.
     * @param mixed $email_change_data
     * @return array
     *
     */
	public function forgotemailchange($email_change_data);
	
	/**
     * 
	 * @param mixed $node
     * @return array
     *
     */
	public function treestorage($node);
	
	/**
     * 
	 * @param mixed $node
     * @return array
     *
     */
	public function imagecontents($node);
	
	/**
     * 
	 * @param mixed $image_data
     * @return string
     *
     */
	public function imageinsert($image_data);
	
}
