/** @description 한글 검색 향상을 위한 라이브러리 */
import { choseongIncludes, hangulIncludes } from "../utils/hangul.js";

document.addEventListener("DOMContentLoaded", async () => {
    const storage = new TranslatorStorage();

    let glossaryList = document.getElementById("glossaryList");
    const glossaryToggle = document.getElementById("glossaryToggle");
    const sortSelect = document.getElementById("sortOrder");
    const importBtn = document.getElementById("importGlossary");
    const exportBtn = document.getElementById("exportGlossary");
    const sourceWordInput = document.getElementById("sourceWord");
    const targetWordInput = document.getElementById("targetWord");
    const addWordBtn = document.getElementById("addWord");



    /**
     * @description 문자열 정규화
     * - 소문자, 특수문자/공백 제거
     * - 히라가나 변환
     * @param {string} str 입력 문자열
     * @returns {string} 정규화된 문자열
     */
    function normalizeText(str) {
        return toHiragana(str.toLowerCase()).replace(/[^\p{L}\p{N}]+/gu, "");
    }

    /**
     * @description 가타카나 → 히라가나 변환
     * @param {string} str 입력 문자열
     * @returns {string} 변환된 문자열
     */
    function toHiragana(str) {
        return str.replace(/[\u30A1-\u30F6]/g, function(ch) {
            return String.fromCharCode(ch.charCodeAt(0) - 0x60);
        });
    }



    /**
     * @description 단어장 목록 뷰 모드 업데이트
     * @param {string} state "partial", "full", "collapsed"
     */
    function updateGlossaryView(state) {
        const list = document.getElementById("glossaryList");
        const toggle = document.getElementById("glossaryToggle");
        if (!list || !toggle) return;

        list.style.display = "block";
        
        switch (state) {
        case "partial":
            list.style.height = "120px";
            list.style.overflowY = "auto";
            toggle.textContent = "▼";
            break;
        case "full":
            list.style.height = "300px";
            list.style.overflowY = "auto";
            toggle.textContent = "▲";
            break;
        case "collapsed":
            list.style.height = "0px";
            list.style.overflow = "hidden";
            toggle.textContent = "▼";
            break;
        }
    }

    let glossaryState = "partial";
    /** @description 단어장 목록 뷰 모드 로드 */
    async function loadGlossaryView() {
        let savedState = await storage.getViewMode();
        if (savedState !== "partial"
            && savedState !== "full"
            && savedState !== "collapsed"
        ) savedState = "partial";

        glossaryState = savedState;
        updateGlossaryView(glossaryState);
    }

    /** @description 단어장 목록 로드 */
    async function loadGlossary() {
        const glossaryObj = await storage.getGlossary();
        let entries = glossaryObj.words;
    
        const searchInput = document.getElementById("searchGlossary");
        if (searchInput) {
            let rawQuery = searchInput.value.trim().replace(/\s/g, "");
            if (rawQuery) {
                entries = entries.filter(item => {
                    const sourceNoSpace = item.source.replace(/\s/g, "").toLowerCase();
                    const targetNoSpace = item.target.replace(/\s/g, "").toLowerCase();
                    return hangulIncludes(sourceNoSpace, rawQuery) ||
                           hangulIncludes(targetNoSpace, rawQuery) ||
                           choseongIncludes(sourceNoSpace, rawQuery) ||
                           choseongIncludes(targetNoSpace, rawQuery);
                });
            }
        }
    
        glossaryList.innerHTML = "";
        if (entries.length === 0) return;
    
        /** @description 정렬 처리 */
        if (sortSelect) {
            const sortOrder = sortSelect.value;
            switch (sortOrder) {
                case "recent": break;
                case "old":
                    entries = entries.slice().reverse();
                    break;
                case "modified":
                    entries = entries.slice().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    break;
                case "modified_reverse":
                    entries = entries.slice().sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                    break;
                case "asc":
                    entries = entries.slice().sort((a, b) => a.source.localeCompare(b.source));
                    break;
                case "desc":
                    entries = entries.slice().sort((a, b) => b.source.localeCompare(a.source));
                    break;
            }
        }
    
        /** @description 단어목록 초기화 및 재렌더링 */
        entries.forEach((item) => {
            const row = document.createElement("div");
            row.className = "glossary-item";
            row.dataset.originalSource = item.source;
    
            const sourceInput = document.createElement("input");
            sourceInput.type = "text";
            sourceInput.value = item.source;
            sourceInput.className = "glossary-input-source";
    
            const arrowSpan = document.createElement("span");
            arrowSpan.className = "arrow";
            arrowSpan.textContent = "→";
    
            const targetInput = document.createElement("input");
            targetInput.type = "text";
            targetInput.value = item.target;
            targetInput.className = "glossary-input-target";
    
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "glossary-delete-btn";
            deleteBtn.textContent = "삭제";
    
            const updateItem = async () => {
                const newSource = sourceInput.value.trim();
                const newTarget = targetInput.value.trim();
                const oldSource = row.dataset.originalSource;
                if (newSource && newTarget) {
                    await storage.updateGlossaryItem(oldSource, newSource, newTarget);
                    row.dataset.originalSource = newSource;
                    await loadGlossary();
                }
            };
    
            sourceInput.addEventListener("blur", updateItem);
            targetInput.addEventListener("blur", updateItem);
            sourceInput.addEventListener("keypress", async (e) => {
                if (e.key === "Enter") await updateItem();
            });
            targetInput.addEventListener("keypress", async (e) => {
                if (e.key === "Enter") await updateItem();
            });
    
            deleteBtn.addEventListener("click", async () => {
                const currentSource = sourceInput.value.trim();
                await storage.removeGlossaryItem(currentSource);
                await loadGlossary();
            });
    
            row.appendChild(sourceInput);
            row.appendChild(arrowSpan);
            row.appendChild(targetInput);
            row.appendChild(deleteBtn);
    
            glossaryList.appendChild(row);
        });
    }



    /** @description 단어장 불러오기 */
    importBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const glossary = JSON.parse(event.target.result);
                    await storage.setGlossary(glossary);
                    await loadGlossary();
                    const msgEl = document.getElementById("glossaryMsg");
                    if (msgEl) {
                        msgEl.textContent = "단어장을 불러왔습니다.";
                        setTimeout(() => { msgEl.textContent = ""; }, 3000);
                    }
                } catch (error) {
                    msgEl.textContent = "올바른 JSON 형식이 아닙니다.";
                    setTimeout(() => { msgEl.textContent = ""; }, 3000);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });

    /** @description 단어장 내보내기 */
    exportBtn.addEventListener("click", async () => {
        const glossary = await storage.getGlossary();
        const blob = new Blob([JSON.stringify(glossary, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        
        a.href = url;
        a.download = "translator-glossary.json";
        a.click();
        URL.revokeObjectURL(url);
    });



    /** @description 네비게이션 탭 */
    const navButtons = document.querySelectorAll(".nav-btn");
    const settingsSections = document.querySelectorAll(".settings-section");

    /** @description 네비게이션 탭 클릭 이벤트 */
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            settingsSections.forEach(section => section.classList.remove("active"));
            const targetId = btn.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });



    /** @description API 키 관리 */
    const keyInput = document.getElementById("apiKey");
    const keyBtn = document.getElementById("saveApiKey");
    const apiKeyIssueBtn = document.getElementById("apiKeyIssue");
    const dailyUsageGraph = document.getElementById("dailyUsageGraph");

    /** @description API 키 발급 버튼 클릭 이벤트 */
    if (apiKeyIssueBtn) {
        apiKeyIssueBtn.addEventListener("click", () => {
            window.open("https://aistudio.google.com/app/apikey", "_blank");
        });
    }

    /** @description 저장된 API 키 로드 */
    const savedApiKey = await storage.getApiKey();
    if (savedApiKey) keyInput.value = savedApiKey;

    /** @description API 키 저장 이벤트 핸들러 */
    keyBtn.addEventListener("click", async () => {
        const apiKey = keyInput.value.trim();
        if (apiKey) {
            await storage.setApiKey(apiKey);
            const apiKeyMsg = document.getElementById("apiKeyMsg");
            if (apiKeyMsg) {
                apiKeyMsg.textContent = "API 키가 저장되었습니다.";
                setTimeout(() => { apiKeyMsg.textContent = ""; }, 2000);
            } else console.warn("apiKeyMsg가 없습니다.");
        }
    });

    /** @description 일일 사용량 그래프 업데이트 */
    const updateDailyUsageGraph = async () => {
        const usageData = await storage.getUsageData();
        const today = new Date().toISOString().split("T")[0];
        const count = usageData?.date === today ? usageData.count : 0;
        
        /** @description 사용량 텍스트 업데이트 */
        const usageCountEl = document.getElementById("usageCount");
        if (usageCountEl) {
            usageCountEl.textContent = `${count} / 1500`;
            if (count >= 1500) usageCountEl.style.color = "red";
            else usageCountEl.style.color = "";
        }

        if (dailyUsageGraph) {
            const usagePercent = Math.min(count / 1500, 1);
            dailyUsageGraph.style.width = (usagePercent * 100) + "%";
        }
    };
    updateDailyUsageGraph();



    /** @description 단어장 검색 */
    const searchInput = document.getElementById("searchGlossary");
    if (searchInput) {
        searchInput.addEventListener("input", async () => {
            await loadGlossary();
        });
    }

    /** @description 단어장 정렬 */
    if (sortSelect) {
        sortSelect.addEventListener("change", async () => {
            await loadGlossary();
        });
        sortSelect.addEventListener("wheel", function(e) {
            e.preventDefault();
            let currentIndex = sortSelect.selectedIndex;
            if (e.deltaY > 0 && currentIndex < sortSelect.options.length - 1) sortSelect.selectedIndex = currentIndex + 1;
            else if (e.deltaY < 0 && currentIndex > 0) sortSelect.selectedIndex = currentIndex - 1;
            let event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, false);
            sortSelect.dispatchEvent(event);
        });
    }

    /** @description 단어장 목록 클릭 이벤트 */
    glossaryList.addEventListener("click", async (e) => {
        if (glossaryState === "partial") glossaryState = "full";
        else if (glossaryState === "full") glossaryState = "collapsed";
        else glossaryState = "partial";
        updateGlossaryView(glossaryState);
        await storage.setViewMode(glossaryState);
    });

    /** @description 단어장 목록 토글 이벤트 */
    glossaryToggle.addEventListener("click", async () => {
        if (glossaryState === "partial") glossaryState = "full";
        else if (glossaryState === "full") glossaryState = "collapsed";
        else glossaryState = "partial";
        updateGlossaryView(glossaryState);
        await storage.setViewMode(glossaryState);
      });

    /** @description 단어 추가 이벤트 핸들러 */
    addWordBtn.addEventListener("click", async () => {
        const source = sourceWordInput.value.trim();
        const target = targetWordInput.value.trim();

        if (source && target) {
            const glossary = await storage.getGlossary();
            const existingIndex = glossary.words.findIndex(word => normalizeText(word.source) === normalizeText(source));
            
            if (existingIndex !== -1) {
                glossary.words[existingIndex] = {
                    source,
                    target,
                    timestamp: Date.now()
                };
                await storage.setGlossary(glossary);
            } else await storage.addGlossaryItem(source, target);
            
            sourceWordInput.value = "";
            targetWordInput.value = "";
            await loadGlossary();
        }
    });

    const cleanGlossaryList = glossaryList.cloneNode(true);
    glossaryList.parentNode.replaceChild(cleanGlossaryList, glossaryList);
    glossaryList = cleanGlossaryList;


    
    /** @description API 키에 따른 탭 이동 */
    if (savedApiKey) {
        const glossaryBtn = document.querySelector(".nav-btn[data-target=\"glossarySection\"]");
        if (glossaryBtn) glossaryBtn.click();
    } else {
        const apiBtn = document.querySelector(".nav-btn[data-target=\"apiSection\"]");
        if (apiBtn) apiBtn.click();
    }

    await loadGlossaryView();
    await loadGlossary();
});