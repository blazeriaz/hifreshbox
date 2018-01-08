<?php
namespace Freshbox\Meals\Api;


use Magento\Framework\Api\SearchCriteriaInterface;

/**
 * @api
 */
interface PreferenceoptionRepositoryInterface
{
    /**
     * Save preference option.
     * @param \Freshbox\Meals\Api\Data\PreferenceoptionInterface $preference_options
     * @return \Freshbox\Meals\Api\Data\PreferenceoptionInterface
     *
     */
    public function save(\Freshbox\Meals\Api\Data\PreferenceoptionInterface  $preference_options);

    /**
     *  Slide.
     * @param int $id
     * @return \Freshbox\Meals\Api\Data\PreferenceoptionInterface
     *
     */
    public function getById($id);

  
	
    /**
     * @param Freshbox\Meals\Api\Data\PreferenceoptionInterface $page
     * @return bool true on success
     */
    public function delete(\Freshbox\Meals\Api\Data\PreferenceoptionInterface $page);

    /**
     * @param int $id
     * @return bool true on success
     */
    public function deleteById($id);
	
	
}
