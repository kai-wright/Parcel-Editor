// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"3Hldv":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "4499344825656288";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"63vsb":[function(require,module,exports) {
var _editorBase = require("./editor_base");
var _regexes = require("./regexes");
// Empty add id manager
const ADD_ID = document.getElementById("resource_add_id");
const ADD_BUTTON = document.getElementById("resource_add_button");
const RESOURCE_PANEL = document.getElementById("show_panel");
const RESOURCE_INFORMATION = document.getElementById("resource_information");
const SAVED_INDICATOR = document.getElementById("saved_indicator");
// == Register editor ==
class ResourceEditorClass extends (0, _editorBase.BaseEditorClass) {
    init() {
        super.init();
        this.renderResourcePanel();
        this.updateSaveStatus();
    }
    update() {
        super.update();
        this.renderResourcePanel();
        this.updateSaveStatus();
    }
    generateEmptyParcel(id, name) {
        return {
            id: id,
            type: "resource",
            name: name,
            description: "",
            symbol: "",
            minvalue: 0,
            maxvalue: 0,
            onUnlock: [],
            onReach: []
        };
    }
    create() {
        if (!this.confirmChangestateSave()) {
            console.log("Cannot create parcel, was unable to save currently loaded parcel");
            return false;
        }
        if (!(0, _regexes.regex_id).test(ADD_ID.value)) {
            alert("Invalid ID");
            return false;
        }
        this.current = this.generateEmptyParcel(ADD_ID.value, ADD_ID.value.replace("_", " "));
        ADD_ID.value = "";
        this.save();
        console.log(`Created ${this.current.id}`);
        this.update();
        return true;
    }
    updateSaveStatus() {
        if (this.isSaved) SAVED_INDICATOR.className = "saved";
        else SAVED_INDICATOR.className = "unsaved";
    }
    checkValidToSave() {
        if (!super.checkValidToSave()) return false;
        if (!(0, _regexes.regex_id).test(this.current.id)) {
            console.warn(`Given invalid ID: ${this.current.id} to save`);
            return false;
        }
        if (!(0, _regexes.regex_name).test(this.current.name)) {
            console.warn(`Given invalid Name: ${this.current.name} to save`);
            return false;
        }
        return true;
    }
    clearRender() {
        RESOURCE_PANEL.innerHTML = "";
        RESOURCE_INFORMATION.innerHTML = "";
        this.renderResourcePanel();
    }
    renderResourcePanel() {
        RESOURCE_PANEL.innerHTML = "";
        for(let i = 0; i < this.resources.length; i++){
            const button = document.createElement("button");
            button.innerHTML = this.resources[i];
            button.addEventListener("click", ()=>{
                console.log(this.resources[i]);
                this.load(this.resources[i]);
                this.renderResouceInformation();
            });
            RESOURCE_PANEL.appendChild(button);
        }
    }
    renderResouceInformation() {
        // If this.current is undefined, return
        if (this.current === undefined) {
            console.warn("No resource loaded");
            return;
        }
        // Generate a set of inputs for the resource
        RESOURCE_INFORMATION.innerHTML = "";
        const tlpanel = document.createElement("div");
        tlpanel.id = "tlpanel";
        const trpanel = document.createElement("div");
        trpanel.id = "trpanel";
        const bpanel = document.createElement("div");
        bpanel.id = "bpanel";
        // ID
        tlpanel.appendChild(this.generateTextInput("id", "ID", [
            "notEmpty",
            "regexId",
            "readonly"
        ]));
        // Name
        tlpanel.appendChild(this.generateTextInput("name", "Name", [
            "spellcheck",
            "notEmpty",
            "regexName"
        ]));
        // Symbol
        tlpanel.appendChild(this.generateTextInput("symbol", "Symbol"));
        // Description
        tlpanel.appendChild(this.generateTextArea("description", "Description", [
            "spellcheck"
        ]));
        // Min Value
        tlpanel.appendChild(this.generateNumberInput("minvalue", "Min Value", [
            "notEmpty"
        ]));
        // Max Value
        tlpanel.appendChild(this.generateNumberInput("maxvalue", "Max Value", [
            "notEmpty"
        ]));
        // On Unlock
        // On Reach
        // Delete button
        bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));
        RESOURCE_INFORMATION.appendChild(tlpanel);
        RESOURCE_INFORMATION.appendChild(trpanel);
        RESOURCE_INFORMATION.appendChild(bpanel);
    }
    constructor(...args){
        super(...args);
        this.editorType = "resource";
        this.editorVersion = 1;
    }
}
// == Initialize editor ==
// Initialize editor, begin loading process and attach editor to window
const editor = new ResourceEditorClass();
editor.init();
window.editor = editor;
ADD_ID.addEventListener("input", ()=>{
    if (ADD_ID.value === "") ADD_ID.classList.add("empty");
    else ADD_ID.classList.remove("empty");
});
ADD_BUTTON.addEventListener("click", ()=>{
    editor.create();
});
SAVED_INDICATOR.addEventListener("click", ()=>{
    editor.save();
});
// =! Development Utilities =!
function generateExamples() {
    let names = [
        "ore_iron",
        "ore_copper",
        "ore_gold",
        "ingot_iron",
        "ingot_copper",
        "ingot_gold"
    ];
    for(let i = 0; i < names.length; i++){
        editor.current = editor.generateEmptyParcel(`example_${names[i]}`, names[i].replace("_", " "));
        editor.save();
    }
} // generateExamples();

},{"./editor_base":"1NhWR","./regexes":"lpqDe"}],"1NhWR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "BaseEditorClass", ()=>BaseEditorClass);
var _logging = require("./logging");
var _regexes = require("./regexes");
class BaseEditorClass {
    init() {
        console.log(`Parcel Editor Version ${(0, _logging.editor_version)} - Starting up.\nLoading ${this.editorType} editor - Version ${this.editorVersion}`);
        this.checkStorage();
        this.logStorageCount();
        this.logStorage();
    }
    update() {
        this.checkStorage();
    }
    checkStorage() {
        this.parcels = [];
        for(let i = 0; i < localStorage.length; i++){
            if (!(0, _regexes.regex_id_full).test(localStorage.key(i))) continue;
            this.parcels.push(localStorage.key(i));
        }
        this.sortStorage();
    }
    sortStorage() {
        this.parcels.sort((a, b)=>a.localeCompare(b));
        // Assign all "resource:" to this.resources
        this.resources = this.parcels.filter((id)=>id.startsWith("resource:"));
        // Assign all "structure:" to this.structures
        this.structures = this.parcels.filter((id)=>id.startsWith("structure:"));
        // Assign all "research:" to this.research
        this.research = this.parcels.filter((id)=>id.startsWith("research:"));
        // Assign all "unique:" to this.unique
        this.unique = this.parcels.filter((id)=>id.startsWith("unique:"));
        // Assign all "interaction:" to this.interactions
        this.interactions = this.parcels.filter((id)=>id.startsWith("interaction:"));
        // Assign all "event:" to this.events
        this.events = this.parcels.filter((id)=>id.startsWith("event:"));
    }
    logStorage() {
        console.table({
            Resources: this.resources,
            Structures: this.structures,
            Research: this.research,
            Unique: this.unique,
            Interactions: this.interactions,
            Events: this.events
        });
    }
    logStorageCount() {
        console.table({
            Total: [
                this.parcels.length
            ],
            Resources: [
                this.resources.length
            ],
            Structures: [
                this.structures.length
            ],
            Research: [
                this.research.length
            ],
            Unique: [
                this.unique.length
            ],
            Interactions: [
                this.interactions.length
            ],
            Events: [
                this.events.length
            ]
        });
    }
    save() {
        if (!this.checkValidToSave()) {
            console.warn("Parcel is not valid and cannot be saved");
            // Fail
            return false;
        }
        // Get the full id
        const fullId = `${this.editorType}:${this.current.id}`;
        // Clear delayed saving
        if (this.saveTimeout) clearTimeout(this.saveTimeout); // Clear the previous timeout if it exists
        // Save it
        localStorage.setItem(fullId, JSON.stringify(this.current));
        // Update saved state and saved status
        this.isSaved = true;
        this.updateSaveStatus();
        // Log saved
        console.info(`Saved ${fullId}`);
        // Success
        return true;
    }
    checkValidToSave() {
        if (this.current === undefined) {
            console.warn("No parcel loaded, not saving");
            return false;
        }
        const fullId = `${this.editorType}:${this.current.id}`;
        // Validate the full id
        if (!(0, _regexes.regex_id_full).test(fullId)) {
            console.warn(`Given invalid full ID: ${fullId} to save`);
            return false;
        }
        // All checks passed
        return true;
    }
    delayedSave() {
        this.isSaved = false; // Reset isSaved to false
        if (this.saveTimeout) clearTimeout(this.saveTimeout); // Clear the previous timeout if it exists
        this.saveTimeout = window.setTimeout(()=>{
            this.save();
        }, 5000);
        this.updateSaveStatus();
    }
    confirmChangestateSave() {
        if (this.current === undefined) // If there is nothing to save, we can continue
        return true;
        if (!this.save()) {
            if (confirm("Unable to save, are you sure you would like to continue?")) // Unable to save but continue anyway
            return true;
            else // Unable to save, not continuing
            return false;
        } else // Saved and can continue
        return true;
    }
    load(full_id) {
        if (!this.confirmChangestateSave()) // Has object loaded, isn't saved, and cannot be saved for some reason.
        // User does not want to continue
        return false;
        // If the ID is invalid, don't load
        if ((0, _regexes.regex_id_full).test(full_id) === false) {
            console.warn(`Given invalid full ID: ${full_id} to load`);
            return false;
        }
        // If this is the wrong type of editor, don't load
        if (full_id.startsWith(this.editorType) === false) {
            console.warn(`Given wrong editor type: ${full_id} to load\n Expected: ${this.editorType}`);
            return false;
        }
        // Load it from storage into tempParcel
        let tempParcel = JSON.parse(localStorage.getItem(full_id));
        // If it doesn't exist, don't load
        if (tempParcel === null) {
            console.warn(`Given parcel doesn't exist: ${full_id} to load`);
            return false;
        }
        let baseParcel = this.generateEmptyParcel(tempParcel.id, "Undefined Name");
        Object.assign(baseParcel, tempParcel);
        this.current = baseParcel;
        return true;
    }
    delete(full_id) {
        if ((0, _regexes.regex_id_full).test(full_id) === false) {
            console.warn(`Given invalid full ID: ${full_id} to delete`);
            return false;
        }
        if (this.current !== undefined && `${this.current.type}:${this.current.id}` === full_id) {
            this.current = undefined;
            this.clearRender();
        }
        localStorage.removeItem(full_id);
        console.log(`Deleted ${full_id}`);
        this.update();
        return true;
    }
    registerInvalid(full_id) {
        if ((0, _regexes.regex_id_full).test(full_id) === false) {
            console.warn(`Given invalid full ID: ${full_id} to register as invalid`);
            return false;
        }
        let knownInvalids = JSON.parse(localStorage.getItem("editor_knownInvalids") || "[]");
        knownInvalids.push([
            full_id,
            true
        ]);
        return true;
    }
    generateTextInput(property, property_name, properties = []) {
        const wrapper = document.createElement("div");
        const label = document.createElement("label");
        label.innerHTML = property_name;
        const text = document.createElement("input");
        text.value = this.current[property];
        text.addEventListener("input", ()=>{
            this.current[property] = text.value;
            this.delayedSave();
        });
        // Special properties
        if (properties.includes("spellcheck")) text.spellcheck = true;
        if (properties.includes("notEmpty")) {
            text.minLength = 1;
            text.required = true;
        }
        if (properties.includes("readonly")) text.readOnly = true;
        if (properties.includes("regexId")) text.pattern = "[a-z]([a-z_]*[a-z])?";
        else if (properties.includes("regexName")) text.pattern = "[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?";
        wrapper.appendChild(label);
        wrapper.appendChild(text);
        return wrapper;
    }
    generateTextArea(property, property_name, properties = []) {
        const wrapper = document.createElement("div");
        const label = document.createElement("label");
        label.innerHTML = property_name;
        const text = document.createElement("textarea");
        text.value = this.current[property];
        text.rows = 4;
        text.addEventListener("input", ()=>{
            this.current[property] = text.value;
            this.delayedSave();
        });
        // Special properties
        if (properties.includes("spellcheck")) text.spellcheck = true;
        if (properties.includes("notEmpty")) {
            text.minLength = 1;
            text.required = true;
        }
        if (properties.includes("readonly")) text.readOnly = true;
        wrapper.appendChild(label);
        wrapper.appendChild(text);
        return wrapper;
    }
    generateNumberInput(property, property_name, properties = []) {
        const wrapper = document.createElement("div");
        const label = document.createElement("label");
        label.innerHTML = property_name;
        const text = document.createElement("input");
        text.type = "number";
        text.value = this.current[property];
        text.addEventListener("input", ()=>{
            this.current[property] = Number(text.value);
            this.delayedSave();
        });
        // Special properties
        if (properties.includes("notNegative")) text.min = "0";
        else if (properties.includes("notZero")) text.min = "1";
        if (properties.includes("notEmpty")) text.required = true;
        wrapper.appendChild(label);
        wrapper.appendChild(text);
        return wrapper;
    }
    generateDeleteButton(full_id) {
        const wrapper = document.createElement("div");
        wrapper.className = "delete";
        const button = document.createElement("button");
        button.innerHTML = "Delete";
        button.addEventListener("click", ()=>{
            this.delete(full_id);
        });
        wrapper.append(button);
        return wrapper;
    }
    constructor(){
        this.isSaved = true;
        // List of all parcels information
        this.parcels = [];
        // List of each type of parcel
        this.resources = [];
        this.structures = [];
        this.research = [];
        this.unique = [];
        // List of interactions and events
        this.interactions = [];
        this.events = [];
    }
}

},{"./logging":"fCHXf","./regexes":"lpqDe","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fCHXf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "editor_version", ()=>editor_version);
const editor_version = "7.1.2";

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"lpqDe":[function(require,module,exports) {
// ? regexID --> Contains only lowercase letters and underscores, cannot start or end with an underscore
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "regex_id", ()=>regex_id);
parcelHelpers.export(exports, "regex_name", ()=>regex_name);
parcelHelpers.export(exports, "regex_id_full", ()=>regex_id_full);
const regex_id = new RegExp("^[a-z]([a-z_]*[a-z])?$");
const regex_name = new RegExp("^[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?$");
const regex_id_full = new RegExp(`^(resource|structure|research|unique|interaction|event)\:(([a-z]([a-z_]*[a-z])?))$`);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["3Hldv","63vsb"], "63vsb", "parcelRequirea313")

//# sourceMappingURL=resource.25656288.js.map