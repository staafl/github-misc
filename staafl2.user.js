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
                // black
                patterns: [/ultimate-guitar.com\/tab/],
                todos: [addStyle(cssBlack)],
                stop: true
            },
            {
                // UG
                patterns: [/ultimate-guitar.com\/tab.*official/],
                todos: [addStyle(cssUg)],
                stop: true
            },
            {
                // anything that uses 'Care your Eyes'
                patterns: [/.*/],
                todos: [addStyle("i { color: #ccc !important }")],
                stop: false
            },
            {
                patterns: [/https:[/][/]my.fibank.bg[/]oauth2-server[/]login/],
                todos: [type("#username", "vnikolov89"),
                        focus("#password")],
                stop: false
            },
            {
                // wikipedia
                patterns: [/wikipedia/],
                todos: [invertImages],
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

    function addStyle(style) {
        return function() {
            let sheet = document.createElement("style");
            sheet.innerHTML = style;
            document.body.appendChild(sheet);
        };
    }

    function invertImages() {
        const images = document.querySelectorAll("img");
        for (let image of images) {
            image.style.filter = "invert(0%)";
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
                e.focus();
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