'use strict';

class ABHaze {
    constructor() {
        window.abDataLayer = [];
    }
    setAB(selector, saveCookie, eventArray) {
        try {
            var containerObj = document.querySelectorAll(selector);
            if (containerObj && containerObj.length) {
                let cookieValue = this.readCookie(`ABHaze_${selector}`);
                let selectedIndex = !cookieValue ? Math.floor(Math.random() * containerObj.length) : parseInt(cookieValue);
                containerObj.forEach((item, index) => {
                    if (item.dataset.testCaseId) {
                        if (index !== selectedIndex) {
                            item.remove();
                        } else {
                            this.setABListener(item, selector, eventArray, item.dataset.testCaseId);
                        }
                    } else {
                        throw new Error(`Initialization error for ${selector}`);
                    }

                });
                if (saveCookie && !cookieValue) {
                    this.saveCookie(selector, selectedIndex);
                }
            }
        } catch (e) {
            console.dir(e);
        }
    }
    saveCookie(selector, variantID) {
        document.cookie = `ABHaze_${selector}=${variantID}`;
    }
    readCookie(selector) {
        let cookieName = selector + '=';
        let cookieArray = document.cookie.split(';');
        let cookieValue;
        for (let i = 0; i < cookieArray.length; i++) {
            cookieValue = cookieArray[i];
            while (cookieValue.charAt(0) === ' ') {
                cookieValue = cookieValue.substring(1, cookieValue.length);
            }
            if (cookieValue.indexOf(cookieName) === 0) {
                return cookieValue.substring(cookieName.length, cookieValue.length);
            }
        }
        return null;
    }
    setABListener(item, selector, eventArray, testCaseId) {
        const viewEventType = 'view';
        let viewEventListener = () => {
            if (this.elementInViewport(item)) {
                window.abDataLayer.push({
                    viewEventType,
                    selector,
                    testCaseId
                });
                window.removeEventListener('load', viewEventListener);
                window.removeEventListener('scroll', viewEventListener);
            }
        };
        window.addEventListener('load', viewEventListener);
        window.addEventListener('scroll', viewEventListener);
        eventArray.forEach((eventType) => {
            let eventListener = () => {
                window.abDataLayer.push({
                    eventType,
                    selector,
                    testCaseId
                });
            };
            window.addEventListener(eventType, eventListener);
        });
    }
    elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }
}

module.exports = ABHaze;
