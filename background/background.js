/** @description 백그라운드 작업 처리 */
class BackgroundService {
    activeTabsMap = new Map();
    portMap = new Map();

    constructor() {
        this.removeContextMenu();
        this.setupContextMenu();
        this.setupNavigationListener();
        this.setupPortListener();
    }

    /** @description 페이지 네비게이션 이벤트 리스너 설정 */
    setupNavigationListener() {
        chrome.webNavigation.onCommitted.addListener(async ({ tabId, frameId }) => {
            if (frameId === 0) {
                this.activeTabsMap.set(tabId, false);
                await this.ensureScriptInjected(tabId);
            }
        });

        chrome.webNavigation.onCompleted.addListener(({ tabId, frameId }) => {
            if (frameId === 0) this.activeTabsMap.set(tabId, true);
        });
    }

    /** @description Port 리스너 설정 */
    setupPortListener() {
        chrome.runtime.onConnect.addListener(port => {
            if (port.name === "translator-connection") {
                const tabId = port.sender.tab.id;

                // 기존 포트 정리
                if (this.portMap.has(tabId))
                    try { this.portMap.get(tabId).disconnect(); } catch (e) { }

                this.portMap.set(tabId, port);
                port.onDisconnect.addListener(() => this.portMap.delete(tabId));
            }
        });
    }

    /** @description 컨텍스트 메뉴 설정 및 클릭 핸들러 등록 */
    setupContextMenu() {
        try {
            chrome.contextMenus.create({
                id: "translate",
                title: "선택한 텍스트 번역",
                contexts: ["selection"]
            },
            () => {
                if (chrome.runtime.lastError)
                    console.error("컨텍스트 메뉴 생성 실패(setupContextMenu):", chrome.runtime.lastError);
            });
        } catch (error) {
            console.error("컨텍스트 메뉴 설정 실패(setupContextMenu):", error);
        }

        chrome.contextMenus.onClicked.addListener(async (info, tab) => {
            if (info.menuItemId === "translate")
                await this.handleTranslation(info.selectionText, tab.id);
        });
    }

    /** @description 기존 컨텍스트 메뉴 제거 */
    removeContextMenu() {
        chrome.contextMenus.removeAll();
    }

    /**
     * @description Content Script 주입 상태 확인 및 필요시 주입
     * @param {number} tabId 탭 ID
     * @returns {Promise<boolean>} 주입 성공 여부
     */
    async ensureScriptInjected(tabId) {
        try {
            if (!await this.isAccessibleUrl(tabId)) {
                console.log("접근 불가능한 탭 건너뛰기:", tabId);
                return false;
            }

            const isReady = await this.pingContentScript(tabId);
            if (!isReady) {
                await this.injectContentScript(tabId);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return true;
        } catch (error) {
            console.error("컨텐츠 스크립트 주입 확인 실패(ensureScriptInjected):", error);
            return false;
        }
    }

    /**
     * @description Content Script 수동 주입
     * @param {number} tabId 탭 ID
     */
    async injectContentScript(tabId) {
        try {
            if (!await this.isAccessibleUrl(tabId)) {
                console.log("접근 불가능한 탭 건너뛰기(injectContentScript):", tabId);
                return;
            }

            /** @description 의존성 순서대로 스크립트 주입 */
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["utils/storage.js"]
            });
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["utils/api.js"]
            });
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["utils/translator.js"]
            });
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content/content.js"]
            });
            await chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ["content/content.css"]
            });
        } catch (error) {
            console.error("컨텐츠 스크립트 주입 실패(injectContentScript):", error);
            throw error;
        }
    }



    /**
     * @description URL 접근 가능 여부 확인
     * @param {number} tabId 탭 ID
     * @returns {Promise<boolean>} 접근 가능 여부
     */
    async isAccessibleUrl(tabId) {
        try {
            const tab = await chrome.tabs.get(tabId);
            return tab?.url && !tab.url.startsWith("chrome://");
        } catch (error) {
            console.log("탭 접근 확인 실패(isAccessibleUrl):", error);
            return false;
        }
    }

    /**
     * @description Content Script 존재 여부 확인
     * @param {number} tabId 탭 ID
     * @returns {Promise<boolean>} Content Script 상태
     */
    async pingContentScript(tabId) {
        return new Promise(resolve => {
            chrome.tabs.sendMessage(tabId, { action: "ping" }, response => {
                if (chrome.runtime.lastError) resolve(false);
                else if (response?.pong) resolve(true);
                else resolve(false);
            });
        });
    }



    /**
     * @description 번역 처리 핸들러
     * @param {string} text 번역할 텍스트
     * @param {number} tabId 탭 ID
     */
    async handleTranslation(text, tabId) {
        try {
            if (!await this.isAccessibleUrl(tabId)) {
                console.log("접근 불가능한 탭 건너뛰기:", tabId);
                return;
            }

            await this.ensureScriptInjected(tabId);
            await this.sendTranslationMessage(text, tabId);
        } catch (error) {
            console.error("번역 실패(handleTranslation):", error);
        }
    }

    /**
     * @description 번역 메시지 전송
     * @param {string} text 번역할 텍스트
     * @param {number} tabId 탭 ID
     * @returns {Promise<boolean>} 메시지 전송 성공 여부
     */
    async sendTranslationMessage(text, tabId) {
        return new Promise(resolve => {
            chrome.tabs.sendMessage(tabId, {
                action: "translate",
                text: text
            },
            _ => {
                if (chrome.runtime.lastError) {
                    if (chrome.runtime.lastError.message.includes("back/forward cache")) {
                        console.warn("메시지 채널이 닫힘(sendTranslationMessage):", chrome.runtime.lastError.message);
                        resolve(false);
                    } else {
                        console.error("메시지 전송 실패(sendTranslationMessage):", chrome.runtime.lastError);
                        resolve(false);
                    }
                } else resolve(true);
            });
        });
    }
}

const backgroundService = new BackgroundService();