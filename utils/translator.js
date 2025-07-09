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
     * @returns {Promise<string>} 번역된 텍스트 | 기본 메시지
     * @throws {Error} 번역 중 에러
     */
    async translate(text, options = {}) {
        const i18n = new I18nManager();
        try {
            const glossary = await this.storage.getGlossary();
            const language = await this.storage.getTranslationLanguage();
            const translation = await this.api.translate(text, glossary, {
                ...options,
                language
            });
            const formatted = translation.replace(/\n/g, "<br>");
            return formatted || await i18n.getText("noTranslationResult");
        } catch (error) {
            console.error("번역 중 에러:", error);
            throw error;
        }
    }
};

window.Translator = Translator;