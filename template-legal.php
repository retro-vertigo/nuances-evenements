<?php
  /*
    Template Name: Page légale
    Template Post Type: page
  */


$context = Timber::context();

$timber_post     = new Timber\Post();
$context['post'] = $timber_post;
Timber::render( 'template-legal.twig' , $context );

