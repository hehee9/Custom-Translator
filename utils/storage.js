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


        
        /** @description 사용량 불러오기 */
        async getUsageData(model) {
            if (!model) model = await this.getTranslationModel();
            const result = await this.#storage.get("usageData");
            let usageData = result.usageData || {};
            
            // 모델별 사용량이 없는 경우 초기화
            if (!usageData[model]) {
                usageData[model] = { date: new Date().toISOString().split("T")[0], count: 0 };
            }
            
            return usageData[model];
        }

        /** @description 사용량 저장 */
        async setUsageData(usageData, model) {
            if (!model) model = await this.getTranslationModel();
            
            const result = await this.#storage.get("usageData");
            let allUsageData = result.usageData || {};
            allUsageData[model] = usageData;
            
            await this.#storage.set({ usageData: allUsageData });
        }

        /** @description 일일 사용량 증가 */
        async increaseUsageCount(model) {
            if (!model) model = await this.getTranslationModel();
            
            let usageData = await this.getUsageData(model);
            const today = new Date().toISOString().split("T")[0];
            
            if (usageData.date !== today) {
                usageData = { date: today, count: 0 };
            }
            
            usageData.count++;
            await this.setUsageData(usageData, model);
            return usageData.count;
        }

        /** 
         * @description 모델별 사용량 한도 반환
         * @param {string} model 모델 코드
         * @returns {{daily: number, minute: number}} 모델별 사용량 한도
         */
        getModelLimits(model) {
            const limits = {
                "gemini-2.0-flash": { daily: 1500, minute: 15 },
                "gemini-2.5-flash": { daily: 500, minute: 10 },
                "gemini-2.5-pro": { daily: 25, minute: 5 }
            };
            return limits[model] || limits["gemini-2.0-flash"];
        }

        /** @description 분당 사용량 증가 */
        async increaseMinuteUsage(model) {
            if (!model) model = await this.getTranslationModel();
            
            const result = await this.#storage.get("minuteUsage");
            let allUsage = result.minuteUsage || {};
            let usage = allUsage[model] || [];
            
            const now = Date.now();
            usage = usage.filter(ts => now - ts < 60000);
            usage.push(now);
            
            allUsage[model] = usage;
            await this.#storage.set({ minuteUsage: allUsage });
            
            return usage.length;
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
    }

    window.TranslatorStorage = TranslatorStorage;
}