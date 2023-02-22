/*!
 * vssue - A vue-powered issue-based comment plugin
 *
 * @version v1.4.8
 * @link https://vssue.js.org
 * @license MIT
 * @copyright 2018-2021 meteorlxy
 */

import { Prop, Inject, Component, Vue as Vue$1, Watch, Provide } from 'vue-property-decorator';
import Vue from 'vue';
import { formatDateTime, getCleanURL } from '@vssue/utils';
import VueI18n from 'vue-i18n';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var script = Vue.extend({
    name: 'Iconfont',
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function (_h,_vm) {var _c=_vm._c;return _c('svg',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}]},[_c('symbol',{attrs:{"id":"vssue-icon-bitbucket","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M579.5522464 489.45249493q4.8371808 38.38537173-30.81752427 61.55702827t-67.95459093 3.66689493q-23.79580907-10.37653333-32.6119616-35.34262826t-0.31207573-50.01020907 31.67573333-35.34262827q21.92335253-11.00068587 44.1587808-7.33379093t39.00952427 21.61127573 16.77409493 41.1160384zM647.19476053 476.65737173q-8.50407573-65.22392427-68.8908192-99.9424t-120.07131413-7.9579424q-38.38537173 17.08617173-61.24495253 53.9111616t-21.0651424 78.95527574q2.41859093 55.4715424 47.20152426 94.48106666t100.87862827 34.1723424q55.4715424-4.8371808 92.60860907-51.18049493t30.50544746-102.43900907zM792.93434133 146.32472427q-12.17097173-16.4620192-34.1723424-27.15062827t-35.34262826-13.41927573-43.30057174-7.64586667q-177.33729493-28.63299093-345.00022826 1.24830507-26.2144 4.29104747-40.25782827 7.33379093t-33.54819093 13.41927573-30.50544747 26.2144q18.2564576 17.08617173 46.34331413 27.6967616t44.78293334 13.41927574 53.36502826 7.02171413q138.95192427 17.71032427 273.06666667 0.62415253 38.38537173-4.8371808 54.53531413-7.33379093t44.1587808-13.1072 45.7191616-28.32091413zM827.65281813 777.10872427q-4.8371808 15.83786667-9.44030506 46.65539093t-8.50407574 51.18049493-17.39824746 42.6764192-35.34262827 34.4064q-52.4288 29.2571424-115.46819093 43.61264747t-123.1140576 13.41927573-122.8019808-11.3127616q-28.0088384-4.8371808-49.69813334-11.00068586t-46.65539093-16.4620192-44.4708576-26.52647574-31.67573333-37.4491424q-15.21371413-58.51428587-34.71847574-177.96144746l3.66689494-9.7523808 11.00068586-5.46133334q135.9091808 90.1900192 308.72137174 90.1900192t309.34552426-90.1900192q12.79512427 3.66689493 14.5895616 14.04342827t-3.0427424 27.46270507-4.8371808 22.54750506zM937.97175147 191.41973333q-15.83786667 101.8148576-67.64251414 399.22346667-3.0427424 18.2564576-16.4620192 34.1723424t-26.52647573 24.3419424-33.23611413 18.88060907q-153.61950507 76.7707424-371.8387808 53.67710506-151.12289493-16.4620192-240.14262827-84.72868586-9.12822827-7.33379093-15.52579093-16.1499424t-10.37653334-21.2992-5.46133333-20.75306667-3.66689493-24.10788587-3.3548192-21.2992q-5.46133333-30.50544747-16.1499424-91.43832426t-17.08617174-98.4600384-14.35550506-89.8779424-13.41927574-96.27550507q1.7944384-15.83786667 10.68860907-29.5692192t19.19268587-22.8595808 27.46270506-18.2564576 28.0088384-13.73135253 29.2571424-11.3127616q76.22460907-28.0088384 190.75657174-39.00952427 231.0144-22.54750507 412.01859093 30.50544747 94.48106667 28.0088384 131.072 74.35215253 9.7523808 12.17097173 10.0644576 31.0515808t-3.3548192 32.9240384z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-gitea","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M184.31868985 236.10860742C106.94832667 235.94086648 3.32655508 285.13080468 9.02973665 408.46209936c8.93218827 192.65010787 206.32096845 210.5144844 285.20099725 212.06608453 8.63864186 36.14810496 101.48307766 160.77938883 170.21479898 167.32127321h301.09442177c180.57278288-11.99345499 315.77172611-546.07960359 215.54670217-548.09249109-165.7696721 7.79993906-264.02374305 11.74184405-348.27147151 12.41280591v166.69224585l-26.25140843-11.61603761-0.16773997-154.99233728c-96.70246985-0.04193548-181.83083757-4.52899687-343.4069947-12.49667687-20.21274496-0.12580547-48.39316992-3.5644886-78.67035236-3.64835859z m10.94507577 68.14462849h9.22573371c10.98701124 98.75729283 28.85138778 156.50200291 64.99949274 244.73357185-92.25734394-10.90314029-170.75995634-37.69970509-185.18564974-137.75698809-7.46445813-51.78991757 17.69663558-105.84433456 110.96042329-107.01851827z m358.83913087 97.07988723c6.29027343 0.08386999 12.70635233 1.25805468 18.74501482 4.02577499l31.40943263 13.54505513-22.51917887 41.05451824a28.18042496 25.03528825 0 0 0-10.10637297 1.59353561 28.18042496 25.03528825 0 0 0-16.98373825 32.038459 28.18042496 25.03528825 0 0 0 4.69673781 7.29671718l-38.83195528 70.70267333a28.18042496 25.03528825 0 0 0-9.30960467 1.59353659 28.18042496 25.03528825 0 0 0-16.98373825 32.038459 28.18042496 25.03528825 0 0 0 36.06423497 15.09665623 28.18042496 25.03528825 0 0 0 16.94180276-32.08039449 28.18042496 25.03528825 0 0 0-6.62575434-9.22573468l37.82551056-68.85752581a28.18042496 25.03528825 0 0 0 12.28700044-1.25805469 28.18042496 25.03528825 0 0 0 8.93218826-4.69673783c14.59343435 6.12253248 26.54495386 11.11281671 35.14166122 15.34826717 12.91602778 6.37414341 17.48696012 10.60959485 18.87082027 15.30633169 1.38386015 4.61286685-0.12580547 13.50312062-7.42252263 29.10299872-5.45157063 11.61603859-14.46762889 28.09655497-25.11915823 47.51253164a28.18042496 25.03528825 0 0 0-10.52572486 1.59353659 28.18042496 25.03528825 0 0 0-16.98373826 32.038459 28.18042496 25.03528825 0 0 0 36.06423498 15.09665623 28.18042496 25.03528825 0 0 0 16.94180278-32.03845901 28.18042496 25.03528825 0 0 0-5.74511608-8.47090188c10.52572388-19.20630122 19.58371762-35.72875308 25.41270465-48.14155897 7.88380904-16.85793279 11.99345499-29.39654416 8.38703091-41.51580463-3.60642311-12.11926046-14.67730434-20.0030695-29.35460966-27.25785217-9.6450856-4.73867233-21.68047607-9.77089106-36.06423399-15.80955357a28.18042496 25.03528825 0 0 0-1.59353562-10.022502 28.18042496 25.03528825 0 0 0-6.08059796-8.7644483l22.14176246-40.38355541 122.61839638 52.96410227c22.14176247 9.6031511 31.2836262 33.12877372 20.54822685 52.8382968l-84.28966393 154.32137544c-10.77733482 19.66758857-37.23841869 27.80300855-59.38018118 18.24179293l-173.48574115-74.98005927c-22.14176247-9.5612156-31.32556167-33.12877372-20.54822687-52.83829679l84.28966395-154.27943995c7.38058716-13.54505513 22.22563246-21.59660511 37.951317-22.22563246h2.68384935z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-gitee","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M978.404275 409.561604H455.061338c-25.117645 0-45.499734 20.382089-45.499734 45.499734l-0.031997 113.781333c0 25.117645 20.350092 45.499734 45.499734 45.531731h318.594132c25.117645 0 45.499734 20.382089 45.499734 45.499735v22.749867a136.5312 136.5312 0 0 1-136.5312 136.5312H250.248539a45.499734 45.499734 0 0 1-45.499734-45.499734V341.343999a136.5312 136.5312 0 0 1 136.5312-136.5312L978.308284 204.780802c25.117645 0 45.499734-20.350092 45.499734-45.467738L1023.904009 45.531731h0.031997A45.499734 45.499734 0 0 0 978.468269 0h-0.031997L341.343999 0.031997C152.84967 0.031997 0.031997 152.84967 0.031997 341.343999v637.092273c0 25.117645 20.382089 45.499734 45.499734 45.499734h671.233072a307.171203 307.171203 0 0 0 307.171203-307.171203v-261.671468c0-25.117645-20.382089-45.499734-45.499734-45.499734z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-github","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M512 20.4425c-278.334 0-504 225.6345-504 504 0 222.6735 144.4275 411.6105 344.673 478.233 25.2 4.662 34.461-10.9305 34.461-24.255 0-12.0015-0.4725-51.723-0.693-93.8385-140.238 30.492-169.8165-59.472-169.8165-59.472-22.932-58.2435-55.944-73.7415-55.944-73.7415-45.738-31.2795 3.465-30.6495 3.465-30.6495 50.589 3.5595 77.238 51.9435 77.238 51.9435 44.9505 77.049 117.9045 54.7785 146.664 41.895 4.5045-32.571 17.577-54.81 32.004-67.41-111.951-12.726-229.635-55.9755-229.635-249.0705 0-55.0305 19.6875-99.981 51.9435-135.2925-5.229-12.6945-22.491-63.945 4.8825-133.371 0 0 42.336-13.545 138.6315 51.66 40.194-11.1825 83.3175-16.758 126.1575-16.9785 42.8085 0.189 85.9635 5.796 126.252 16.9785 96.201-65.205 138.4425-51.66 138.4425-51.66 27.4365 69.426 10.1745 120.6765 4.9455 133.371 32.319 35.28 51.8805 80.262 51.8805 135.2925 0 193.5675-117.9045 236.187-230.139 248.6925 18.081 15.6555 34.1775 46.305 34.1775 93.3345 0 67.4415-0.5985 121.716-0.5985 138.3165 0 13.419 9.072 29.1375 34.6185 24.192 200.151-66.717 344.3895-255.5595 344.3895-478.17 0-278.3655-225.666-504-504-504z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-gitlab","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M66.61375986 405.11600042L512.11376028 976.03999972 23.84576 621.65599958a39.312 39.312 0 0 1-14.07600042-43.30799944l56.8080007-173.26800028z m259.88400014 0h371.26800014L512.14975986 976.03999972zM215.11376 60.88400042l111.384 344.232H66.61375986l111.384-344.232a19.72800014 19.72800014 0 0 1 37.11600014 0z m742.49999972 344.232l56.8080007 173.2679993a39.23999986 39.23999986 0 0 1-14.07600042 43.30800042l-488.26800028 354.38400014 445.50000042-570.92400028z m0 0h-259.88400014l111.384-344.232a19.72800014 19.72800014 0 0 1 37.11600014 0z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-loading","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M843.307 742.24c0 3.217 2.607 5.824 5.824 5.824s5.824-2.607 5.824-5.824a5.823 5.823 0 0 0-5.824-5.824 5.823 5.823 0 0 0-5.824 5.824zM714.731 874.912c0 6.398 5.186 11.584 11.584 11.584s11.584-5.186 11.584-11.584-5.186-11.584-11.584-11.584-11.584 5.186-11.584 11.584zM541.419 943.2c0 9.614 7.794 17.408 17.408 17.408s17.408-7.794 17.408-17.408-7.794-17.408-17.408-17.408-17.408 7.794-17.408 17.408z m-186.56-9.152c0 12.795 10.373 23.168 23.168 23.168s23.168-10.373 23.168-23.168-10.373-23.168-23.168-23.168-23.168 10.373-23.168 23.168zM189.355 849.12c0 16.012 12.98 28.992 28.992 28.992s28.992-12.98 28.992-28.992-12.98-28.992-28.992-28.992-28.992 12.98-28.992 28.992zM74.731 704.736c0 19.228 15.588 34.816 34.816 34.816s34.816-15.588 34.816-34.816-15.588-34.816-34.816-34.816-34.816 15.588-34.816 34.816z m-43.008-177.28c0 22.41 18.166 40.576 40.576 40.576s40.576-18.166 40.576-40.576-18.166-40.576-40.576-40.576-40.576 18.166-40.576 40.576z m35.392-176.128c0 25.626 20.774 46.4 46.4 46.4s46.4-20.774 46.4-46.4c0-25.626-20.774-46.4-46.4-46.4-25.626 0-46.4 20.774-46.4 46.4z m106.176-142.016c0 28.843 23.381 52.224 52.224 52.224s52.224-23.381 52.224-52.224c0-28.843-23.381-52.224-52.224-52.224-28.843 0-52.224 23.381-52.224 52.224z m155.904-81.344c0 32.024 25.96 57.984 57.984 57.984s57.984-25.96 57.984-57.984-25.96-57.984-57.984-57.984-57.984 25.96-57.984 57.984z m175.104-5.056c0 35.24 28.568 63.808 63.808 63.808s63.808-28.568 63.808-63.808c0-35.24-28.568-63.808-63.808-63.808-35.24 0-63.808 28.568-63.808 63.808z m160.32 72.128c0 38.421 31.147 69.568 69.568 69.568s69.568-31.147 69.568-69.568-31.147-69.568-69.568-69.568-69.568 31.147-69.568 69.568z m113.92 135.488c0 41.638 33.754 75.392 75.392 75.392s75.392-33.754 75.392-75.392-33.754-75.392-75.392-75.392-75.392 33.754-75.392 75.392z m45.312 175.488c0 44.854 36.362 81.216 81.216 81.216s81.216-36.362 81.216-81.216c0-44.854-36.362-81.216-81.216-81.216-44.854 0-81.216 36.362-81.216 81.216z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-like","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-unlike","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4-8.3-3.6-17.2-5.4-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81z m627.2 160.4H496.8l9.6 198.4c0.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7-19.6-0.1-36.9-13.4-42.2-32.3L329 459.2V172h415.4c20.4 9.2 33.6 29.4 33.6 51.8 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 19.1-11 37.5-28.8 48.4z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-heart","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-edit","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M723.2 917.76H286.72c-65.28 0-118.4-51.2-118.4-113.92V261.76C168.32 198.4 221.44 147.2 286.72 147.2h375.04c17.92 0 32 14.08 32 32s-14.08 32-32 32H286.72c-30.08 0-54.4 22.4-54.4 49.92v542.08c0 27.52 24.32 49.92 54.4 49.92H723.2c30.08 0 54.4-22.4 54.4-49.92V440.32c0-17.92 14.08-32 32-32s32 14.08 32 32v363.52c0 62.72-53.12 113.92-118.4 113.92z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M499.84 602.24c-7.68 0-14.72-2.56-21.12-7.68-13.44-11.52-14.72-32-3.2-45.44L780.16 198.4c11.52-13.44 32-14.72 45.44-3.2s14.72 32 3.2 45.44L524.16 591.36c-6.4 7.04-15.36 10.88-24.32 10.88z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-delete","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M677.647059 256l0-90.352941c0-37.436235-23.461647-60.235294-61.771294-60.235294L408.094118 105.411765c-38.249412 0-61.741176 22.799059-61.741176 60.235294l0 90.352941-180.705882 0 0 60.235294 60.235294 0 0 512c0 54.272 33.972706 90.352941 90.352941 90.352941l391.529412 0c55.085176 0 90.352941-33.490824 90.352941-90.352941l0-512 60.235294 0 0-60.235294L677.647059 256zM406.588235 165.647059l210.823529 0-1.264941 90.352941L406.588235 256 406.588235 165.647059zM737.882353 858.352941l-451.764706 0 0-542.117647 451.764706 0L737.882353 858.352941zM466.823529 376.470588l-58.729412 0-1.505882 391.529412 60.235294 0L466.823529 376.470588zM617.411765 376.470588l-60.235294 0 0 391.529412 60.235294 0L617.411765 376.470588z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-reply","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M426.666667 384 426.666667 213.333333 128 512 426.666667 810.666667 426.666667 635.733333C640 635.733333 789.333333 704 896 853.333333 853.333333 640 725.333333 426.666667 426.666667 384Z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-error","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"}})])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = true;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

var script$1 = Vue.extend({
    name: 'TransitionFade',
    functional: true,
    props: {
        group: {
            type: Boolean,
            required: false,
            default: false,
        },
        tag: {
            type: String,
            required: false,
            default: 'div',
        },
    },
    render(h, { props, children }) {
        return h(props.group ? 'TransitionGroup' : 'Transition', {
            props: {
                name: 'fade',
                mode: 'out-in',
                appear: true,
                tag: props.tag,
            },
        }, children);
    },
});

/* script */
const __vue_script__$1 = script$1;

/* template */

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

var script$2 = Vue.extend({
    name: 'VssueIcon',
    functional: true,
    props: {
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: null,
        },
    },
    render(h, { props, data }) {
        return h('svg', Object.assign(Object.assign({}, data), { class: ['vssue-icon', `vssue-icon-${props.name}`], attrs: {
                'aria-hidden': 'true',
            } }), [
            h('title', props.title),
            h('use', {
                attrs: {
                    'xlink:href': `#vssue-icon-${props.name}`,
                },
            }),
        ]);
    },
});

/* script */
const __vue_script__$2 = script$2;

/* template */

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = normalizeComponent(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueComment = class VssueComment extends Vue$1 {
    constructor() {
        super(...arguments);
        this.editMode = false;
        this.editContent = this.comment.contentRaw;
        this.creatingReactions = [];
        this.isPutingComment = false;
        this.isDeletingComment = false;
    }
    get currentUser() {
        return this.vssue.user ? this.vssue.user.username : null;
    }
    get content() {
        return this.comment.content;
    }
    get author() {
        return this.comment.author;
    }
    get createdAt() {
        return formatDateTime(this.comment.createdAt);
    }
    get updatedAt() {
        return formatDateTime(this.comment.updatedAt);
    }
    get showReactions() {
        return Boolean(this.vssue.API &&
            this.vssue.API.platform.meta.reactable &&
            this.comment.reactions &&
            !this.editMode);
    }
    get reactionKeys() {
        return ['heart', 'like', 'unlike'];
    }
    get editContentRows() {
        return this.editContent.split('\n').length - 1;
    }
    get editInputRows() {
        return this.editContentRows < 3 ? 5 : this.editContentRows + 2;
    }
    async postReaction({ reaction, }) {
        try {
            if (this.creatingReactions.includes(reaction))
                return;
            this.creatingReactions.push(reaction);
            const success = await this.vssue.postCommentReaction({
                commentId: this.comment.id,
                reaction,
            });
            if (!success) {
                this.vssue.$emit('error', new Error(this.vssue.$t('reactionGiven', {
                    reaction: this.vssue.$t(reaction),
                })));
            }
            // always refresh reactions even already given
            const reactions = await this.vssue.getCommentReactions({
                commentId: this.comment.id,
            });
            if (reactions) {
                this.comment.reactions = reactions;
            }
        }
        finally {
            this.creatingReactions.splice(this.creatingReactions.findIndex(item => item === reaction), 1);
        }
    }
    enterEdit() {
        this.editMode = true;
        this.$nextTick(() => {
            this.$refs.input.focus();
        });
    }
    resetEdit() {
        this.editMode = false;
        this.editContent = this.comment.contentRaw;
    }
    async putComment() {
        try {
            if (this.vssue.isPending)
                return;
            if (this.editContent !== this.comment.contentRaw) {
                this.isPutingComment = true;
                this.vssue.isUpdatingComment = true;
                const comment = await this.vssue.putComment({
                    commentId: this.comment.id,
                    content: this.editContent,
                });
                if (comment) {
                    this.vssue.comments.data.splice(this.vssue.comments.data.findIndex(item => item.id === this.comment.id), 1, comment);
                }
            }
            this.editMode = false;
        }
        finally {
            this.isPutingComment = false;
            this.vssue.isUpdatingComment = false;
        }
    }
    async deleteComment() {
        try {
            if (this.vssue.isPending)
                return;
            if (!window.confirm(this.vssue.$t('deleteConfirm')))
                return;
            this.isDeletingComment = true;
            this.vssue.isUpdatingComment = true;
            const success = await this.vssue.deleteComment({
                commentId: this.comment.id,
            });
            if (success) {
                // decrease count immediately
                this.vssue.comments.count -= 1;
                // if there are more than one comment on this page, remove the deleted comment immediately
                if (this.vssue.comments.data.length > 1) {
                    this.vssue.comments.data.splice(this.vssue.comments.data.findIndex(item => item.id === this.comment.id), 1);
                }
                // if the page count should be decreased, change the query param to trigger comments reload
                if (this.vssue.query.page > 1 &&
                    this.vssue.query.page >
                        Math.ceil(this.vssue.comments.count / this.vssue.query.perPage)) {
                    this.vssue.query.page -= 1;
                }
                else {
                    await this.vssue.getComments();
                }
            }
            else {
                this.vssue.$emit('error', new Error(this.vssue.$t('deleteFailed')));
            }
        }
        finally {
            this.isDeletingComment = false;
            this.vssue.isUpdatingComment = false;
        }
    }
};
__decorate([
    Prop({
        type: Object,
        required: true,
    })
], VssueComment.prototype, "comment", void 0);
__decorate([
    Inject()
], VssueComment.prototype, "vssue", void 0);
VssueComment = __decorate([
    Component({
        components: {
            VssueIcon: __vue_component__$2,
        },
    })
], VssueComment);
var script$3 = VssueComment;

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-comment",class:{
    'vssue-comment-edit-mode': _vm.editMode,
    'vssue-comment-disabled': _vm.isDeletingComment || _vm.isPutingComment,
  }},[_c('div',{staticClass:"vssue-comment-avatar"},[_c('a',{attrs:{"href":_vm.author.homepage,"title":_vm.author.username,"target":"_blank","rel":"noopener noreferrer"}},[_c('img',{attrs:{"src":_vm.author.avatar,"alt":_vm.author.username}})])]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-body"},[_vm._t("body",[_c('div',{staticClass:"vssue-comment-header"},[_c('span',{staticClass:"vssue-comment-author"},[_c('a',{attrs:{"href":_vm.author.homepage,"title":_vm.author.username,"target":"_blank","rel":"noopener noreferrer"}},[_vm._v("\n            "+_vm._s(_vm.author.username)+"\n          ")])]),_vm._v(" "),_c('span',{staticClass:"vssue-comment-created-at"},[_vm._v("\n          "+_vm._s(_vm.createdAt)+"\n        ")])]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-main"},[(_vm.editMode)?_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.editContent),expression:"editContent"}],ref:"input",staticClass:"vssue-edit-comment-input",attrs:{"rows":_vm.editInputRows},domProps:{"value":(_vm.editContent)},on:{"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }if(!$event.ctrlKey){ return null; }return _vm.putComment()},"input":function($event){if($event.target.composing){ return; }_vm.editContent=$event.target.value;}}}):_c('article',{staticClass:"markdown-body",domProps:{"innerHTML":_vm._s(_vm.content)}})]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-footer"},[(_vm.editMode)?_c('span',{staticClass:"vssue-comment-hint"},[_vm._v("\n          "+_vm._s(_vm.vssue.$t('editMode'))+"\n        ")]):_vm._e(),_vm._v(" "),(_vm.showReactions)?_c('span',{staticClass:"vssue-comment-reactions"},_vm._l((_vm.reactionKeys),function(reaction){return _c('span',{key:reaction,staticClass:"vssue-comment-reaction",attrs:{"title":_vm.vssue.$t(
                _vm.creatingReactions.includes(reaction) ? 'loading' : reaction
              )},on:{"click":function($event){return _vm.postReaction({ reaction: reaction })}}},[_c('VssueIcon',{attrs:{"name":_vm.creatingReactions.includes(reaction) ? 'loading' : reaction,"title":_vm.vssue.$t(
                  _vm.creatingReactions.includes(reaction) ? 'loading' : reaction
                )}}),_vm._v(" "),_c('span',{staticClass:"vssue-comment-reaction-number"},[_vm._v("\n              "+_vm._s(_vm.comment.reactions[reaction])+"\n            ")])],1)}),0):_vm._e(),_vm._v(" "),_c('span',{staticClass:"vssue-comment-operations"},[(_vm.comment.author.username === _vm.currentUser && _vm.editMode)?_c('span',{staticClass:"vssue-comment-operation",class:{ 'vssue-comment-operation-muted': _vm.isPutingComment },attrs:{"title":_vm.vssue.$t(_vm.isPutingComment ? 'loading' : 'submit')},on:{"click":function($event){return _vm.putComment()}}},[_c('VssueIcon',{directives:[{name:"show",rawName:"v-show",value:(_vm.isPutingComment),expression:"isPutingComment"}],attrs:{"name":"loading","title":_vm.vssue.$t('loading')}}),_vm._v("\n\n            "+_vm._s(_vm.vssue.$t('submit'))+"\n          ")],1):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser && _vm.editMode)?_c('span',{staticClass:"vssue-comment-operation vssue-comment-operation-muted",attrs:{"title":_vm.vssue.$t('cancel')},on:{"click":function($event){return _vm.resetEdit()}}},[_vm._v("\n            "+_vm._s(_vm.vssue.$t('cancel'))+"\n          ")]):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser)?_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){return _vm.enterEdit()}}},[_c('VssueIcon',{attrs:{"name":"edit","title":_vm.vssue.$t('edit')}})],1):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser || _vm.vssue.isAdmin)?_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){return _vm.deleteComment()}}},[_c('VssueIcon',{attrs:{"name":_vm.isDeletingComment ? 'loading' : 'delete',"title":_vm.vssue.$t(_vm.isDeletingComment ? 'loading' : 'delete')}})],1):_vm._e(),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){return _vm.vssue.$emit('reply-comment', _vm.comment)}}},[_c('VssueIcon',{attrs:{"name":"reply","title":_vm.vssue.$t('reply')}})],1)])])])],2)])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

let VssuePagination = class VssuePagination extends Vue$1 {
    get disabled() {
        return this.vssue.isPending;
    }
    get pageCount() {
        const pageCount = Math.ceil(this.vssue.comments.count / this.vssue.comments.perPage);
        return pageCount > 1 ? pageCount : 1;
    }
    get perPageOptions() {
        const perPageOptions = [5, 10, 20, 50];
        if (!perPageOptions.includes(this.vssue.options.perPage) &&
            this.vssue.options.perPage < 100) {
            perPageOptions.push(this.vssue.options.perPage);
        }
        return perPageOptions.sort((a, b) => a - b);
    }
    get page() {
        return this.vssue.query.page > this.pageCount
            ? this.pageCount
            : this.vssue.query.page;
    }
    set page(val) {
        if (val > 0 && val <= this.pageCount) {
            this.vssue.query.page = val;
        }
    }
    get perPage() {
        return this.vssue.query.perPage;
    }
    set perPage(val) {
        if (this.perPageOptions.includes(val)) {
            this.vssue.query.perPage = val;
        }
    }
};
__decorate([
    Inject()
], VssuePagination.prototype, "vssue", void 0);
VssuePagination = __decorate([
    Component({
        components: {
            VssueIcon: __vue_component__$2,
        },
    })
], VssuePagination);
var script$4 = VssuePagination;

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-pagination"},[_c('div',{staticClass:"vssue-pagination-per-page"},[_c('label',[_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.perPage),expression:"perPage"}],staticClass:"vssue-pagination-select",attrs:{"disabled":_vm.disabled},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.perPage=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},_vm._l((_vm.perPageOptions),function(val){return _c('option',{key:val,domProps:{"value":val}},[_vm._v("\n          "+_vm._s(val)+"\n        ")])}),0),_vm._v(" "),_c('span',[_vm._v("\n        "+_vm._s(_vm.vssue.$t('perPage'))+"\n      ")])]),_vm._v(" "),(_vm.vssue.API.platform.meta.sortable)?_c('span',{class:{
        'vssue-pagination-link': true,
        disabled: _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('sort')},on:{"click":function($event){_vm.vssue.query.sort = _vm.vssue.query.sort === 'asc' ? 'desc' : 'asc';}}},[_vm._v("\n      "+_vm._s(_vm.vssue.query.sort === 'asc' ? "↑" : "↓")+"\n    ")]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"vssue-pagination-page"},[_c('span',{class:{
        'vssue-pagination-link': true,
        disabled: _vm.page === 1 || _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('prev')},domProps:{"textContent":_vm._s("<")},on:{"click":function($event){_vm.page -= 1;}}}),_vm._v(" "),_c('label',[_c('span',[_vm._v("\n        "+_vm._s(_vm.vssue.$t('page'))+"\n      ")]),_vm._v(" "),_c('select',{directives:[{name:"show",rawName:"v-show",value:(_vm.pageCount > 1),expression:"pageCount > 1"},{name:"model",rawName:"v-model",value:(_vm.page),expression:"page"}],staticClass:"vssue-pagination-select",attrs:{"disabled":_vm.disabled},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.page=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},_vm._l((_vm.pageCount),function(val){return _c('option',{key:val,domProps:{"value":val}},[_vm._v("\n          "+_vm._s(val)+"\n        ")])}),0),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.pageCount < 2),expression:"pageCount < 2"}],domProps:{"textContent":_vm._s(_vm.page)}}),_vm._v(" "),_c('span',{domProps:{"textContent":_vm._s((" / " + _vm.pageCount + " "))}})]),_vm._v(" "),_c('span',{class:{
        'vssue-pagination-link': true,
        disabled: _vm.page === _vm.pageCount || _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('next')},domProps:{"textContent":_vm._s(">")},on:{"click":function($event){_vm.page += 1;}}})])])};
var __vue_staticRenderFns__$2 = [];

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueComments = class VssueComments extends Vue$1 {
};
__decorate([
    Inject()
], VssueComments.prototype, "vssue", void 0);
VssueComments = __decorate([
    Component({
        components: {
            TransitionFade: __vue_component__$1,
            VssueComment: __vue_component__$3,
            VssuePagination: __vue_component__$4,
        },
    })
], VssueComments);
var script$5 = VssueComments;

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-comments"},[_c('VssuePagination'),_vm._v(" "),_c('TransitionFade',{attrs:{"group":""}},_vm._l((_vm.vssue.comments.data),function(comment){return _c('VssueComment',{key:comment.id,attrs:{"comment":comment}})}),1),_vm._v(" "),_c('VssuePagination',{directives:[{name:"show",rawName:"v-show",value:(_vm.vssue.comments.data.length > 5),expression:"vssue.comments.data.length > 5"}]})],1)};
var __vue_staticRenderFns__$3 = [];

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

var script$6 = Vue.extend({
    name: 'VssueIcon',
    functional: true,
    props: {
        type: {
            type: String,
            required: false,
            default: 'default',
        },
    },
    render(h, { props, data, children }) {
        return h('button', Object.assign(Object.assign({}, data), { class: ['vssue-button', `vssue-button-${props.type}`] }), children);
    },
});

/* script */
const __vue_script__$6 = script$6;

/* template */

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = undefined;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = normalizeComponent(
    {},
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueNewComment = class VssueNewComment extends Vue$1 {
    constructor() {
        super(...arguments);
        this.content = '';
    }
    get user() {
        return this.vssue.user;
    }
    get platform() {
        return this.vssue.API && this.vssue.API.platform.name;
    }
    get isInputDisabled() {
        return this.loading || this.user === null || this.vssue.issue === null;
    }
    get isSubmitDisabled() {
        return (this.content === '' || this.vssue.isPending || this.vssue.issue === null);
    }
    get loading() {
        return this.vssue.isCreatingComment;
    }
    get contentRows() {
        return this.content.split('\n').length - 1;
    }
    get inputRows() {
        return this.contentRows < 3 ? 5 : this.contentRows + 2;
    }
    created() {
        this.vssue.$on('reply-comment', comment => {
            const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ');
            const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`;
            this.content = this.content.concat(replyContent);
            this.focus();
        });
    }
    beforeDestroy() {
        this.vssue.$off('reply-comment');
    }
    focus() {
        this.$refs.input.focus();
    }
    async submit() {
        if (this.isSubmitDisabled)
            return;
        await this.vssue.postComment({ content: this.content });
        this.content = '';
        await this.vssue.getComments();
    }
};
__decorate([
    Inject()
], VssueNewComment.prototype, "vssue", void 0);
VssueNewComment = __decorate([
    Component({
        components: {
            VssueButton: __vue_component__$6,
            VssueIcon: __vue_component__$2,
        },
    })
], VssueNewComment);
var script$7 = VssueNewComment;

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-new-comment"},[_c('div',{staticClass:"vssue-comment-avatar"},[(_vm.user)?_c('a',{attrs:{"href":_vm.user.homepage,"title":_vm.user.username,"target":"_blank","rel":"noopener noreferrer"}},[_c('img',{attrs:{"src":_vm.user.avatar,"alt":_vm.user.username}})]):_c('VssueIcon',{attrs:{"name":_vm.platform.toLowerCase(),"title":_vm.vssue.$t('loginToComment', { platform: _vm.platform })},on:{"click":function($event){return _vm.vssue.login()}}})],1),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-body"},[_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.content),expression:"content"}],ref:"input",staticClass:"vssue-new-comment-input",attrs:{"rows":_vm.inputRows,"disabled":_vm.isInputDisabled,"placeholder":_vm.vssue.$t(_vm.user ? 'placeholder' : 'noLoginPlaceHolder'),"spellcheck":false,"aria-label":"leave a comment"},domProps:{"value":(_vm.content)},on:{"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }if(!$event.ctrlKey){ return null; }return _vm.submit()},"input":function($event){if($event.target.composing){ return; }_vm.content=$event.target.value;}}})]),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-footer"},[(_vm.user)?_c('span',{staticClass:"vssue-current-user"},[_c('span',[_vm._v(_vm._s(_vm.vssue.$t('currentUser'))+" - "+_vm._s(_vm.user.username)+" - ")]),_vm._v(" "),_c('a',{staticClass:"vssue-logout",on:{"click":function($event){return _vm.vssue.logout()}}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t('logout'))+"\n      ")])]):_c('span',{staticClass:"vssue-current-user"},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('loginToComment', { platform: _vm.platform }))+"\n    ")]),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-operations"},[(_vm.user)?_c('VssueButton',{staticClass:"vssue-button-submit-comment",attrs:{"type":"primary","disabled":_vm.isSubmitDisabled},on:{"click":function($event){return _vm.submit()}}},[_c('VssueIcon',{directives:[{name:"show",rawName:"v-show",value:(_vm.loading),expression:"loading"}],attrs:{"name":"loading"}}),_vm._v("\n\n        "+_vm._s(_vm.vssue.$t(_vm.loading ? 'submitting' : 'submitComment'))+"\n      ")],1):_c('VssueButton',{staticClass:"vssue-button-login",attrs:{"type":"primary","title":_vm.vssue.$t('loginToComment', { platform: _vm.platform })},on:{"click":function($event){return _vm.vssue.login()}}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t('login', { platform: _vm.platform }))+"\n      ")])],1)])])};
var __vue_staticRenderFns__$4 = [];

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$7 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueNotice = class VssueNotice extends Vue$1 {
    constructor() {
        super(...arguments);
        // progress data
        this.progress = {
            show: false,
            percent: 0,
            timer: null,
            speed: 200,
        };
        // alert data
        this.alert = {
            show: false,
            message: null,
            timer: null,
        };
    }
    /**
     * Show progress when loading comments
     */
    onLoadingCommentsChange(val) {
        if (this.vssue.comments) {
            if (val) {
                this.progressStart();
            }
            else {
                this.progressDone();
            }
        }
    }
    created() {
        this.vssue.$on('error', e => this.alertShow(e.message));
    }
    beforeDestroy() {
        this.vssue.$off('error');
        if (this.progress.timer !== null)
            window.clearTimeout(this.progress.timer);
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
    }
    /**
     * Progress start
     */
    progressStart() {
        this.progress.show = true;
        this.progress.percent = 0;
        this.progress.timer = window.setInterval(() => {
            this.progress.percent += 5;
            if (this.progress.percent > 94) {
                if (this.progress.timer !== null)
                    window.clearInterval(this.progress.timer);
            }
        }, this.progress.speed);
    }
    /**
     * Progress stop
     */
    progressDone() {
        this.progress.percent = 100;
        if (this.progress.timer !== null)
            window.clearTimeout(this.progress.timer);
        this.progress.timer = null;
        window.setTimeout(() => {
            this.progress.show = false;
        }, this.progress.speed);
    }
    /**
     * Show alert message
     */
    alertShow(content) {
        this.alert.show = true;
        this.alert.message = content;
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
        this.alert.timer = window.setTimeout(() => {
            this.alertHide();
        }, 3000);
    }
    /**
     * Hide alert message
     */
    alertHide() {
        this.alert.show = false;
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
        this.alert.timer = null;
    }
};
__decorate([
    Inject()
], VssueNotice.prototype, "vssue", void 0);
__decorate([
    Watch('vssue.isLoadingComments')
], VssueNotice.prototype, "onLoadingCommentsChange", null);
VssueNotice = __decorate([
    Component({
        components: {
            TransitionFade: __vue_component__$1,
        },
    })
], VssueNotice);
var script$8 = VssueNotice;

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-notice"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.progress.show),expression:"progress.show"}],staticClass:"vssue-progress",style:({
      width: ((_vm.progress.percent) + "%"),
      transition: ("all " + (_vm.progress.speed) + "ms linear"),
    })}),_vm._v(" "),_c('TransitionFade',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.alert.show),expression:"alert.show"}],staticClass:"vssue-alert",domProps:{"textContent":_vm._s(_vm.alert.message)},on:{"click":function($event){return _vm.alertHide()}}})])],1)};
var __vue_staticRenderFns__$5 = [];

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$8 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueStatus = class VssueStatus extends Vue$1 {
    get status() {
        if (this.vssue.isFailed) {
            return 'failed';
        }
        else if (this.vssue.isInitializing) {
            return 'initializing';
        }
        else if (this.vssue.isIssueNotCreated && !this.vssue.isCreatingIssue) {
            if (this.vssue.isAdmin || !this.vssue.isLogined) {
                return 'issueNotCreated';
            }
            else {
                return 'failed';
            }
        }
        else if (this.vssue.isLoginRequired) {
            return 'loginRequired';
        }
        else if (!this.vssue.comments || this.vssue.isCreatingIssue) {
            return 'loadingComments';
        }
        else if (this.vssue.comments.data.length === 0) {
            return 'noComments';
        }
        else {
            return null;
        }
    }
    handleClick() {
        if (this.status === 'issueNotCreated') {
            this.vssue.postIssue();
        }
        else if (this.status === 'loginRequired') {
            this.vssue.login();
        }
    }
};
__decorate([
    Inject()
], VssueStatus.prototype, "vssue", void 0);
VssueStatus = __decorate([
    Component({
        components: {
            TransitionFade: __vue_component__$1,
            VssueIcon: __vue_component__$2,
        },
    })
], VssueStatus);
var script$9 = VssueStatus;

/* script */
const __vue_script__$9 = script$9;

/* template */
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('TransitionFade',[(_vm.status)?_c('div',{key:_vm.status,staticClass:"vssue-status"},[(['failed', 'loadingComments', 'initializing'].includes(_vm.status))?_c('VssueIcon',{attrs:{"name":_vm.status === 'failed' ? 'error' : 'loading'}}):_vm._e(),_vm._v(" "),_c('p',{staticClass:"vssue-status-info"},[_c(['issueNotCreated', 'loginRequired'].includes(_vm.status) ? 'a' : 'span',{tag:"Component",on:{"click":_vm.handleClick}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t(_vm.status))+"\n      ")])],1)],1):_vm._e()])};
var __vue_staticRenderFns__$6 = [];

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$9 = normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueBody = class VssueBody extends Vue$1 {
};
__decorate([
    Inject()
], VssueBody.prototype, "vssue", void 0);
VssueBody = __decorate([
    Component({
        components: {
            TransitionFade: __vue_component__$1,
            VssueIcon: __vue_component__$2,
            VssueComments: __vue_component__$5,
            VssueNewComment: __vue_component__$7,
            VssueNotice: __vue_component__$8,
            VssueStatus: __vue_component__$9,
        },
    })
], VssueBody);
var script$a = VssueBody;

/* script */
const __vue_script__$a = script$a;

/* template */
var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('TransitionFade',[(!_vm.vssue.isInitializing)?_c('div',{staticClass:"vssue-body"},[(_vm.vssue.API)?_c('VssueNewComment'):_vm._e(),_vm._v(" "),_c('VssueNotice'),_vm._v(" "),_c('TransitionFade',[(_vm.vssue.comments && _vm.vssue.comments.data.length > 0)?_c('VssueComments'):_c('VssueStatus')],1)],1):_c('VssueStatus')],1)};
var __vue_staticRenderFns__$7 = [];

  /* style */
  const __vue_inject_styles__$a = undefined;
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$a = normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    false,
    undefined,
    undefined,
    undefined
  );

let VssueHeader = class VssueHeader extends Vue$1 {
};
__decorate([
    Inject()
], VssueHeader.prototype, "vssue", void 0);
VssueHeader = __decorate([
    Component
], VssueHeader);
var script$b = VssueHeader;

/* script */
const __vue_script__$b = script$b;

/* template */
var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-header"},[_c('a',{staticClass:"vssue-header-comments-count",attrs:{"href":_vm.vssue.issue ? _vm.vssue.issue.link : null,"target":"_blank","rel":"noopener noreferrer"}},[_c('span',[_vm._v("\n      "+_vm._s(_vm.vssue.comments
          ? _vm.vssue.$tc('comments', _vm.vssue.comments.count, {
              count: _vm.vssue.comments.count,
            })
          : _vm.vssue.$tc('comments', 0))+"\n    ")])]),_vm._v(" "),_c('span',{staticClass:"vssue-header-powered-by"},[_c('span',[_vm._v("Powered by")]),_vm._v(" "),(_vm.vssue.API)?_c('span',[_c('a',{attrs:{"href":_vm.vssue.API.platform.link,"title":((_vm.vssue.API.platform.name) + " API " + (_vm.vssue.API.platform.version)),"target":"_blank","rel":"noopener noreferrer"}},[_vm._v("\n        "+_vm._s(_vm.vssue.API.platform.name)+"\n      ")]),_vm._v(" "),_c('span',[_vm._v("&")])]):_vm._e(),_vm._v(" "),_c('a',{attrs:{"href":"https://github.com/meteorlxy/vssue","title":("Vssue v" + (_vm.vssue.version)),"target":"_blank","rel":"noopener noreferrer"}},[_vm._v("\n      Vssue\n    ")])])])};
var __vue_staticRenderFns__$8 = [];

  /* style */
  const __vue_inject_styles__$b = undefined;
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$b = normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    false,
    undefined,
    undefined,
    undefined
  );

const messages = {
    // auth
    login: 'Login with {platform}',
    logout: 'Logout',
    currentUser: 'Current User',
    // comment input
    loading: 'Loading',
    submit: 'Submit',
    submitting: 'Submitting',
    submitComment: 'Submit Comment',
    cancel: 'Cancel',
    edit: 'Edit',
    editMode: 'Edit Mode',
    delete: 'Delete',
    reply: 'Reply',
    // reactions
    heart: 'Heart',
    like: 'Like',
    unlike: 'Unlike',
    // pagination
    perPage: 'Comments per page',
    sort: 'Click to change the sort direction',
    page: 'Page',
    prev: 'Previous Page',
    next: 'Next Page',
    // hint
    comments: 'Comments | {count} Comment | {count} Comments',
    loginToComment: 'Login with {platform} account to leave a comment',
    placeholder: 'Leave a comment. Styling with Markdown is supported. Ctrl + Enter to submit.',
    noLoginPlaceHolder: 'Login to leave a comment. Styling with Markdown is supported. ',
    // status
    failed: 'Failed to load comments',
    initializing: 'Initializing...',
    issueNotCreated: 'Click to create issue',
    loadingComments: 'Loading comments...',
    loginRequired: 'Login to view comments',
    noComments: 'No comments yet. Leave the first comment !',
    // alerts
    reactionGiven: `Already given '{reaction}' reaction`,
    deleteConfirm: 'Confirm to delete this comment ?',
    deleteFailed: 'Failed to delete comment',
};

const messages$1 = {
    // auth
    login: '使用 {platform} 登录',
    logout: '退出登录',
    currentUser: '当前用户',
    // comment input
    loading: '加载中',
    submit: '提交',
    submitting: '发表中',
    submitComment: '发表评论',
    cancel: '取消',
    edit: '编辑',
    editMode: '编辑模式',
    delete: '删除',
    reply: '回复',
    // reactions
    heart: '喜欢',
    like: '赞',
    unlike: '踩',
    // pagination
    perPage: '每页评论数',
    sort: '点击改变排序方式',
    page: '页数',
    prev: '上一页',
    next: '下一页',
    // hint
    comments: '评论 | {count} 条评论 | {count} 条评论',
    loginToComment: '使用 {platform} 帐号登录后发表评论',
    placeholder: '留下你的评论丨支持 Markdown 语法丨Ctrl + Enter 发表评论',
    noLoginPlaceHolder: '登录后才能发表评论丨支持 Markdown 语法',
    // status
    failed: '评论加载失败',
    initializing: '正在初始化...',
    issueNotCreated: '点击创建 Issue',
    loadingComments: '正在加载评论...',
    loginRequired: '登录后查看评论',
    noComments: '还没有评论，来发表第一条评论吧！',
    // alerts
    reactionGiven: `已经添加过 '{reaction}' 了`,
    deleteConfirm: '确认要删除该评论吗？',
    deleteFailed: '评论删除失败',
};

const messages$2 = {
    // auth
    login: 'Entrar com {platform}',
    logout: 'Sair',
    currentUser: 'Usuário Atual',
    // comment input
    loading: 'Carregando',
    submit: 'Enviar',
    submitting: 'Enviando',
    submitComment: 'Enviar Comentário',
    cancel: 'Cancelar',
    edit: 'Editar',
    editMode: 'Modo de Edição',
    delete: 'Apagar',
    reply: 'Responder',
    // reactions
    heart: 'Heart',
    like: 'Like',
    unlike: 'Unlike',
    // pagination
    perPage: 'Comentários por página',
    sort: 'Clique para alterar a ordenação',
    page: 'Página',
    prev: 'Página Anterior',
    next: 'Próxima Página',
    // hint
    comments: 'Comentários | {count} Comentário | {count} Comentários',
    loginToComment: 'Entre com uma conta {platform} para deixar um comentário',
    placeholder: 'Deixe um comentário. Estilos com Markdown suportados. Ctrl + Enter para enviar.',
    noLoginPlaceHolder: 'Entre para deixar um comentário. Estilos com Markdown suportados. ',
    // status
    failed: 'Falha ao carregar comentários',
    initializing: 'Inicializando...',
    issueNotCreated: 'Click to create issue',
    loadingComments: 'Carregando comentários...',
    loginRequired: 'Entrar para visualizar comentários',
    noComments: 'Nenhum comentário. Deixe o primeiro comentário!',
    // alerts
    reactionGiven: `Já reagiu com '{reaction}'`,
    deleteConfirm: 'Apagar este comentário?',
    deleteFailed: 'Falha ao apagar comentário',
};

const messages$3 = {
    // auth
    login: '{platform} でログイン',
    logout: 'ログアウト',
    currentUser: '現在のユーザー',
    // comment input
    loading: '読み込み中',
    submit: '送信',
    submitting: '送信中',
    submitComment: 'コメントを送信',
    cancel: 'キャンセル',
    edit: '編集',
    editMode: '編集モード',
    delete: '削除',
    reply: '返信',
    // reactions
    heart: 'ハート',
    like: '高評価',
    unlike: '低評価',
    // pagination
    perPage: 'コメント/ページ',
    sort: '並び順を変更するにはクリックしてください',
    page: 'ページ',
    prev: '前のページ',
    next: '次のページ',
    // hint
    comments: 'コメント | {count} コメント | {count} コメント',
    loginToComment: 'コメントを残すには {platform} アカウントでログインしてください。',
    placeholder: 'コメントを残してください。Markdown 記法をサポートしています。 Ctrl + Enter で送信できます。',
    noLoginPlaceHolder: 'コメントを残すにはログインしてください。マークダウン記法をサポートしています。',
    // status
    failed: 'コメントの読み込みに失敗しました',
    initializing: '初期化中...',
    issueNotCreated: 'Click to create issue',
    loadingComments: 'コメントの読み込み中...',
    loginRequired: 'コメントを見るにはログインしてください',
    noComments: 'まだコメントがありません。最初のコメントを残しましょう！',
    // alerts
    reactionGiven: `既に '{reaction}' のリアクションをしています`,
    deleteConfirm: '本当にコメントを削除してもいいですか？',
    deleteFailed: 'コメントの削除に失敗しました',
};

const messages$4 = {
    // auth
    login: 'התחברו עם {platform}',
    logout: 'התנתקו',
    currentUser: 'משתמש/ת נוכחי/ת',
    // comment input
    loading: 'טוען',
    submit: 'שליחה',
    submitting: 'שולח',
    submitComment: 'שליחת תגובה',
    cancel: 'ביטל',
    edit: 'עריכה',
    editMode: 'מצב עריכה',
    delete: 'מחיקה',
    reply: 'תשובה',
    // reactions
    heart: 'לב',
    like: 'לייק',
    unlike: 'אנלייק',
    // pagination
    perPage: 'תגובות לדף',
    sort: 'לחצו כדי לשנות את כיוון המיון',
    page: 'דף',
    prev: 'הדף הקודם',
    next: 'הדף הבא',
    // hint
    comments: 'תגובות | {count} תגובה | {count} תגובות',
    loginToComment: 'התחברו עם חשבון {platform} כדי להשאיר תגובה',
    placeholder: 'השאירו תגובה. יש תמיכה בעיצוב בעזרת Markdown. Ctrl + Enter כדי לשלוח.',
    noLoginPlaceHolder: 'התחברו כדי להשאיר תגובה. יש תמיכה בעיצוב בעזרת Markdown. ',
    // status
    failed: 'כשלון בטעינת התגובות',
    initializing: 'מאתחל...',
    issueNotCreated: 'לחצו ליצירת issue',
    loadingComments: 'טוען תגובות...',
    loginRequired: 'התחברו כדי לצפות בתגובות',
    noComments: 'עדיין אין תגובות. השאירו תגובה ראשונה !',
    // alerts
    reactionGiven: `כבר ניתן חיווי '{reaction}'`,
    deleteConfirm: 'בטוחים במחיקת התגובה ?',
    deleteFailed: 'כשלון במחיקת התגובה',
};

if (!Object.prototype.hasOwnProperty.call(Vue, '$i18n')) {
    Vue.use(VueI18n);
}
const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: messages,
        'en-US': messages,
        zh: messages$1,
        'zh-CN': messages$1,
        pt: messages$2,
        'pt-BR': messages$2,
        ja: messages$3,
        'ja-JP': messages$3,
        he: messages$4,
        'he-IL': messages$4,
    },
});

let VssueStore = class VssueStore extends Vue$1 {
    constructor() {
        super(...arguments);
        this.title = options => `${options.prefix}${document.title}`;
        this.issueId = null;
        this.options = null;
        this.API = null;
        this.accessToken = null;
        this.user = null;
        this.issue = null;
        this.comments = null;
        this.query = {
            page: 1,
            perPage: 10,
            sort: 'desc',
        };
        this.isInitializing = true;
        this.isIssueNotCreated = false;
        this.isLoginRequired = false;
        this.isFailed = false;
        this.isCreatingIssue = false;
        this.isLoadingComments = false;
        this.isCreatingComment = false;
        this.isUpdatingComment = false;
    }
    get version() {
        return "1.4.8";
    }
    get issueTitle() {
        if (this.options === null) {
            return '';
        }
        return typeof this.title === 'function'
            ? this.title(this.options)
            : `${this.options.prefix}${this.title}`;
    }
    get isPending() {
        return (this.isLoadingComments || this.isCreatingComment || this.isUpdatingComment);
    }
    get isLogined() {
        return this.accessToken !== null && this.user !== null;
    }
    get isAdmin() {
        return (this.options !== null &&
            this.accessToken !== null &&
            this.user !== null &&
            (this.user.username === this.options.owner ||
                this.options.admins.includes(this.user.username)));
    }
    /**
     * the key of access token for local storage
     */
    get accessTokenKey() {
        return this.API
            ? `Vssue.${this.API.platform.name.toLowerCase()}.access_token`
            : '';
    }
    onQueryPerPageChange() {
        this.query.page = 1;
        this.getComments();
    }
    onQueryChange() {
        this.getComments();
    }
    /**
     * Set options of Vssue
     */
    setOptions(options) {
        this.options = Object.assign({
            labels: ['Vssue'],
            state: 'Vssue',
            prefix: '[Vssue]',
            admins: [],
            perPage: 10,
            proxy: (url) => `https://cors-anywhere.azm.workers.dev/${url}`,
            issueContent: ({ url }) => url,
            autoCreateIssue: false,
        }, options);
        // check options
        const requiredOptions = ['api', 'owner', 'repo', 'clientId'];
        for (const opt of requiredOptions) {
            if (!this.options[opt]) {
                console.warn(`[Vssue] the option '${opt}' is required`);
            }
        }
        // set locale
        if (this.options.locale) {
            this.$i18n.locale = this.options.locale;
        }
        else {
            const locales = Object.keys(this.$i18n.messages);
            const navLangs = window.navigator.languages;
            this.$i18n.locale =
                navLangs.filter(item => locales.includes(item)).shift() || 'en';
        }
    }
    /**
     * Initialization
     */
    async init() {
        try {
            // init VssueStore
            await this.initStore();
            // init comments
            await this.initComments();
        }
        catch (e) {
            if (e.response && [401, 403].includes(e.response.status)) {
                // in some cases, require login to load comments
                this.isLoginRequired = true;
            }
            else {
                this.isFailed = true;
            }
            console.error(e);
        }
    }
    /**
     * Init VssueStore
     */
    async initStore() {
        try {
            if (!this.options)
                throw new Error('Options are required to initialize Vssue');
            // reset data
            this.API = null;
            this.accessToken = null;
            this.user = null;
            this.issue = null;
            this.comments = null;
            this.query = {
                page: 1,
                perPage: this.options.perPage,
                sort: 'desc',
            };
            // reset status
            this.isInitializing = true;
            this.isIssueNotCreated = false;
            this.isLoginRequired = false;
            this.isFailed = false;
            this.isCreatingIssue = false;
            this.isLoadingComments = false;
            this.isCreatingComment = false;
            this.isUpdatingComment = false;
            // get the VssueAPI instance according to the options.api
            const APIConstructor = this.options.api;
            this.API = new APIConstructor({
                baseURL: this.options.baseURL,
                labels: this.options.labels,
                state: this.options.state,
                owner: this.options.owner,
                repo: this.options.repo,
                clientId: this.options.clientId,
                clientSecret: this.options.clientSecret,
                proxy: this.options.proxy,
            });
            // handle authorization
            await this.handleAuth();
        }
        finally {
            this.isInitializing = false;
        }
    }
    /**
     * Init comments
     */
    async initComments() {
        if (!this.API || !this.options)
            return;
        if (this.issueId) {
            // if issueId is set, get the issue and comments in the mean time
            // notice that vssue will not try to create the issue is not found
            const [issue, comments] = await Promise.all([
                this.API.getIssue({
                    accessToken: this.accessToken,
                    issueId: this.issueId,
                }),
                this.API.getComments({
                    accessToken: this.accessToken,
                    issueId: this.issueId,
                    query: this.query,
                }),
            ]);
            this.issue = issue;
            this.comments = comments;
        }
        else {
            // get issue according to title
            this.issue = await this.API.getIssue({
                accessToken: this.accessToken,
                issueTitle: this.issueTitle,
            });
            if (this.issue === null) {
                // if the issue of this page does not exist
                this.isIssueNotCreated = true;
                // try to create issue when `autoCreateIssue = true`
                if (this.options.autoCreateIssue) {
                    await this.postIssue();
                }
            }
            else {
                // try to load comments
                await this.getComments();
            }
        }
    }
    /**
     * Post a new issue
     */
    async postIssue() {
        if (!this.API || !this.options || this.issue || this.issueId)
            return;
        // login to create issue
        if (!this.isLogined) {
            this.login();
        }
        // only owner/admins can create issue
        if (!this.isAdmin)
            return;
        try {
            this.isCreatingIssue = true;
            const issue = await this.API.postIssue({
                title: this.issueTitle,
                content: await this.options.issueContent({
                    options: this.options,
                    url: getCleanURL(window.location.href),
                }),
                accessToken: this.accessToken,
            });
            this.issue = issue;
            this.isIssueNotCreated = false;
            await this.getComments();
        }
        catch (e) {
            this.isFailed = true;
        }
        finally {
            this.isCreatingIssue = false;
        }
    }
    /**
     * Get comments of this vssue according to the issue id
     */
    async getComments() {
        try {
            if (!this.API || !this.issue || this.isLoadingComments)
                return;
            this.isLoadingComments = true;
            const comments = await this.API.getComments({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                query: this.query,
            });
            this.comments = comments;
            if (this.query.page !== comments.page) {
                this.query.page = comments.page;
            }
            if (this.query.perPage !== comments.perPage) {
                this.query.perPage = comments.perPage;
            }
            return comments;
        }
        catch (e) {
            if (e.response &&
                [401, 403].includes(e.response.status) &&
                !this.isLogined) {
                this.isLoginRequired = true;
            }
            else {
                this.$emit('error', e);
                throw e;
            }
        }
        finally {
            this.isLoadingComments = false;
        }
    }
    /**
     * Post a new comment
     */
    async postComment({ content, }) {
        try {
            if (!this.API || !this.issue || this.isCreatingComment)
                return;
            this.isCreatingComment = true;
            const comment = await this.API.postComment({
                accessToken: this.accessToken,
                content,
                issueId: this.issue.id,
            });
            return comment;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
        finally {
            this.isCreatingComment = false;
        }
    }
    /**
     * Edit a comment
     */
    async putComment({ commentId, content, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const comment = await this.API.putComment({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
                content,
            });
            return comment;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Delete a new comment
     */
    async deleteComment({ commentId, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const success = await this.API.deleteComment({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
            });
            return success;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Get reactions of a comment
     */
    async getCommentReactions({ commentId, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const reactions = await this.API.getCommentReactions({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
            });
            return reactions;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Create a new reaction to a certain comment
     */
    async postCommentReaction({ commentId, reaction, }) {
        try {
            if (!this.API || !this.issue)
                return false;
            const success = await this.API.postCommentReaction({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
                reaction,
            });
            return success;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Redirect to the platform's authorization page
     */
    login() {
        if (!this.API)
            return;
        this.API.redirectAuth();
    }
    /**
     * Clean the access token stored in local storage
     */
    logout() {
        this.setAccessToken(null);
        this.user = null;
    }
    /**
     * Handle authorization and set access_token
     */
    async handleAuth() {
        if (!this.API)
            return;
        // handle authorize and try to get the access_token
        const accessToken = await this.API.handleAuth();
        if (accessToken) {
            // new access_token
            this.setAccessToken(accessToken);
            this.user = await this.API.getUser({ accessToken });
        }
        else if (this.getAccessToken()) {
            // have access_token in localstorage
            this.user = await this.API.getUser({ accessToken: this.accessToken });
        }
        else {
            // no access_token
            this.setAccessToken(null);
            this.user = null;
        }
    }
    /**
     * Get access token from local storage
     */
    getAccessToken() {
        this.accessToken = window.localStorage.getItem(this.accessTokenKey);
        return this.accessToken;
    }
    /**
     * Save access token to local storage
     */
    setAccessToken(token) {
        if (token === null) {
            window.localStorage.removeItem(this.accessTokenKey);
        }
        else {
            window.localStorage.setItem(this.accessTokenKey, token);
        }
        this.accessToken = token;
    }
};
__decorate([
    Watch('query.perPage')
], VssueStore.prototype, "onQueryPerPageChange", null);
__decorate([
    Watch('query.page'),
    Watch('query.sort')
], VssueStore.prototype, "onQueryChange", null);
VssueStore = __decorate([
    Component({ i18n })
], VssueStore);
var VssueStore$1 = VssueStore;

let Vssue = class Vssue extends Vue$1 {
    constructor() {
        super(...arguments);
        /**
         * Provide the VssueStore for the child components
         */
        this.vssue = new VssueStore$1();
    }
    /**
     * Set options of Vssue if `options` prop is changed
     */
    onOptionsChange(options) {
        this.vssue.setOptions(options);
    }
    /**
     * mounted hook
     */
    mounted() {
        // set issue title and issue id
        if (this.title !== null) {
            this.vssue.title = this.title;
        }
        if (this.issueId !== null) {
            this.vssue.issueId = this.issueId;
        }
        // set options
        this.vssue.setOptions(this.options);
        // init vssue
        this.vssue.init();
    }
};
__decorate([
    Prop({
        type: [String, Function],
        required: false,
        default: null,
    })
], Vssue.prototype, "title", void 0);
__decorate([
    Prop({
        type: [String, Number],
        required: false,
        default: null,
    })
], Vssue.prototype, "issueId", void 0);
__decorate([
    Prop({
        type: Object,
        required: false,
        default: () => ({}),
    })
], Vssue.prototype, "options", void 0);
__decorate([
    Provide('vssue')
], Vssue.prototype, "vssue", void 0);
__decorate([
    Watch('options', { deep: true })
], Vssue.prototype, "onOptionsChange", null);
Vssue = __decorate([
    Component({
        components: {
            Iconfont: __vue_component__,
            VssueBody: __vue_component__$a,
            VssueHeader: __vue_component__$b,
        },
    })
], Vssue);
var script$c = Vssue;

/* script */
const __vue_script__$c = script$c;

/* template */
var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue"},[_c('Iconfont'),_vm._v(" "),_c('VssueHeader'),_vm._v(" "),_c('VssueBody')],1)};
var __vue_staticRenderFns__$9 = [];

  /* style */
  const __vue_inject_styles__$c = undefined;
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$c = normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    false,
    undefined,
    undefined,
    undefined
  );

const VssuePlugin = {
    get version() {
        return "1.4.8";
    },
    installed: false,
    install(Vue, options) {
        if (this.installed) {
            return false;
        }
        this.installed = true;
        Vue.component('Vssue', {
            functional: true,
            props: {
                title: {
                    type: String,
                    required: false,
                    default: undefined,
                },
                issueId: {
                    type: [Number, String],
                    required: false,
                    default: undefined,
                },
                options: {
                    type: Object,
                    required: false,
                    default: undefined,
                },
            },
            render(h, { data, props }) {
                return h(__vue_component__$c, Object.assign(Object.assign({}, data), { props: {
                        title: props.title,
                        issueId: props.issueId,
                        options: Object.assign({}, options, props.options),
                    } }));
            },
        });
    },
    VssueComponent: __vue_component__$c,
};

export default VssuePlugin;
export { __vue_component__$c as VssueComponent };
