/** @description 한글 검색 향상을 위한 라이브러리 */
import { choseongIncludes, hangulIncludes } from "../utils/hangul.js";

document.addEventListener("DOMContentLoaded", async () => {
    const storage = new TranslatorStorage();
    const i18n = new window.I18nManager();

    const importBtn = document.getElementById("importGlossary");
    
    // 프리셋 관리 요소들
    const presetList = document.getElementById("presetList");
    const createPresetBtn = document.getElementById("createPreset");
    const exportDropdownBtn = document.getElementById("exportDropdown");
    const exportDropdownMenu = document.getElementById("exportDropdownMenu");
    const exportSelectedBtn = document.getElementById("exportSelected");
    const exportAllBtn = document.getElementById("exportAll");
    
    // 현재 편집 중인 프리셋
    let currentEditingPreset = null;
    
    // 현재 사이트 설정 관련 변수들
    let currentDomain = null;
    let siteSettingsPanelOpen = false;
    
    // 커스텀 모달 참조
    const customConfirmModal = document.getElementById("customConfirmModal");
    
    /**
     * @description 커스텀 확인 다이얼로그 표시
     * @param {string} message 표시할 메시지
     * @param {string} title 다이얼로그 제목
     * @param {string} icon 표시할 아이콘
     * @returns {Promise<boolean>} 사용자 선택 결과
     */
    async function showCustomConfirm(message, title = null, icon = "⚠️") {
        if (!title) {
            title = await i18n.getText("confirm") || "확인";
        }
        return new Promise((resolve) => {
            document.getElementById("confirmDialogTitle").textContent = title;
            document.getElementById("confirmDialogMessage").textContent = message;
            document.getElementById("confirmDialogIcon").textContent = icon;
            
            const confirmButton = document.getElementById("confirmDialogConfirm");
            const cancelButton = document.getElementById("confirmDialogCancel");
            
            const cleanup = () => {
                customConfirmModal.classList.remove("show");
                confirmButton.removeEventListener("click", handleConfirm);
                cancelButton.removeEventListener("click", handleCancel);
            };
            
            const handleConfirm = () => {
                cleanup();
                resolve(true);
            };
            
            const handleCancel = () => {
                cleanup();
                resolve(false);
            };
            
            confirmButton.addEventListener("click", handleConfirm);
            cancelButton.addEventListener("click", handleCancel);
            customConfirmModal.classList.add("show");
        });
    }
    
    /**
     * @description 현재 활성 탭의 도메인 가져오기
     * @returns {Promise<string|null>} 도메인명
     */
    async function getCurrentDomain() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length === 0) return null;
            
            const tab = tabs[0];
            if (!tab.url) return null;
            
            const url = new URL(tab.url);
            return url.hostname;
        } catch (error) {
            console.error("도메인 가져오기 실패:", error);
            return null;
        }
    }
    
    /**
     * @description 사이트별 설정 초기화
     * @param {string} domain 도메인명
     */
    async function resetSiteSettings(domain) {
        try {
            let resetConfirmText = await i18n.getText("resetSiteSettingsConfirm") || 
                `${domain}의 사이트별 설정을 초기화하시겠습니까?\n전역 설정을 사용하게 됩니다.`;
            resetConfirmText = resetConfirmText.replace("{domain}", domain);
            
            if (confirm(resetConfirmText)) {
                const settings = await storage.getGlossarySettings();
                
                if (settings.siteSpecificSettings && settings.siteSpecificSettings[domain]) {
                    delete settings.siteSpecificSettings[domain];
                    await storage.setGlossarySettings(settings);
                    await loadPresets(); // 프리셋 목록 새로고침
                }
            }
        } catch (error) {
            console.error("사이트 설정 초기화 실패:", error);
            const errorText = await i18n.getText("resetSiteSettingsError") || "사이트 설정 초기화에 실패했습니다.";
            alert(errorText);
        }
    }
    
    /**
     * @description 현재 사이트 정보 로드 및 표시
     */
    async function loadCurrentSiteInfo() {
        try {
            currentDomain = await getCurrentDomain();
            const currentDomainElement = document.getElementById("currentDomainText");
            const siteStatusElement = document.getElementById("siteStatusText");
            
            if (!currentDomain) {
                currentDomainElement.textContent = "-";
                siteStatusElement.textContent = await i18n.getText("noActiveTab") || "활성 탭 없음";
                return;
            }
            
            currentDomainElement.textContent = currentDomain;
            
            // 사이트별 설정 확인
            const settings = await storage.getGlossarySettings();
            const hasSiteSetting = await checkDomainMatch(currentDomain, settings);
            
            if (hasSiteSetting) {
                const activePresets = hasSiteSetting.presets || [];
                if (activePresets.length > 0) {
                    const statusText = await i18n.getText("usingSiteSettings") || 
                        `사이트 설정 사용 (${activePresets.length}개 프리셋)`;
                    siteStatusElement.textContent = statusText.replace("{count}", activePresets.length);
                } else {
                    const statusText = await i18n.getText("siteNoPresets") || "사이트 설정 사용 (프리셋 없음)";
                    siteStatusElement.textContent = statusText;
                }
            } else {
                const statusText = await i18n.getText("useGlobalSettings") || "전역 설정 사용";
                siteStatusElement.textContent = statusText;
            }
        } catch (error) {
            console.error("현재 사이트 정보 로드 실패:", error);
        }
    }
    
    /**
     * @description 도메인 매칭 확인 (서브도메인 지원)
     * @param {string} currentDomain 현재 도메인
     * @param {Object} settings 설정 객체
     * @returns {Promise<Object|null>} 매칭된 설정 또는 null
     */
    async function checkDomainMatch(currentDomain, settings) {
        if (!settings.siteSpecificSettings || !currentDomain) return null;
        
        // 정확한 일치 우선 확인
        if (settings.siteSpecificSettings[currentDomain]) {
            return settings.siteSpecificSettings[currentDomain];
        }
        
        // 서브도메인 매칭 확인 (exactMatch가 false인 경우)
        let bestMatch = null;
        let bestMatchLength = 0;
        
        for (const [domain, setting] of Object.entries(settings.siteSpecificSettings)) {
            // exactMatch가 true면 정확한 도메인만 일치
            if (setting.exactMatch) {
                continue;
            }
            
            // 서브도메인 매칭: 현재 도메인이 설정된 도메인의 서브도메인인지 확인
            if (currentDomain.endsWith('.' + domain) || domain.endsWith('.' + currentDomain)) {
                // 더 구체적인 매칭을 우선 (긴 도메인)
                if (domain.length > bestMatchLength) {
                    bestMatch = setting;
                    bestMatchLength = domain.length;
                }
            }
        }
        
        return bestMatch;
    }
    
    /**
     * @description 사이트 설정 패널 토글
     */
    async function toggleSiteSettingsPanel() {
        const panel = document.getElementById("siteSettingsPanel");
        const toggleBtn = document.getElementById("toggleSiteSettings");
        
        if (siteSettingsPanelOpen) {
            panel.classList.add("hidden");
            toggleBtn.classList.remove("active");
            toggleBtn.textContent = await i18n.getText("configure") || "설정";
            siteSettingsPanelOpen = false;
        } else {
            await loadSiteSettingsPanel();
            panel.classList.remove("hidden");
            toggleBtn.classList.add("active");
            toggleBtn.textContent = await i18n.getText("close") || "닫기";
            siteSettingsPanelOpen = true;
        }
    }
    
    /**
     * @description 사이트 설정 패널 내용 로드
     */
    async function loadSiteSettingsPanel() {
        if (!currentDomain) return;
        
        try {
            const settings = await storage.getGlossarySettings();
            const presets = await storage.getGlossaryPresets();
            const sitePresetsList = document.getElementById("sitePresetsList");
            const exactDomainMatch = document.getElementById("exactDomainMatch");
            
            // 현재 설정 로드
            const currentSiteSetting = await checkDomainMatch(currentDomain, settings);
            const activePresets = currentSiteSetting?.presets || [];
            const isExactMatch = currentSiteSetting?.exactMatch || false;
            
            exactDomainMatch.checked = isExactMatch;
            
            // 프리셋 목록 생성
            sitePresetsList.innerHTML = "";
            
            if (Object.keys(presets).length === 0) {
                const noPresetsText = await i18n.getText("noPresetsAvailable") || "사용 가능한 프리셋이 없습니다.";
                sitePresetsList.innerHTML = `<div class="no-presets">${noPresetsText}</div>`;
                return;
            }
            
            // i18n 텍스트를 미리 가져오기
            const wordsCountTemplate = await i18n.getText("wordsCount");
            
            Object.values(presets).forEach(preset => {
                const isActive = activePresets.includes(preset.id);
                const wordCount = preset.words ? preset.words.length : 0;
                
                const presetItem = document.createElement("div");
                presetItem.className = "site-preset-item";
                const displayCount = wordsCountTemplate ? wordsCountTemplate.replace("{count}", wordCount) : `${wordCount}개`;
                presetItem.innerHTML = `
                    <input type="checkbox" id="site-preset-${preset.id}" ${isActive ? "checked" : ""} 
                           data-preset-id="${preset.id}">
                    <label for="site-preset-${preset.id}" class="site-preset-name">${preset.name}</label>
                    <span class="site-preset-count">${displayCount}</span>
                `;
                
                sitePresetsList.appendChild(presetItem);
            });
        } catch (error) {
            console.error("사이트 설정 패널 로드 실패:", error);
        }
    }
    
    /**
     * @description 사이트 설정 적용
     */
    async function applySiteSettings() {
        if (!currentDomain) return;
        
        try {
            const settings = await storage.getGlossarySettings();
            const exactDomainMatch = document.getElementById("exactDomainMatch").checked;
            
            // 선택된 프리셋 수집
            const selectedPresets = Array.from(
                document.querySelectorAll("#sitePresetsList input[type='checkbox']:checked")
            ).map(cb => cb.dataset.presetId);
            
            // 설정 저장
            if (!settings.siteSpecificSettings) {
                settings.siteSpecificSettings = {};
            }
            
            // 프리셋이 선택되지 않았어도 명시적으로 빈 배열로 저장하여 "프리셋 없음" 상태 유지
            settings.siteSpecificSettings[currentDomain] = {
                presets: selectedPresets, // 빈 배열일 수도 있음
                exactMatch: exactDomainMatch,
                lastUsed: Date.now()
            };
            
            await storage.setGlossarySettings(settings);
            
            // UI 새로고침
            await loadCurrentSiteInfo();
            await loadPresets();
            await toggleSiteSettingsPanel(); // 패널 닫기
            
            const appliedText = await i18n.getText("siteSettingsApplied") || "사이트 설정이 적용되었습니다.";
            
        } catch (error) {
            console.error("사이트 설정 적용 실패:", error);
            const errorText = await i18n.getText("siteSettingsApplyError") || "사이트 설정 적용에 실패했습니다.";
            alert(errorText);
        }
    }
    
    /**
     * @description 사이트 설정 초기화
     */
    async function resetCurrentSiteSettings() {
        if (!currentDomain) return;
        
        try {
            const confirmText = await i18n.getText("resetCurrentSiteConfirm") || 
                              `현재 사이트(${currentDomain})의 설정을 초기화하시겠습니까?`;
            
            const resetConfirmTitle = await i18n.getText("resetConfirm") || "초기화 확인";
            const confirmResult = await showCustomConfirm(confirmText, resetConfirmTitle, "⚠️");
            if (!confirmResult) return;
            
            const settings = await storage.getGlossarySettings();
            if (settings.siteSpecificSettings) {
                delete settings.siteSpecificSettings[currentDomain];
                await storage.setGlossarySettings(settings);
                
                // UI 새로고침
                await loadCurrentSiteInfo();
                await loadPresets();
                await loadSiteSettingsPanel(); // 패널 내용 새로고침
                
                const resetText = await i18n.getText("siteSettingsReset") || "사이트 설정이 초기화되었습니다.";
            }
        } catch (error) {
            console.error("사이트 설정 초기화 실패:", error);
        }
    }

    /**
     * @description 프리셋 목록 로드 및 표시
     */
    async function loadPresets() {
        if (!presetList) return;
        
        const presets = await storage.getGlossaryPresets();
        const settings = await storage.getGlossarySettings();
        const presetIds = Object.keys(presets);
        
        // 현재 활성 탭의 도메인 정보 가져오기
        const currentDomain = await getCurrentDomain();
        
        // 사이트별 설정이 있으면 사용, 없으면 전역 설정 사용
        let activePresets = settings.activePresets || [];
        let isSiteSpecific = false;
        
        if (currentDomain && settings.siteSpecificSettings && settings.siteSpecificSettings[currentDomain]) {
            activePresets = settings.siteSpecificSettings[currentDomain].presets || [];
            isSiteSpecific = true;
        }
        
        if (presetIds.length === 0) {
            const emptyText = await i18n.getText("presetEmpty") || "프리셋이 없습니다. 새 프리셋을 만들어주세요.";
            presetList.innerHTML = `<div class="preset-empty">${emptyText}</div>`;
            currentEditingPreset = null;
            return;
        }
        
        presetList.innerHTML = '';
        
        // 사이트별 설정 표시기 추가
        if (isSiteSpecific && currentDomain) {
            const siteIndicator = document.createElement("div");
            siteIndicator.className = "site-indicator";
            
            const siteInfoText = await i18n.getText("siteSpecificSettings") || "사이트별 설정";
            const resetTitleText = await i18n.getText("resetToGlobalSettings") || "전역 설정으로 되돌리기";
            
            siteIndicator.innerHTML = `
                <div class="site-info">
                    <span class="site-icon">🌐</span>
                    <div class="site-text-container">
                        <span class="site-text">${siteInfoText}</span>
                        <small class="site-domain">${currentDomain}</small>
                    </div>
                </div>
                <button class="site-reset-btn" title="${resetTitleText}">
                    ↺
                </button>
            `;
            
            // 사이트별 설정 초기화 버튼 이벤트
            const resetBtn = siteIndicator.querySelector(".site-reset-btn");
            resetBtn.addEventListener("click", () => resetSiteSettings(currentDomain));
            
            presetList.appendChild(siteIndicator);
        }
        
        // 프리셋 정렬 (최근 수정순)
        const sortedPresets = presetIds
            .map(id => presets[id])
            .sort((a, b) => (b.updated || 0) - (a.updated || 0));

        // i18n 텍스트를 미리 가져오기
        const deleteText = await i18n.getText("delete") || "삭제";
        const wordsCountTemplate = await i18n.getText("wordsCount");
        const addText = await i18n.getText("add") || "추가";
        const searchText = await i18n.getText("search") || "🔍 검색";
        const sortRecentText = await i18n.getText("sortRecent") || "최신순";
        const sortOldText = await i18n.getText("sortOld") || "오래된순";
        const sortModifiedText = await i18n.getText("sortModified") || "수정순";
        const sortModifiedReverseText = await i18n.getText("sortModifiedReverse") || "수정역순";
        const sortAscText = await i18n.getText("sortAsc") || "이름순";
        const sortDescText = await i18n.getText("sortDesc") || "이름역순";
        const sourceWordPlaceholderText = await i18n.getText("sourceWordPlaceholder") || "원본 단어";
        const targetWordPlaceholderText = await i18n.getText("targetWordPlaceholder") || "번역 단어";
            
        for (const preset of sortedPresets) {
            const presetItem = document.createElement('div');
            presetItem.className = 'preset-item';
            presetItem.dataset.presetId = preset.id;
            
            const isActive = activePresets.includes(preset.id);
            const wordCount = preset.words ? preset.words.length : 0;
            const wordsText = wordsCountTemplate ? wordsCountTemplate.replace("{count}", wordCount) : `${wordCount}개 단어`;
            
            presetItem.innerHTML = `
                <div class="preset-header" data-preset-id="${preset.id}">
                    <div class="preset-checkbox">
                        <input type="checkbox" id="preset-${preset.id}" ${isActive ? 'checked' : ''}>
                    </div>
                    <div class="preset-info">
                        <div class="preset-name" data-preset-id="${preset.id}">${preset.name}</div>
                        <div class="preset-stats">${wordsText}</div>
                    </div>
                    <div class="preset-actions-item">
                        <button class="preset-btn delete" data-preset-id="${preset.id}">${deleteText}</button>
                    </div>
                </div>
                <div class="preset-edit-area" id="edit-area-${preset.id}">
                    <div class="inline-word-editing">
                        <div class="glossary-input-container">
                            <div class="inline-glossary-input">
                                <input type="text" class="source-word-input" placeholder="${sourceWordPlaceholderText}">
                                <span class="arrow">→</span>
                                <input type="text" class="target-word-input" placeholder="${targetWordPlaceholderText}">
                                <button class="add-word-btn">${addText}</button>
                            </div>
                        </div>
                        <div class="inline-glossary-filter">
                            <input type="text" class="search-glossary-input" placeholder="${searchText}">
                            <select class="sort-order-select">
                                <option value="recent">${sortRecentText}</option>
                                <option value="old">${sortOldText}</option>
                                <option value="modified">${sortModifiedText}</option>
                                <option value="modified_reverse">${sortModifiedReverseText}</option>
                                <option value="asc">${sortAscText}</option>
                                <option value="desc">${sortDescText}</option>
                            </select>
                        </div>
                        <div class="inline-glossary-list" id="glossary-list-${preset.id}">
                            <!-- 단어장 목록 -->
                        </div>
                    </div>
                </div>
            `;
            
            presetList.appendChild(presetItem);
        }
        
        // 이벤트 리스너 추가
        addPresetEventListeners();
    }
    
    /**
     * @description 프리셋 이벤트 리스너 추가
     */
    function addPresetEventListeners() {
        if (!presetList) return;
        
        // 체크박스 이벤트 (이벤트 위임 사용)
        presetList.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox' && e.target.id.startsWith('preset-')) {
                const presetId = e.target.id.replace('preset-', '');
                const settings = await storage.getGlossarySettings();
                const currentDomain = await getCurrentDomain();
                
                // 사이트별 설정인지 확인
                const hasSiteSetting = currentDomain && settings.siteSpecificSettings && settings.siteSpecificSettings[currentDomain];
                
                if (hasSiteSetting) {
                    // 사이트별 설정 업데이트
                    const siteSettings = settings.siteSpecificSettings[currentDomain];
                    if (e.target.checked) {
                        if (!siteSettings.presets.includes(presetId)) {
                            siteSettings.presets.push(presetId);
                        }
                    } else {
                        siteSettings.presets = siteSettings.presets.filter(id => id !== presetId);
                    }
                    siteSettings.lastUsed = Date.now();
                } else {
                    // 사이트별 설정 생성
                    if (currentDomain) {
                        // 전역 설정을 기반으로 사이트별 설정 생성
                        const currentActivePresets = [...(settings.activePresets || [])];
                        
                        if (e.target.checked && !currentActivePresets.includes(presetId)) {
                            currentActivePresets.push(presetId);
                        } else if (!e.target.checked) {
                            const index = currentActivePresets.indexOf(presetId);
                            if (index > -1) {
                                currentActivePresets.splice(index, 1);
                            }
                        }
                        
                        // 사이트별 설정 생성
                        if (!settings.siteSpecificSettings) {
                            settings.siteSpecificSettings = {};
                        }
                        settings.siteSpecificSettings[currentDomain] = {
                            presets: currentActivePresets,
                            lastUsed: Date.now()
                        };
                    } else {
                        // 전역 설정 업데이트 (도메인이 없는 경우)
                        if (e.target.checked) {
                            if (!settings.activePresets.includes(presetId)) {
                                settings.activePresets.push(presetId);
                            }
                        } else {
                            settings.activePresets = settings.activePresets.filter(id => id !== presetId);
                        }
                        await storage.setActivePresets(settings.activePresets);
                    }
                }
                
                // 설정 저장
                if (storage.setGlossarySettings) {
                    await storage.setGlossarySettings(settings);
                } else {
                    await chrome.storage.local.set({ glossarySettings: settings });
                }
                
                e.stopPropagation(); // 클릭 이벤트 전파 방지
            }
        });
        
        // 프리셋 헤더 클릭으로 편집 영역 토글
        presetList.addEventListener('click', async (e) => {
            const presetHeader = e.target.closest('.preset-header');
            if (!presetHeader) return;
            
            // 체크박스나 삭제 버튼 클릭 시 무시
            if (e.target.type === 'checkbox' || e.target.classList.contains('preset-btn')) {
                return;
            }
            
            const presetId = presetHeader.dataset.presetId;
            const presetItem = presetHeader.closest('.preset-item');
            
            // requestAnimationFrame을 사용하여 레이아웃 안정화
            requestAnimationFrame(() => {
                // 다른 모든 프리셋 접기
                document.querySelectorAll('.preset-item.expanded').forEach(item => {
                    if (item !== presetItem) {
                        item.classList.remove('expanded');
                    }
                });
                
                // 현재 프리셋 토글
                presetItem.classList.toggle('expanded');
                
                // 편집 영역이 열렸을 때 단어장 로드
                if (presetItem.classList.contains('expanded')) {
                    currentEditingPreset = presetId;
                    loadInlineGlossary(presetId).then(() => {
                        setupInlineEditListeners(presetId);
                    });
                }
            });
        });
        
        // 프리셋 이름 더블클릭으로 편집
        presetList.addEventListener('dblclick', async (e) => {
            if (e.target.classList.contains('preset-name')) {
                e.stopPropagation(); // 헤더 클릭 이벤트 방지
                
                const presetId = e.target.dataset.presetId;
                const presets = await storage.getGlossaryPresets();
                const preset = presets[presetId];
                
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'preset-name editing';
                input.value = preset.name;
                
                e.target.replaceWith(input);
                input.focus();
                input.select();
                
                const saveEdit = async () => {
                    const newName = input.value.trim();
                    if (newName && newName !== preset.name) {
                        await storage.updateGlossaryPreset(presetId, { name: newName });
                        await loadPresets();
                    } else {
                        await loadPresets();
                    }
                };
                
                input.addEventListener('blur', saveEdit);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    } else if (e.key === 'Escape') {
                        loadPresets();
                    }
                });
            }
        });
        
        // 삭제 버튼 이벤트
        presetList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('preset-btn') && e.target.classList.contains('delete')) {
                e.stopPropagation(); // 헤더 클릭 이벤트 방지
                
                const presetId = e.target.dataset.presetId;
                const presets = await storage.getGlossaryPresets();
                const preset = presets[presetId];
                
                const confirmText = await i18n.getText("deletePresetConfirm");
                const message = confirmText ? confirmText.replace("{name}", preset.name) : `"${preset.name}" 프리셋을 삭제하시겠습니까?`;
                if (confirm(message)) {
                    await storage.deleteGlossaryPreset(presetId);
                    
                    // 삭제된 프리셋이 현재 편집 대상이었다면 초기화
                    if (currentEditingPreset === presetId) {
                        currentEditingPreset = null;
                    }
                    
                    await loadPresets();
                }
            }
        });
    }

    /**
     * @description 인라인 단어장 로드
     * @param {string} presetId 프리셋 ID
     */
    async function loadInlineGlossary(presetId) {
        const glossaryListEl = document.getElementById(`glossary-list-${presetId}`);
        const searchInput = document.querySelector(`#edit-area-${presetId} .search-glossary-input`);
        const sortSelect = document.querySelector(`#edit-area-${presetId} .sort-order-select`);
        
        if (!glossaryListEl) return;
        
        // i18n 텍스트를 미리 가져오기
        const deleteBtnText = await i18n.getText("delete") || "삭제";
        const notFoundText = await i18n.getText("presetNotFound") || "프리셋을 찾을 수 없습니다.";
        const noWordsText = await i18n.getText("noWords") || "단어가 없습니다.";
        
        const presets = await storage.getGlossaryPresets();
        const preset = presets[presetId];
        
        if (!preset) {
            glossaryListEl.innerHTML = `<div style="text-align: center; padding: 10px; color: #666;">${notFoundText}</div>`;
            return;
        }
        
        let entries = preset.words || [];
        
        // 검색 필터링
        if (searchInput && searchInput.value.trim()) {
            const query = searchInput.value.trim().toLowerCase();
            entries = entries.filter(item => {
                const source = item.source.toLowerCase();
                const target = item.target.toLowerCase();
                const sourceNoSpace = source.replace(/\s/g, "");
                const targetNoSpace = target.replace(/\s/g, "");
                const queryNoSpace = query.replace(/\s/g, "");
                
                return source.includes(query) ||
                       target.includes(query) ||
                       hangulIncludes(sourceNoSpace, queryNoSpace) ||
                       hangulIncludes(targetNoSpace, queryNoSpace) ||
                       choseongIncludes(sourceNoSpace, queryNoSpace) ||
                       choseongIncludes(targetNoSpace, queryNoSpace);
            });
        }
        
        // 정렬 처리
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
        
        glossaryListEl.innerHTML = "";
        
        if (entries.length === 0) {
            glossaryListEl.innerHTML = `<div style="text-align: center; padding: 10px; color: #666;">${noWordsText}</div>`;
            return;
        }
        
        entries.forEach((item) => {
            const row = document.createElement("div");
            row.className = "glossary-item";
            row.dataset.originalSource = item.source;
            row.dataset.presetId = presetId;
            
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
            deleteBtn.textContent = deleteBtnText;
            
            const updateItem = async () => {
                const newSource = sourceInput.value.trim();
                const newTarget = targetInput.value.trim();
                const oldSource = row.dataset.originalSource;
                if (newSource && newTarget) {
                    const presets = await storage.getGlossaryPresets();
                    const preset = presets[presetId];
                    if (preset) {
                        const words = preset.words || [];
                        const index = words.findIndex(item => item.source === oldSource);
                        if (index !== -1) {
                            words[index] = {
                                source: newSource,
                                target: newTarget,
                                timestamp: Date.now()
                            };
                            await storage.updateGlossaryPreset(presetId, { words });
                            row.dataset.originalSource = newSource;
                            await loadInlineGlossary(presetId);
                            await loadPresets();
                        }
                    }
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
                await storage.removeWordFromPreset(presetId, currentSource);
                await loadInlineGlossary(presetId);
                await loadPresets();
            });
            
            row.appendChild(sourceInput);
            row.appendChild(arrowSpan);
            row.appendChild(targetInput);
            row.appendChild(deleteBtn);
            
            glossaryListEl.appendChild(row);
        });
    }

    /**
     * @description 인라인 편집 리스너 설정
     * @param {string} presetId 프리셋 ID
     */
    function setupInlineEditListeners(presetId) {
        const editArea = document.getElementById(`edit-area-${presetId}`);
        if (!editArea) return;
        
        const sourceInput = editArea.querySelector('.source-word-input');
        const targetInput = editArea.querySelector('.target-word-input');
        const addBtn = editArea.querySelector('.add-word-btn');
        const searchInput = editArea.querySelector('.search-glossary-input');
        const sortSelect = editArea.querySelector('.sort-order-select');
        
        // 단어 추가
        const addWord = async () => {
            const source = sourceInput.value.trim();
            const target = targetInput.value.trim();
            
            if (source && target) {
                await storage.addWordToPreset(presetId, source, target);
                sourceInput.value = '';
                targetInput.value = '';
                await loadInlineGlossary(presetId);
                await loadPresets();
            }
        };
        
        if (addBtn) {
            addBtn.addEventListener('click', addWord);
        }
        
        if (sourceInput) {
            sourceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addWord();
            });
        }
        
        if (targetInput) {
            targetInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addWord();
            });
        }
        
        // 검색
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                loadInlineGlossary(presetId);
            });
        }
        
        // 정렬
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                loadInlineGlossary(presetId);
            });
        }
    }

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


    /** @description 단어장 불러오기 */
    if (importBtn) {
        importBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const msgEl = document.getElementById("glossaryMsg");
                try {
                    const glossary = JSON.parse(event.target.result);
                    
                    if (!glossary || typeof glossary !== 'object') {
                        throw new Error("유효한 단어장 형식이 아닙니다.");
                    }
                    
                    // 단일 프리셋 파일인 경우
                    if (Array.isArray(glossary.words)) {
                        if (!currentEditingPreset) {
                            // 편집 중인 프리셋이 없으면 새로 생성
                            const language = await storage.getTranslationLanguage();
                            const defaultName = await i18n.getText("importedGlossary") || '가져온 단어장';
                            currentEditingPreset = await storage.createGlossaryPreset(defaultName);
                            await loadPresets();
                        }
                        
                        await storage.updateGlossaryPreset(currentEditingPreset, {
                            words: glossary.words,
                            version: glossary.version || 1
                        });
                        
                        await loadPresets();
                        
                        const loadedText = await i18n.getText("glossaryLoaded") || "단어장을 불러왔습니다.";
                        alert(loadedText);
                    }
                    // 다중 프리셋 파일인 경우 (미래 확장용)
                    else {
                        const unsupportedText = await i18n.getText("unsupportedFormat") || "지원하지 않는 형식입니다.";
                        throw new Error(unsupportedText);
                    }
                } catch (error) {
                    const invalidText = await i18n.getText("invalidGlossary") || "올바른 단어장 형식이 아닙니다.";
                    alert(invalidText);
                }
            };
            reader.readAsText(file);
        };
        input.click();
        });
    }

    /** @description 새 프리셋 생성 */
    if (createPresetBtn) {
        createPresetBtn.addEventListener("click", async () => {
            const language = await storage.getTranslationLanguage();
            const presets = await storage.getGlossaryPresets();
            const presetCount = Object.keys(presets).length + 1;
            
            // 언어에 따른 기본 이름 생성
            let defaultName = `단어장${presetCount}`;
            const nameMap = {
                'Korean': `단어장${presetCount}`,
                'Japanese': `単語集${presetCount}`,
                'Chinese (Simplified)': `词汇表${presetCount}`,
                'Chinese (Traditional)': `詞彙表${presetCount}`,
                'English': `Glossary${presetCount}`,
                'Spanish': `Glosario${presetCount}`,
                'French': `Glossaire${presetCount}`,
                'German': `Glossar${presetCount}`,
                'Italian': `Glossario${presetCount}`,
                'Portuguese': `Glossário${presetCount}`,
                'Russian': `Словарь${presetCount}`,
                'Arabic': `مسرد${presetCount}`,
                'Hindi': `शब्दकोश${presetCount}`,
                'Thai': `พจนานุกรม${presetCount}`,
                'Vietnamese': `Từ điển${presetCount}`
            };
            
            if (nameMap[language]) {
                defaultName = nameMap[language];
            }
            
            const presetId = await storage.createGlossaryPreset(defaultName);
            await loadPresets();
            
            // 새 프리셋을 편집 대상으로 설정
            currentEditingPreset = presetId;
        });
    }

    /** @description 내보내기 드롭다운 토글 */
    if (exportDropdownBtn && exportDropdownMenu) {
        exportDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            exportDropdownMenu.classList.toggle("show");
        });
        
        // 드롭다운 외부 클릭 시 닫기
        document.addEventListener("click", () => {
            exportDropdownMenu.classList.remove("show");
        });
    }
    
    /** @description 선택된 프리셋 내보내기 */
    if (exportSelectedBtn) {
        exportSelectedBtn.addEventListener("click", async () => {
            if (exportDropdownMenu) exportDropdownMenu.classList.remove("show");
            
            const presets = await storage.getGlossaryPresets();
            const settings = await storage.getGlossarySettings();
            const activePresets = settings.activePresets;
            
            if (activePresets.length === 0) {
                const noPresetsText = await i18n.getText("noActivePresets") || "내보낼 활성 프리셋이 없습니다.";
                alert(noPresetsText);
                return;
            }
            
            if (activePresets.length === 1) {
                // 단일 프리셋 내보내기
                const preset = presets[activePresets[0]];
                const glossary = {
                    words: preset.words || [],
                    version: preset.version || 1
                };
                
                const blob = new Blob([JSON.stringify(glossary, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                
                a.href = url;
                a.download = `${preset.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                // 다중 프리셋 통합 내보내기
                const combinedWords = [];
                const seenWords = new Set();
                
                activePresets.forEach(presetId => {
                    if (presets[presetId] && presets[presetId].words) {
                        presets[presetId].words.forEach(word => {
                            const key = word.source.toLowerCase().trim();
                            if (!seenWords.has(key)) {
                                seenWords.add(key);
                                combinedWords.push(word);
                            }
                        });
                    }
                });
                
                const glossary = {
                    words: combinedWords,
                    version: 1
                };
                
                const blob = new Blob([JSON.stringify(glossary, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                
                a.href = url;
                a.download = "combined-glossary.json";
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    }
    
    /** @description 모든 프리셋 내보내기 */
    if (exportAllBtn) {
        exportAllBtn.addEventListener("click", async () => {
            if (exportDropdownMenu) exportDropdownMenu.classList.remove("show");
            
            const presets = await storage.getGlossaryPresets();
            const presetIds = Object.keys(presets);
            
            if (presetIds.length === 0) {
                const noPresetsText = await i18n.getText("noPresetsToExport") || "내보낼 프리셋이 없습니다.";
                alert(noPresetsText);
                return;
            }
            
            // 각 프리셋을 별도 파일로 다운로드
            for (const presetId of presetIds) {
                const preset = presets[presetId];
                const glossary = {
                    words: preset.words || [],
                    version: preset.version || 1
                };
                
                const blob = new Blob([JSON.stringify(glossary, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                
                a.href = url;
                a.download = `${preset.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                // 브라우저가 다운로드를 처리할 수 있도록 지연
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            const exportedText = await i18n.getText("presetsExported");
            const message = exportedText ? exportedText.replace("{count}", presetIds.length) : `${presetIds.length}개 프리셋을 내보냈습니다.`;
            alert(message);
        });
    }

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

    /** @description 모델 선택 */
    const modelSelect = document.getElementById("modelSelect");
    
    /** @description 고급 설정 버튼 */
    const openAdvancedSettingsBtn = document.getElementById("openAdvancedSettings");
    const openAdvancedSettingsGlossaryBtn = document.getElementById("openAdvancedSettingsGlossary");

    /** @description 고급 설정 페이지 열기 */
    if (openAdvancedSettingsBtn) {
        openAdvancedSettingsBtn.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    }
    
    if (openAdvancedSettingsGlossaryBtn) {
        openAdvancedSettingsGlossaryBtn.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    }

    /** @description 모델 선택 초기화 */
    const savedModel = await storage.getTranslationModel();
    if (savedModel && modelSelect) {
        modelSelect.value = savedModel;
    }

    /** @description 모델 선택 변경 이벤트 */
    if (modelSelect) {
        modelSelect.addEventListener("change", async () => {
            const selectedModel = modelSelect.value;
            await storage.setTranslationModel(selectedModel);
        });
    }
    
    /** @description 언어 선택 변경 이벤트 */
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
        // 저장된 언어 로드
        const savedLanguage = await storage.getTranslationLanguage();
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }
        
        languageSelect.addEventListener("change", async () => {
            const selectedLanguage = languageSelect.value;
            await storage.setTranslationLanguage(selectedLanguage);
            // UI 언어 업데이트
            await i18n.updateAllTexts();
        });
    }




    /** @description 기본적으로 단어장 탭 활성화 */
    const glossaryBtn = document.querySelector(".nav-btn[data-target=\"glossarySection\"]");
    if (glossaryBtn) glossaryBtn.click();

    // 현재 사이트 정보 로드
    await loadCurrentSiteInfo();
    
    // 현재 사이트 설정 관련 이벤트 리스너
    const toggleSiteSettingsBtn = document.getElementById("toggleSiteSettings");
    const applySiteSettingsBtn = document.getElementById("applySiteSettings");
    const resetSiteSettingsBtn = document.getElementById("resetSiteSettings");
    const cancelSiteSettingsBtn = document.getElementById("cancelSiteSettings");
    
    if (toggleSiteSettingsBtn) {
        toggleSiteSettingsBtn.addEventListener("click", () => {
            toggleSiteSettingsPanel();
        });
    }
    
    if (applySiteSettingsBtn) {
        applySiteSettingsBtn.addEventListener("click", () => {
            applySiteSettings();
        });
    }
    
    if (resetSiteSettingsBtn) {
        resetSiteSettingsBtn.addEventListener("click", () => {
            resetCurrentSiteSettings();
        });
    }
    
    if (cancelSiteSettingsBtn) {
        cancelSiteSettingsBtn.addEventListener("click", () => {
            toggleSiteSettingsPanel();
        });
    }

    await loadPresets();

    // 이미 위에서 언어 선택 초기화와 이벤트 리스너가 설정되었음

    // 페이지 로드 시 UI 언어 업데이트
    await i18n.updateAllTexts();
});