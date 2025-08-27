/**
 * @class Translator
 * @description APIManager, TranslatorStorage 인스턴스로 번역 수행
 */
var Translator = class {
    /** @description APIManager, TranslatorStorage 인스턴스 초기화 */
    constructor() {
        this.api = new APIManager();
        this.storage = new TranslatorStorage();
    }

    /**
     * @description 텍스트 번역
     * @param {string} text 번역할 텍스트
     * @param {Object} [options={}] 번역 옵션
     * @param {string} [options.domain] 현재 도메인 (사이트별 단어장 적용용)
     * @returns {Promise<{text: string, tokenUsage?: Object, cost?: number, appliedPresets?: Array}>} 번역 결과 및 프리셋 정보
     * @throws {Error} 번역 중 에러
     */
    async translate(text, options = {}) {
        const i18n = new I18nManager();
        try {
            // 사용된 프리셋 정보를 추적하기 위한 변수
            let appliedPresets = [];
            
            // 도메인 정보가 있으면 해당 도메인의 단어장을, 없으면 기본 단어장을 사용
            const glossary = options.domain 
                ? await this.storage.getCombinedGlossary(options.domain)
                : await this.storage.getGlossary();
                
            // 적용된 프리셋 정보 수집
            appliedPresets = await this.getAppliedPresets(options.domain);
                
            const language = await this.storage.getTranslationLanguage();
            const result = await this.api.translate(text, glossary, {
                ...options,
                language
            });
            const formatted = result.text.replace(/\n/g, "<br>");
            return {
                text: formatted || await i18n.getText("noTranslationResult"),
                tokenUsage: result.tokenUsage,
                cost: result.cost,
                appliedPresets: appliedPresets,
                thinking: result.thinking
            };
        } catch (error) {
            console.error("번역 중 에러:", error);
            throw error;
        }
    }

    /**
     * @description 현재 적용된 프리셋 정보 가져오기
     * @param {string} domain 현재 도메인
     * @returns {Promise<Array>} 적용된 프리셋 정보 배열
     */
    async getAppliedPresets(domain = null) {
        try {
            const presets = await this.storage.getGlossaryPresets();
            const settings = await this.storage.getGlossarySettings();
            
            // 사이트별 설정이 있으면 사용, 없으면 전역 설정 사용
            let activePresetIds = settings.activePresets || [];
            let settingSource = 'global';
            
            if (domain && settings.siteSpecificSettings && settings.siteSpecificSettings[domain]) {
                activePresetIds = settings.siteSpecificSettings[domain].presets || [];
                settingSource = 'site-specific';
            }
            
            // 프리셋 ID를 실제 프리셋 정보로 변환
            const appliedPresets = activePresetIds
                .filter(id => presets[id])
                .map(id => ({
                    id: id,
                    name: presets[id].name,
                    wordCount: presets[id].words ? presets[id].words.length : 0
                }));
                
            return appliedPresets;
        } catch (error) {
            console.error("프리셋 정보 조회 실패:", error);
            return [];
        }
    }
};

window.Translator = Translator;