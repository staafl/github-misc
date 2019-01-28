// ==UserScript==
// @name         staafl
// @namespace    http://staafl.trustingwolves.com/
// @version      0.1
// @description  try to take over the world!
// @author       staafl
// @match        http://*/*
// @match        https://*/*
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
const debug = true;
(function() {
    "use strict";

    if (typeof inAjax === "undefined") {
        var baseUrl = "https://raw.githubusercontent.com/staafl/" +
            "github-misc/master/staafl.user.js?timestamp=";
        GM_xmlhttpRequest ( {
            method: 'GET',
            url: baseUrl + new Date().getTime(),
            // 'https://github.com/staafl/github-misc/raw/master/staafl.user.js',
            onload: function (responseDetails) {
                if (responseDetails.status == 200) {
                    try {
                        eval("const inAjax = true;\n" + responseDetails.responseText);
                    }
                    catch (e) {
                        console.error(e);
                        doActualStuff();
                    }
                }
                else {
                    console.error(responseDetails);
                    doActualStuff();
                }
            }
        } );
        return;
    }
    else {
        doActualStuff();
    }

    function doActualStuff() {
// inc:: version: ["](.*?)["] => version: "#{$1+1}"
        unsafeWindow.staafl = { version: "54"};

        if (debug) {
            console.log("Staafl userscript version " + unsafeWindow.staafl.version);
        }

        const { cssUg, cssWhite, cssBlack } = getCss();

        let filters =
            [
                {
                    patterns: [/spotify[.]com/],
                    todos: [spotifyTitle],
                    stop: false
                },
                {
                    patterns: [/youtube[.]com/, /youtu[.]be/],
                    todos: [stripYouTubeNotifications, youtubeClickContinueWatching],
                    stop: false
                },
                {
                    patterns: [/google[.]com/, /duckduckgo[.]com/, /facebook[.]com/],
                    todos: [stripTracking],
                    stop: false
                },
                {
                    patterns: [/facebook.com/],
                    todos: [showScrolling],
                    stop: false,
                },
//                {
//                    patterns: [/facebook[.]com[/]?$/],
//                    todos: [redirect("https://www.facebook.com/messages")],
//                    stop: true
//                },
                {
                    patterns: [/react-native-web-player/],
                    todos: [addStyle("#app { background: white !important }")],
                    stop: false
                },
                {
                    patterns: [/[/]maps[/]/, /maps[.]/],
                    stop: true
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
                {   // Chrome Web Store
                    patterns: [/chrome.google.com[/]webstore/],
                    todos: [addStyle(cssBlack)],
                    stop: true
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
                    patterns: [/:[/][/](www[.])?reddit[.]com/],
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
                    for (let todo of (filter.todos || [])) {
                        todo();
                    }
                    break;
                }
            }
            if (matched && filter.stop) {
                break;
            }
        }

        function showScrolling() {
            const div = document.createElement("div");
            div.style.position = "fixed";
            div.style.fontSize = "20pt";
            div.style.backgroundColor = "white";
            div.style.color = "black";
            div.style.left = "20px";
            div.style.top = "32px";
            div.style.width = "120px";
            div.style.height = "32px";
            div.style.zIndex = 100000;
            div.style.textAlign = "center";
            window.addEventListener("scroll", update);
            document.body.appendChild(div);
            update();

            function update(e) {
                div.innerText = Math.floor(window.scrollY/1000) + "kpx";
                div.style.backgroundColor = window.scrollY > 10000 ? "red" : "white";
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
                        image.style.filter = "invert(0%)"; // 2018-09-27 - moving away from chrome
                        // image.style.filter = "invert(100%)";
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

        function spotifyTitle() {
            setInterval(function() {
                if (!~document.title.indexOf("Spotify")) {
                    document.title = document.title + " - Spotify";
                }
            }, 1000);
        }

        function youtubeClickContinueWatching() {
            setInterval(function() {
                for (const elem of document.querySelectorAll(".line-text")) {
                    if (~elem.innerHTML.indexOf("Video paused") && elem.offsetParent) {
                        let parent = elem.parentElement;
                        let button;
                        while (parent && parent.id !== "main") {
                            parent = parent.parentElement;
                        }

                        if (parent) {
                            button = document.querySelector("ytd-popup-container #confirm-button");
                            if (button) {
                                button.click();
                            }
                        }

                        // https://openuserjs.org/scripts/Telokis/Youtube_auto_close_popup/source
                        button = button || document
                          .querySelector(
                            ".style-scope.ytd-popup-container>yt-confirm-dialog-renderer .buttons.style-scope.yt-confirm-dialog-renderer>yt-button-renderer#confirm-button");

                        if (button && button.offsetParent && elem.offsetParent) {
                          console.log("Clicking YouTube confirm button!");
                          console.log(button);
                          button.click();
                        }
                    }
                }

            }, 5000);
        }

        function stripYouTubeNotifications() {
            setInterval(function() {
                if (document.title.trim().startsWith("(")) {
                    document.title = document.title.replace(/^ *[(][^)]+[)] */g, "")
                }

            }, 1000);
        }

        function stripTracking() {
            const isFacebook = ~window.location.href.indexOf("facebook");
            const isGoogle = ~window.location.href.indexOf("google");
            var changeObserver = new MutationObserver(function(mutations) {
              let should = false;
              mutations.forEach(function(mutation) {

                var namedItem =
                    mutation.target.attributes &&
                    mutation.target.attributes.getNamedItem('id');

                const id = namedItem && namedItem.value;
                const nodeName = mutation.target.nodeName.toUpperCase();

                if (debug) {
                    // console.log(nodeName, id);
                }

                if (isGoogle) {
                    if ((nodeName == 'BODY' && id == 'gsr') ||
                        (nodeName == 'DIV' && id == 'taw') ||
                        nodeName == "A") {
                      should = true;
                    }
                } else if (isFacebook) {
                    if (id == "globalContainer" || nodeName == "A") {
                        should = true;
                    }
                }

              });

              if (should) {
                doIt();
              }
            });

            const element = //isFacebook ? document.getElementById("globalContainer") :
                document.documentElement;

            changeObserver.observe(
                element,
                {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true
                });

            doIt();

            function doIt() {
              if (debug) { console.log("doIt() called..."); }
              const resultLinks = document.getElementsByTagName("a");
              [].forEach.apply(resultLinks, [function(link) {
                var oldLink = link.href;
                if (link.getAttribute('onmousedown')) {
                  link.removeAttribute('onmousedown');
                }
                if (isGoogle) {
                  var matches = /url\?(url|q)=(.+?)&/.exec(oldLink);
                  if (matches != null) {
                    link.href = unescape(matches[2]);
                  }
                } else if (isFacebook) {
                  var matches = /l[.]facebook[.]com[/]l[.]php.*[?&]u=([^&]*)/.exec(oldLink);
                  if (matches != null) {
                    link.href = unescape(matches[1]);
                  }
                } else if ((/pdf$/i).test(oldLink)) {
                  link.href = oldLink;
                }
                if (/:[/][/](www[.])?reddit[.]com/.test(link.href)) {
                    // console.log(link.href);
                    link.href = link.href.replace(/(www[.])?reddit[.]com/, "old.reddit.com");
                }
                if (link.href != oldLink) {
                    console.log(`${oldLink} -> ${link.href}`);
                }
              }]);
            }
        }

        function getCss()
        {
           let cssUg = " \
               body, .jg5ks, ._1eAgg \
               { \
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
