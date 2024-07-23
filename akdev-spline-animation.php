<?php

/**
 * Plugin Name:       AKDev Spline animation 
 * Description:       With this block plugin you can add spline 3d animation to your wordpress website, create experiences which will wow your users.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Anas niazi
 * Author URI:        https://anasniazi.com
 * Donate: Donate
 * Donate URI: https://google.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       akdev-spline-animation
 *
 * @package           create-block
 */


if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class AKDevSplineAnimation {
  function __construct() {
    add_action('init', array($this, 'onInit'));
  }

  function onInit() {
    if(is_admin()){
      // enqueueing script in head via cdn due to copyright
      wp_enqueue_script('Gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      wp_enqueue_script('Gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
    wp_register_script('akdev-spline-animation-script', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
    wp_register_style('akdev-spline-animation-style', plugin_dir_url(__FILE__) . 'build/style-index.css');
  }
    $block = file_get_contents( plugin_dir_path(__FILE__) .'build/block.json');
    $blockDecode = json_decode($block, true);
    register_block_type('create-block/akdev-spline-animation', array(
      'render_callback' => array($this, 'renderCallback'),
      'editor_script' => 'akdev-spline-animation-script',
	  'title'=> ('Spline Animation'),
    'icon'=> ('art'),
    'category'=> ('animations'),
    'description'=> ('Small block editor plugin to add spline animations to delight your user experience'),
      'editor_style' => 'akdev-spline-animation-style' , 
      'attributes'=>$blockDecode['attributes'],
    ));

// options page
function akdev_options_assets() {
  wp_enqueue_style('akdev-spline-animation-style', plugin_dir_url(__FILE__) . 'build/style-index.css');
}
?>


<?php function akdev_menu_callback() {
?>
    <div>
    <h2>AKDev Spline animation | Options</h2>
    <div class="akdev_options_wrapper">
    <p>Check this box if you like to enable smooth scrolling for your animation pages.</p>

    <form method="post" action="options.php" style="display: flex;
    gap: 15px;
    align-items: center;
}">
    <?php settings_fields( 'akdev_options_group' ); ?>
    <table>
    <tr valign="top">
    <th scope="row"><label for="akdev_option_lenis">Lenis Scroll</label></th>
    <td><input type="checkbox" id="akdev_option_lenis" name="akdev_option_lenis" <?php checked(1, get_option('akdev_option_lenis'), true) ?>value="1" /></td>
    </tr>
    </table>
    <?php  submit_button(); ?>
    </form>

</div>
<div style="margin-top:15px; margin-bottom:10px !important;">
      <a href="#" target="_blank" class="button button-primary">Give this plugin a review</a>
      <a href="https://www.patreon.com/anasakdev/shop/support-156932?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=productshare_creator&utm_content=join_link" class="button button-secondary" target="_blank">Donate to this plugin</a>

    </div>
    <a target="_blank" style="display:block;" href="https://www.youtube.com/watch?v=oUHLYpTjJH8&t=2s" >How to use this plugin</a>

    </div>
  <?php
  } ?>
<?php
    function akdev_add_option_menu() {
      $page_hook_suffix=  add_options_page(
        __( 'AKDev Spline animation', 'akdev-spline-animation' ),
        __( 'AKDev Spline animation', 'akdev-spline-animation' ),
        'manage_options',
        'akdev-spline-animation',
        'akdev_menu_callback'
      );
    
      add_action( "admin_print_styles-{$page_hook_suffix}", 'akdev_options_assets' );
    }
    
    add_action( 'admin_menu', 'akdev_add_option_menu' );

    function akdev_register_settings() {
      add_option( 'akdev_option_lenis', 
    );
      register_setting( 'akdev_options_group', 'akdev_option_lenis' );
   }
   add_action( 'admin_init', 'akdev_register_settings' );
   
    
    // options page
    
    function filter_block_categories_when_post_provided( $block_categories, $editor_context ) {
        if ( ! empty( $editor_context->post ) ) {
            array_push(
                $block_categories,
                array(
                    'slug'  => 'animations',  
                    'title' => __( 'Animations', 'create-block' ),
                    'icon'  => null,
                )
            );
        }
        return $block_categories;
    }
    
    add_filter( 'block_categories_all', 'filter_block_categories_when_post_provided', 10, 2 );
  
  }
  


  function renderCallback($attributes) {
    if (!is_admin()) {
      wp_enqueue_script('Gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
      wp_enqueue_script('Gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
      wp_enqueue_script('spline-akdev/frontend-script', plugin_dir_url(__FILE__) . 'build/client.js', array('wp-element'));
      wp_enqueue_style('spline-akdev/frontend-styles', plugin_dir_url(__FILE__) . 'build/index.css');
    }
    $json = wp_json_encode($attributes);
    $json = wp_json_encode($attributes);
$result = json_decode($json,true);
$customStyles = wp_json_encode($result['customStyles'],true);
$classNames = wp_json_encode($result['className'],true);
$customStyles = wp_json_encode($result['customStyles'],true);
$classNames = wp_json_encode($result['className'],true);
$classNamesData = json_decode($classNames, true);
$data = json_decode($customStyles, true);
$cssString = '';



if ($data) {
  // Convert associative array to CSS style string
  foreach ($data as $property => $value) {
      $cssString .= $property . ':' . $value . ';';
  }
} 

    ob_start(); 
    ?>


    <div class="akdev-spline-animation-block-wrapper <?php echo esc_html($classNamesData);?>" style="<?php echo esc_html($cssString)?>" smooth-scroll='<?php echo esc_html(htmlspecialchars(wp_json_encode(get_option(('akdev_option_lenis'))), ENT_QUOTES, 'UTF-8'));?>' data-attributes='<?php echo esc_html(htmlspecialchars(wp_json_encode($attributes), ENT_QUOTES, 'UTF-8'))?>' > </div>
    <?php return ob_get_clean();
    
  }




}



$akdevsplineanimation = new AKDevSplineAnimation();
