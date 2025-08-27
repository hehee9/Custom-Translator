// 한글 검색 강화를 위한 라이브러리 동적 로드
let hangulUtils = null;

async function loadHangulUtils() {
    if (hangulUtils) return hangulUtils;
    
    try {
        const module = await import('../utils/hangul.js');
        hangulUtils = module;
        return hangulUtils;
    } catch (error) {
        console.warn(await i18n.getText('hangulUtilsLoadFailed') || '한글 검색 유틸리티를 로드할 수 없습니다:', error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const storage = new TranslatorStorage();
    const i18n = new window.I18nManager();
    
    // 한글 검색 유틸리티 로드
    await loadHangulUtils();
    
    // 다국어 초기화
    await i18n.updateDataI18nElements();

    // 사이드바 네비게이션 처리
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const settingSections = document.querySelectorAll(".settings-section");

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            // 모든 사이드바 아이템과 섹션의 활성 상태 제거
            sidebarItems.forEach(i => i.classList.remove("active"));
            settingSections.forEach(s => s.classList.remove("active"));
            
            // 클릭된 아이템 활성화
            item.classList.add("active");
            const targetSection = document.getElementById(item.dataset.target);
            if (targetSection) {
                targetSection.classList.add("active");
            }
        });
    });

    // API 설정 관련 요소들
    const geminiTab = document.getElementById("geminiTab");
    const openaiTab = document.getElementById("openaiTab");
    const cerebrasTab = document.getElementById("cerebrasTab");
    const geminiApiSection = document.getElementById("geminiApiSection");
    const openaiApiSection = document.getElementById("openaiApiSection");
    const cerebrasApiSection = document.getElementById("cerebrasApiSection");

    // API 키 입력 요소들
    const apiKeyInput = document.getElementById("apiKey");
    const saveApiKeyBtn = document.getElementById("saveApiKey");
    const apiKeyMsg = document.getElementById("apiKeyMsg");
    const apiKeyIssueBtn = document.getElementById("apiKeyIssue");

    const openaiApiKeyInput = document.getElementById("openaiApiKey");
    const saveOpenaiApiKeyBtn = document.getElementById("saveOpenaiApiKey");
    const openaiKeyMsg = document.getElementById("openaiKeyMsg");
    const openaiKeyIssueBtn = document.getElementById("openaiKeyIssue");

    const cerebrasApiKeyInput = document.getElementById("cerebrasApiKey");
    const saveCerebrasApiKeyBtn = document.getElementById("saveCerebrasApiKey");
    const cerebrasKeyMsg = document.getElementById("cerebrasKeyMsg");
    const cerebrasKeyIssueBtn = document.getElementById("cerebrasKeyIssue");

    // API 탭 전환 함수
    function resetAllApiTabs() {
        geminiTab.classList.remove("active");
        openaiTab.classList.remove("active");
        cerebrasTab.classList.remove("active");
        geminiApiSection.classList.remove("active");
        openaiApiSection.classList.remove("active");
        cerebrasApiSection.classList.remove("active");
    }

    // API 탭 이벤트 리스너
    geminiTab.addEventListener("click", () => {
        resetAllApiTabs();
        geminiTab.classList.add("active");
        geminiApiSection.classList.add("active");
    });

    openaiTab.addEventListener("click", () => {
        resetAllApiTabs();
        openaiTab.classList.add("active");
        openaiApiSection.classList.add("active");
    });

    cerebrasTab.addEventListener("click", () => {
        resetAllApiTabs();
        cerebrasTab.classList.add("active");
        cerebrasApiSection.classList.add("active");
    });

    // API 키 발급 버튼 이벤트
    apiKeyIssueBtn?.addEventListener("click", () => {
        window.open("https://aistudio.google.com/app/apikey", "_blank");
    });

    openaiKeyIssueBtn?.addEventListener("click", () => {
        window.open("https://platform.openai.com/api-keys", "_blank");
    });

    cerebrasKeyIssueBtn?.addEventListener("click", () => {
        window.open("https://cloud.cerebras.ai/platform", "_blank");
    });

    // 저장된 API 키 로드
    async function loadSavedApiKeys() {
        try {
            const geminiKey = await storage.getApiKey();
            if (geminiKey && apiKeyInput) {
                apiKeyInput.value = geminiKey;
            }

            const openaiKey = await storage.getOpenAIApiKey();
            if (openaiKey && openaiApiKeyInput) {
                openaiApiKeyInput.value = openaiKey;
            }

            const cerebrasKey = await storage.getCerebrasApiKey();
            if (cerebrasKey && cerebrasApiKeyInput) {
                cerebrasApiKeyInput.value = cerebrasKey;
            }
        } catch (error) {
            console.error(await i18n.getText('apiKeyLoadFailed') || "API 키 로드 실패:", error);
        }
    }

    // 메시지 표시 함수
    function showMessage(element, message, isError = false) {
        if (element) {
            element.textContent = message;
            element.className = `message ${isError ? 'error' : 'success'}`;
            setTimeout(() => {
                element.textContent = "";
                element.className = "message";
            }, 3000);
        }
    }

    // 라이선스 모달 표시 함수
    function showLicenseModal() {
        const modal = document.getElementById("licensesModal");
        const content = document.getElementById("licensesContent");
        
        // 라이선스 정보 HTML 생성
        const licensesHTML = `
            <div class="license-section">
                <h3>Custom Translator Chrome Extension</h3>
                <h4>MIT License</h4>
                <p>Copyright (c) 2024 Custom Translator Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</p>
            </div>

            <div class="license-section">
                <h3>Third Party Libraries</h3>
                
                <h4>Chrome Extensions API</h4>
                <p>Google Chrome Extensions API
Licensed under Chrome Web Store Developer Agreement
https://developer.chrome.com/docs/webstore/developer_agreement/</p>
                
                <h4>Google Gemini API</h4>
                <p>Google AI Studio / Gemini API
Licensed under Google AI/ML Terms of Service
https://ai.google.dev/terms</p>
                
                <h4>OpenAI API</h4>
                <p>OpenAI API Services
Licensed under OpenAI API Terms of Use
https://openai.com/api/policies/terms/</p>
                
                <h4>Cerebras API</h4>
                <p>Cerebras Cloud API Services
Licensed under Cerebras Terms of Service
https://cloud.cerebras.ai/terms</p>
            </div>

            <div class="license-section">
                <h3>Additional Acknowledgments</h3>
                <p>This extension uses various web standards and APIs provided by:
• W3C (World Wide Web Consortium)
• WHATWG (Web Hypertext Application Technology Working Group)
• Mozilla Developer Network documentation
• Chrome Developer documentation

All used under their respective open licenses and terms of service.</p>
            </div>
        `;
        
        content.innerHTML = licensesHTML;
        modal.classList.add("show");
        
        // 모달 외부 클릭 시 닫기
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        };
    }

    // API 키 저장 이벤트 핸들러
    saveApiKeyBtn?.addEventListener("click", async () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            try {
                await storage.setApiKey(apiKey);
                showMessage(apiKeyMsg, await i18n.getText('apiKeySaved') || "Gemini API 키가 저장되었습니다.");
            } catch (error) {
                showMessage(apiKeyMsg, await i18n.getText('saveFailed') || "API 키 저장에 실패했습니다.", true);
                console.error("API 키 저장 실패:", error);
            }
        } else {
            showMessage(apiKeyMsg, await i18n.getText('presetNameRequired') || "API 키를 입력해주세요.", true);
        }
    });

    saveOpenaiApiKeyBtn?.addEventListener("click", async () => {
        const apiKey = openaiApiKeyInput.value.trim();
        if (apiKey) {
            try {
                await storage.setOpenAIApiKey(apiKey);
                showMessage(openaiKeyMsg, await i18n.getText('apiKeySaved') || "OpenAI API 키가 저장되었습니다.");
            } catch (error) {
                showMessage(openaiKeyMsg, await i18n.getText('saveFailed') || "API 키 저장에 실패했습니다.", true);
                console.error("OpenAI API 키 저장 실패:", error);
            }
        } else {
            showMessage(openaiKeyMsg, await i18n.getText('presetNameRequired') || "API 키를 입력해주세요.", true);
        }
    });

    saveCerebrasApiKeyBtn?.addEventListener("click", async () => {
        const apiKey = cerebrasApiKeyInput.value.trim();
        if (apiKey) {
            try {
                await storage.setCerebrasApiKey(apiKey);
                showMessage(cerebrasKeyMsg, await i18n.getText('apiKeySaved') || "Cerebras API 키가 저장되었습니다.");
            } catch (error) {
                showMessage(cerebrasKeyMsg, await i18n.getText('saveFailed') || "API 키 저장에 실패했습니다.", true);
                console.error("Cerebras API 키 저장 실패:", error);
            }
        } else {
            showMessage(cerebrasKeyMsg, await i18n.getText('presetNameRequired') || "API 키를 입력해주세요.", true);
        }
    });

    // 사용량 통계 관련 요소들
    const statsPeriodSelect = document.getElementById("statsPeriod");
    const totalRequestsEl = document.getElementById("totalRequests");
    const totalTokensEl = document.getElementById("totalTokens");
    const totalCostEl = document.getElementById("totalCost");
    const modelStatsContainer = document.getElementById("modelStats");

    // 기간별 날짜 범위 계산
    function getDateRange(period) {
        const endDate = new Date();
        const startDate = new Date();
        
        switch (period) {
            case "today":
                startDate.setDate(endDate.getDate());
                break;
            case "week":
                startDate.setDate(endDate.getDate() - 7);
                break;
            case "month":
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case "3months":
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case "6months":
                startDate.setMonth(endDate.getMonth() - 6);
                break;
        }
        
        return {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0]
        };
    }

    // 사용량 통계 업데이트
    async function updateUsageStats(period = "today") {
        try {
            const dateRange = getDateRange(period);
            
            // i18n 텍스트를 미리 가져오기
            const requestsCountTemplate = await i18n.getText('requestsCount') || '요청: {count}';
            const tokensCountTemplate = await i18n.getText('tokensCount') || '토큰: {count}';
            const getUsageStatsMethodNotFoundText = await i18n.getText('getUsageStatsMethodNotFound') || "getUsageStats 메서드를 찾을 수 없습니다.";
            
            // storage에서 getUsageStats 메서드가 있는지 확인
            let stats = {};
            if (typeof storage.getUsageStats === 'function') {
                stats = await storage.getUsageStats(dateRange);
            } else {
                console.warn(getUsageStatsMethodNotFoundText);
            }
            
            let totalRequests = 0;
            let totalTokens = 0;
            let totalCost = 0;
            
            // 전체 통계 계산
            Object.values(stats).forEach(modelStat => {
                totalRequests += modelStat.requestCount || 0;
                totalTokens += (modelStat.inputTokens || 0) + (modelStat.outputTokens || 0);
                totalCost += modelStat.totalCost || 0;
            });
            
            // UI 업데이트
            if (totalRequestsEl) totalRequestsEl.textContent = totalRequests.toLocaleString();
            if (totalTokensEl) totalTokensEl.textContent = totalTokens.toLocaleString();
            if (totalCostEl) totalCostEl.textContent = `$${totalCost.toFixed(4)}`;
            
            // 모델별 통계 표시
            if (modelStatsContainer) {
                modelStatsContainer.innerHTML = "";
                
                const hasData = Object.values(stats).some(stat => stat.requestCount > 0);
                
                if (hasData) {
                    Object.entries(stats).forEach(([modelName, modelStat]) => {
                        if (modelStat.requestCount > 0) {
                            const statItem = document.createElement("div");
                            statItem.className = "model-stat-item";
                            statItem.innerHTML = `
                                <div class="model-stat-header">
                                    <span class="model-name">${modelName}</span>
                                    <span class="model-cost">$${(modelStat.totalCost || 0).toFixed(4)}</span>
                                </div>
                                <div class="model-stat-details">
                                    <span class="stat-detail">${requestsCountTemplate.replace('{count}', (modelStat.requestCount || 0).toLocaleString())}</span>
                                    <span class="stat-detail">${tokensCountTemplate.replace('{count}', ((modelStat.inputTokens || 0) + (modelStat.outputTokens || 0)).toLocaleString())}</span>
                                </div>
                            `;
                            modelStatsContainer.appendChild(statItem);
                        }
                    });
                } else {
                    modelStatsContainer.innerHTML = `<div class="no-data">${await i18n.getText('noDataForPeriod') || '선택한 기간에 사용량 데이터가 없습니다.'}</div>`;
                }
            }
        } catch (error) {
            console.error(await i18n.getText('usageStatsUpdateFailed') || "사용량 통계 업데이트 실패:", error);
            if (modelStatsContainer) {
                modelStatsContainer.innerHTML = `<div class="error-message">${await i18n.getText('statsLoadFailed') || '통계 데이터를 불러오는데 실패했습니다.'}</div>`;
            }
        }
    }

    // 사용량 통계 기간 변경 이벤트
    statsPeriodSelect?.addEventListener("change", () => {
        updateUsageStats(statsPeriodSelect.value);
    });

    // 고급 설정 관련 요소들
    const exportAllDataBtn = document.getElementById("exportAllData");
    const importAllDataBtn = document.getElementById("importAllData");
    const clearAllDataBtn = document.getElementById("clearAllData");
    const extensionVersionSpan = document.getElementById("extensionVersion");

    // 모든 데이터 내보내기
    exportAllDataBtn?.addEventListener("click", async () => {
        try {
            const allData = {
                apiKeys: {
                    gemini: await storage.getApiKey() || "",
                    openai: (typeof storage.getOpenAIApiKey === 'function' ? await storage.getOpenAIApiKey() : "") || "",
                    cerebras: (typeof storage.getCerebrasApiKey === 'function' ? await storage.getCerebrasApiKey() : "") || ""
                },
                settings: {
                    translationModel: await storage.getTranslationModel() || "",
                    translationLanguage: await storage.getTranslationLanguage() || "",
                    viewMode: (typeof storage.getViewMode === 'function' ? await storage.getViewMode() : "") || ""
                },
                glossary: await storage.getGlossary() || { words: [], version: 1 },
                usageData: (typeof storage.getAllUsageData === 'function' ? await storage.getAllUsageData() : {}) || {},
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `custom-translator-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(await i18n.getText('dataExportFailed') || "데이터 내보내기 실패:", error);
            await showCustomAlert(await i18n.getText('dataExportFailed') || "데이터 내보내기에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 데이터 가져오기
    importAllDataBtn?.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            try {
                const text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsText(file);
                });

                const data = JSON.parse(text);
                
                // 데이터 유효성 검사
                if (!data.apiKeys || !data.settings || !data.glossary) {
                    throw new Error(await i18n.getText('invalidBackupFormat') || "올바른 백업 파일 형식이 아닙니다.");
                }

                const confirmResult = await showCustomConfirm(
                    await i18n.getText('overwriteDataConfirm') || "기존 데이터를 모두 덮어쓰시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
                    await i18n.getText('dataRestoreConfirm') || "데이터 복원 확인",
                    "⚠️"
                );

                if (confirmResult) {
                    // 데이터 복원
                    try {
                        if (data.apiKeys.gemini) await storage.setApiKey(data.apiKeys.gemini);
                        if (data.apiKeys.openai && typeof storage.setOpenAIApiKey === 'function') {
                            await storage.setOpenAIApiKey(data.apiKeys.openai);
                        }
                        if (data.apiKeys.cerebras && typeof storage.setCerebrasApiKey === 'function') {
                            await storage.setCerebrasApiKey(data.apiKeys.cerebras);
                        }
                        
                        if (data.settings.translationModel) await storage.setTranslationModel(data.settings.translationModel);
                        if (data.settings.translationLanguage) await storage.setTranslationLanguage(data.settings.translationLanguage);
                        if (data.settings.viewMode && typeof storage.setViewMode === 'function') {
                            await storage.setViewMode(data.settings.viewMode);
                        }
                        
                        if (data.glossary) await storage.setGlossary(data.glossary);
                        if (data.usageData && typeof storage.setAllUsageData === 'function') {
                            await storage.setAllUsageData(data.usageData);
                        }

                        await showCustomAlert(await i18n.getText('dataRestoredSuccess') || "데이터가 성공적으로 복원되었습니다. 페이지를 새로고침합니다.", await i18n.getText('completed') || "완료", "✅");
                        window.location.reload();
                    } catch (restoreError) {
                        console.error(await i18n.getText('dataRestoreError') || "데이터 복원 중 오류:", restoreError);
                        await showCustomAlert((await i18n.getText('partialRestoreFailed') || "일부 데이터 복원에 실패했습니다") + ": " + restoreError.message, await i18n.getText('warning') || "경고", "⚠️");
                    }
                }
            } catch (error) {
                console.error(await i18n.getText('dataImportFailed') || "데이터 가져오기 실패:", error);
                await showCustomAlert((await i18n.getText('dataImportFailed') || "데이터 가져오기에 실패했습니다") + ": " + error.message, await i18n.getText('error') || "오류", "❌");
            }
        };
        input.click();
    });

    // 모든 데이터 삭제
    clearAllDataBtn?.addEventListener("click", async () => {
        const confirmResult = await showCustomConfirm(
            await i18n.getText('deleteAllDataConfirm') || "모든 데이터를 삭제하시겠습니까?\n- API 키\n- 설정\n- 단어장\n- 사용량 통계\n\n이 작업은 되돌릴 수 없습니다.",
            await i18n.getText('dataDeleteConfirm') || "데이터 삭제 확인",
            "🗑️"
        );

        if (confirmResult) {
            const doubleConfirmResult = await showCustomConfirm(
                await i18n.getText('finalDeleteConfirm') || "정말로 모든 데이터를 삭제하시겠습니까?",
                await i18n.getText('finalConfirm') || "최종 확인",
                "⚠️"
            );
            
            if (doubleConfirmResult) {
                try {
                    await chrome.storage.local.clear();
                    await showCustomAlert(await i18n.getText('allDataDeleted') || "모든 데이터가 삭제되었습니다. 페이지를 새로고침합니다.", await i18n.getText('completed') || "완료", "✅");
                    window.location.reload();
                } catch (error) {
                    console.error(await i18n.getText('dataDeleteFailed') || "데이터 삭제 실패:", error);
                    await showCustomAlert(await i18n.getText('dataDeleteFailed') || "데이터 삭제에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
                }
            }
        }
    });

    // 확장 프로그램 버전 표시
    if (extensionVersionSpan) {
        try {
            const manifest = chrome.runtime.getManifest();
            extensionVersionSpan.textContent = manifest.version || "1.2.0";
        } catch (error) {
            console.error(await i18n.getText('manifestLoadFailed') || "매니페스트 가져오기 실패:", error);
            extensionVersionSpan.textContent = "1.2.0";
        }
    }

    // 단어장 관리 관련 변수들
    let currentEditingPreset = null;
    let hasUnsavedChanges = false;
    let originalPresetData = null;
    const presetEditModal = document.getElementById("presetEditModal");
    const siteSettingModal = document.getElementById("siteSettingModal");

    // 커스텀 다이얼로그 함수들
    const customAlertModal = document.getElementById("customAlertModal");
    const customConfirmModal = document.getElementById("customConfirmModal");
    const unsavedChangesModal = document.getElementById("unsavedChangesModal");

    async function showCustomAlert(message, title, icon = "ℹ️") {
        if (!title) title = await i18n.getText('notification') || "알림";
        return new Promise((resolve) => {
            document.getElementById("alertDialogTitle").textContent = title;
            document.getElementById("alertDialogMessage").textContent = message;
            document.getElementById("alertDialogIcon").textContent = icon;
            
            const okButton = document.getElementById("alertDialogOk");
            const handleOk = () => {
                customAlertModal.classList.remove("show");
                okButton.removeEventListener("click", handleOk);
                resolve();
            };
            
            okButton.addEventListener("click", handleOk);
            customAlertModal.classList.add("show");
        });
    }

    async function showCustomConfirm(message, title, icon = "⚠️") {
        if (!title) title = await i18n.getText('confirm') || "확인";
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

    async function showUnsavedChangesDialog(message) {
        if (!message) message = await i18n.getText('unsavedChangesDialog') || "저장되지 않은 변경사항이 있습니다. 어떻게 하시겠습니까?";
        return new Promise((resolve) => {
            document.getElementById("unsavedChangesMessage").textContent = message;
            
            const saveButton = document.getElementById("unsavedChangesSave");
            const discardButton = document.getElementById("unsavedChangesDiscard");
            const cancelButton = document.getElementById("unsavedChangesCancel");
            
            const cleanup = () => {
                unsavedChangesModal.classList.remove("show");
                saveButton.removeEventListener("click", handleSave);
                discardButton.removeEventListener("click", handleDiscard);
                cancelButton.removeEventListener("click", handleCancel);
            };
            
            const handleSave = () => {
                cleanup();
                resolve("save");
            };
            
            const handleDiscard = () => {
                cleanup();
                resolve("discard");
            };
            
            const handleCancel = () => {
                cleanup();
                resolve("cancel");
            };
            
            saveButton.addEventListener("click", handleSave);
            discardButton.addEventListener("click", handleDiscard);
            cancelButton.addEventListener("click", handleCancel);
            unsavedChangesModal.classList.add("show");
        });
    }

    // 변경 사항 추적 함수들
    function markAsChanged() {
        hasUnsavedChanges = true;
    }

    function markAsSaved() {
        hasUnsavedChanges = false;
    }

    async function checkForUnsavedChanges() {
        if (!hasUnsavedChanges || !currentEditingPreset) return true;
        
        const result = await showUnsavedChangesDialog();
        
        if (result === "save") {
            // 저장 로직 실행
            await saveCurrentPreset();
            return true;
        } else if (result === "discard") {
            return true;
        } else {
            return false; // 취소
        }
    }

    async function saveCurrentPreset() {
        if (!currentEditingPreset) return;

        const name = document.getElementById("presetNameInput").value.trim();
        if (!name) {
            await showCustomAlert(await i18n.getText('presetNameRequired') || "프리셋 이름을 입력해주세요.", await i18n.getText('error') || "오류", "❌");
            return false;
        }

        try {
            await storage.updateGlossaryPreset(currentEditingPreset, { name });
            markAsSaved();
            await loadGlossaryPresets();
            return true;
        } catch (error) {
            console.error(await i18n.getText('presetSaveFailed') || "프리셋 저장 실패:", error);
            await showCustomAlert(await i18n.getText('saveFailed') || "저장에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
            return false;
        }
    }

    function setupChangeTracking(presetId) {
        // 프리셋 이름 변경 추적
        const presetNameInput = document.getElementById("presetNameInput");
        if (presetNameInput) {
            presetNameInput.addEventListener("input", markAsChanged);
        }
        
        // 단어 추가/삭제 시 변경으로 표시하는 것은 해당 함수들에서 처리
    }

    // 단어장 관리 함수들
    async function loadGlossaryPresets() {
        const presetsList = document.getElementById("glossaryPresetsList");
        if (!presetsList) return;

        try {
            const presets = await storage.getGlossaryPresets();
            const settings = await storage.getGlossarySettings();
            
            // i18n 텍스트를 미리 가져오기
            const wordsCountTemplate = await i18n.getText('wordsCount') || '{count}개 단어';
            const activeText = await i18n.getText('active') || '(활성)';
            const clickToEditText = await i18n.getText('clickToEditHint') || '클릭하여 편집';
            const deleteText = await i18n.getText('delete') || '삭제';
            const noPresetsText = await i18n.getText('noPresetsCreated') || '아직 생성된 프리셋이 없습니다.';
            
            presetsList.innerHTML = "";

            if (Object.keys(presets).length === 0) {
                presetsList.innerHTML = `<div class="empty-state"><div class="icon">📚</div>${noPresetsText}</div>`;
                return;
            }

            const sortedPresets = Object.values(presets).sort((a, b) => (b.updated || 0) - (a.updated || 0));

            for (const preset of sortedPresets) {
                const isActive = settings.activePresets.includes(preset.id);
                const wordCount = preset.words ? preset.words.length : 0;
                
                const presetItem = document.createElement("div");
                presetItem.className = "preset-item";
                presetItem.innerHTML = `
                    <div class="preset-header">
                        <div class="preset-info clickable" data-action="edit" data-preset-id="${preset.id}">
                            <h4>${preset.name}</h4>
                            <div class="preset-stats">${wordsCountTemplate.replace('{count}', wordCount)} ${isActive ? activeText : ''}</div>
                            <div class="click-hint">${clickToEditText}</div>
                        </div>
                        <div class="preset-actions">
                            <button class="btn btn-danger btn-sm" data-action="delete" data-preset-id="${preset.id}">${deleteText}</button>
                        </div>
                    </div>
                `;
                
                presetsList.appendChild(presetItem);
            }

            // 프리셋 액션 이벤트 리스너 추가
            presetsList.addEventListener("click", handlePresetAction);

        } catch (error) {
            console.error(await i18n.getText('presetLoadFailed') || "프리셋 로드 실패:", error);
            presetsList.innerHTML = `<div class="error-message">${await i18n.getText('presetListLoadFailed') || '프리셋을 불러오는데 실패했습니다.'}</div>`;
        }
    }

    // 프리셋 액션 핸들러
    async function handlePresetAction(e) {
        const actionElement = e.target.closest("[data-action]");
        if (!actionElement) return;

        const action = actionElement.dataset.action;
        const presetId = actionElement.dataset.presetId;

        if (action === "edit") {
            await openPresetEditModal(presetId);
        } else if (action === "delete") {
            await deletePreset(presetId);
        }
    }

    // 프리셋 편집 모달 열기
    async function openPresetEditModal(presetId) {
        try {
            const presets = await storage.getGlossaryPresets();
            const preset = presets[presetId];
            
            if (!preset) {
                await showCustomAlert(await i18n.getText('presetNotFound') || "프리셋을 찾을 수 없습니다.", await i18n.getText('error') || "오류", "❌");
                return;
            }

            currentEditingPreset = presetId;
            
            // 원본 데이터 저장 (변경 사항 추적용)
            originalPresetData = {
                name: preset.name || "",
                words: JSON.parse(JSON.stringify(preset.words || []))
            };
            
            // 변경 사항 초기화
            hasUnsavedChanges = false;
            
            // 모달 제목과 입력 값 설정
            document.getElementById("presetModalTitle").textContent = presetId ? (await i18n.getText('editPreset') || "프리셋 편집") : (await i18n.getText('createNewPreset') || "새 프리셋 생성");
            document.getElementById("presetNameInput").value = preset.name || "";
            
            // 단어 목록 로드
            await loadPresetWords(presetId);
            
            // 변경 사항 추적 설정
            setupChangeTracking(presetId);
            
            // 모달 표시
            presetEditModal.classList.add("show");
            
        } catch (error) {
            console.error(await i18n.getText('modalOpenFailed') || "모달 열기 실패:", error);
            await showCustomAlert(await i18n.getText('modalOpenFailed') || "모달을 열 수 없습니다.", await i18n.getText('error') || "오류", "❌");
        }
    }

    // 프리셋 단어 목록 로드
    async function loadPresetWords(presetId, searchQuery = "", sortOrder = "recent") {
        const wordsList = document.getElementById("presetWordsList");
        if (!wordsList) return;

        try {
            // i18n 텍스트를 미리 가져오기
            const deleteText = await i18n.getText('delete') || '삭제';
            const wordsEmptyText = await i18n.getText('wordsEmpty') || '단어가 없습니다.';
            
            const presets = await storage.getGlossaryPresets();
            const preset = presets[presetId];
            
            if (!preset) return;

            let words = preset.words || [];

            // 검색 필터링
            if (searchQuery) {
                const query = searchQuery.trim().toLowerCase();
                words = words.filter(word => {
                    const source = word.source.toLowerCase();
                    const target = word.target.toLowerCase();
                    const sourceNoSpace = source.replace(/\s/g, "");
                    const targetNoSpace = target.replace(/\s/g, "");
                    const queryNoSpace = query.replace(/\s/g, "");
                    
                    // 기본 검색 (공백 포함)
                    if (source.includes(query) || target.includes(query)) {
                        return true;
                    }
                    
                    // 한글 강화 검색 (공백 제거)
                    if (hangulUtils) {
                        const { hangulIncludes, choseongIncludes } = hangulUtils;
                        
                        return hangulIncludes(sourceNoSpace, queryNoSpace) ||
                               hangulIncludes(targetNoSpace, queryNoSpace) ||
                               choseongIncludes(sourceNoSpace, queryNoSpace) ||
                               choseongIncludes(targetNoSpace, queryNoSpace);
                    }
                    
                    // 공백 제거 후 기본 검색
                    return sourceNoSpace.includes(queryNoSpace) || targetNoSpace.includes(queryNoSpace);
                });
            }

            // 정렬
            switch (sortOrder) {
                case "recent":
                    words = words.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    break;
                case "old":
                    words = words.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                    break;
                case "asc":
                    words = words.sort((a, b) => a.source.localeCompare(b.source));
                    break;
                case "desc":
                    words = words.sort((a, b) => b.source.localeCompare(a.source));
                    break;
            }

            wordsList.innerHTML = "";

            if (words.length === 0) {
                wordsList.innerHTML = `<div class="empty-state">${wordsEmptyText}</div>`;
                return;
            }

            words.forEach(word => {
                const wordItem = document.createElement("div");
                wordItem.className = "word-item";
                wordItem.innerHTML = `
                    <div class="word-pair">
                        <span class="source-word">${word.source}</span>
                        <span class="arrow">→</span>
                        <span class="target-word">${word.target}</span>
                    </div>
                    <div class="word-actions">
                        <button class="btn btn-danger btn-sm" data-action="delete-word" data-source="${word.source}">${deleteText}</button>
                    </div>
                `;
                wordsList.appendChild(wordItem);
            });

        } catch (error) {
            console.error(await i18n.getText('wordListLoadFailed') || "단어 목록 로드 실패:", error);
            wordsList.innerHTML = `<div class="error-message">${await i18n.getText('wordListLoadFailed') || '단어 목록을 불러오는데 실패했습니다.'}</div>`;
        }
    }

    // 프리셋 삭제
    async function deletePreset(presetId) {
        try {
            const presets = await storage.getGlossaryPresets();
            const preset = presets[presetId];
            
            if (!preset) return;

            if (await showCustomConfirm((await i18n.getText('deletePresetQuestion') || '"${name}" 프리셋을 삭제하시겠습니까?').replace('{name}', preset.name), await i18n.getText('presetDelete') || "프리셋 삭제", "🗑️")) {
                await storage.deleteGlossaryPreset(presetId);
                await loadGlossaryPresets();
            }
        } catch (error) {
            console.error(await i18n.getText('presetDeleteFailed') || "프리셋 삭제 실패:", error);
            await showCustomAlert(await i18n.getText('presetDeleteFailed') || "프리셋 삭제에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    }

    // 사이트별 설정 관리 함수들
    async function loadSiteSettings() {
        const siteSettingsList = document.getElementById("siteSettingsList");
        if (!siteSettingsList) return;

        try {
            const settings = await storage.getGlossarySettings();
            const presets = await storage.getGlossaryPresets();
            const siteSettings = settings.siteSpecificSettings || {};

            // i18n 텍스트를 미리 가져오기
            const noSiteSettingsText = await i18n.getText('noSiteSettings') || '아직 설정된 사이트가 없습니다.';
            const noPresetsText = await i18n.getText('noPresets') || "없음";
            const presetsLabelText = await i18n.getText('presetsLabel') || '프리셋:';
            const editText = await i18n.getText('edit') || '편집';
            const deleteText = await i18n.getText('delete') || '삭제';

            siteSettingsList.innerHTML = "";

            if (Object.keys(siteSettings).length === 0) {
                siteSettingsList.innerHTML = `<div class="empty-state"><div class="icon">🌐</div>${noSiteSettingsText}</div>`;
                return;
            }

            Object.entries(siteSettings).forEach(([domain, setting]) => {
                const presetNames = setting.presets?.map(id => presets[id]?.name || id).join(", ") || noPresetsText;
                
                const settingItem = document.createElement("div");
                settingItem.className = "site-setting-item";
                settingItem.innerHTML = `
                    <div class="site-setting-header">
                        <div class="site-info">
                            <div class="site-domain">${domain}</div>
                            <div class="site-presets">${presetsLabelText} ${presetNames}</div>
                        </div>
                        <div class="site-actions">
                            <button class="btn btn-primary btn-sm" data-action="edit-site" data-domain="${domain}">${editText}</button>
                            <button class="btn btn-danger btn-sm" data-action="delete-site" data-domain="${domain}">${deleteText}</button>
                        </div>
                    </div>
                `;
                siteSettingsList.appendChild(settingItem);
            });

            // 사이트 액션 이벤트 리스너 추가
            siteSettingsList.addEventListener("click", handleSiteSettingAction);

        } catch (error) {
            console.error(await i18n.getText('siteSettingsLoadFailed') || "사이트 설정 로드 실패:", error);
            siteSettingsList.innerHTML = `<div class="error-message">${await i18n.getText('siteSettingsListLoadFailed') || '사이트 설정을 불러오는데 실패했습니다.'}</div>`;
        }
    }

    // 사이트 설정 액션 핸들러
    async function handleSiteSettingAction(e) {
        const button = e.target.closest("button[data-action]");
        if (!button) return;

        const action = button.dataset.action;
        const domain = button.dataset.domain;

        if (action === "edit-site") {
            await openSiteSettingModal(domain);
        } else if (action === "delete-site") {
            await deleteSiteSetting(domain);
        }
    }

    // 사이트 설정 모달 열기
    async function openSiteSettingModal(domain = null) {
        try {
            const presets = await storage.getGlossaryPresets();
            const settings = await storage.getGlossarySettings();
            
            // 도메인 입력 설정
            const siteUrlInput = document.getElementById("siteUrlInput");
            siteUrlInput.value = domain || "";
            siteUrlInput.readOnly = !!domain; // 편집 모드에서는 읽기 전용

            // 프리셋 체크박스 생성
            const checkboxContainer = document.getElementById("sitePresetCheckboxes");
            checkboxContainer.innerHTML = "";

            const currentPresets = domain ? 
                (settings.siteSpecificSettings[domain]?.presets || []) : 
                [];

            Object.values(presets).forEach(preset => {
                const isChecked = currentPresets.includes(preset.id);
                
                const checkboxItem = document.createElement("div");
                checkboxItem.className = "preset-checkbox-item";
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="preset-${preset.id}" value="${preset.id}" ${isChecked ? 'checked' : ''}>
                    <label class="preset-checkbox-label" for="preset-${preset.id}">${preset.name}</label>
                `;
                checkboxContainer.appendChild(checkboxItem);
            });

            // 모달 표시
            siteSettingModal.classList.add("show");

        } catch (error) {
            console.error(await i18n.getText('siteSettingsModalOpenFailed') || "사이트 설정 모달 열기 실패:", error);
            await showCustomAlert(await i18n.getText('modalOpenFailed') || "모달을 열 수 없습니다.", await i18n.getText('error') || "오류", "❌");
        }
    }

    // 사이트 설정 삭제
    async function deleteSiteSetting(domain) {
        if (await showCustomConfirm((await i18n.getText('deleteSiteSettingConfirm') || '{domain}의 설정을 삭제하시겠습니까?').replace('{domain}', domain), await i18n.getText('siteSettingDelete') || "사이트 설정 삭제", "🗑️")) {
            try {
                const settings = await storage.getGlossarySettings();
                delete settings.siteSpecificSettings[domain];
                await storage.setGlossarySettings(settings);
                await loadSiteSettings();
            } catch (error) {
                console.error(await i18n.getText('siteSettingDeleteFailed') || "사이트 설정 삭제 실패:", error);
                await showCustomAlert(await i18n.getText('siteSettingDeleteFailed') || "사이트 설정 삭제에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
            }
        }
    }

    // 이벤트 리스너들
    
    // 새 프리셋 생성
    document.getElementById("createNewGlossaryPreset")?.addEventListener("click", async () => {
        try {
            const language = await storage.getTranslationLanguage();
            const presets = await storage.getGlossaryPresets();
            const count = Object.keys(presets).length + 1;
            
            const defaultName = language === 'Korean' ? `단어장${count}` : `Glossary${count}`;
            const presetId = await storage.createGlossaryPreset(defaultName);
            await openPresetEditModal(presetId);
        } catch (error) {
            console.error(await i18n.getText('presetCreateFailed') || "프리셋 생성 실패:", error);
            await showCustomAlert(await i18n.getText('presetCreateFailed') || "프리셋 생성에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 단어장 파일 불러오기
    document.getElementById("importGlossaryData")?.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsText(file);
                });

                const data = JSON.parse(text);
                
                if (!data.words || !Array.isArray(data.words)) {
                    throw new Error(await i18n.getText('invalidGlossaryFormat') || "올바른 단어장 형식이 아닙니다.");
                }

                const language = await storage.getTranslationLanguage();
                const presetName = language === 'Korean' ? (await i18n.getText('importedGlossaryName') || '가져온 단어장') : 'Imported Glossary';
                
                const presetId = await storage.createGlossaryPreset(presetName);
                await storage.updateGlossaryPreset(presetId, {
                    words: data.words,
                    version: data.version || 1
                });

                await loadGlossaryPresets();
                await showCustomAlert(await i18n.getText('glossaryImportSuccess') || "단어장을 성공적으로 가져왔습니다.", await i18n.getText('completed') || "완료", "✅");

            } catch (error) {
                console.error(await i18n.getText('glossaryImportFailed') || "단어장 가져오기 실패:", error);
                await showCustomAlert((await i18n.getText('glossaryImportFailed') || "단어장 가져오기에 실패했습니다") + ": " + error.message, await i18n.getText('error') || "오류", "❌");
            }
        };
        input.click();
    });

    // 내보내기 드롭다운
    let exportDropdownOpen = false;
    document.getElementById("exportGlossaryDropdown")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("exportGlossaryMenu");
        if (exportDropdownOpen) {
            menu.classList.remove("show");
        } else {
            menu.classList.add("show");
        }
        exportDropdownOpen = !exportDropdownOpen;
    });

    // 외부 클릭시 드롭다운 닫기
    document.addEventListener("click", () => {
        if (exportDropdownOpen) {
            document.getElementById("exportGlossaryMenu")?.classList.remove("show");
            exportDropdownOpen = false;
        }
    });

    // 활성 프리셋 내보내기
    document.getElementById("exportActiveGlossaries")?.addEventListener("click", async () => {
        try {
            const settings = await storage.getGlossarySettings();
            const presets = await storage.getGlossaryPresets();
            
            if (settings.activePresets.length === 0) {
                await showCustomAlert(await i18n.getText('noActivePresetsToExport') || "활성 프리셋이 없습니다.", await i18n.getText('info') || "알림", "ℹ️");
                return;
            }

            const combinedGlossary = await storage.getCombinedGlossary();
            
            const blob = new Blob([JSON.stringify(combinedGlossary, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `active-glossaries-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error(await i18n.getText('activePresetExportFailed') || "활성 프리셋 내보내기 실패:", error);
            await showCustomAlert(await i18n.getText('exportFailed') || "내보내기에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 모든 프리셋 내보내기
    document.getElementById("exportAllGlossaries")?.addEventListener("click", async () => {
        try {
            const presets = await storage.getGlossaryPresets();
            
            if (Object.keys(presets).length === 0) {
                await showCustomAlert(await i18n.getText('noPresetsToExport') || "내보낼 프리셋이 없습니다.", await i18n.getText('info') || "알림", "ℹ️");
                return;
            }

            // 각 프리셋을 별도 파일로 다운로드
            for (const preset of Object.values(presets)) {
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

                // 다운로드 간격
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            console.error(await i18n.getText('allPresetExportFailed') || "모든 프리셋 내보내기 실패:", error);
            await showCustomAlert(await i18n.getText('exportFailed') || "내보내기에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 사이트 추가
    document.getElementById("addNewSiteSetting")?.addEventListener("click", () => {
        openSiteSettingModal();
    });

    // 모든 사이트 설정 초기화
    document.getElementById("clearAllSiteConfigs")?.addEventListener("click", async () => {
        if (await showCustomConfirm(await i18n.getText('resetAllSiteSettingsConfirm') || "모든 사이트별 설정을 초기화하시겠습니까?", await i18n.getText('settingsReset') || "설정 초기화", "🔄")) {
            try {
                const settings = await storage.getGlossarySettings();
                settings.siteSpecificSettings = {};
                await storage.setGlossarySettings(settings);
                await loadSiteSettings();
                await showCustomAlert(await i18n.getText('allSiteSettingsReset') || "모든 사이트 설정이 초기화되었습니다.", await i18n.getText('completed') || "완료", "✅");
            } catch (error) {
                console.error(await i18n.getText('siteSettingsResetFailed') || "사이트 설정 초기화 실패:", error);
                await showCustomAlert(await i18n.getText('resetFailed') || "초기화에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
            }
        }
    });

    // 모달 관련 이벤트들

    // 프리셋 편집 모달 닫기
    document.getElementById("closePresetModal")?.addEventListener("click", () => {
        if (checkForUnsavedChanges()) {
            presetEditModal.classList.remove("show");
            currentEditingPreset = null;
            hasUnsavedChanges = false;
        }
    });


    // 사이트 설정 모달 닫기
    document.getElementById("closeSiteModal")?.addEventListener("click", () => {
        siteSettingModal.classList.remove("show");
    });

    // 모달 외부 클릭시 닫기
    presetEditModal?.addEventListener("click", (e) => {
        if (e.target === presetEditModal) {
            if (checkForUnsavedChanges()) {
                presetEditModal.classList.remove("show");
                currentEditingPreset = null;
                hasUnsavedChanges = false;
            }
        }
    });
    
    siteSettingModal?.addEventListener("click", (e) => {
        if (e.target === siteSettingModal) {
            siteSettingModal.classList.remove("show");
        }
    });

    // 단어 추가
    document.getElementById("addWordBtn")?.addEventListener("click", async () => {
        const sourceInput = document.getElementById("sourceWordInput");
        const targetInput = document.getElementById("targetWordInput");
        
        const source = sourceInput.value.trim();
        const target = targetInput.value.trim();

        if (source && target && currentEditingPreset) {
            try {
                await storage.addWordToPreset(currentEditingPreset, source, target);
                markAsChanged();
                sourceInput.value = "";
                targetInput.value = "";
                await loadPresetWords(currentEditingPreset);
            } catch (error) {
                console.error(await i18n.getText('wordAddFailed') || "단어 추가 실패:", error);
                await showCustomAlert(await i18n.getText('wordAddFailed') || "단어 추가에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
            }
        }
    });

    // 단어 삭제 (이벤트 위임)
    document.getElementById("presetWordsList")?.addEventListener("click", async (e) => {
        if (e.target.dataset.action === "delete-word") {
            const source = e.target.dataset.source;
            if (currentEditingPreset && await showCustomConfirm((await i18n.getText('deleteWordConfirm') || '"{source}" 단어를 삭제하시겠습니까?').replace('{source}', source), await i18n.getText('wordDelete') || "단어 삭제", "🗑️")) {
                try {
                    await storage.removeWordFromPreset(currentEditingPreset, source);
                    markAsChanged();
                    await loadPresetWords(currentEditingPreset);
                } catch (error) {
                    console.error(await i18n.getText('wordDeleteFailed') || "단어 삭제 실패:", error);
                    await showCustomAlert(await i18n.getText('wordDeleteFailed') || "단어 삭제에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
                }
            }
        }
    });

    // 검색 및 정렬
    document.getElementById("wordFilterInput")?.addEventListener("input", (e) => {
        if (currentEditingPreset) {
            const sortOrder = document.getElementById("wordSortSelect")?.value || "recent";
            loadPresetWords(currentEditingPreset, e.target.value, sortOrder);
        }
    });

    document.getElementById("wordSortSelect")?.addEventListener("change", (e) => {
        if (currentEditingPreset) {
            const searchQuery = document.getElementById("wordFilterInput")?.value || "";
            loadPresetWords(currentEditingPreset, searchQuery, e.target.value);
        }
    });

    // 프리셋 저장
    document.getElementById("savePresetBtn")?.addEventListener("click", async () => {
        if (!currentEditingPreset) return;

        const name = document.getElementById("presetNameInput").value.trim();
        if (!name) {
            await showCustomAlert(await i18n.getText('presetNameRequired') || "프리셋 이름을 입력해주세요.", await i18n.getText('notification') || "알림", "ℹ️");
            return;
        }

        try {
            await storage.updateGlossaryPreset(currentEditingPreset, { name });
            markAsSaved();
            presetEditModal.classList.remove("show");
            currentEditingPreset = null;
            await loadGlossaryPresets();
        } catch (error) {
            console.error(await i18n.getText('presetSaveFailed') || "프리셋 저장 실패:", error);
            await showCustomAlert(await i18n.getText('saveFailed') || "저장에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 프리셋 삭제 (모달 내)
    document.getElementById("deletePresetBtn")?.addEventListener("click", async () => {
        if (currentEditingPreset) {
            await deletePreset(currentEditingPreset);
            presetEditModal.classList.remove("show");
        }
    });

    // 취소
    document.getElementById("cancelPresetBtn")?.addEventListener("click", () => {
        presetEditModal.classList.remove("show");
    });

    // 사이트 설정 저장
    document.getElementById("saveSiteSettingBtn")?.addEventListener("click", async () => {
        const domain = document.getElementById("siteUrlInput").value.trim();
        if (!domain) {
            await showCustomAlert(await i18n.getText('domainRequired') || "도메인을 입력해주세요.", await i18n.getText('notification') || "알림", "ℹ️");
            return;
        }

        const selectedPresets = Array.from(
            document.querySelectorAll("#sitePresetCheckboxes input[type='checkbox']:checked")
        ).map(cb => cb.value);

        try {
            await storage.setSiteSpecificPresets(domain, selectedPresets);
            siteSettingModal.classList.remove("show");
            await loadSiteSettings();
        } catch (error) {
            console.error(await i18n.getText('siteSettingSaveFailed') || "사이트 설정 저장 실패:", error);
            await showCustomAlert(await i18n.getText('saveFailed') || "저장에 실패했습니다.", await i18n.getText('error') || "오류", "❌");
        }
    });

    // 사이트 설정 취소
    document.getElementById("cancelSiteSettingBtn")?.addEventListener("click", () => {
        siteSettingModal.classList.remove("show");
    });

    // 라이선스 버튼 이벤트
    document.getElementById("showLicenses")?.addEventListener("click", showLicenseModal);
    document.getElementById("closeLicensesModal")?.addEventListener("click", () => {
        document.getElementById("licensesModal").classList.remove("show");
    });

    // 초기화 함수들 호출
    await loadSavedApiKeys();
    await updateUsageStats();
    await loadGlossaryPresets();
    await loadSiteSettings();
});