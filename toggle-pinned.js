(function() {
  window.pinnedHidden = !window.pinnedHidden
  if (window.pinnedHidden && !window.pinnedFirstHidden) {
    // force it to load some stuff
    for (const elem of document.getElementsByClassName("customScrollBar")) {
      if (!elem.classList.contains("ms-FocusZone")) {
        elem.scroll(0, 100);
      }
    }
  }
  setTimeout(() => {

    for (const elem of document.querySelectorAll("div[data-convid]")) {
      if (~(elem.getAttribute("aria-label") || "").indexOf("Pinned")) {
        elem.style.visibility = window.pinnedHidden ? "collapse" : "visible"
        elem.style.display = window.pinnedHidden ? "none" : "block"
      }
    }
    for (const elem of document.getElementsByClassName("customScrollBar")) {
      if (!elem.classList.contains("ms-FocusZone")) {
        elem.scroll(0, 0);
      }
    }

    console.log(window.pinnedHidden ? "collapse" : "visible");
  },  window.pinnedFirstHidden ? 0 : 2500);
  
  window.pinnedFirstHidden = true;
})()