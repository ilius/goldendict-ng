// seperate from cpp code.
var gdAudioLinks = {
  first: null,
  current: null,
};

//store dictionary audio link.
var gdAudioMap = new Map();

function gdMakeArticleActive(newId, noEvent) {
  const gdCurrentArticle =
    document.querySelector(".gdactivearticle").attributes.id;
  if (gdCurrentArticle !== "gdfrom-" + newId) {
    document
      .querySelector(".gdactivearticle")
      .classList.remove("gdactivearticle");
    const newFormId = "gdfrom-" + newId;
    document.querySelector(`#${newFormId}`).classList.add("gdactivearticle");
    gdAudioLinks.current = newId;
    if (!noEvent) articleview.onJsActiveArticleChanged("gdfrom-" + newId);
  }
}

var overIframeId = null;

function gdSelectArticle(id) {
  var selection = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(document.getElementById("gdfrom-" + id));
  selection.removeAllRanges();
  selection.addRange(range);
}

function processIframeMouseOut() {
  overIframeId = null;
  top.focus();
}

function processIframeMouseOver(newId) {
  overIframeId = newId;
}

function processIframeClick() {
  if (overIframeId != null) {
    overIframeId = overIframeId.replace("gdexpandframe-", "");
    gdMakeArticleActive(overIframeId);
  }
}

function init() {
  window.addEventListener("blur", processIframeClick, false);
}
window.addEventListener("load", init, false);

function gdExpandOptPart(expanderId, optionalId) {
  var d1 = document.getElementById(expanderId);
  var i = 0;
  if (d1.alt == "[+]") {
    d1.alt = "[-]";
    d1.src = "qrc:///icons/collapse_opt.png";
    for (i = 0; i < 1000; i++) {
      var d2 = document.getElementById(optionalId + i);
      if (!d2) break;
      d2.style.display = "inline";
    }
  } else {
    d1.alt = "[+]";
    d1.src = "qrc:///icons/expand_opt.png";
    for (i = 0; i < 1000; i++) {
      var d2 = document.getElementById(optionalId + i);
      if (!d2) break;
      d2.style.display = "none";
    }
  }
}

function emitClickedEvent(link) {
  try {
    if ("string" != typeof link) {
      return;
    }
    articleview.linkClickedInHtml(link);
  } catch (error) {
    console.error(error);
  }
}

function gdExpandArticle(id) {
  emitClickedEvent();
  elem = document.getElementById("gdarticlefrom-" + id);
  ico = document.getElementById("expandicon-" + id);
  art = document.getElementById("gdfrom-" + id);
  ev = window.event;
  t = null;
  if (ev) t = ev.target || ev.srcElement;
  if (elem.style.display == "inline") {
    elem.style.display = "none";
    ico.className = "gdexpandicon";
    art.className = art.className + " gdcollapsedarticle";
    nm = document.getElementById("gddictname-" + id);
    nm.style.cursor = "pointer";
    if (ev) ev.stopPropagation();
    ico.title = tr("Expand article");
    nm.title = "";
    articleview.collapseInHtml(id, true);
  } else if (elem.style.display == "none") {
    elem.style.display = "inline";
    ico.className = "gdcollapseicon";
    art.className = art.className.replace(" gdcollapsedarticle", "");
    nm = document.getElementById("gddictname-" + id);
    nm.style.cursor = "default";
    nm.title = "";
    ico.title = tr("Collapse article");
    articleview.collapseInHtml(id, false);
  }
}

function gdCheckArticlesNumber() {
  elems = document.getElementsByClassName("gddictname");
  if (elems.length == 1) {
    el = elems.item(0);
    s = el.id.replace("gddictname-", "");
    el = document.getElementById("gdfrom-" + s);
    if (el && el.className.search("gdcollapsedarticle") > 0) gdExpandArticle(s);
  }
}
