<?php

// ==============================================

//        GUTENBERG EDITOR

// ==============================================



//  Custom editor
// -----------------------------------------------

// Add embeded custom stylesheet inline for blocks editor
add_action( 'after_setup_theme', 'pga_setup_editor_styles' );
function pga_setup_editor_styles() {
  add_theme_support( 'editor-styles' );
  add_editor_style( 'assets/css/custom-editor-inline.min.css' );
}


// Add external custom stylesheet in blocks editor only
add_action( 'enqueue_block_editor_assets', 'pga_block_editor_styles' );
function pga_block_editor_styles() {
  wp_enqueue_style( 'site-block-editor-styles', CSS_URL.'custom-editor.min.css', '', filemtime( CSS_PATH.'custom-editor.min.css' ));
  // deny list for embed core blocks
  wp_enqueue_script( 'deny-list-blocks', JS_URL . '/deny-list-blocks.min.js', array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ));
}


// Embed svg icons in admin
add_action( 'in_admin_header', 'pga_embed_sprites_icon' );
function pga_embed_sprites_icon() {
  // add hidden styles in admin when svg sprite contains svgs with mask
  // echo '<style type="text/css">
  // .visually-hidden {
  //   clip: rect(0 0 0 0);
  //   clip-path: inset(50%);
  //   height: 1px;
  //   overflow: hidden;
  //   position: absolute;
  //   white-space: nowrap;
  //   width: 1px;
  // }
  // </style>';
  // if( get_page_template_slug( $post ) == 'templates/template-home.php' ) {
  echo file_get_contents( SVG_PATH.'sprite.svg' );
}



//  Blocks
// -----------------------------------------------

// Restrict default blocks
add_filter( 'allowed_block_types_all', 'pga_allow_block_types', 10, 2 );
function pga_allow_block_types( $allowed_blocks, $editor_context ) {
  
  if ( !empty( $editor_context->post ) ) {
    $post = $editor_context->post;

    // Default ACF blocks
    $custom_blocks = array(
      'acf/side-image',
      'acf/values',
      'acf/gallery',
      'acf/cta',
      'acf/truc',
      'acf/team',
      'acf/accordion',
      'acf/brands',
      'acf/push-news',
      'acf/push-projects',
    );

     // No blocks for page contact and page actualit??s (blog page)
     if( get_page_template_slug( $post ) == 'template-contact.php' || $post->ID == get_option( 'page_for_posts' )) {
      $custom_blocks = array();
    }

     // Only some WP blocks for page legal
     if( get_page_template_slug( $post ) == 'template-legal.php') {
      $custom_blocks = array(
        'core/heading',
        'core/paragraph',
        'core/list',
      );
    }

    // Only some WP blocks for single post and single project
    if( $post->post_type == 'post' || $post->post_type == 'project' ) {
      $custom_blocks = array(
        'core/heading',
        'core/paragraph',
        'core/list',
        'core/image',
        'core/embed'
      );
    }
    
    $allowed_blocks = $custom_blocks;
  }
  return $allowed_blocks;
}


// Set template with predefined blocks in job posts
// add_action( 'init', 'pga_job_post_block_template' );
function pga_job_post_block_template() {

  $post_type_object = get_post_type_object( 'job' );
  $post_type_object->template = array(
    array( 'acf/hero-text' ),
    array( 'acf/intro', array( 'data' => array( 'text' => 'Texte d\'introduction de l\'offre...' ) ) ),
    array( 'acf/text', array( 'data' => array( 'text' => 'Texte de contenu de l\'offre...' ) ) ),
    array( 'acf/card-job' ),
  );
}


// Start post creation with predefined blocks
// add_filter( 'register_post_type_args', 'pga_custom_block_templates', 20, 2 );
function pga_custom_block_templates( $args, $post_type ) {

  if ( 'post' == $post_type || 'page' == $post_type ) {

    // Set the template
    $args['template'] = [
      [
        'acf/hero',
      ],
    ];
  }

  // if ( 'job' == $post_type ) {

  //   // Set the template
  //   $args['template'] = [
  //     [
  //       'acf/hero-text ',
  //     ],
  //   ];
  // }

  return $args;
}


// Add custom block category
add_filter( 'block_categories_all', 'pga_add_block_categories', 10, 2 );
function pga_add_block_categories( $categories, $post ) {
  // if ( $post->post_type !== 'post' ) {
  //     return $categories;
  // }
  return array_merge(
      $categories,
      array(
          array(
              'slug' => 'custom-cat',
              'title' => __( 'Blocs du th??me', 'my-plugin' ),
              'icon'  => 'star-empty',
          ),
      )
  );
}


// Disable fullscren mode editor mode
add_action( 'enqueue_block_editor_assets', 'pga_disable_editor_fullscreen_by_default' );
function pga_disable_editor_fullscreen_by_default() {
	$script = "window.onload = function() { const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' ); if ( isFullscreenMode ) { wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' ); } }";
	wp_add_inline_script( 'wp-blocks', $script );
}


// Remove default Gutenberg block styles
function pga_remove_wp_block_library_css(){
  wp_dequeue_style( 'wp-block-library' );
}
add_action( 'wp_enqueue_scripts', 'pga_remove_wp_block_library_css', 100 );