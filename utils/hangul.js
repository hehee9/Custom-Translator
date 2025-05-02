/** @description 초성 배열 */
const CHOSEONG_LIST = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ",
    "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ",
    "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

/** @description 중성 배열 */
const JUNGSEONG_LIST = [
    "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ",
    "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ",
    "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ",
    "ㅡ", "ㅢ", "ㅣ"
];

/** @description 종성 배열 */
const JONGSEONG_LIST = [
    "", "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ",
    "ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ",
    "ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

/**
 * @description 초성 추출
 * @param {string} text 입력 문자열
 * @returns {string} 초성 문자열
 */
function getChoseong(text) {
    let result = "";
    for (const ch of text) {
        const code = ch.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
            const offset = code - 0xac00;
            const choseongIndex = Math.floor(offset / (21 * 28));
            result += CHOSEONG_LIST[choseongIndex];
        } else result += ch;

    }
    return result;
}

/**
 * @description 문자열 분해, 초/중/종성 결합 문자열 변환
 * @param {string} text 입력 문자열
 * @returns {string} 분해된 문자열
 */
function disassemble(text) {
    let result = "";
    for (const ch of text) {
        const code = ch.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
            const offset = code - 0xac00;
            const choseongIndex = Math.floor(offset / (21 * 28));
            const jungseongIndex = Math.floor((offset % (21 * 28)) / 28);
            const jongseongIndex = offset % 28;
            result += CHOSEONG_LIST[choseongIndex] + JUNGSEONG_LIST[jungseongIndex] + (jongseongIndex ? JONGSEONG_LIST[jongseongIndex] : "");
        } else result += ch;
    }
    return result;
}

/**
 * @description 초성 검색
 * @param {string} source 원본 문자열
 * @param {string} search 검색어 (초성)
 * @returns {boolean} 포함 여부
 */
function choseongIncludes(source, search) {
    if (!search) return true;
    return getChoseong(source).includes(search);
}

/**
 * @description 한글 포함 검색
 * @param {string} source 원본 문자열
 * @param {string} search 검색어
 * @returns {boolean} 포함 여부
 */
function hangulIncludes(source, search) {
    if (!search) return true;
    return source.includes(search) || disassemble(source).includes(disassemble(search));
}

export { choseongIncludes, hangulIncludes };