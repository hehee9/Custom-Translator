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
        translationCompleted = false; // 번역 완료 상태 추가
        loadingPosX = 0;
        textAlignment = "left";
        thinkingContent = null;
        thinkingSection = null;
        thinkingContentDiv = null;

        /**
         * @description DOM 요소 캐시
         * @private
         */
        #domCache = new Map();
        
        /**
         * @description 자주 사용되는 selector들
         * @private
         */
        static #commonSelectors = {
            thinkingHeader: '.thinking-header',
            thinkingContent: '.thinking-content',
            thinkingToggle: '.thinking-toggle',
            translationContent: '.translation-content',
            copyButton: '.copy-button',
            translationInfoContainer: '.translation-info-container',
            leftInfo: '.left-info',
            rightActions: '.right-actions'
        };

        constructor() {
            this.init();
            window.addEventListener("pagehide", this.handlePageHide);
        }

        /**
         * @description 캐시된 DOM 요소 가져오기
         * @param {string} selector CSS 선택자
         * @param {Element} [context=this.result] 검색 컨텍스트
         * @returns {Element|null} DOM 요소
         * @private
         */
        #getCachedElement(selector, context = this.result) {
            if (!context) return null;
            
            const cacheKey = `${selector}:${context === this.result ? 'result' : 'custom'}`;
            
            if (this.#domCache.has(cacheKey)) {
                const cached = this.#domCache.get(cacheKey);
                // 요소가 여전히 DOM에 존재하는지 확인
                if (cached && cached.parentNode) {
                    return cached;
                }
                // 캐시 무효화
                this.#domCache.delete(cacheKey);
            }
            
            const element = context.querySelector(selector);
            if (element) {
                this.#domCache.set(cacheKey, element);
            }
            
            return element;
        }

        /**
         * @description 여러 캐시된 DOM 요소 가져오기
         * @param {string} selector CSS 선택자
         * @param {Element} [context=this.result] 검색 컨텍스트
         * @returns {NodeList} DOM 요소 목록
         * @private
         */
        #getCachedElements(selector, context = this.result) {
            if (!context) return [];
            return context.querySelectorAll(selector);
        }

        /**
         * @description DOM 캐시 무효화
         * @private
         */
        #invalidateDOMCache() {
            this.#domCache.clear();
        }

        /**
         * @description 결과 컨테이너에서 특정 요소 가져오기 (캐시 사용)
         * @param {string} type 요소 타입 (commonSelectors의 키)
         * @returns {Element|null} DOM 요소
         * @private
         */
        #getResultElement(type) {
            const selector = TranslatorUI.#commonSelectors[type];
            return selector ? this.#getCachedElement(selector) : null;
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
                    
                    // 이벤트 위임으로 추론 영역 토글 처리
                    this.result.addEventListener("click", this.handleThinkingToggle);
                    
                    document.body.appendChild(this.result);
                }
            } catch (error) {
                console.error("UI 초기화 실패:", error);
                
                // 오류 발생 시 기본값으로 UI 생성
                if (!this.button) {
                    this.button = document.createElement("div");
                    this.button.className = "translator-button";
                    // i18n을 사용하여 기본값 설정
                    this.button.textContent = "번역"; // 기본값
                    this.button.addEventListener("click", this.handleButtonClick);
                    document.body.appendChild(this.button);
                }
                
                if (!this.result) {
                    this.result = document.createElement("div");
                    this.result.className = "translator-result";
                    
                    // 이벤트 위임으로 추론 영역 토글 처리
                    this.result.addEventListener("click", this.handleThinkingToggle);
                    
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
            if (this.messageHandler && chrome && chrome.runtime && chrome.runtime.onMessage)
                try {
                    chrome.runtime.onMessage.removeListener(this.messageHandler);
                } catch (e) { }

            if (this.button) this.button.remove();
            if (this.result) this.result.remove();
            window.removeEventListener("pagehide", this.handlePageHide);
        }



        /**  @description 선택 영역 번역 버튼 위치 업데이트 */
        updateUIPosition() {
            if (!this.currentSelection || this.destroyed || !this.button) return;

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

            // chrome.runtime이 사용 가능한지 확인
            if (!chrome || !chrome.runtime || !chrome.runtime.connect) {
                console.warn("Chrome runtime이 사용할 수 없는 상태입니다. 확장 프로그램 컨텍스트가 무효화되었을 수 있습니다.");
                this.destroy();
                return;
            }

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
                        setTimeout(() => { 
                            if (!this.destroyed && chrome && chrome.runtime && chrome.runtime.connect) {
                                this.setupPortConnection();
                            }
                        }, 1000);
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
            // chrome.runtime이 사용 가능한지 확인
            if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) {
                console.warn("Chrome runtime 메시지 리스너를 설정할 수 없습니다.");
                return;
            }

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
                    const domain = message.domain; // 도메인 정보 추가
                    if (text) {
                        this.hideButton();
                        this.handleTranslation(text, domain);
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
                "Portuguese": "Traduzir"
            };
            
            this.button.textContent = buttonTexts[language] || "번역";
        }
        
        /**
         * @description 추론 영역 토글 핸들러 (이벤트 위임)
         * @param {Event} e 클릭 이벤트
         * @private
         */
        handleThinkingToggle = (e) => {
            if (e.target.closest(".thinking-header")) {
                const header = e.target.closest(".thinking-header");
                const content = header.nextElementSibling;
                const toggle = header.querySelector(".thinking-toggle");
                
                if (content && toggle) {
                    const isCollapsed = content.classList.contains("collapsed");
                    if (isCollapsed) {
                        content.classList.remove("collapsed");
                        toggle.classList.remove("collapsed");
                    } else {
                        content.classList.add("collapsed");
                        toggle.classList.add("collapsed");
                    }
                }
            }
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
            ) this.hideResult(); // 결과 팝업은 번역 중이 아닐 때 숨김 (translationCompleted 조건 제거)
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
            if (this.destroyed || !this.currentSelection || !this.button) return;

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

            // i18n을 사용하여 로딩 텍스트 가져오기
            let loadingText = "번역 중..."; // 기본값
            
            // 언어별 로딩 텍스트
            const loadingTexts = {
                "Korean": "번역 중...",
                "English": "Translating...",
                "Japanese": "翻訳中...",
                "Chinese": "翻译中...",
                "Chinese_TW": "翻譯中...",
                "Spanish": "Traduciendo...",
                "French": "Traduction en cours...",
                "German": "Übersetzen...",
                "Italian": "Traduzione in corso...",
                "Russian": "Перевод...",
                "Portuguese": "Traduzindo..."
            };
            
            if (this.currentLanguage && loadingTexts[this.currentLanguage]) {
                loadingText = loadingTexts[this.currentLanguage];
            }
        

            const { posX } = this._getPopupPosition(10, 10);
            this.loadingPosX = posX;
            if (!this.translationActive) this.result.innerHTML = loadingText;
            this.translationActive = true;
            this._applyPopupStyle(loadingText);
        }

        /**
         * @description DOM 요소에서 실제 텍스트 내용만 추출 (AI 출력 보존)
         * @param {string} text 원본 텍스트 (AI 출력)
         * @returns {string} 복사할 텍스트
         * @private
         */
        stripHtmlTags(text) {
            if (!text || typeof text !== 'string') return '';
            
            // 만약 현재 result DOM에서 실제 표시된 텍스트를 가져올 수 있다면 그것을 사용
            if (this.result) {
                // 번역 결과 영역에서 번역 내용만 추출
                const resultClone = this.result.cloneNode(true);
                
                // UI 요소들 제거 (복사 버튼, 번역 정보 컨테이너, thinking 헤더 등)
                const copyButtons = resultClone.querySelectorAll('.copy-button');
                const thinkingHeaders = resultClone.querySelectorAll('.thinking-header');
                const translationInfoContainers = resultClone.querySelectorAll('.translation-info-container');
                const rightActions = resultClone.querySelectorAll('.right-actions');
                
                copyButtons.forEach(btn => btn.remove());
                thinkingHeaders.forEach(header => header.remove());
                translationInfoContainers.forEach(container => container.remove());
                rightActions.forEach(action => action.remove());
                
                // 번역 내용만 추출 (thinking 내용과 번역 결과만)
                const translationContent = resultClone.querySelector('.translation-content');
                const thinkingContent = resultClone.querySelector('.thinking-content');
                
                let textContent = '';
                
                // thinking 내용이 있고 펼쳐져 있으면 추가
                if (thinkingContent && !thinkingContent.classList.contains('collapsed')) {
                    textContent += thinkingContent.textContent + '\n\n';
                }
                
                // 번역 결과 추가
                if (translationContent) {
                    textContent += translationContent.textContent;
                } else {
                    // translation-content가 없으면 전체에서 UI 요소를 제거한 텍스트 사용
                    textContent = resultClone.textContent || resultClone.innerText || '';
                }
                
                // 빈 결과인 경우 원본 텍스트 사용
                if (textContent.trim()) {
                    return textContent.trim();
                }
            }
            
            // 폴백: 원본 텍스트 반환 (AI가 실제로 HTML을 출력한 경우 보존)
            return text;
        }

        /**
         * @description 팝업 위치를 뷰포트 내로 조정
         * @private
         */
        adjustPopupPosition() {
            if (!this.result || this.destroyed) return;
            
            // 현재 요소의 위치 정보 가져오기
            const rect = this.result.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // 새로운 위치 계산 (뷰포트 기준)
            let { posX, posY } = this._getPopupPosition(10, 10);
            
            // 뷰포트 경계를 벗어나는 경우 조정
            const popupHeight = rect.height || 300;
            const popupWidth = rect.width || 400;
            
            // 하단을 벗어나는 경우
            if (posY + popupHeight > window.scrollY + viewportHeight) {
                posY = window.scrollY + viewportHeight - popupHeight - 20;
            }
            
            // 우측을 벗어나는 경우
            if (posX + popupWidth > window.scrollX + viewportWidth) {
                posX = window.scrollX + viewportWidth - popupWidth - 20;
            }
            
            // 상단을 벗어나는 경우
            if (posY < window.scrollY) {
                posY = window.scrollY + 20;
            }
            
            // 좌측을 벗어나는 경우
            if (posX < window.scrollX) {
                posX = window.scrollX + 20;
            }
            
            // 새로운 위치 적용
            this.result.style.top = `${posY}px`;
            this.result.style.left = `${posX}px`;
            this.result.style.position = "absolute";
        }

        /**
         * @description 추론 섹션 생성 및 표시
         * @param {string} thinkingText 추론 내용
         * @returns {HTMLElement} 생성된 추론 섹션 엘리먼트
         */
        async createThinkingSection(thinkingText = null) {
            const defaultThinking = thinkingText || "추론 중...";
            
            const thinkingSection = document.createElement('div');
            thinkingSection.className = 'thinking-section';
            
            const thinkingHeader = document.createElement('div');
            thinkingHeader.className = 'thinking-header';
            
            const headerText = document.createElement('span');
            headerText.className = 'thinking-header-text';
            headerText.textContent = '추론 과정';
            
            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'thinking-toggle collapsed';
            toggleIcon.textContent = '▼';
            
            thinkingHeader.appendChild(headerText);
            thinkingHeader.appendChild(toggleIcon);
            
            const thinkingContentDiv = document.createElement('div');
            thinkingContentDiv.className = 'thinking-content collapsed';
            thinkingContentDiv.textContent = defaultThinking;
            
            thinkingSection.appendChild(thinkingHeader);
            thinkingSection.appendChild(thinkingContentDiv);
            
            return thinkingSection;
        }

        /**
         * @description qwen thinking 모델용 UI 초기 설정
         * @param {string} loadingText 로딩 텍스트
         */
        async showLoadingStateWithThinking(loadingText) {
            if (this.destroyed) return;
            
            // 추론 섹션 생성
            this.thinkingSection = await this.createThinkingSection();
            this.thinkingContentDiv = this.thinkingSection.querySelector('.thinking-content');
            
            // 번역 결과 영역 생성
            const translationDiv = document.createElement('div');
            translationDiv.className = 'translation-content has-thinking';
            translationDiv.textContent = loadingText;
            
            // 컨테이너 생성 및 조합
            const container = document.createElement('div');
            container.appendChild(this.thinkingSection);
            container.appendChild(translationDiv);
            
            this._applyPopupStyleWithContent(container.innerHTML);
            this.translationActive = true;
        }

        /**
         * @description 추론 내용 업데이트 (최적화된 DOM 쿼리)
         * @param {string} thinkingText 추론 내용
         */
        updateThinkingContent(thinkingText) {
            if (this.destroyed) return;
            
            const thinkingContent = this.#getResultElement('thinkingContent');
            if (thinkingContent) {
                thinkingContent.textContent = thinkingText;
            }
        }

        /**
         * @description 번역 결과 내용만 업데이트 (thinking 모델용, 최적화된 DOM 쿼리)
         * @param {string} translationText 번역 결과 텍스트
         */
        updateTranslationContent(translationText) {
            if (this.destroyed) return;
            
            const translationContent = this.#getResultElement('translationContent');
            if (translationContent) {
                translationContent.textContent = translationText;
            }
        }

        /**
         * @description 번역 결과 UI 표시 후 상태 초기화
         * @param {string} text 최종 번역 결과 텍스트
         * @param {string} [thinking] 추론 내용 (선택적)
         */
        async showTranslation(text, thinking = null) {
            if (this.destroyed) return;
            
            // 스트리밍이 이미 완료된 경우, 기존 DOM 내용을 보존하고 복사 버튼만 추가
            const hasExistingContent = this.streamingStarted && this.result && this.result.innerHTML.trim() !== '';
            
            if (hasExistingContent) {
                // DOM 보존 모드에서는 display를 명시적으로 block으로 설정
                this.result.style.display = "block";
                this.adjustPopupPosition();
                
                this.resetTranslationState();
                return;
            }

            // 스트리밍이 없었거나 다른 이유로 DOM을 새로 만들어야 하는 경우
            if (thinking) {
                // 추론 내용이 있는 경우 섹션 구성
                const thinkingSection = await this.createThinkingSection(thinking);
                const translationDiv = document.createElement('div');
                translationDiv.className = 'translation-content has-thinking';
                translationDiv.textContent = text;
                
                // DOM 요소들을 직접 적용하여 줄바꿈 보존 (복사 버튼은 별도 처리)
                this._applyPopupStyleWithElements([thinkingSection, translationDiv]);
            } else {
                // 기존 방식 유지 (복사 버튼은 별도 처리)
                const textDiv = document.createElement('div');
                textDiv.textContent = text;
                
                // DOM 요소들을 직접 적용하여 줄바꿈 보존
                this._applyPopupStyleWithElements([textDiv]);
            }
            
            // 새로 DOM을 생성한 경우에도 위치 조정
            this.adjustPopupPosition();
            
            this.resetTranslationState();
        }

        /**
         * @description 기존 DOM 내용에 복사 버튼만 추가 (줄바꿈 보존, 최적화된 DOM 쿼리)
         * @param {string} text 복사할 텍스트
         */
        async addCopyButtonToExistingContent(text) {
            if (this.destroyed || !this.result) return;
            
            // 이미 복사 버튼이 있는지 확인 (캐시 사용하지 않고 실제 DOM 검사)
            const existingCopyButton = this.result.querySelector('.copy-button');
            if (existingCopyButton && existingCopyButton.parentNode && this.result.contains(existingCopyButton)) {
                return;
            }
            
            // right-actions 영역을 찾거나 생성 (실제 DOM 검사)
            let rightActions = this.result.querySelector('.right-actions');
            
            if (!rightActions) {
                // right-actions가 없다면 translation-info-container를 찾아서 추가
                let infoContainer = this.result.querySelector('.translation-info-container');
                
                if (infoContainer) {
                    rightActions = document.createElement('div');
                    rightActions.className = 'right-actions';
                    infoContainer.appendChild(rightActions);
                } else {
                    // info container가 없다면 새로 생성 (fallback)
                    infoContainer = document.createElement('div');
                    infoContainer.className = 'translation-info-container';
                    
                    const leftInfo = document.createElement('div');
                    leftInfo.className = 'left-info';
                    infoContainer.appendChild(leftInfo);
                    
                    rightActions = document.createElement('div');
                    rightActions.className = 'right-actions';
                    infoContainer.appendChild(rightActions);
                    
                    this.result.appendChild(infoContainer);
                }
                // DOM 구조 변경 후 캐시 무효화
                this.#invalidateDOMCache();
            }
            
            // 복사 버튼 생성 및 추가
            const copyButton = await this.createCopyButton(text);
            rightActions.appendChild(copyButton);
        }

        /**
         * @description 복사 버튼 생성
         * @param {string} text 복사할 텍스트 (HTML 포함 가능)
         * @returns {HTMLElement} 복사 버튼 엘리먼트
         */
        async createCopyButton(text) {
            // HTML 태그 제거하고 순수 텍스트만 추출
            const cleanText = this.stripHtmlTags(text);
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            
            // i18n을 사용하여 복사 텍스트 가져오기
            let copyText = "복사"; // 기본값
            try {
                if (window.I18nManager) {
                    const i18n = new I18nManager();
                    copyText = await i18n.getText("copy") || "복사";
                }
            } catch (error) {
                console.warn("i18n 텍스트 로드 실패:", error);
            }
            
            copyButton.innerHTML = `📋`;
            
            copyButton.addEventListener('click', () => this.copyToClipboard(cleanText, copyButton));
            
            return copyButton;
        }

        /**
         * @description 팝업에 HTML 콘텐츠 적용 (추론 섹션 포함)
         * @param {string} htmlContent HTML 콘텐츠
         * @private
         */
        _applyPopupStyleWithContent(htmlContent) {
            const { posX, posY, newMaxWidth } = this._computePopupPosition(htmlContent);
            Object.assign(this.result.style, {
                position: "absolute",
                maxWidth: `${newMaxWidth}px`,
                maxHeight: "400px", // 추론 섹션 때문에 높이 증가
                overflowY: "auto",
                display: "block",
                top: `${posY}px`,
                left: `${posX}px`,
                color: "var(--text-color, black)",
                textAlign: this.textAlignment || "left",
                whiteSpace: "normal", // HTML 콘텐츠를 위해 normal로 변경
                overflowWrap: "break-word"
            });
            this.result.innerHTML = htmlContent;
            // DOM 구조가 변경되었으므로 캐시 무효화
            this.#invalidateDOMCache();
        }

        /**
         * @description 팝업에 DOM 요소들을 직접 적용 (줄바꿈 보존)
         * @param {HTMLElement[]} elements DOM 요소 배열
         * @private
         */
        _applyPopupStyleWithElements(elements) {
            // 첫 번째 요소의 텍스트 내용으로 위치 계산
            const sampleText = elements[0] ? elements[0].textContent || elements[0].innerText || "" : "";
            const { posX, posY, newMaxWidth } = this._computePopupPosition(sampleText);
            
            Object.assign(this.result.style, {
                position: "absolute",
                maxWidth: `${newMaxWidth}px`,
                maxHeight: "400px",
                overflowY: "auto",
                display: "block",
                top: `${posY}px`,
                left: `${posX}px`,
                color: "var(--text-color, black)",
                textAlign: this.textAlignment || "left",
                whiteSpace: "pre-wrap", // 줄바꿈 보존
                overflowWrap: "break-word",
                paddingRight: "15px" // 기본 패딩
            });
            
            // 기존 내용 제거
            this.result.innerHTML = '';
            
            // 요소들을 직접 추가
            elements.forEach((element, index) => {
                if (element) {
                    this.result.appendChild(element);
                }
            });
            
            // DOM 구조가 변경되었으므로 캐시 무효화
            this.#invalidateDOMCache();
        }

        /**
         * @description 번역 정보 (토큰 사용량, 비용, 프리셋) 표시
         * @param {Object} result 번역 결과 객체
         * @param {Object} result.tokenUsage 토큰 사용량
         * @param {number} result.cost 비용
         * @param {Array} result.appliedPresets 적용된 프리셋 정보
         */
        showTranslationInfo(result) {
            if (this.destroyed) return;
            
            // 이미 정보 컨테이너가 있는지 확인하지만, 내용이 비어있으면 다시 채움
            let existingInfoContainer = this.result.querySelector('.translation-info-container');
            if (existingInfoContainer) {
                // 기존 컨테이너에 left-info가 비어있으면 채움
                const leftInfo = existingInfoContainer.querySelector('.left-info');
                if (leftInfo && leftInfo.children.length === 0) {
                    // 빈 left-info가 있으면 내용을 채움
                } else {
                    return; // 이미 내용이 있으면 건너뜀
                }
            }
            
            // 토큰/비용 정보나 프리셋 정보가 하나라도 있으면 표시
            const hasTokenInfo = result.tokenUsage && result.cost;
            const hasPresetInfo = result.appliedPresets && result.appliedPresets.length > 0;
            
            if (!hasTokenInfo && !hasPresetInfo) return;
            
            // 기존 컨테이너가 있으면 재사용, 없으면 새로 생성
            let infoContainer = existingInfoContainer;
            let leftInfo;
            
            if (existingInfoContainer) {
                leftInfo = existingInfoContainer.querySelector('.left-info');
            } else {
                // 정보 컨테이너 생성
                infoContainer = document.createElement('div');
                infoContainer.className = 'translation-info-container';
                
                // 좌측 정보 영역 생성
                leftInfo = document.createElement('div');
                leftInfo.className = 'left-info';
            }
            
            // 토큰 사용량 및 비용 정보 (좌측 상단)
            if (hasTokenInfo) {
                const tokenInfo = document.createElement('div');
                tokenInfo.className = 'token-info';
                
                const { inputTokens, cachedInputTokens, outputTokens } = result.tokenUsage;
                const costText = result.cost.toFixed(4);
                
                let tokenText = `입력: ${inputTokens.toLocaleString()}`;
                if (cachedInputTokens > 0) {
                    tokenText += ` (캐시: ${cachedInputTokens.toLocaleString()})`;
                }
                tokenText += ` | 출력: ${outputTokens.toLocaleString()} | 비용: $${costText}`;
                
                tokenInfo.textContent = tokenText;
                leftInfo.appendChild(tokenInfo);
            }
            
            // 프리셋 정보 (좌측 하단)
            if (hasPresetInfo) {
                const presetInfo = document.createElement('div');
                presetInfo.className = 'preset-info';
                
                const presetText = this.formatPresetText(result.appliedPresets);
                presetInfo.textContent = presetText;
                leftInfo.appendChild(presetInfo);
            }
            
            if (!existingInfoContainer) {
                infoContainer.appendChild(leftInfo);
                
                // 우측에는 복사 버튼이 들어갈 공간 예약 (createCopyButton에서 추가됨)
                const rightActions = document.createElement('div');
                rightActions.className = 'right-actions';
                infoContainer.appendChild(rightActions);
                
                this.result.appendChild(infoContainer);
            }
        }

        /**
         * @description 프리셋 정보를 텍스트로 포맷팅
         * @param {Array} appliedPresets 적용된 프리셋 배열
         * @returns {string} 포맷된 텍스트
         */
        formatPresetText(appliedPresets) {
            if (!appliedPresets || appliedPresets.length === 0) {
                return '';
            }
            
            if (appliedPresets.length === 1) {
                return `${appliedPresets[0].name} 적용`;
            } else {
                const firstPreset = appliedPresets[0].name;
                const remaining = appliedPresets.length - 1;
                return `${firstPreset} 외 ${remaining}개 적용`;
            }
        }

        /**
         * @description 기존 호환성을 위한 showTokenUsage 메서드 유지
         * @param {Object} result 번역 결과 객체
         * @deprecated showTranslationInfo를 사용하세요
         */
        showTokenUsage(result) {
            this.showTranslationInfo(result);
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

        /**
         * @description 클립보드에 텍스트 복사
         * @param {string} text 복사할 텍스트
         * @param {HTMLElement} button 클릭된 복사 버튼
         */
        async copyToClipboard(text, button) {
            try {
                // 최신 Clipboard API 사용
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    // 폴백 방법
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                
                // 성공 피드백
                this.showCopyFeedback(button, true);
            } catch (error) {
                console.error('복사 실패:', error);
                // 실패 피드백
                this.showCopyFeedback(button, false);
            }
        }

        /**  @description 번역 버튼 숨김 */
        hideButton() {
            if (this.destroyed || !this.button) return;
            this.button.style.display = "none";
        }

        /**
         * @description 복사 완료 피드백 표시
         * @param {HTMLElement} button 복사 버튼
         * @param {boolean} success 성공 여부
         */
        async showCopyFeedback(button, success) {
            const originalHTML = button.innerHTML;
            
            if (success) {
                button.innerHTML = `✓`;
                button.className = 'copy-button success';
            } else {
                button.innerHTML = `✗`;
                button.className = 'copy-button error';
            }
            
            // 1.5초 후 원래 상태로 복원
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.className = 'copy-button';
            }, 1500);
        }

        /**  @description 번역 결과 팝업 숨김 및 상태 초기화 */
        hideResult() {
            if (this.destroyed) return;
            if (this.result) this.result.style.display = "none";
            this.translationCompleted = false;
        }

        

        /**  @description 번역 완료 후 상태 초기화 */
        resetTranslationState() {
            this.translationActive = false;
            this.translationCompleted = true;
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
                if (this.button && this.button.getBoundingClientRect) {
                    const buttonRect = this.button.getBoundingClientRect();
                    this.popupOrigin = {
                        posX: buttonRect.left + window.scrollX,
                        posY: buttonRect.top + window.scrollY
                    };
                }
                
                // 현재 페이지의 도메인 정보 가져오기
                const currentDomain = window.location.hostname;
                
                this.hideButton();
                this.handleTranslation(this.selectedText, currentDomain);
            }
        };

        /**
         * @description 모델이 qwen thinking 모델인지 확인
         * @param {string} model 모델명
         * @returns {boolean} qwen thinking 모델인지 여부
         */
        isQwenThinkingModel(model) {
            return model && model.includes("qwen") && model.includes("thinking");
        }

        /**
         * @description 번역 요청 처리
         * @param {string} text 번역 요청 텍스트
         * @param {string} domain 현재 도메인 (사이트별 단어장 적용용)
         */
        async handleTranslation(text, domain = null) {
            if (!text || this.destroyed) return;
            
            // 번역 시작 시 상태 초기화
            this.translationCompleted = false;
            
            try {
                if (!this.isInitialized) await this.init();

                this.dragEndX = undefined;
                this.dragEndY = undefined;
                
                this.requested = true;
                this.streamingStarted = false;
                this.thinkingContent = null; // 추론 내용 초기화
                
                // 현재 모델 확인
                const storage = new TranslatorStorage();
                const currentModel = await storage.getTranslationModel();
                const isThinkingModel = this.isQwenThinkingModel(currentModel);
                
                let loadingText = "번역 중...";
                
                // thinking 모델인 경우 추론 영역과 함께 표시
                if (isThinkingModel) {
                    await this.showLoadingStateWithThinking(loadingText);
                } else {
                    await this.showLoadingState();
                }
        
                const result = await this.translator.translate(text, {
                    domain: domain,
                    stream: true,
                    onStream: (partial) => {
                        if (this.destroyed) return;
                        if (isThinkingModel) {
                            // thinking 모델인 경우 번역 결과 영역만 업데이트
                            if (!this.streamingStarted) {
                                this.updateTranslationContent(partial);
                                this.streamingStarted = true;
                            } else {
                                // 기존 내용에 추가
                                const translationContent = this.result.querySelector('.translation-content');
                                if (translationContent) {
                                    translationContent.textContent += partial;
                                }
                            }
                        } else {
                            // 기존 방식
                            if (!this.streamingStarted) {
                                this.result.innerHTML = partial;
                                this.streamingStarted = true;
                            } else {
                                this.result.innerHTML += partial;
                                this.updateLoadingStateWidth();
                            }
                        }
                    },
                    onThinking: (thinkingText) => {
                        if (this.destroyed) return;
                        this.thinkingContent = thinkingText;
                        // thinking 모델인 경우 추론 영역에 실시간 업데이트
                        if (isThinkingModel) {
                            this.updateThinkingContent(thinkingText);
                        }
                    }
                });
                if (result && result.text) {
                    // 추론 내용이 결과에 포함되어 있다면 우선 사용
                    const thinking = result.thinking || this.thinkingContent;
                    await this.showTranslation(result.text, thinking);
                    this.showTranslationInfo(result);
                    
                    // 번역 정보가 표시된 후에 복사 버튼 추가
                    await this.addCopyButtonToExistingContent(result.text);
                }
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