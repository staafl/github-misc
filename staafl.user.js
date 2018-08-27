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
// @connect     githubusercontent.com
// @download     https://github.com/staafl/github-misc/raw/master/staafl.user.js
// @update       https://github.com/staafl/github-misc/raw/master/staafl.user.js
// @run-at       document-end
// ==/UserScript==

/* jshint esversion: 6, multistr: true */
(function() {
    "use strict";

    if (!unsafeWindow.inAjax) {
        unsafeWindow.inAjax = true;
        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        'https://raw.githubusercontent.com/staafl/github-misc/master/staafl.user.js?timestamp=' + new Date().getTime(),
            // 'https://github.com/staafl/github-misc/raw/master/staafl.user.js',
            onload:     function (responseDetails) {
                if (responseDetails.status == 200) {
                    eval(responseDetails.responseText);
                }
                else {
                    console.error(responseDetails);
                    doActualStuff();
                }
            }
        } );
        return;
    }
    else{
        doActualStuff();
    }

    function doActualStuff() {

// inc:: version: ["](.*?)["] => version: "#{$1+1}"
        unsafeWindow.staafl = { version: "30"};

        var wall = (location.href + "").indexOf("://www.wall.org") != -1;
        if (wall) {
            unsafeWindow.onbeforeunload = function() {
//                console.log(unsafeWindow.location.hash);
//                if (unsafeWindow.location.hash == "#doreload") {
//                    return undefined;
//                }
                return "?";
            };

            // unsafeWindow.location.hash = "";
            setInterval(function() {
                // unsafeWindow.location.hash = "#doreload";
                // unsafeWindow.location.reload();
                unsafeWindow.document.body.innerHTML = '';
                unsafeWindow.document.write(Math.random());
            }, 1000);
        }

        const { cssUg, cssWhite, cssBlack } = getCss();

        let filters =
            [
                {
                    patterns: [/react-native-web-player/],
                    todos: [addStyle("#app { background: white !important }")],
                    stop: false
                },
                {
                    patterns: [/tick42[.]com/],
                    todos: [type("#login-form-username", "vnikolov"),
                            manip("#login-form-remember-me", e => e.checked = true),
                            manip("button[type='submit']", e => e.disabled = null),
                            focus("#login-form-password"),

                            type("input[name='user']", "vnikolo"),
                            focus("input[name='user']"),
                            manip("#remember-me", e => e.checked = true),

                            type("#j_username", "vnikolov"),
                            focus("input[name='j_password']"),
                        ],
                },
                {
                    patterns: [/stackoverflow/, /stackexchange/],
                    todos: [hideHotNetworkQuestions()],
                    stop: false
                },
                {
                    patterns: [/quora[.com]/],
                    todos: [addStyle(".icon_action_bar { visibility: collapse !important; display: none !important; }")]
                },
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
                    patterns: [/ultimate-guitar[.]com[/]tab/],
                    todos: [addStyle(cssBlack)],
                    stop: true
                },
                {
                    // black
                    patterns: [/10fastfingers[.]com/],
                    todos: [manip("#cye-workaround-body-image", e => { e.removeAttribute("style"); }),
                           () => setInterval(() => unsafeWindow.countdown = 3600, 1000),
                           addStyle("#input-row { background: unset !important; } #sidebar-md-lg, #speedtest-main > div:nth-child(7), #input-row > div > div:nth-child(2),body > div.top-first-bg { visibility: hidden !important }")
                           ],
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
                    patterns: [/google.*[/]search.*q=weather/],
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

        function manip(selector, f) {
            return doToElement(selector, null, f);
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

        function hideHotNetworkQuestions(timeout) {
            return doToElement("#feed-link", timeout || 200,
                function() {
                    document.querySelector("#hot-network-questions").style.display = "none";
                    // https://meta.stackexchange.com/a/232424/395833
                    var toClick = document.querySelector(".js-show-more.show-more");
                    if (toClick) {
                        toClick.click();
                    }
                    setTimeout(function() {
                        var ignore="Programming Puzzles & Code Golf, TeX - LaTeX, Aviation, Database Administrators";
                        var include="Game Development, Worldbuilding, English Language & Usage, The Workplace, Interpersonal Skills, Personal Finance & Money, Law, Politics, Information Security, Writing, Stack Overflow, German Language, Cryptography"
                        var questList=document.getElementById("hot-network-questions").getElementsByTagName("li");
                        var curSite="";

                        ignore=","+ignore.replace(", ",",");
                        include=","+include.replace(/, /g, ",");

                        for (var i=0; i<questList.length; i++) {
                            curSite=questList[i].getElementsByTagName("div")[0].title;
                            if (curSite.indexOf("Stack Exchange") > 1) {
                                curSite=curSite.substring(0, curSite.length - 15);
                            }

                            if (include.indexOf(","+curSite) == -1) {
                                questList[i].style.display="none";
                            }
                            if (ignore.indexOf(","+curSite) > -1) {
                                questList[i].style.display="none";
                            }
                        }
                        document.querySelector("#hot-network-questions").style.display = "block";

                        if (toClick) {
                            toClick.addEventListener("click",
                                                     function() {
                                hideHotNetworkQuestions();
                            });
                        }
                    }, 1000);
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

    }
})();
