if (typeof(window) !== "undefined" && !window.TranslatorStorage) {

    /**
     * @class TranslatorStorage
     * @description 크롬 스토리지 관리 클래스
     */
    class TranslatorStorage {
        #storage = chrome.storage.local;

        /**
         * @description API 키 가져오기
         * @returns {Promise<string>} API 키
         */
        async getApiKey() {
            const result = await this.#storage.get("apiKey");
            return result.apiKey;
        }

        /**
         * @description API 키 설정
         * @param {string} apiKey API 키
         */
        async setApiKey(apiKey) {
            await this.#storage.set({ apiKey });
        }

        /**
         * @description OpenAI API 키 가져오기
         * @returns {Promise<string>} OpenAI API 키
         */
        async getOpenAIApiKey() {
            const result = await this.#storage.get("openaiApiKey");
            return result.openaiApiKey;
        }

        /**
         * @description OpenAI API 키 설정
         * @param {string} apiKey OpenAI API 키
         */
        async setOpenAIApiKey(apiKey) {
            await this.#storage.set({ openaiApiKey: apiKey });
        }

        /**
         * @description Cerebras API 키 가져오기
         * @returns {Promise<string>} Cerebras API 키
         */
        async getCerebrasApiKey() {
            const result = await this.#storage.get("cerebrasApiKey");
            return result.cerebrasApiKey;
        }

        /**
         * @description Cerebras API 키 설정
         * @param {string} apiKey Cerebras API 키
         */
        async setCerebrasApiKey(apiKey) {
            await this.#storage.set({ cerebrasApiKey: apiKey });
        }

        /**
         * @description 번역 모델 가져오기
         * @returns {Promise<string>} 선택된 모델
         */
        async getTranslationModel() {
            const result = await this.#storage.get("translationModel");
            return result.translationModel || "gemini-2.5-flash";
        }

        /**
         * @description 번역 모델 설정
         * @param {string} model 선택된 모델
         */
        async setTranslationModel(model) {
            await this.#storage.set({ translationModel: model });
        }

        /**
         * @description 단어장 불러오기
         * @returns {Promise<Object>} { words: Array<{source: string, target: string, timestamp: number}>, version: number }
         */
        async getGlossary() {
            const result = await this.#storage.get("glossary");
            if (!result.glossary) return { words: [], version: 1 };
            return result.glossary;
        }

        /**
         * @description 단어장 저장
         * @param {Object} glossary { words: Array<{source: string, target: string, timestamp: number}>, version: number }
         */
        async setGlossary(glossary) {
            await this.#storage.set({ glossary });
        }



        /**
         * @description 단어장 아이템 추가
         * @param {string} source 원본 용어
         * @param {string} target 대상 용어
         */
        async addGlossaryItem(source, target) {
            const glossary = await this.getGlossary();
            const existingIndex = glossary.words.findIndex(item => item.source === source);
            if (existingIndex !== -1) {
                glossary.words[existingIndex] = {
                    source,
                    target,
                    timestamp: Date.now()
                };
            } else {
                glossary.words.unshift({
                    source,
                    target,
                    timestamp: Date.now()
                });
            }
            await this.setGlossary(glossary);
        }

        /**
         * @description 용어집 아이템 업데이트
         * @param {string} oldSource 기존 원본 용어 (식별키)
         * @param {string} newSource 새 원본 용어
         * @param {string} newTarget 새 대상 용어
         */
        async updateGlossaryItem(oldSource, newSource, newTarget) {
            const glossary = await this.getGlossary();
            const index = glossary.words.findIndex(item => item.source === oldSource);
            if (index !== -1) {
                glossary.words[index] = { 
                    source: newSource, 
                    target: newTarget, 
                    timestamp: Date.now() 
                };
                await this.setGlossary(glossary);
            }
        }

        /**
         * @description 용어집 아이템 제거
         * @param {string} source 제거할 원본 용어
         */
        async removeGlossaryItem(source) {
            const glossary = await this.getGlossary();
            glossary.words = glossary.words.filter(item => item.source !== source);
            await this.setGlossary(glossary);
        }



        /**
         * @description 뷰 모드 저장
         * @param {string} mode "partial" | "expanded" | "collapsed"
         */
        async setViewMode(mode) {
            await this.#storage.set({ viewMode: mode });
        }

        /**
         * @description 뷰 모드 불러오기
         * @returns {Promise<string>} 저장된 뷰 모드
         */
        async getViewMode() {
            const result = await this.#storage.get("viewMode");
            return result.viewMode || "partial";
        }


        
        /** 
         * @description 모델별 토큰 비용 정보 반환 (USD)
         * @param {string} model 모델 코드
         * @returns {{inputTokenCost: number, cachedInputTokenCost: number, outputTokenCost: number}} 1M 토큰당 비용
         */
        getTokenCosts(model) {
            const costs = {
                // Gemini 모델들 (1M 토큰당 USD)
                "gemini-2.0-flash": { inputTokenCost: 0.10, cachedInputTokenCost: 0.025, outputTokenCost: 0.40 },
                "gemini-2.5-flash": { inputTokenCost: 0.30, cachedInputTokenCost: 0.075, outputTokenCost: 2.50 },
                "gemini-2.5-pro": { inputTokenCost: 1.25, cachedInputTokenCost: 0.3125, outputTokenCost: 10.00 },
                
                // OpenAI 모델들 (1M 토큰당 USD)
                "gpt-4o": { inputTokenCost: 2.50, cachedInputTokenCost: 1.25, outputTokenCost: 10.00 },
                "gpt-4o-mini": { inputTokenCost: 0.15, cachedInputTokenCost: 0.075, outputTokenCost: 0.60 },
                "gpt-4-turbo": { inputTokenCost: 10.00, cachedInputTokenCost: 5.00, outputTokenCost: 30.00 },
                "gpt-4": { inputTokenCost: 30.00, cachedInputTokenCost: 15.00, outputTokenCost: 60.00 },
                "gpt-3.5-turbo": { inputTokenCost: 0.50, cachedInputTokenCost: 0.25, outputTokenCost: 1.50 },
                "gpt-5-chat-latest": { inputTokenCost: 1.25, cachedInputTokenCost: 0.125, outputTokenCost: 10.00 },
                "o1-preview": { inputTokenCost: 15.00, cachedInputTokenCost: 7.50, outputTokenCost: 60.00 },
                "o1-mini": { inputTokenCost: 3.00, cachedInputTokenCost: 1.50, outputTokenCost: 12.00 },
                
                // Cerebras 모델들 (1M 토큰당 USD)
                "qwen-3-235b-a22b-instruct-2507": { inputTokenCost: 0.60, cachedInputTokenCost: 0.60, outputTokenCost: 1.20 },
                "qwen-3-235b-a22b-thinking-2507": { inputTokenCost: 0.60, cachedInputTokenCost: 0.60, outputTokenCost: 1.20 }
            };
            return costs[model] || costs["gemini-2.5-flash"];
        }

        /**
         * @description 토큰 비용 계산 (차등 요금제 고려)
         * @param {string} model 모델명
         * @param {Object} tokenUsage 현재 요청의 토큰 사용량
         * @param {Object} dayData 하루 누적 데이터
         * @returns {number} 계산된 비용 (USD)
         */
        calculateTokenCost(model, tokenUsage, dayData) {
            const costs = this.getTokenCosts(model);
            const inputTokens = tokenUsage.inputTokens || 0;
            const cachedInputTokens = tokenUsage.cachedInputTokens || 0;
            const outputTokens = tokenUsage.outputTokens || 0;
            
            // Gemini 2.5 Pro의 차등 요금제 처리
            if (model === "gemini-2.5-pro") {
                return this.calculateGeminiProCost(
                    inputTokens, cachedInputTokens, outputTokens,
                    dayData.inputTokens, costs
                );
            }
            
            // 일반적인 비용 계산
            return (
                inputTokens * costs.inputTokenCost / 1000000 +
                cachedInputTokens * costs.cachedInputTokenCost / 1000000 +
                outputTokens * costs.outputTokenCost / 1000000
            );
        }

        /**
         * @description Gemini 2.5 Pro 차등 요금제 비용 계산
         * @param {number} inputTokens 현재 요청 입력 토큰
         * @param {number} cachedInputTokens 현재 요청 캐시된 입력 토큰  
         * @param {number} outputTokens 현재 요청 출력 토큰
         * @param {number} dailyInputTotal 오늘 누적 입력 토큰 (현재 요청 제외)
         * @param {Object} costs 기본 비용 정보
         * @returns {number} 계산된 비용 (USD)
         */
        calculateGeminiProCost(inputTokens, cachedInputTokens, outputTokens, dailyInputTotal, costs) {
            const threshold = 200000; // 20만 토큰
            const premiumInputMultiplier = 2.0; // 입력 토큰 2배
            const premiumOutputMultiplier = 1.5; // 출력 토큰 1.5배
            
            let inputCost = 0;
            let cachedInputCost = 0;
            let outputCost = 0;
            
            // 입력 토큰 비용 계산
            const currentTotalInput = dailyInputTotal + inputTokens;
            
            if (dailyInputTotal >= threshold) {
                // 이미 임계점을 넘었다면 모든 토큰에 프리미엄 요금 적용
                inputCost = inputTokens * costs.inputTokenCost * premiumInputMultiplier / 1000000;
                outputCost = outputTokens * costs.outputTokenCost * premiumOutputMultiplier / 1000000;
            } else if (currentTotalInput > threshold) {
                // 이번 요청으로 임계점을 넘는다면 구간별 계산
                const tokensBeforeThreshold = threshold - dailyInputTotal;
                const tokensAfterThreshold = inputTokens - tokensBeforeThreshold;
                
                inputCost = (
                    tokensBeforeThreshold * costs.inputTokenCost / 1000000 +
                    tokensAfterThreshold * costs.inputTokenCost * premiumInputMultiplier / 1000000
                );
                outputCost = outputTokens * costs.outputTokenCost * premiumOutputMultiplier / 1000000;
            } else {
                // 아직 임계점 미만이면 기본 요금
                inputCost = inputTokens * costs.inputTokenCost / 1000000;
                outputCost = outputTokens * costs.outputTokenCost / 1000000;
            }
            
            // 캐시된 입력 토큰은 항상 기본 요금 (Google 문서에서 명시하지 않아 보수적 접근)
            cachedInputCost = cachedInputTokens * costs.cachedInputTokenCost / 1000000;
            
            return inputCost + cachedInputCost + outputCost;
        }

        /** 
         * @description 사용량 데이터 저장 (일별 토큰 사용량 및 비용)
         * @param {string} model 모델명
         * @param {Object} tokenUsage 토큰 사용량 데이터
         * @param {number} tokenUsage.inputTokens input 토큰 수
         * @param {number} tokenUsage.cachedInputTokens cached input 토큰 수
         * @param {number} tokenUsage.outputTokens output 토큰 수
         */
        async recordTokenUsage(model, tokenUsage) {
            const today = new Date().toISOString().split("T")[0];
            const result = await this.#storage.get("tokenUsageHistory");
            let history = result.tokenUsageHistory || {};
            
            if (!history[model]) {
                history[model] = {};
            }
            
            if (!history[model][today]) {
                history[model][today] = {
                    inputTokens: 0,
                    cachedInputTokens: 0,
                    outputTokens: 0,
                    totalCost: 0,
                    requestCount: 0
                };
            }
            
            const dayData = history[model][today];
            dayData.inputTokens += tokenUsage.inputTokens || 0;
            dayData.cachedInputTokens += tokenUsage.cachedInputTokens || 0;
            dayData.outputTokens += tokenUsage.outputTokens || 0;
            dayData.requestCount += 1;
            
            // 비용 계산
            const cost = this.calculateTokenCost(model, tokenUsage, dayData);
            dayData.totalCost += cost;
            
            // 6개월 이상 된 데이터 정리
            this.cleanOldUsageData(history);
            
            await this.#storage.set({ tokenUsageHistory: history });
            return cost;
        }

        /** 
         * @description 6개월 이상 된 데이터 정리
         * @param {Object} history 사용량 히스토리 데이터
         */
        cleanOldUsageData(history) {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const cutoffDate = sixMonthsAgo.toISOString().split("T")[0];
            
            Object.keys(history).forEach(model => {
                Object.keys(history[model]).forEach(date => {
                    if (date < cutoffDate) {
                        delete history[model][date];
                    }
                });
            });
        }

        /** 
         * @description 사용량 통계 조회
         * @param {Object} options 옵션
         * @param {string} options.model 모델명 (전체 조회 시 null)
         * @param {string} options.startDate 시작 날짜 (YYYY-MM-DD)
         * @param {string} options.endDate 끝 날짜 (YYYY-MM-DD)
         * @returns {Promise<Object>} 통계 데이터
         */
        async getUsageStats(options = {}) {
            const result = await this.#storage.get("tokenUsageHistory");
            const history = result.tokenUsageHistory || {};
            
            const endDate = options.endDate || new Date().toISOString().split("T")[0];
            const startDate = options.startDate || (() => {
                const date = new Date();
                date.setDate(date.getDate() - 30); // 기본 30일
                return date.toISOString().split("T")[0];
            })();
            
            const stats = {};
            const modelsToProcess = options.model ? [options.model] : Object.keys(history);
            
            modelsToProcess.forEach(model => {
                if (!history[model]) return;
                
                stats[model] = {
                    inputTokens: 0,
                    cachedInputTokens: 0,
                    outputTokens: 0,
                    totalCost: 0,
                    requestCount: 0,
                    dailyStats: {}
                };
                
                Object.keys(history[model]).forEach(date => {
                    if (date >= startDate && date <= endDate) {
                        const dayData = history[model][date];
                        stats[model].inputTokens += dayData.inputTokens;
                        stats[model].cachedInputTokens += dayData.cachedInputTokens;
                        stats[model].outputTokens += dayData.outputTokens;
                        stats[model].totalCost += dayData.totalCost;
                        stats[model].requestCount += dayData.requestCount;
                        stats[model].dailyStats[date] = { ...dayData };
                    }
                });
            });
            
            return stats;
        }

        /**
         * @description 번역 언어 가져오기
         * @returns {Promise<string>} 선택된 번역 언어
         */
        async getTranslationLanguage() {
            const result = await this.#storage.get("translationLanguage");
            return result.translationLanguage || "Korean";
        }

        /**
         * @description 번역 언어 설정
         * @param {string} language 선택된 번역 언어
         */
        async setTranslationLanguage(language) {
            await this.#storage.set({ translationLanguage: language });
        }

        /**
         * @description UUID 생성 (간단한 방식)
         * @returns {string} UUID
         */
        #generateId() {
            return 'preset-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * @description 기존 단어장을 새 프리셋 구조로 마이그레이션
         * @returns {Promise<boolean>} 마이그레이션 수행 여부
         */
        async #migrateGlossaryToPresets() {
            const result = await this.#storage.get(['glossary', 'glossaryPresets', 'glossarySettings']);
            
            // 이미 새 구조가 있는지 확인
            if (result.glossaryPresets) {
                // 프리셋은 있지만 활성 프리셋이 없는 경우 처리
                await this.#ensureActivePresets();
                return false;
            }

            const oldGlossary = result.glossary;
            if (!oldGlossary || !oldGlossary.words || oldGlossary.words.length === 0) {
                // 빈 단어장이면 기본 구조만 생성
                await this.#storage.set({
                    glossaryPresets: {},
                    glossarySettings: {
                        activePresets: [],
                        defaultPresets: [],
                        siteSpecificSettings: {}
                    }
                });
                return true;
            }

            // 기존 단어장을 첫 번째 프리셋으로 변환
            const presetId = this.#generateId();
            const now = Date.now();
            
            // 언어에 따른 기본 이름 생성
            const language = await this.getTranslationLanguage();
            let defaultName = '단어장1'; // 기본값
            
            const nameMap = {
                'Korean': '단어장1',
                'Japanese': '単語集1', 
                'Chinese (Simplified)': '词汇表1',
                'Chinese (Traditional)': '詞彙表1',
                'English': 'Glossary1',
                'Spanish': 'Glosario1',
                'French': 'Glossaire1',
                'German': 'Glossar1',
                'Italian': 'Glossario1',
                'Portuguese': 'Glossário1',
                'Russian': 'Словарь1',
                'Arabic': 'مسرد1',
                'Hindi': 'शब्दकोश1',
                'Thai': 'พจนานุกรม1',
                'Vietnamese': 'Từ điển1'
            };
            
            if (nameMap[language]) {
                defaultName = nameMap[language];
            }

            const newPreset = {
                id: presetId,
                name: defaultName,
                words: oldGlossary.words,
                version: oldGlossary.version || 1,
                created: now,
                updated: now,
                isActive: true
            };

            await this.#storage.set({
                glossaryPresets: {
                    [presetId]: newPreset
                },
                glossarySettings: {
                    activePresets: [presetId],
                    defaultPresets: [presetId],
                    siteSpecificSettings: {}
                }
            });

            return true;
        }

        /**
         * @description 활성 프리셋이 없는 경우 자동으로 활성화
         * @private
         */
        async #ensureActivePresets() {
            const result = await this.#storage.get(['glossaryPresets', 'glossarySettings']);
            const presets = result.glossaryPresets || {};
            let settings = result.glossarySettings || {
                activePresets: [],
                defaultPresets: [],
                siteSpecificSettings: {}
            };

            const presetIds = Object.keys(presets);
            
            // 프리셋이 있지만 활성 프리셋이 없는 경우
            if (presetIds.length > 0 && (!settings.activePresets || settings.activePresets.length === 0)) {
                // 첫 번째 프리셋을 활성화
                settings.activePresets = [presetIds[0]];
                settings.defaultPresets = [presetIds[0]];
                
                await this.#storage.set({ glossarySettings: settings });
            }
            
            // 활성 프리셋 중 존재하지 않는 것들 제거
            if (settings.activePresets && settings.activePresets.length > 0) {
                const validActivePresets = settings.activePresets.filter(id => presets[id]);
                if (validActivePresets.length !== settings.activePresets.length) {
                    settings.activePresets = validActivePresets;
                    await this.#storage.set({ glossarySettings: settings });
                }
            }
        }

        /**
         * @description 모든 단어장 프리셋 가져오기
         * @returns {Promise<Object>} 프리셋 객체들
         */
        async getGlossaryPresets() {
            await this.#migrateGlossaryToPresets();
            const result = await this.#storage.get('glossaryPresets');
            return result.glossaryPresets || {};
        }

        /**
         * @description 단어장 설정 가져오기
         * @returns {Promise<Object>} 설정 객체
         */
        async getGlossarySettings() {
            await this.#migrateGlossaryToPresets();
            const result = await this.#storage.get('glossarySettings');
            return result.glossarySettings || {
                activePresets: [],
                defaultPresets: [],
                siteSpecificSettings: {}
            };
        }

        /**
         * @description 단어장 설정 저장
         * @param {Object} settings 설정 객체
         */
        async setGlossarySettings(settings) {
            await this.#storage.set({ glossarySettings: settings });
        }

        /**
         * @description 새 단어장 프리셋 생성
         * @param {string} name 프리셋 이름
         * @returns {Promise<string>} 생성된 프리셋 ID
         */
        async createGlossaryPreset(name) {
            const presets = await this.getGlossaryPresets();
            const presetId = this.#generateId();
            const now = Date.now();

            presets[presetId] = {
                id: presetId,
                name: name || `새 단어장 ${Object.keys(presets).length + 1}`,
                words: [],
                version: 1,
                created: now,
                updated: now,
                isActive: false
            };

            await this.#storage.set({ glossaryPresets: presets });
            return presetId;
        }

        /**
         * @description 단어장 프리셋 업데이트
         * @param {string} presetId 프리셋 ID
         * @param {Object} data 업데이트할 데이터
         */
        async updateGlossaryPreset(presetId, data) {
            const presets = await this.getGlossaryPresets();
            if (!presets[presetId]) {
                throw new Error('존재하지 않는 프리셋입니다.');
            }

            presets[presetId] = {
                ...presets[presetId],
                ...data,
                updated: Date.now()
            };

            await this.#storage.set({ glossaryPresets: presets });
        }

        /**
         * @description 단어장 프리셋 삭제
         * @param {string} presetId 삭제할 프리셋 ID
         */
        async deleteGlossaryPreset(presetId) {
            const presets = await this.getGlossaryPresets();
            const settings = await this.getGlossarySettings();

            if (!presets[presetId]) {
                throw new Error('존재하지 않는 프리셋입니다.');
            }

            // 프리셋 삭제
            delete presets[presetId];

            // 설정에서도 제거
            settings.activePresets = settings.activePresets.filter(id => id !== presetId);
            settings.defaultPresets = settings.defaultPresets.filter(id => id !== presetId);
            
            // 사이트별 설정에서도 제거
            Object.keys(settings.siteSpecificSettings).forEach(domain => {
                settings.siteSpecificSettings[domain].presets = 
                    settings.siteSpecificSettings[domain].presets.filter(id => id !== presetId);
            });

            await this.#storage.set({ 
                glossaryPresets: presets,
                glossarySettings: settings 
            });
        }

        /**
         * @description 활성 프리셋 설정
         * @param {string[]} presetIds 활성화할 프리셋 ID 배열
         */
        async setActivePresets(presetIds) {
            const settings = await this.getGlossarySettings();
            settings.activePresets = presetIds;
            await this.#storage.set({ glossarySettings: settings });
        }

        /**
         * @description 기본 프리셋 설정
         * @param {string[]} presetIds 기본 프리셋 ID 배열
         */
        async setDefaultPresets(presetIds) {
            const settings = await this.getGlossarySettings();
            settings.defaultPresets = presetIds;
            await this.#storage.set({ glossarySettings: settings });
        }

        /**
         * @description 사이트별 프리셋 설정 가져오기
         * @param {string} domain 도메인
         * @returns {Promise<string[]>} 프리셋 ID 배열
         */
        async getSiteSpecificPresets(domain) {
            const settings = await this.getGlossarySettings();
            return settings.siteSpecificSettings[domain]?.presets || settings.defaultPresets;
        }

        /**
         * @description 사이트별 프리셋 설정 저장
         * @param {string} domain 도메인
         * @param {string[]} presetIds 프리셋 ID 배열
         */
        async setSiteSpecificPresets(domain, presetIds) {
            const settings = await this.getGlossarySettings();
            if (!settings.siteSpecificSettings[domain]) {
                settings.siteSpecificSettings[domain] = {};
            }
            settings.siteSpecificSettings[domain].presets = presetIds;
            settings.siteSpecificSettings[domain].lastUsed = Date.now();
            await this.#storage.set({ glossarySettings: settings });
        }

        /**
         * @description 활성 프리셋들의 단어를 병합한 통합 단어장 가져오기
         * @param {string} domain 현재 도메인 (선택사항)
         * @returns {Promise<Object>} 통합 단어장 객체
         */
        async getCombinedGlossary(domain = null) {
            // 마이그레이션 및 활성 프리셋 확인
            await this.#migrateGlossaryToPresets();
            
            const presets = await this.getGlossaryPresets();
            const settings = await this.getGlossarySettings();
            let activePresetIds = [];

            if (domain) {
                activePresetIds = await this.getSiteSpecificPresets(domain);
            } else {
                activePresetIds = settings.activePresets || [];
            }

            const combinedWords = [];
            const seenWords = new Set(); // 중복 제거용
            const activePresetNames = []; // 디버깅용 프리셋 이름 목록

            // 활성 프리셋이 없는 경우 자동 활성화 시도
            if (activePresetIds.length === 0) {
                const presetIds = Object.keys(presets);
                if (presetIds.length > 0) {
                    await this.#ensureActivePresets();
                    
                    // 설정 다시 조회
                    const updatedSettings = await this.getGlossarySettings();
                    activePresetIds = domain ? 
                        await this.getSiteSpecificPresets(domain) : 
                        updatedSettings.activePresets || [];
                }
            }

            activePresetIds.forEach(presetId => {
                if (presets[presetId]) {
                    const preset = presets[presetId];
                    activePresetNames.push(preset.name);
                    
                    if (preset.words && Array.isArray(preset.words)) {
                        preset.words.forEach(word => {
                            if (word.source && word.target) {
                                const key = word.source.toLowerCase().trim();
                                if (!seenWords.has(key)) {
                                    seenWords.add(key);
                                    combinedWords.push(word);
                                }
                            }
                        });
                    }
                } else {
                    console.warn(`⚠️ 존재하지 않는 프리셋 ID: ${presetId}`);
                }
            });

            return {
                words: combinedWords,
                version: 1,
                appliedPresetNames: activePresetNames // 적용된 프리셋 이름 추가
            };
        }

        /**
         * @description 특정 프리셋에 단어 추가
         * @param {string} presetId 프리셋 ID
         * @param {string} source 원본 용어
         * @param {string} target 대상 용어
         */
        async addWordToPreset(presetId, source, target) {
            const presets = await this.getGlossaryPresets();
            if (!presets[presetId]) {
                throw new Error('존재하지 않는 프리셋입니다.');
            }

            const words = presets[presetId].words;
            const existingIndex = words.findIndex(item => item.source === source);
            
            if (existingIndex !== -1) {
                words[existingIndex] = {
                    source,
                    target,
                    timestamp: Date.now()
                };
            } else {
                words.unshift({
                    source,
                    target,
                    timestamp: Date.now()
                });
            }

            await this.updateGlossaryPreset(presetId, { words });
        }

        /**
         * @description 특정 프리셋에서 단어 제거
         * @param {string} presetId 프리셋 ID
         * @param {string} source 제거할 원본 용어
         */
        async removeWordFromPreset(presetId, source) {
            const presets = await this.getGlossaryPresets();
            if (!presets[presetId]) {
                throw new Error('존재하지 않는 프리셋입니다.');
            }

            const words = presets[presetId].words.filter(item => item.source !== source);
            await this.updateGlossaryPreset(presetId, { words });
        }

        /**
         * @description 기존 단어장 관련 메서드들 - 호환성을 위해 유지하되 새 구조 사용
         */

        /**
         * @description 단어장 불러오기 (호환성 유지)
         * @returns {Promise<Object>} { words: Array<{source: string, target: string, timestamp: number}>, version: number }
         */
        async getGlossary() {
            return await this.getCombinedGlossary();
        }

        /**
         * @description 단어장 저장 (호환성 유지 - 첫 번째 활성 프리셋에 저장)
         * @param {Object} glossary { words: Array<{source: string, target: string, timestamp: number}>, version: number }
         */
        async setGlossary(glossary) {
            const settings = await this.getGlossarySettings();
            let targetPresetId = settings.activePresets[0];

            if (!targetPresetId) {
                // 활성 프리셋이 없으면 새로 생성
                const language = await this.getTranslationLanguage();
                const presetName = language === 'Korean' ? '단어장1' : 'Glossary1';
                targetPresetId = await this.createGlossaryPreset(presetName);
                await this.setActivePresets([targetPresetId]);
                await this.setDefaultPresets([targetPresetId]);
            }

            await this.updateGlossaryPreset(targetPresetId, {
                words: glossary.words,
                version: glossary.version || 1
            });
        }

        /**
         * @description 단어장 아이템 추가 (호환성 유지 - 첫 번째 활성 프리셋에 추가)
         * @param {string} source 원본 용어
         * @param {string} target 대상 용어
         */
        async addGlossaryItem(source, target) {
            const settings = await this.getGlossarySettings();
            let targetPresetId = settings.activePresets[0];

            if (!targetPresetId) {
                // 활성 프리셋이 없으면 새로 생성
                const language = await this.getTranslationLanguage();
                const presetName = language === 'Korean' ? '단어장1' : 'Glossary1';
                targetPresetId = await this.createGlossaryPreset(presetName);
                await this.setActivePresets([targetPresetId]);
                await this.setDefaultPresets([targetPresetId]);
            }

            await this.addWordToPreset(targetPresetId, source, target);
        }

        /**
         * @description 용어집 아이템 업데이트 (호환성 유지 - 모든 활성 프리셋에서 검색하여 업데이트)
         * @param {string} oldSource 기존 원본 용어 (식별키)
         * @param {string} newSource 새 원본 용어
         * @param {string} newTarget 새 대상 용어
         */
        async updateGlossaryItem(oldSource, newSource, newTarget) {
            const presets = await this.getGlossaryPresets();
            const settings = await this.getGlossarySettings();

            let updated = false;
            for (const presetId of settings.activePresets) {
                if (presets[presetId]) {
                    const words = presets[presetId].words;
                    const index = words.findIndex(item => item.source === oldSource);
                    if (index !== -1) {
                        words[index] = {
                            source: newSource,
                            target: newTarget,
                            timestamp: Date.now()
                        };
                        await this.updateGlossaryPreset(presetId, { words });
                        updated = true;
                        break; // 첫 번째 발견된 것만 업데이트
                    }
                }
            }

            if (!updated) {
                throw new Error('업데이트할 단어를 찾을 수 없습니다.');
            }
        }

        /**
         * @description 용어집 아이템 제거 (호환성 유지 - 모든 활성 프리셋에서 제거)
         * @param {string} source 제거할 원본 용어
         */
        async removeGlossaryItem(source) {
            const presets = await this.getGlossaryPresets();
            const settings = await this.getGlossarySettings();

            for (const presetId of settings.activePresets) {
                if (presets[presetId]) {
                    const words = presets[presetId].words.filter(item => item.source !== source);
                    if (words.length !== presets[presetId].words.length) {
                        await this.updateGlossaryPreset(presetId, { words });
                    }
                }
            }
        }
    }

    window.TranslatorStorage = TranslatorStorage;
}