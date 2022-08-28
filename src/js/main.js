// document ready jquery
(function ($) {

    // constant vars
    const form = $('#acf-img-set-post-thumb-form');

    // updatable let vars
    let data  = null;
    let props = {};

    /**
     * acf image set post thumb form event handlers
     * @param e
    */
    $(form).on('change', function(e) {

        // event prevent default
        e.preventDefault();

        // update our vars
        data = new FormData(this);
        props = Object.fromEntries(data);

        // if props has properties post_type and acf_image_field
        if(Object.hasOwn(props,'post_type') && Object.hasOwn(props,'acf_image_field')) {

            // enable submit button
            $('[type="submit"]',this).prop('disabled',false);

        }

    }).on('submit', function(e) {

        // event prevent default
        e.preventDefault();

        // update our vars
        data = new FormData(this);
        props = Object.fromEntries(data);

        // if confirm is confirmed
        if (confirm('Are you sure you want to run this process?') === true) {

            // ajax process images
            process_images(props);

        // else
        } else {

            // return false
            return false;

        }

    });

    /**
     * process images js function
     * @param props
     * @param init
     * @param count
     * @param processed
     * @param exclude
     * @param done
     */
    function process_images(
        props,
        init = true,
        count = 0,
        processed = 0,
        exclude = false,
        done = false)
    {

        // jquery post ajax call
        $.ajax({
            cache: false,
            timeout: 300000, // 5 hours
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'process_images',
                security: acf_img_set_post_thumb_nonce,
                props: props,
                init: init,
                count: count,
                processed: processed,
                exclude: exclude,
                done: done
            },
            // success response
            success: function (response) {

                // let our response data
                let data = response.data;

                // if this is the initial process
                if(data.init) {

                    // disable submit button
                    $('[type="submit"]', form).prop('disabled',true);

                    // empty logger
                    $('.logger', form).empty();

                    // reveal progress bar
                    $('.progress-wrap', form).html('<div class="progress"><div class="progress-bar"></div></div>');

                    // reveal progress and logger table rows
                    $('.progress-row, .logger-row', form).removeClass('row-hide');

                }

                // progress bar processed percentage status
                let progress_percent = Math.round(((100/data.count) * data.processed) * 10) / 10;

                // if we are not done then run again
                if(!data.done) {

                    // if response is success
                    if (response.success) {

                        // update progress bar processed percentage status
                        $('.progress-bar', form).width(progress_percent + '%').text(progress_percent + '%');

                        // logger
                        logger('success', data);

                        // continue processing the acf image set post thumbnail function with our response data
                        process_images(
                            data.props,
                            false,
                            data.count,
                            data.processed,
                            data.exclude,
                            data.done
                        );

                    } else {

                        // empty logger
                        $('.logger', form).empty();

                        // hide progress table row
                        $('.progress-row', form).addClass('row-hide');

                        // reveal logger table row
                        $('.logger-row', form).removeClass('row-hide');

                        // logger
                        logger('error', data);

                    }

                } else {

                    // if response is success
                    if (response.success) {

                        // update progress bar processed percentage status
                        $('.progress-bar', form).width(progress_percent + '%').text(progress_percent + '%');

                        // logger
                        logger('success', data);

                    } else {

                        // logger
                        logger('error', data);

                    }

                }

            },
            // error response
            error: function (response) {

                // let our response data
                let data = response.data;

                // after 1 second
                setTimeout(function(){

                    // empty logger
                    $('.logger', form).empty();

                    // hide progress table row
                    $('.progress-row', form).addClass('row-hide');

                    // reveal progress and logger table rows
                    $('.logger-row', form).removeClass('row-hide');

                    // unknown error log
                    data.log = 'An unknown problem has occurred!'

                    // hide update products json progress bar
                    logger('error', data);

                },1000);

            }

        // done response
        }).done(function (response) {

            // if response is success
            if (response.success) {

                // let our response data
                let data = response.data;

                // and we are done
                if(data.done) {

                    // log our process is complete
                    logger('done', data);

                    // change progress bar color to green
                    $('.progress', form).addClass('progress-done');

                    // re-enable submit button
                    $('[type="submit"]', form).prop('disabled',false);

                }

            }

        });

    }

    /**
     * logger function to log process data
     * @param status
     * @param data
     */
    function logger(status, data = false) {

        // get logger object
        let logger = $('.logger',form);

        // if status is success
        if(status === 'success') {

            // each log entry
            $.each(data.log, function(post_id, $post_data) {

                // if result is success
                if($post_data.result) {

                    // log our success message
                    $(logger).append('<strong>' + data.props.post_type + '</strong> <a href="' + $post_data.edit_link + '" target="_blank" class="log-text-success">#' + post_id + '</a> post thumbnail has been set with acf image field <strong>' + data.props.acf_image_field + '</strong> attachment.' + "<br/>");

                } else {

                    // log our failed message
                    $(logger).append('<strong>' + data.props.post_type + '</strong> <a href="' + $post_data.edit_link + '" target="_blank" class="log-text-error">#' + post_id + '</a> acf image field <strong>' + data.props.acf_image_field + '</strong> had no attachment id set.' + "<br/>");

                }

            });

        // if status is done
        } else if (status === 'done') {

            // log our process done message
            $(logger).append('<strong class="log-text-done">Process complete.</strong>' + "<br/>");

        // if status is error
        } else if (status === 'error') {

            // if we have data log
            if(data.log) {

                // log our error message
                $(logger).append(data.log + "<br/>");

            }

        }

        // animate scroll to bottom of logger after new logs are appended
        $(logger).animate({

            // logger scroll top position
            scrollTop: logger.prop("scrollHeight")

        // animate options
        },{
            duration: 250,
            easing: 'linear'
        });

    }

})(jQuery);