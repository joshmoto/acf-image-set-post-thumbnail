<?php
/*
Plugin Name: ACF Image Set Post Thumbnail
Plugin URI: https://jostmoto.wtf/
Description: Plugin to set ACF image as post thumbnail featured image.
Version: 1.0
Author: J O S H M O T O
Author URI: https://jostmoto.wtf/
License: GPLv2 or later
Text Domain: joshmoto
*/

class ACF_img_set_post_thumb {

    /**
     * constructor method.
     */
    public function __construct ()
    {

        // add our page to tools menu and set out page with callback
        add_action('admin_menu', [ $this, 'management_page_add' ]);

        // enqueue our scripts and css
        add_action('admin_enqueue_scripts', [ $this, 'action_admin_enqueue_scripts' ]);

        // ajax run acf image set post thumbnail process
        add_action('wp_ajax_nopriv_process_images', [ $this, 'ajax_process_images' ], 20);
        add_action('wp_ajax_process_images', [ $this, 'ajax_process_images' ], 20);

    }

    /**
     * @return void
     */
    public function action_admin_enqueue_scripts() {

        // global page now
        global $pagenow;

        // if page now is tools php and page var is acf-image-set-post-thumbnail
        if($pagenow === 'tools.php' && isset($_REQUEST['page']) && $_REQUEST['page'] === 'acf-image-set-post-thumbnail') {

            // register js in footer
            $filename = plugin_dir_url(__FILE__) . 'dist/js/main.js';
            wp_register_script('acf-img-set-post-thumb', $filename, array(), rand(), true);

            // register css in header
            $filename = plugin_dir_url(__FILE__) . 'dist/css/screen.css';
            wp_register_style('acf-img-set-post-thumb', $filename, array(), rand(), 'screen');

            // enqueue required scripts
            wp_enqueue_script('acf-img-set-post-thumb');

            // enqueue required styles
            wp_enqueue_style('acf-img-set-post-thumb');

        }

    }

    /**
     * @return void
     */
    public function management_page_add() {

        // add admin tools page
        add_management_page(
            'ACF Image Set Post Thumbnail',
            'ACF Image Set Post Thumbnail',
            'manage_options',
            'acf-image-set-post-thumbnail',
            [ $this, 'management_page' ],
            null
        );

    }

    /**
     * @return void
     */
    public function management_page() {

        // get current user id
        $user_id = get_current_user_id();

        // create our nonce security via md5 hash of user id
        $nonce = wp_create_nonce(md5($user_id));

        // start our management page html
        ?>
        <div class="wrap">

            <h1>ACF Image Set Post Thumbnail</h1>

            <p>A tool function to loop through all posts for specific <kbd>post_type</kbd> and set an ACF image field attachment as the Wordpress default <kbd>post_thumbnail</kbd> (featured image).</p>

            <p>Simply select the post type you wish to run this function on, then select the ACF image field <kbd>name</kbd> you want to set as the <kbd>post_thumbnail</kbd>, and click run.</p>

            <p><strong>If ACF image field for current post has no attachment value, the function will skip this post and continue processing.</strong></p>

            <form id="acf-img-set-post-thumb-form" method="post" action="<?=$_SERVER['PHP_SELF']?>">
                <table class="form-table" role="presentation">
                    <tbody>
                        <tr>
                            <th colspan="2">
                                <h2 class="title">Function Settings</h2>
                            </th>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="post_type">Post Type</label>
                            </th>
                            <td>
                                <select name="post_type" required>
                                    <option value="" selected="selected" disabled>Select Post Type...</option>
                                    <?php self::get_post_types_options(); ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="acf_image_field">ACF Image Field</label>
                            </th>
                            <td>
                                <select name="acf_image_field" required>
                                    <option value="" selected="selected" disabled>Select ACF Image Field...</option>
                                    <?php self::get_acf_img_field_options(); ?>
                                </select>
                            </td>
                        </tr>
                        <tr class="progress-row row-hide">
                            <th scope="row">
                                <label for="progress">Progress</label>
                            </th>
                            <td>
                                <div class="progress-wrap"></div>
                            </td>
                        </tr>
                        <tr class="logger-row row-hide">
                            <th scope="row">
                                <label for="logger">Logs</label>
                            </th>
                            <td>
                                <pre class="logger"></pre>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="submit">
                    <button type="submit" name="submit" class="button button-primary" disabled>
                        Run ACF Image Set Post Thumbnail
                    </button>
                </p>
                <script>window.acf_img_set_post_thumb_nonce = '<?=$nonce?>';</script>
            <form>
        </div>

        <?php
        // end our management page html

    }

    /**
     * @return void
     */
    private function get_post_types_options() {

        // get our post types which support post thumbnails
        $types = get_post_types_by_support('thumbnail');

        // for each types as type
        foreach ($types as $type) {

            // get type object for type
            $type_object = get_post_type_object($type);

            // if type object is object
            if(is_object($type_object)) {

                // output post type as select option
                echo '<option value="' . $type_object->name . '">' . $type_object->label . '</option>';

            }

        }

    }

    /**
     * @return void
     */
    private function get_acf_img_field_options() {

        // global wpdb
        global $wpdb;

        // our sql query
        $sql =  "SELECT post_excerpt as 'field_name', post_name as 'field_key' FROM {$wpdb->posts} where post_type = 'acf-field'";

        // get results from our sql query
        $results = $wpdb->get_results($sql,ARRAY_A);

        // for each results as key value
        foreach ($results as $key => $value) {

            // if field key is set
            if(isset($value['field_key'])) {

                // get acf field object by field key
                $field_object = get_field_object($value['field_key']);

                // if field object type key is set and type is image field
                if(isset($field_object['type']) && $field_object['type'] === 'image') {

                    // output acf field type as select option
                    echo '<option value="' . $field_object['name'] . '">' . $field_object['name'] . '</option>';

                }

            }

        }

    }

    /**
     * @param $props array|bool
     * @param $posts_per_page int
     * @param $exclude bool|string
     * @return array
     */
    public function query_args($props, int $posts_per_page = -1, $exclude = false) {

        // query args
        $args = [
            'post_type'         => $props['post_type'],
            'post_status'       => 'any',
            'posts_per_page'    => $posts_per_page,
            'orderby'           => 'date',
            'order'             => 'ASC'
        ];

        // if exclude is an array
        if(is_array($exclude)) {

            // add exclude post ids to args array
            $args['post__not_in'] = $exclude;

        }

        // return the query args
        return $args;

    }

    /**
     * @return void
     * @noinspection PhpUnused
     */
    public function ajax_process_images() {

        // get current user id
        $user_id = get_current_user_id();

        // security check ajax referer action of md5 hashed current user id
        check_ajax_referer(md5($user_id),'security');

        // get our passed properties
        $props = $_POST['props'];

        // if props is an array
        if(is_array($props)) {

            // if props array has array keys post_type and acf_image_field
            if(isset($props['post_type']) && isset($props['acf_image_field'])) {

                // check the init state
                $init = $_POST['init'] === 'true';

                // get post count
                $count = (int)$_POST['count'];

                // processed count
                $processed = (int)$_POST['processed'];

                // exclude posts
                $exclude = $_POST['exclude'];

                // are we done to return bool true or false
                $done = !($_POST['done'] === 'false');

                // if this is the initial run
                if($init) {

                    // our wp query count for passed post type
                    $query_count = new WP_Query(self::query_args($props));

                    // set count to our total query count
                    $count = $query_count->post_count;

                }

                // if exclude is false string
                if ($exclude === 'false') {

                    // set exclude to bool
                    $exclude = false;

                    // else if exclude is array
                } else if($exclude !== 'false') {

                    // explode exclude string into array
                    $exclude = explode('e',$exclude);

                }

                // process query
                $query = new WP_Query(self::query_args($props,50,$exclude));

                // log data
                $logs = [];

                // if we have posts to loop
                if($query->have_posts()):

                    // start our object buffer
                    ob_start();

                    // loop through our query post results
                    while ($query->have_posts()): $query->the_post();

                        // get attachment id
                        $attachment_id = get_field($props['acf_image_field'],$query->post->ID,false);

                        // if there is an acf featured attachment id set
                        if($attachment_id) {

                            // set the post thumbnail with acf featured image attachment id
                            set_post_thumbnail($query->post,$attachment_id);

                            // log post thumbnail has been set
                            $logs[$query->post->ID] = [
                                'result' => 1,
                                'edit_link' => get_edit_post_link($query->post->ID)
                            ];

                        } else {

                            // log no attachment found
                            $logs[$query->post->ID] = [
                                'result' => 0,
                                'edit_link' => get_edit_post_link($query->post->ID)
                            ];

                        }

                        // processed increment
                        $processed++;

                        // add current processed post to
                        $exclude[] = (int)$query->post->ID;

                        // if processed is equal to count
                        if ($processed === $count) {

                            // set done to true
                            $done = true;

                        }

                    // end while
                    endwhile;

                    // setup our data response to send
                    $data = [
                        'props'         => $props,
                        'init'          => $init,
                        'count'         => $count,
                        'processed'     => $processed,
                        'exclude'       => is_array($exclude) ? implode('e',$exclude) : false,
                        'done'          => $done,
                        'log'           => $logs
                    ];

                    // wp send json success
                    wp_send_json_success($data);

                else :

                    // error message text
                    $message = "Sorry, <strong>" . $props['post_type'] . "</strong> post type query returned no results.\n";

                    // setup our data response to send
                    $data = [
                        'log' => $message
                    ];

                    // wp send json error
                    wp_send_json_error($data);

                endif;

            }

        }

        // die
        die();

    }

}

new ACF_img_set_post_thumb();