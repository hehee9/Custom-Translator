if (!window.Translator) {
    /**
     * @class Translator
     * @description APIManager, TranslatorStorage 인스턴스로 번역 수행
     */
    class Translator {
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
            try {
                const glossary = await this.storage.getGlossary();
                const translation = await this.api.translate(text, glossary, options);
                const formatted = translation.replace(/\n/g, "<br>");
                return formatted || "번역 결과가 없습니다.";
            } catch (error) {
                console.error("번역 중 에러:", error);
                throw error;
            }
        }
    }
    
    window.Translator = Translator;
}