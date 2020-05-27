'use strict';

class ABHaze {
    constructor(siteID, siteSecret, mode, customSessionUserId) {
        const REQUEST_URL = siteID
            ? mode === 'PRODUCTION'
                ? `https://diploma-ab.herokuapp.com/api/containers/save?siteID=${siteID}`
                : `http://localhost:4000/api/containers/save?siteID=${siteID}`
            : null;
        window.abDataLayer = {
            eventsHistory: [],
            eventAnalytics: [],
            containersArray: []
        };
        window.onbeforeunload = () => {
            if (REQUEST_URL) {
                console.dir(`Request URL = ${REQUEST_URL}`);
                if (!this.readCookie('ABUserSessionId')) {
                    const userSessionId = customSessionUserId || Date.now() + Math.random().toString(36).substring(7);
                    document.cookie = `ABUserSessionId=${userSessionId}`;
                }
                window.abDataLayer.userSessionId = this.readCookie('ABUserSessionId');
                window.abDataLayer.sessionId = Date.now() + Math.random().toString(36).substring(7);
                window.abDataLayer.userDevice = this.deviceDetection();
                window.abDataLayer.userClient = navigator.userAgent;
                window.abDataLayer.siteSecret = siteSecret;
                const blob = new Blob([JSON.stringify(window.abDataLayer)], {type: 'application/json'});
                navigator.sendBeacon(REQUEST_URL, blob);
            }
        };
    }
    setAB(selector, targetSelector, saveCookie) {
        if (!targetSelector) {
            targetSelector = selector;
        }
        const eventArray = ['click', 'mouseenter'];
        try {
            var containerObj = document.querySelectorAll(selector);
            if (containerObj && containerObj.length) {
                let containerInfoObj = {
                    selector,
                    targetSelector
                };
                let cookieValue = this.readCookie(`ABHaze_${selector}`);
                let selectedIndex = !cookieValue ? Math.floor(Math.random() * containerObj.length) : parseInt(cookieValue);
                containerObj.forEach((item, index) => {
                    if (item.dataset.testCaseId) {
                        if (index !== selectedIndex) {
                            item.remove();
                        } else {
                            if (!containerInfoObj.containerDescription && item.dataset.containerDescription) {
                                containerInfoObj.containerDescription = item.dataset.containerDescription;
                            }
                            this.setABListener(item, selector, eventArray, item.dataset.testCaseId, targetSelector);
                        }
                    } else {
                        throw new Error(`Initialization error for ${selector}`);
                    }

                });
                if (saveCookie && !cookieValue) {
                    this.saveCookie(selector, selectedIndex);
                }
                window.abDataLayer.containersArray.push(containerInfoObj);
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
    setABListener(item, selector, eventArray, testCaseId, targetSelector) {
        const viewEventType = 'view';
        let viewEventListener = () => {
            if (this.elementInViewport(item)) {
                window.abDataLayer.eventsHistory.push({
                    eventType: viewEventType,
                    selector,
                    testCaseId,
                    targetSelector
                });
                window.removeEventListener('load', viewEventListener);
                window.removeEventListener('scroll', viewEventListener);
                this.updateEventAnalytics(selector, 'view');
            }
        };
        window.addEventListener('load', viewEventListener);
        window.addEventListener('scroll', viewEventListener);
        const eventAnalyticsObject = {
            selector,
            targetSelector,
            testCaseId,
            view: false
        };
        if (eventArray.includes('click')) {
            eventAnalyticsObject.click = false;
        }
        if (eventArray.includes('mouseenter')) {
            eventAnalyticsObject.mouseover = false;
        }
        window.abDataLayer.eventAnalytics.push(eventAnalyticsObject);
        eventArray.forEach((eventType) => {
            let eventListener = () => {
                window.abDataLayer.eventsHistory.push({
                    eventType,
                    selector,
                    testCaseId,
                    targetSelector
                });
                this.updateEventAnalytics(selector, eventType);
            };
            const targetElementCollection = document.getElementsByClassName(selector.substr(1));
            if (targetElementCollection.length) {
                targetElementCollection[0].addEventListener(eventType, eventListener);
            }
        });
    }
    updateEventAnalytics(selector, eventType) {
        if (eventType === 'mouseenter') {
            eventType = 'mouseover';
        }
        window.abDataLayer.eventAnalytics.forEach((event) => {
            if (event.selector === selector) {
                event[eventType] = true;
            }
        });
    }
    elementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        return (vertInView && horInView);
    }
    deviceDetection() {
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            return 'mobile';
        }
        return 'desktop';
    }
}

module.exports = ABHaze;
