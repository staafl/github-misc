// ==UserScript==
// @name         staafl
// @namespace    http://staafl.trustingwolves.com/
// @version      0.1
// @description  try to take over the world!
// @author       staafl
// @match        http*://*/*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @download     https://github.com/staafl/github-misc/raw/master/staafl.user.js
// @update       https://github.com/staafl/github-misc/raw/master/staafl.user.js
// @run-at       document-end
// ==/UserScript==

/* jshint esversion: 6, multistr: true */
(function() {
    "use strict";

    const { cssUg, cssWhite, cssBlack } = getCss();

    let filters =
        [
            {
                patterns: [/www[.]reddit[.]com/],
                todos: [redirect((location + "").replace("www.", "old."))],
                stop: true
            },
            {
                // UG
                patterns: [/ultimate-guitar[.]com[/]tab.*official/, /ultimate-guitar[.]com[/]tab.*pro_[0-9]/],
                todos: [addStyle(cssUg)],
                stop: true
            },
            {
                // black
                patterns: [/ultimate-guitar[.]com[/]tab/, /10fastfingers[.]com/],
                todos: [addStyle(cssBlack)],
                stop: true
            },
            {
                // anything that uses 'Care your Eyes'
                patterns: [/.*/],
                todos: [addStyle("i { color: #ccc !important }")],
                stop: false
            },
            {
                patterns: [/https:[/][/]my[.]fibank[.]bg[/]oauth2-server[/]login/],
                todos: [type("#username", "vnikolov89"),
                        focus("#password", 200),
                        setAttribute("#submitBtn", "disabled", null)],
                stop: false
            },
            {
                patterns: [/https:[/][/]my[.]fibank[.]bg[/]EBank[/]utility[/]pay-bills[/]process-bill/],
                todos: [fromAccount(2000)],
                stop: false
            },
            {
                // wikipedia
                patterns: [/wikipedia/],
                todos: [invertImages()],
                stop: false
            },
            {
                // white
                patterns: [/docs[.]glue42/],
                todos: [addStyle(cssWhite)],
                stop: false
            },
            {
                patterns: [/google.*[/]search.*q=weather[+]sofia/],
                todos: [click("#wob_rain", 1000)],
                stop: false
            }
        ];

    for (let filter of filters) {
        let matched = false;
        for (let pattern of filter.patterns) {
            if (pattern.test(location.href)) {
                matched = true;
                for (let todo of filter.todos) {
                    todo();
                }
                break;
            }
        }
        if (matched && filter.stop) {
            break;
        }
    }

    function redirect(where) {
        return function() {
            location.href = where;
        }
    }

    function addStyle(style) {
        return function() {
            let sheet = document.createElement("style");
            sheet.innerHTML = style;
            document.body.appendChild(sheet);
        };
    }

    function invertImages() {
        return function() {
            const images = document.querySelectorAll("img");
            for (let image of images) {
                if (image.classList.contains("mwe-math-fallback-image-inline")) {
                    image.style.filter = "invert(0%)"; // somehow this fixes math formulas
                }
                else {
                    image.style.filter = "invert(100%)";
                }
            }
        }
    }

    function type(selector, text, timeout) {
        return doToElement(selector, timeout,
            function(e) {
                e.value = text;
            });
    }

    function focus(selector, timeout) {
        return doToElement(selector, timeout,
            function(e) {
                e.tabIndex = -1;
                e.focus();
            });
    }

    function setAttribute(selector, attribute, value, timeout) {
        return doToElement(selector, timeout,
            function(e) {
                e[attribute] = value;
            });
    }

    function doToElement(selector, timeout, func) {
        timeout = timeout || 0;
        return function() {
            setTimeout(function() {
                let timer;

                if (!doer()) {
                    timer = setInterval(doer, 1000);
                }

                function doer() {
                    const element = document.querySelector(selector);
                    if (!element) {
                        return false;
                    }
                    func(element);
                    if (timer) {
                        clearInterval(timer);
                    }
                    return true;
                }
            }, timeout);
        };
    }


    function fromAccount(timeout) {
        return doToElement("#step2 > div > button", timeout,
            function() {
                let time = 0;
                for (let x of document.querySelectorAll("#step2 > div > button")) {
                    let k = x;
                    setTimeout(
                        function() {
                            k.click();
                            setTimeout(function() { document.querySelector("span.text:visible:last").click(); }, 200);
                        },
                        time);
                    time += 400;
                }
            });
    }

    function click(selector, timeout) {
        return doToElement(selector, timeout, function(e) { e.click(); });
    }

    function getCss()
    {
       let cssUg = " \
           body, .jg5ks, ._1eAgg \
           { \
               background: black !important; \
           } \
\
           #canvas > div \
           { \
               z-index: -1 !important; \
               background: black !important; \
           } \
\
           #canvas > canvas:nth-child(2) \
           { \
               filter: invert(100%); \
           } \
\
           section, aside \
           { \
               background: black !important; \
               color: white !important; \
           }";

        let cssWhite = " \
            * \
            { \
                color: #333333 !important; \
                background: white !important; \
            } \
\
            .ace_marker-layer, .ace_cursor-layer \
            { \
                visibility: hidden !important; \
            }";

        let cssBlack = " \
            * \
            { \
                color: #cccccc !important; background: black !important; \
            } \
\
            .ace_marker-layer, .ace_cursor-layer \
            { \
                visibility: hidden !important; \
            }";

        return { cssUg, cssWhite, cssBlack };
    }

    // 2018-07-07-12-07-36
})();