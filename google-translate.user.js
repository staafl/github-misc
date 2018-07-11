// ==UserScript==
// @name         Google Translate Keyboard Shortcut
// @namespace    https://github.com/staafl
// @version      1.0
// @icon         https://raw.githubusercontent.com/Greenek/google-translate-keyboard-shortcut-userscript/master/icon.png
// @updateURL    https://github.com/staafl/github-misc/raw/master/google-translate.user.js
// @downloadURL  https://github.com/staafl/github-misc/raw/master/google-translate.user.js
// @grant        none
// @run-at       document-end
// @include      http://translate.google.tld/*
// @include      https://translate.google.tld/*
// ==/UserScript==
(() => {
  "use strict";

  // based on https://github.com/Greenek/google-translate-keyboard-shortcut-userscript

  function click(id) {
    var elem = document.getElementById(id);
    ["mouseover", "mousedown", "mouseup"].forEach(type =>
      elem.dispatchEvent(new MouseEvent(type))
    );
  }

  /**
   * Set listeners for shortcut event.
   */
  window.addEventListener(
    "keypress",
    event => {
      if (event.key === "`") {
        click("gt-swap");
        event.preventDefault();
      }
      if (event.key === "1") {
        click("gt-sl-gms")
        event.preventDefault();
      }
      if (event.key === "2") {
        click("gt-tl-gms")
        event.preventDefault();
      }
      if (event.key === "3") {
        click("source")
        event.preventDefault();
      }
    },
    true
  );
})();