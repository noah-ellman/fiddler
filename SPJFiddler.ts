/* <reference path="./jquery.d.ts"/> */

/**
 * @author Noah Ellman
 *
 * The SPJFiddler module is easy to install.
 * Simply add the following HTML anywhere in your page.
 *
 * <div id="fiddler_container">
 *     <div data-fiddler-frame="html"></div>
 *     <div data-fiddler-frame="css"></div>
 *     <div data-fiddler-frame="output"></div>
 * </div>
 *
 * Then in your javascript just instantiate the class on page load.
 *
 * @usage new SPJFiddler({container: "#fiddler_container"});
 *
 * @module SPJFiddler
 * @class SPJFiddler
 * @requires jquery
 */


class SPJFiddler {

    html_frame: HTMLElement;
    css_frame: HTMLElement;
    output_frame: HTMLElement;

    html_textarea: HTMLTextAreaElement;
    css_textarea: HTMLTextAreaElement;
    output_iframe: HTMLIFrameElement;

    output_document: HTMLDocument;

    // These events will be bound to textarea's
    textareaEvents = {
        keydown: (e) => {
            // Block tabs for now
            if ((e.charCode === 9 || e.keyCode === 9) && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                return false;
            }
        },
        keyup: (e) => {
            // live updates
            this.renderOutput();
        }
    };

    /**
     * Creates the SPJ interface, with the dynamically created components
     * and register the events to get it all working.
     * @constructor
     * @param {object} userOptions
     */
    constructor(userOptions?: {container: string}) {

        let options = {
            container: "#fiddler_container"
        };
        $.extend(options, userOptions);

        // You must have 3 elements with the data-fiddler-frame attribute to specify
        // where everything is in your UI
        let frames = $(options.container + " [data-fiddler-frame]");
        if (frames.length < 3) throw new Error("Can't find elements with [data-fiddler-frame] attribute");
        frames.each((k, v: HTMLElement) => {
            let data = $(v).data("fiddler-frame");
            this[data + "_frame"] = v;
        });

        // initialize each frame
        this.initTextArea(this.html_frame, 'html');
        this.initTextArea(this.css_frame, 'css');
        this.initIframe(this.output_frame);

    };


    /**
     * Renders the HTML and CSS code into the iframe document.
     *
     * @method renderOutput
     * @public
     * @returns self
     */

    renderOutput() {
        let html = this.html_textarea.value;
        let css = this.css_textarea.value;
        // Turn the CSS frame red if there's a CSS error
        if (this.parseCSS(css)) $(this.css_textarea).removeClass('has-error');
        else $(this.css_textarea).addClass('has-error');
        // Uses jquery's parseHTML to put the html text into a DOM fragment.
        $(this.output_document.body)
            .empty()
            .append($.parseHTML(html));
        return this;
    };

    /**
     * A nice clean DOM way to remove and add stylesheet rules for a document.
     * This will remove all the old styles rules and replace them all.
     * If a user entered a invalid rule it will return false.
     *
     * @method parseCSS
     * @private
     * @param {string} code
     * @returns {boolean} pass or fail
     */

    private parseCSS(code) {
        let sheet: any = this.output_document.getElementsByTagName('style')[0];
        // each CSS rule
        let lines = code.replace(/[\r\n\t]/gm, ' ').split(/}/);
        if (!sheet) return;
        sheet = sheet.styleSheet || sheet.sheet || sheet;

        // delete old css rules
        for (let i = 0; i < sheet.cssRules.length; i++) {
            try {
                if (sheet.deleteRule) sheet.deleteRule(i);
                else sheet.removeRule(i);
            } catch (e) {
            }
        }

        // insert each new css rule one by one
        try {
            lines.forEach(function (str) {
                str = $.trim(str) + '}';
                let m = str.match(/(.+?)\{(.*?)}/), m1, m2;
                if (m) {
                    m1 = $.trim(m[1]);
                    m2 = $.trim(m[2]);
                    if (sheet.insertRule) sheet.insertRule(m1 + '{' + m2 + '}', sheet.cssRules.length);
                    else sheet.addRule(m1, m2);
                }
            });
        } catch (e) {
            return false;
        }
        return true;
    };


    /**
     * Dynamically generate the textarea elements for our css and html
     * and bind the appropriate event handles.
     *
     * @method initTextArea
     * @private
     * @param {HTMLElement} element
     * @param {string} type Is is HTML or CSS frame?
     * @returns self
     */
    private initTextArea(element: HTMLElement, type: string) {
        let $textarea: HTMLTextAreaElement;
        $textarea = <HTMLTextAreaElement>$("<textarea>", {
            id: "fiddler_input_" + type,
            "class": "fiddler_input",
        })[0];
        $textarea.placeholder = "Place your " + type.toUpperCase() + " code here.";
        $textarea.spellcheck = false;
        this[type + "_textarea"] = $textarea;
        $($textarea).appendTo(element);
        $($textarea).on('keydown', this.textareaEvents.keydown);
        $($textarea).on('keyup', this.textareaEvents.keyup);
        return this;
    };

    /**
     * Dynamically generate the iframe element for our live output.
     *
     * @method initIframe
     * @private
     * @param {HTMLElement} element
     * @returns self
     */
    private initIframe(element: HTMLElement) {
        let $iframe: HTMLIFrameElement;
        $iframe = <HTMLIFrameElement>$("<iframe>")[0];
        element.appendChild($iframe);
        this.output_document = $iframe.contentDocument;
        $(this.output_document.body).html("<h3>Output</h3>");
        // This is our style tag we use to inject CSS
        this.output_document.head.appendChild(document.createElement('style'));
        return this;
    };


}






