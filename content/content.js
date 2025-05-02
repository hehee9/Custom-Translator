if (!window.TranslatorUI) {
    /**
     * @class TranslatorUI
     * @description 번역 UI 및 이벤트 처리
     */
    class TranslatorUI {
        isInitialized = false;
        port = null;
        attempts = 0;
        maxAttempts = 3;
        destroyed = false;
        lastScrollY = window.scrollY;
        isTextInput = false;
        selectedText = "";
        currentSelection = null;
        requested = false;
        streamingStarted = false;
        messageHandler = null;
        dragEndX = null;
        dragEndY = null;
        skipNextClick = false;
        skipTimeout = null;
        popupOrigin = null;

        button = null;
        result = null;

        translationActive = false;
        loadingPosX = 0;
        textAlignment = "left";

        constructor() {
            this.init();
            window.addEventListener("pagehide", this.handlePageHide);
        }

        /**
         * @static
         * @description 이모지 구성 확인
         * @param {string} text 검사할 문자열
         * @returns {boolean} 이모지뿐이면 true
         */
        static isEmoji(text) {
            const emojiRegex = /^(?:\p{Extended_Pictographic}(?:\uFE0F)?)+$/u;
            return emojiRegex.test(text);
        }

        /**
         * @description 동적 팝업 최대 너비 계산
         * - ≤50자: 75%
         * - 50자 ~ 300자: 선형 보간으로 100~200%
         * - 300자 이상: 200%
         * @param {string} text 표시 텍스트
         * @param {number} [baseWidth=400] 기본 최대폭 (px)
         * @returns {number} 계산된 최대폭 (px)
         */
        getMaxWidth(text, baseWidth = 400) {
            const len = text.length;
            let newWidth;
            if (len <= 50) newWidth = baseWidth * 0.75;
            else if (len < 300) {
                const ratio = (len - 50) / 250;  // 0 ~ 1 사이 값
                newWidth = baseWidth + ratio * baseWidth;
            } else newWidth = baseWidth * 2;
            return newWidth;
        }



        /**
         * @description 노드 재귀 순회 텍스트 및 이모지(IMG alt) 누적
         * @param {Node} node 순회 노드
         * @returns {string} 누적된 텍스트
         * @private
         */
        _extractText(node) {
            if (node.nodeType === Node.TEXT_NODE) return node.textContent;
            else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === "IMG") {
                    const altText = node.getAttribute("alt")?.trim() || "";
                    return altText && TranslatorUI.isEmoji(altText) ? altText : "";
                }
                return Array.from(node.childNodes)
                    .map(child => this._extractText(child))
                    .join("");
            }
            return "";
        }

        /**
         * @description 선택 영역 팝업 위치 및 최대 너비 계산
         * @param {string} content 표시 텍스트
         * @returns {Object} { posX, posY, newMaxWidth }
         * @private
         */
        _computePopupPosition(content) {
            const offsetX = 10, offsetY = 10;
            let { posX, posY } = this._getPopupPosition(offsetX, offsetY);
            const viewportWidth = window.innerWidth;
            const naturalMaxWidth = this.getMaxWidth(content);
            const newMaxWidth = Math.min(naturalMaxWidth, viewportWidth - 20);

            let adjustedPosX = posX;
            if (adjustedPosX + newMaxWidth > window.scrollX + viewportWidth)
                adjustedPosX = Math.max(10, window.scrollX + viewportWidth - newMaxWidth - 10);
            return { posX: adjustedPosX, posY, newMaxWidth };
        }

        /**
         * @description 팝업 요소(result) 스타일 적용
         * @param {string} content 표시 텍스트
         * @private
         */
        _applyPopupStyle(content) {
            const { posX, posY, newMaxWidth } = this._computePopupPosition(content);
            Object.assign(this.result.style, {
                position: "absolute",
                maxWidth: `${newMaxWidth}px`,
                maxHeight: "300px",
                overflowY: "auto",
                display: "block",
                top: `${posY}px`,
                left: `${posX}px`,
                color: "var(--text-color, black)",
                textAlign: this.textAlignment || "left",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word"
            });
            this.result.innerHTML = content;
        }



        /**
         * @description body 준비 대기
         * @returns {Promise<void>}
         */
        waitForBody() {
            if (document.body) return Promise.resolve();
            return new Promise(resolve => {
                const observer = new MutationObserver((_, obs) => {
                    if (document.body) {
                        obs.disconnect();
                        resolve();
                    }
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
            });
        }

        /**
         * @description 초기화 수행
         * - body 준비되면 UI 생성, 이벤트 및 메시지 리스너 설정, 포트 연결
         */
        async init() {
            await this.waitForBody();
            if (this.destroyed) return;

            try {
                this.translator = new Translator();
                this.initUI();
                this.bindEvents();
                this.setupMessageListener();
                this.setupPortConnection();
                this.isInitialized = true;
            } catch (error) {
                if (!this.destroyed) console.error("초기화 실패 (init):", error);
            }
        }

        /**  @description 번역 UI (버튼, 결과 팝업) 생성 */
        async initUI() {
            if (this.destroyed || !document.body) return;

            try {
                const storage = new TranslatorStorage();
                const language = await storage.getTranslationLanguage() || "Korean";
                
                if (!this.button) {
                    this.button = document.createElement("div");
                    this.button.className = "translator-button";
                    this.updateButtonText(language);
                    this.button.addEventListener("click", this.handleButtonClick);
                    document.body.appendChild(this.button);
                } else {
                    this.updateButtonText(language);
                }
                
                if (!this.result) {
                    this.result = document.createElement("div");
                    this.result.className = "translator-result";
                    document.body.appendChild(this.result);
                }
            } catch (error) {
                console.error("UI 초기화 실패:", error);
                
                // 오류 발생 시 기본값으로 UI 생성
                if (!this.button) {
                    this.button = document.createElement("div");
                    this.button.className = "translator-button";
                    this.button.textContent = "번역"; // 기본값
                    this.button.addEventListener("click", this.handleButtonClick);
                    document.body.appendChild(this.button);
                }
                
                if (!this.result) {
                    this.result = document.createElement("div");
                    this.result.className = "translator-result";
                    document.body.appendChild(this.result);
                }
            }
        }

        /**  @description TranslatorUI 인스턴스 및 이벤트 리스너, UI 요소 해제 */
        destroy() {
            this.destroyed = true;

            if (this.port)
                try {
                    this.port.disconnect();
                } catch (e) { }
            if (this.messageHandler)
                try {
                    chrome.runtime.onMessage.removeListener(this.messageHandler);
                } catch (e) { }

            if (this.button) this.button.remove();
            if (this.result) this.result.remove();
            window.removeEventListener("pagehide", this.handlePageHide);
        }



        /**  @description 선택 영역 번역 버튼 위치 업데이트 */
        updateUIPosition() {
            if (!this.currentSelection || this.destroyed) return;

            let posX, posY;
            if (typeof(this.dragEndX) === "number" && typeof(this.dragEndY) === "number") {
                posX = this.dragEndX + window.scrollX + 10;
                posY = this.dragEndY + window.scrollY + 10;
            } else {
                const rect = this.currentSelection.range.getBoundingClientRect();
                posX = rect.right + window.scrollX + 10;
                posY = rect.top + window.scrollY;
            }
            this.button.style.left = `${posX}px`;
            this.button.style.top = `${posY}px`;
        }

        /**  @description 스크롤에 따른 번역 결과 팝업 위치 업데이트 */
        updatePopupPosition() {
            if (this.destroyed || !this.result || this.result.style.display !== "block") return;

            const content = this.result.innerHTML || "번역 중...";
            const { posX, posY } = this._computePopupPosition(content);
            this.result.style.left = `${posX}px`;
            this.result.style.top = `${posY}px`;
        }

        /**  @description 로딩 상태 UI 너비 업데이트 */
        updateLoadingStateWidth() {
            const content = this.result.innerHTML || "번역 중...";
            const { posX, newMaxWidth } = this._computePopupPosition(content);
            this.result.style.maxWidth = `${newMaxWidth}px`;
            this.result.style.left = `${posX}px`;
        }



        /**  @description 크롬 런타임 포트 연결 설정 및 재연결 로직 구현 */
        setupPortConnection() {
            if (this.destroyed) return;

            if (this.port)
                try {
                    this.port.disconnect();
                } catch (e) { }
            try {
                this.port = chrome.runtime.connect({ name: "translator-connection" });
                this.attempts = 0;
                this.port.onDisconnect.addListener(() => {
                    if (this.destroyed) return;
                    const errMsg = chrome.runtime.lastError?.message || "";
                    if (errMsg.includes("Extension context invalidated")) {
                        this.destroy();
                        return;
                    }
                    if (errMsg.includes("back/forward cache")) return;
                    if (this.attempts < this.maxAttempts) {
                        this.attempts++;
                        setTimeout(() => { if (!this.destroyed) this.setupPortConnection(); }, 1000);
                    }
                });
            } catch (error) {
                if (!this.destroyed && !error.message?.includes("Extension context invalidated"))
                    console.error(`포트 연결 실패(setupPortConnection): ${error}`);
            }
        }

        /**
         * @description 메시지 리스너 설정
         * - 번역 요청 및 확장 프로그램 상태 변경 메시지 처리
         */
        setupMessageListener() {
            this.messageHandler = (message, sender, sendResponse) => {
                if (this.destroyed) {
                    sendResponse({ success: false, error: "UI가 이미 해제됨" });
                    return;
                }

                // 기존 코드 유지
                if (message.action === "ping") {
                    sendResponse({ pong: true });
                } else if (message.action === "translate") {
                    const text = message.text;
                    if (text) {
                        this.hideButton();
                        this.handleTranslation(text);
                        sendResponse({ success: true });
                    } else {
                        sendResponse({ success: false, error: "텍스트가 없음" });
                    }
                } 
                // 언어 변경 메시지 처리 추가
                else if (message.action === "languageChanged") {
                    this.updateButtonText(message.language);
                    sendResponse({ success: true });
                }
            };

            chrome.runtime.onMessage.addListener(this.messageHandler);
        }

        /**
         * @description 번역 버튼 텍스트 업데이트
         * @param {string} language 언어 코드
         */
        async updateButtonText(language) {
            if (!this.button) return;
            
            // 언어별 버튼 텍스트
            const buttonTexts = {
                "Korean": "번역",
                "English": "Translate",
                "Japanese": "翻訳",
                "Chinese": "翻译",
                "Chinese_TW": "翻譯",
                "Spanish": "Traducir",
                "French": "Traduire",
                "German": "Übersetzen",
                "Italian": "Traduci",
                "Russian": "Перевести",
                "Portuguese": "Traduzir",
                "Dutch": "Vertalen",
                "Indonesian": "Terjemah",
                "Filipino": "Isalin",
                "Malay": "Terjemah",
                "Arabic": "ترجمة",
                "Hindi": "अनुवाद",
                "Vietnamese": "Dịch",
                "Thai": "แปล"
            };
            
            this.button.textContent = buttonTexts[language] || "번역";
        }

        /**
         * @description 텍스트 선택 이벤트 핸들러
         * @param {Event} e - 이벤트 객체
         */
        handleTextSelection = (e) => {
            if (this.destroyed || e.target.closest(".translator-button")) return;

            if (e.target.closest(".translator-result")) {
                this.hideButton();
                return;
            }

            // 입력 필드 내에서는 번역 버튼 숨김
            if (
                e.target.matches("input, textarea, [contenteditable=\"true\"]") ||
                (document.activeElement && document.activeElement.matches("input, textarea, [contenteditable=\"true\"]"))
            ) {
                this.hideButton();
                this.hideResult();
                this.selectedText = "";
                return;
            }

            if (e.type === "mouseup") {
                this.dragEndX = e.clientX;
                this.dragEndY = e.clientY;
            }

            setTimeout(() => {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const fragment = range.cloneContents();
                    let combinedText = "";
                    fragment.childNodes.forEach(child => {
                        combinedText += this._extractText(child);
                    });

                    const selectedStr = combinedText.trim();
                    if (selectedStr) {
                        this.selectedText = selectedStr;
                        this.currentSelection = { range };
                        this.textAlignment = this.getTextAlignment();
                        this.showButton();
                    } else {
                        this.selectedText = "";
                        this.currentSelection = null;
                        this.hideButton();
                    }
                } else {
                    this.selectedText = "";
                    this.currentSelection = null;
                    this.hideButton();
                }
            }, 0);
        };

        /**
         * @description 번역 결과 팝업 숨기기
         * @param {Event} e 클릭 이벤트
         */
        handleDocumentClick = (e) => {
            if (this.skipNextClick || this.translationActive) return; /** @todo 팝업창에 닫기 버튼 추가하면 2번 조건 삭제 */
            if (!e.target.closest(".translator-button")) this.hideButton(); // [번역]은 항상 숨김
            if (!e.target.closest(".translator-button")
                && !e.target.closest(".translator-result")
                && !this.translationActive
            ) this.hideResult(); // 결과 팝업은 번역 중이 아닐 때만 숨김
        };

        /**
         * @description 텍스트 정렬 방향 반환
         * @returns {string} "left", "right", "center" 중 하나
         */
        getTextAlignment() {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return "left";

            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer;
            const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                return computedStyle.textAlign || "left";
            }
            return "left";
        }

        /**
         * @description 팝업 위치 계산
         * @param {number} [defaultOffsetX=10] 기본 X 오프셋
         * @param {number} [defaultOffsetY=10] 기본 Y 오프셋
         * @returns {Object} { posX: number, posY: number }
         * @private
         */
        _getPopupPosition(defaultOffsetX = 10, defaultOffsetY = 10) {
            let posX, posY;
            if (this.popupOrigin) {
                posX = this.popupOrigin.posX + defaultOffsetX;
                posY = this.popupOrigin.posY + defaultOffsetY;
            } else if (this.currentSelection && this.currentSelection.range) {
                const rect = this.currentSelection.range.getBoundingClientRect();
                posX = rect.left + window.scrollX + defaultOffsetX;
                posY = rect.bottom + window.scrollY + defaultOffsetY;
            } else if (typeof(this.dragEndX) === "number" && typeof(this.dragEndY) === "number") {
                posX = this.dragEndX + window.scrollX + defaultOffsetX;
                posY = this.dragEndY + window.scrollY + defaultOffsetY;
            } else {
                posX = window.scrollX + window.innerWidth / 2;
                posY = window.scrollY + window.innerHeight / 2;
            }
            return { posX, posY };
        }



        /**  @description [번역] 버튼 표시 */
        showButton() {
            if (this.destroyed || !this.currentSelection) return;

            let posX = this.dragEndX;
            let posY = this.dragEndY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const buttonWidth = 50;
            const buttonHeight = 30;

            if (posX + buttonWidth > viewportWidth) posX = viewportWidth - buttonWidth - 10;
            if (posY + buttonHeight > viewportHeight) posY = viewportHeight - buttonHeight - 10;

            this.button.style.position = "fixed";
            this.button.style.left = `${posX}px`;
            this.button.style.top = `${posY}px`;
            this.button.style.display = "block";
        }

        /** @description 로딩 상태 UI 표시 */
        async showLoadingState() {
            if (this.destroyed) return;

            let loadingText = "번역 중..."; // 기본값
            
            try {
                const storage = new TranslatorStorage();
                const language = await storage.getTranslationLanguage();
                
                // 언어별 로딩 텍스트
                const loadingTexts = {
                    "Korean": "번역 중...",
                    "English": "Translating...",
                    "Japanese": "翻訳中...",
                    "Chinese": "翻译中...",
                    "Chinese_TW": "翻譯中...",
                    "Spanish": "Traduciendo...",
                    "French": "Traduction...",
                    "German": "Übersetzung...",
                    "Italian": "Traduzione in corso...",
                    "Russian": "Перевод...",
                    "Portuguese": "Traduzindo...",
                    "Dutch": "Vertalen...",
                    "Indonesian": "Menerjemahkan...",
                    "Filipino": "Nagsasalin...",
                    "Malay": "Menterjemah...",
                    "Arabic": "جارٍ الترجمة...",
                    "Hindi": "अनुवाद कर रहा है...",
                    "Vietnamese": "Đang dịch...",
                    "Thai": "กำลังแปล..."
                };
                
                loadingText = loadingTexts[language] || loadingText;
            } catch (error) {
                console.error("언어 설정 로드 실패:", error);
            }

            const { posX } = this._getPopupPosition(10, 10);
            this.loadingPosX = posX;
            if (!this.translationActive) this.result.innerHTML = loadingText;
            this.translationActive = true;
            this._applyPopupStyle(loadingText);
        }

        /**
         * @description 번역 결과 UI 표시 후 상태 초기화
         * @param {string} text 최종 번역 결과 텍스트
         */
        showTranslation(text) {
            if (this.destroyed) return;
            this._applyPopupStyle(text);
            this.resetTranslationState();
        }

        /**
         * @description 에러 메시지 UI 표시
         * @param {string} message 에러 메시지
         */
        showError(message) {
            if (this.destroyed || !this.currentSelection) return;

            if (message.includes("Extension context invalidated")) message = "확장 프로그램이 업데이트 되었습니다. 페이지를 새로고침 해주세요";

            const rect = this.currentSelection.range.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;
            this.result.innerHTML = `⚠️ ${message}`;
            this.result.style.display = "block";
            this.result.style.top = `${rect.bottom + scrollY + 40}px`;
            this.result.style.left = `${rect.left + scrollX}px`;
            this.result.style.color = "#d93025";
        }

        /**  @description 번역 버튼 숨김 */
        hideButton() {
            if (this.destroyed) return;
            this.button.style.display = "none";
        }

        /**  @description 번역 결과 팝업 숨김 및 상태 초기화 */
        hideResult() {
            if (this.destroyed) return;
            if (this.result) this.result.style.display = "none";
        }

        

        /**  @description 번역 완료 후 상태 초기화 */
        resetTranslationState() {
            this.translationActive = false;
        }

        /** @description 페이지가 백/포워드 캐시에 들어갈 때 포트 안전 해제 */
        handlePageHide = () => {
            if (this.port)
                try {
                    this.port.disconnect();
                } catch (error) { }
        }

        /**
         * @description 버튼 클릭 이벤트 핸들러
         * - 선택된 텍스트 번역 요청 처리
         */
        handleButtonClick = (e) => {
            e.preventDefault();
            if (this.destroyed) return;

            if (this.selectedText) {
                console.log("번역 버튼 클릭됨, 요청 텍스트:", this.selectedText);

                if (this.button && this.button.getBoundingClientRect) {
                    const buttonRect = this.button.getBoundingClientRect();
                    this.popupOrigin = {
                        posX: buttonRect.left + window.scrollX,
                        posY: buttonRect.top + window.scrollY
                    };
                }
                
                this.hideButton();
                this.handleTranslation(this.selectedText);
            }
        };

        /**
         * @description 번역 요청 처리
         * @param {string} text 번역 요청 텍스트
         */
        async handleTranslation(text) {
            if (!text || this.destroyed) return;
            try {
                console.log("번역 요청:", text);
                if (!this.isInitialized) await this.init();

                this.dragEndX = undefined;
                this.dragEndY = undefined;
                
                this.requested = true;
                this.showLoadingState();
                this.streamingStarted = false;
        
                console.log("스트림 번역 호출...");
                const finalText = await this.translator.translate(text, {
                    stream: true,
                    onStream: (partial) => {
                        if (this.destroyed) return;
                        if (!this.streamingStarted) {
                            this.result.innerHTML = partial;
                            this.streamingStarted = true;
                        } else {
                            this.result.innerHTML += partial;
                            this.updateLoadingStateWidth();
                        }
                    }
                });
                console.log("번역 완료");
                if (finalText) this.showTranslation(finalText);
            } catch (error) {
                console.error("번역 오류(handleTranslation):", error);
                if (!this.destroyed) this.showError(error.message);
            }
        }



        /** @description 이벤트 핸들러 바인딩 */
        bindEvents() {
            document.addEventListener("mouseup", this.handleTextSelection);
            document.addEventListener("click", this.handleDocumentClick, true); /** @todo 팝업창에 닫기 버튼 추가하면 true 삭제 */
        }
    }
    window.TranslatorUI = TranslatorUI;
}

/** @description 전역 인스턴스 생성 */
try {
    if (window.translatorUIInstance) window.translatorUIInstance.destroy();
    window.translatorUIInstance = new TranslatorUI();
} catch (e) {
    console.error("TranslatorUI 초기화 실패:", e);
}

/**
 * @description
 * <canvas> 영역 클릭 시 팝업이 안 닫히는 이슈 해결을 위해 아래 조건을 추가했음
 * - bindEvents `click`의 true
 * - handleDocumentClick 조건 추가 (this.skipNextClick || this.translationActive)
 * 이전 방식이 더 좋다는 의견이 많으면 롤백
 */