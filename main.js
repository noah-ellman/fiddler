// General javascript which is not part of
// the SPJFiddler module but more specific to the rest of the UI

$(function () {

    // Load the SPJFiddler module
    // Everything is encapsulated within, so we don't have to do anything else.
    var fiddler = new SPJFiddler({container: "#fiddler_container"});

    // Handle the toolbar buttons for show/hide of the frames
    // Uses the data-showhide attribute on the buttons
    // and data-fiddler-frame on the frames.
    $("[data-showhide]").each(function (k, v) {
        var whichframe = $(v).data('showhide');
        //        var remembered_state = !!localStorage.getItem(whichframe);
        //        if( !!remembered_state ) {
        //            v.setAttribute('checked',"true");
        //           $(v).addClass('active');
        //       } else {
        //           if( whichframe != 'css' ) v.checked = true;
        //        }

        $(v).on('change', function (e) {
            var frame = $("[data-fiddler-frame=" + whichframe + "]");
            //            localStorage.setItem(whichframe, !!e.target.checked);
            if (e.target.checked) {
                frame.css('display', 'block');
            } else {
                frame.css('display', 'none');
            }
        });
        $(v).trigger('change');
    });

    // On window resize fit the height the fiddler components on the screen perfectly
    $(window).on('resize', function (e) {
        var fiddlerHeight = $(window).height() - $('nav').height() - 20;
        $("#fiddler_container textarea, #fiddler_container iframe, #fiddler_container > div").css('height', fiddlerHeight + 'px');
    });

    $(window).trigger('resize');

    // This is how you manually set the initial content in fiddler
  //  var css = "\nbody { \n    font-family: Arial; \n} \nvar {\n    display:inline-block;\n    padding:2px;\n    border:1px solid grey;\n    background:lightyellow;\n}\nem {\n    color: blue;\n}\nh1 {\n    font-family: Georgia;\n    text-shadow: 2px 2px 3px black;\n    color: purple;\n}\n";
  //  var html = "\n<h1>SPJFiddler</h1>\n<h4>Technologies used</h4>\n<ul>\n<li>JavaScript using <b>TypeScript</b></li>\n<li>Bootstrap v4 alpha</li>\n<li>CSS using <b>LESS</b></li>\n<li>jQuery latest</li>\n</ul>\n<p>The code for this module is in <em>SPJFiddler.ts</em>, which is in <var>TypeScript</var>.  The <em>.js</em> file contains the transpiled code from ES6 to ES5 and all comments are removed. \n<p>I would love to discuss my implementation in further detail. </p>\n";
  //  fiddler.html_textarea.value = html;
  //  fiddler.css_textarea.value = css;
  //  fiddler.renderOutput();

});

