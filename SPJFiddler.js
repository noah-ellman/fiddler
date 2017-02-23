// THIS IS GENERATED FILE
// THE ACTUAL CODE IS IN THE TYPESCRIPT FILE

var SPJFiddler = (function () {
    function SPJFiddler(userOptions) {
        var _this = this;
        this.textareaEvents = {
            keydown: function (e) {
                if ((e.charCode === 9 || e.keyCode === 9) && !e.metaKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    return false;
                }
            },
            keyup: function (e) {
                _this.renderOutput();
            }
        };
        var options = {
            container: "#fiddler_container"
        };
        $.extend(options, userOptions);
        var frames = $(options.container + " [data-fiddler-frame]");
        if (frames.length < 3)
            throw new Error("Can't find elements with [data-fiddler-frame] attribute");
        frames.each(function (k, v) {
            var data = $(v).data("fiddler-frame");
            _this[data + "_frame"] = v;
        });
        this.initTextArea(this.html_frame, 'html');
        this.initTextArea(this.css_frame, 'css');
        this.initIframe(this.output_frame);
    }
    ;
    SPJFiddler.prototype.renderOutput = function () {
        var html = this.html_textarea.value;
        var css = this.css_textarea.value;
        if (this.parseCSS(css))
            $(this.css_textarea).removeClass('has-error');
        else
            $(this.css_textarea).addClass('has-error');
        $(this.output_document.body)
            .empty()
            .append($.parseHTML(html));
        return this;
    };
    ;
    SPJFiddler.prototype.parseCSS = function (code) {
        var sheet = this.output_document.getElementsByTagName('style')[0];
        var lines = code.replace(/[\r\n\t]/gm, ' ').split(/}/);
        if (!sheet)
            return;
        sheet = sheet.styleSheet || sheet.sheet || sheet;
        for (var i = 0; i < sheet.cssRules.length; i++) {
            try {
                if (sheet.deleteRule)
                    sheet.deleteRule(i);
                else
                    sheet.removeRule(i);
            }
            catch (e) {
            }
        }
        try {
            lines.forEach(function (str) {
                str = $.trim(str) + '}';
                var m = str.match(/(.+?)\{(.*?)}/), m1, m2;
                if (m) {
                    m1 = $.trim(m[1]);
                    m2 = $.trim(m[2]);
                    if (sheet.insertRule)
                        sheet.insertRule(m1 + '{' + m2 + '}', sheet.cssRules.length);
                    else
                        sheet.addRule(m1, m2);
                }
            });
        }
        catch (e) {
            return false;
        }
        return true;
    };
    ;
    SPJFiddler.prototype.initTextArea = function (element, type) {
        var $textarea;
        $textarea = $("<textarea>", {
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
    ;
    SPJFiddler.prototype.initIframe = function (element) {
        var $iframe;
        $iframe = $("<iframe>")[0];
        element.appendChild($iframe);
        this.output_document = $iframe.contentDocument;
        $(this.output_document.body).html("<h3>Output</h3>");
        this.output_document.head.appendChild(document.createElement('style'));
        return this;
    };
    ;
    return SPJFiddler;
}());
//# sourceMappingURL=SPJFiddler.js.map