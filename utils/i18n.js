/** @description 언어별 UI 텍스트 정의 */
if (!window.I18nManager) {
    /**
     * @class I18nManager
     * @description 다국어 지원 관리 클래스
     */
    window.I18nManager = class I18nManager {
        constructor() {
            this.storage = new TranslatorStorage();
            this.translations = {
                // 한국어 (기본)
                "Korean": {
                    // 네비게이션
                    "settings": "설정",
                    "glossary": "단어장",
                    
                    // 설정 탭
                    "apiKeyIssue": "Gemini API KEY 발급",
                    "apiWarning": "※유료 계정에 연동 시 요금이 부과됨",
                    "apiKeyPlaceholder": "Gemini API 키를 입력하세요",
                    "save": "저장",
                    "modelSelectionTitle": "번역 모델 선택",
                    "languageSelectionTitle": "번역 언어 선택",
                    "apiKeySaved": "API 키가 저장되었습니다.",
                    
                    // 모델 설명
                    "gemini20FlashDesc": "매우 빠름, 준수한 성능",
                    "gemini25FlashDesc": "속도 보통, 좋은 성능",
                    "gemini25ProDesc": "약간 느림, 뛰어난 성능",
                    "gpt5ChatDesc": "보통 속도, 뛰어난 성능",
                    "qwen3235bInstructDesc": "초고속 번역",
                    "qwen3235bThinkingDesc": "초고속 추론 및 번역",
                    
                    // OpenAI/Cerebras API 관련
                    "openaiApiKeyIssue": "OpenAI API KEY 발급",
                    "openaiApiWarning": "※OpenAI 유료 계정이 필요합니다",
                    "openaiApiKeyPlaceholder": "OpenAI API 키를 입력하세요",
                    "cerebrasApiKeyIssue": "Cerebras API KEY 발급",
                    "cerebrasApiWarning": "※모델별로 매일 100만 토큰 무료 지원",
                    "cerebrasApiKeyPlaceholder": "Cerebras API 키를 입력하세요",
                    
                    // 토큰 사용량/비용 통계 관련
                    "usageStatisticsTitle": "토큰 사용량 & 비용 통계",
                    "periodToday": "오늘",
                    "periodWeek": "이번 주",
                    "periodMonth": "이번 달",
                    "period3Months": "최근 3개월",
                    "period6Months": "최근 6개월",
                    "totalRequests": "총 요청",
                    "totalTokens": "총 토큰",
                    "totalCost": "총 비용",
                    "modelBreakdown": "모델별 사용량",
                    
                    // 단어장 탭
                    "importGlossary": "단어장 불러오기",
                    "exportGlossary": "단어장 내보내기",
                    "sourceWordPlaceholder": "원본 단어",
                    "targetWordPlaceholder": "번역 단어",
                    "add": "추가",
                    "search": "검색",
                    "delete": "삭제",
                    
                    // 정렬 옵션
                    "sortRecent": "최신순",
                    "sortOld": "오래된순",
                    "sortModified": "수정순",
                    "sortModifiedReverse": "수정역순",
                    "sortAsc": "이름순",
                    "sortDesc": "이름역순",
                    
                    // 단어장 프리셋 관련
                    "glossaryPresets": "단어장 프리셋",
                    "createPreset": "새 프리셋",
                    "editWords": "단어 편집",
                    "editingPreset": "편집 중인 프리셋:",
                    "exportSelected": "선택한 프리셋 내보내기",
                    "exportAll": "모든 프리셋 내보내기",
                    "presetEmpty": "프리셋이 없습니다. 새 프리셋을 만들어주세요.",
                    "selectPresetToEdit": "편집할 프리셋을 선택해주세요.",
                    "presetNotFound": "프리셋을 찾을 수 없습니다.",
                    "deletePresetConfirm": "\"{name}\" 프리셋을 삭제하시겠습니까?",
                    "selectPresetToAdd": "단어를 추가할 프리셋을 선택해주세요.",
                    "noActivePresets": "내보낼 활성 프리셋이 없습니다.",
                    "noPresetsToExport": "내보낼 프리셋이 없습니다.",
                    "presetsExported": "{count}개 프리셋을 내보냈습니다.",
                    "importedGlossary": "가져온 단어장",
                    "unsupportedFormat": "지원하지 않는 형식입니다.",
                    "edit": "편집",
                    "delete": "삭제",
                    "wordsCount": "{count}개 단어",
                    
                    // 사이트별 설정 관련
                    "siteSpecificSettings": "사이트별 설정",
                    "resetToGlobalSettings": "전역 설정으로 되돌리기",
                    "resetSiteSettingsConfirm": "{domain}의 사이트별 설정을 초기화하시겠습니까?\n전역 설정을 사용하게 됩니다.",
                    "resetSiteSettingsError": "사이트 설정 초기화에 실패했습니다.",
                    
                    // 현재 사이트 단어장 관련
                    "currentSiteGlossaryTitle": "현재 사이트 단어장",
                    "configure": "설정",
                    "useGlobalSettings": "전역 설정 사용",
                    "noActiveTab": "활성 탭 없음",
                    "usingSiteSettings": "사이트 설정 사용 ({count}개 프리셋)",
                    "siteNoPresets": "사이트 설정 사용 (프리셋 없음)",
                    "exactDomainMatchOption": "정확한 도메인만 일치",
                    "exactDomainHelp": "체크 시 서브도메인 제외하고 정확히 일치하는 도메인에만 적용",
                    "selectPresetsForSite": "이 사이트에 사용할 단어장:",
                    "apply": "적용",
                    "reset": "초기화",
                    "cancel": "취소",
                    "close": "닫기",
                    
                    // 고급 설정 관련
                    "advancedSettings": "고급 설정",
                    "advancedSettingsDesc": "API 키 관리, 사용량 통계, 데이터 백업 등의 기능을 사용할 수 있습니다.",
                    "quickSettings": "빠른 설정",
                    
                    // Options 페이지 관련
                    "optionsTitle": "Custom Translator 고급 설정",
                    "optionsDescription": "API 키 관리, 단어장 편집, 사용량 통계 및 고급 설정을 관리할 수 있습니다.",
                    "apiKeysTab": "API 키",
                    "glossaryTab": "단어장 편집",
                    "siteSettingsTab": "사이트별 설정",
                    "usageTab": "사용량 통계",
                    "backupTab": "백업/복원",
                    
                    // 단어장 관리
                    "glossaryManagementTitle": "단어장 관리",
                    "glossaryManagement": "단어장 관리",
                    "createNewPreset": "새 프리셋 생성",
                    "exportOptions": "내보내기",
                    "exportActive": "활성 프리셋 내보내기", 
                    "exportAll": "모든 프리셋 내보내기",
                    "editPreset": "프리셋 편집",
                    "presetName": "프리셋 이름",
                    "enterPresetName": "프리셋 이름을 입력하세요",
                    "sourceWord": "원본 단어",
                    "targetWord": "번역 단어",
                    "wordsInPreset": "단어 목록",
                    "sortByRecent": "최신순",
                    "sortByOld": "오래된순", 
                    "sortByNameAsc": "이름순",
                    "sortByNameDesc": "이름역순",
                    "cancel": "취소",
                    
                    // 사이트별 설정
                    "siteSettingsTitle": "사이트별 설정",
                    "siteSettings": "사이트별 설정",
                    "siteSettingsDescription": "특정 웹사이트에서 자동으로 적용될 단어장 프리셋을 설정할 수 있습니다.",
                    "addSiteSetting": "사이트 추가",
                    "clearAllSiteSettings": "모든 설정 초기화",
                    "siteSettingTitle": "사이트 설정",
                    "domainName": "도메인",
                    "domainExample": "예: example.com",
                    "domainHelp": "프로토콜(http://)은 제외하고 입력하세요.",
                    "selectedPresets": "적용할 프리셋",
                    
                    // 메시지
                    "glossaryLoaded": "단어장을 불러왔습니다.",
                    "invalidGlossary": "올바른 단어장 형식이 아닙니다.",
                    
                    // 에러 메시지
                    "apiKeyRequired": "API 키가 설정되어 있지 않습니다. 팝업창을 열어 API 키를 입력 후 저장하세요.",
                    "dailyLimitExceeded": "일일 사용량 제한({limit}회)을 초과했습니다. 내일 다시 시도해주세요.",
                    "minuteLimitExceeded": "분당 사용량 제한({limit}회)을 초과했습니다. 잠시 후 다시 시도해주세요.",
                    "noTranslationResult": "번역 결과가 없습니다.",
                    
                    // 컨텍스트 메뉴
                    "translateSelectedText": "선택한 텍스트 번역",
                    
                    // 번역 팝업
                    "translateButton": "번역",
                    "translating": "번역 중...",
                    "thinkingProcess": "추론 과정",
                    "thinking": "추론 중...",
                    "close": "닫기",
                    "listen": "듣기",
                    "copy": "복사",
                    "copied": "복사됨",
                    "copyFailed": "복사 실패",
                    
                    // 새로운 설정 페이지 관련
                    "settingsTitle": "Custom Translator 설정",
                    "apiSettings": "API 설정",
                    "usageStatistics": "사용량 통계",
                    "advancedSettings": "고급 설정",
                    "quickSettings": "빠른 설정",
                    "advancedSettingsDesc": "API 키 관리, 사용량 통계, 데이터 백업 등의 기능을 사용할 수 있습니다.",
                    
                    // API 설정 페이지
                    "apiSettingsTitle": "API 설정",
                    "apiKeyLabel": "API 키",
                    "openaiApiKeyLabel": "API 키",
                    "cerebrasApiKeyLabel": "API 키",
                    
                    // 사용량 통계 페이지
                    "periodLabel": "기간 선택:",
                    
                    // 고급 설정 페이지
                    "advancedSettingsTitle": "고급 설정",
                    "dataManagement": "데이터 관리",
                    "exportAllData": "모든 데이터 내보내기",
                    "exportAllDataDesc": "설정, 단어장, 사용량 통계를 모두 내보냅니다.",
                    "importAllData": "데이터 가져오기",
                    "importAllDataDesc": "백업 파일에서 데이터를 복원합니다.",
                    "clearAllData": "모든 데이터 삭제",
                    "clearAllDataDesc": "모든 설정과 데이터를 초기화합니다. (복구 불가)",
                    "about": "정보",
                    "version": "버전:",
                    "developer": "개발자:",
                    
                    // 라이선스 관련
                    "showLicenses": "오픈소스 라이선스",
                    "openSourceLicenses": "오픈소스 라이선스",
                    
                    // 추가 필요한 키들
                    "clickToEdit": "클릭하여 편집",
                    "unsavedChanges": "저장되지 않은 변경사항",
                    "unsavedChangesMessage": "변경사항이 저장되지 않았습니다. 정말로 나가시겠습니까?",
                    "discardChanges": "변경사항 버리기", 
                    "saveChanges": "변경사항 저장",
                    "getApiKey": "API KEY 발급",
                    "requestsLabel": "요청",
                    "tokensLabel": "토큰",
                    "noPresetSelected": "프리셋: 없음",
                    "presetSelected": "프리셋: {name}",
                    "confirm": "확인",
                    "confirmMessage": "정말로 실행하시겠습니까?",
                    "noPresetsAvailable": "사용 가능한 프리셋이 없습니다.",
                    "noWords": "단어가 없습니다.",
                    "resetConfirm": "초기화 확인",
                    "geminiApiSettingsTitle": "Gemini API 설정",
                    "openaiApiSettingsTitle": "OpenAI API 설정", 
                    "cerebrasApiSettingsTitle": "Cerebras API 설정",
                    "notification": "알림",
                    "taskCompleted": "작업이 완료되었습니다.",
                    "gemini20FlashFullDesc": "매우 빠름, 준수한 성능",
                    "gemini25FlashFullDesc": "빠름, 좋은 성능", 
                    "gemini25ProFullDesc": "약간 느림, 뛰어난 성능",
                    "optionsPageTitle": "Custom Translator 설정",
                    "sourceWordPlaceholder": "원본 단어",
                    "targetWordPlaceholder": "번역 단어",
                    "wordsCount": "{count}개 단어",
                    "active": "(활성)",
                    "clickToEditHint": "클릭하여 편집",
                    "noPresetsCreated": "아직 생성된 프리셋이 없습니다.",
                    "wordsEmpty": "단어가 없습니다.",
                    "presetsLabel": "프리셋:",
                    "edit": "편집",
                    
                    // options.js에서 사용되는 메시지들
                    "hangulUtilsLoadFailed": "한글 검색 유틸리티를 로드할 수 없습니다",
                    "apiKeyLoadFailed": "API 키 로드 실패",
                    "usageStatsUpdateFailed": "사용량 통계 업데이트 실패",
                    "dataExportFailed": "데이터 내보내기에 실패했습니다",
                    "error": "오류",
                    "invalidBackupFormat": "올바른 백업 파일 형식이 아닙니다",
                    "overwriteDataConfirm": "기존 데이터를 모두 덮어쓰시겠습니까?\n이 작업은 되돌릴 수 없습니다",
                    "dataRestoreConfirm": "데이터 복원 확인",
                    "warning": "경고",
                    "dataRestoredSuccess": "데이터가 성공적으로 복원되었습니다. 페이지를 새로고침합니다",
                    "completed": "완료",
                    "dataRestoreError": "데이터 복원 중 오류",
                    "partialRestoreFailed": "일부 데이터 복원에 실패했습니다",
                    "dataImportFailed": "데이터 가져오기에 실패했습니다",
                    "deleteAllDataConfirm": "모든 데이터를 삭제하시겠습니까?\n- API 키\n- 설정\n- 단어장\n- 사용량 통계\n\n이 작업은 되돌릴 수 없습니다",
                    "dataDeleteConfirm": "데이터 삭제 확인",
                    "finalDeleteConfirm": "정말로 모든 데이터를 삭제하시겠습니까?",
                    "finalConfirm": "최종 확인",
                    "allDataDeleted": "모든 데이터가 삭제되었습니다. 페이지를 새로고침합니다",
                    "dataDeleteFailed": "데이터 삭제에 실패했습니다",
                    "manifestLoadFailed": "매니페스트 가져오기 실패",
                    "unsavedChangesDialog": "저장되지 않은 변경사항이 있습니다. 어떻게 하시겠습니까?",
                    "presetNameRequired": "프리셋 이름을 입력해주세요",
                    "saveFailed": "저장에 실패했습니다",
                    "presetSaveFailed": "프리셋 저장 실패",
                    "presetLoadFailed": "프리셋 로드 실패",
                    "presetNotFound": "프리셋을 찾을 수 없습니다",
                    "modalOpenFailed": "모달을 열 수 없습니다",
                    "editPreset": "프리셋 편집",
                    "createNewPreset": "새 프리셋 생성",
                    "wordListLoadFailed": "단어 목록 로드 실패",
                    "deletePresetQuestion": "\"{name}\" 프리셋을 삭제하시겠습니까?",
                    "presetDelete": "프리셋 삭제",
                    "presetDeleteFailed": "프리셋 삭제에 실패했습니다",
                    "siteSettingsLoadFailed": "사이트 설정 로드 실패",
                    "noPresets": "없음",
                    "siteSettingsModalOpenFailed": "사이트 설정 모달 열기 실패",
                    "deleteSiteSettingConfirm": "{domain}의 설정을 삭제하시겠습니까?",
                    "siteSettingDelete": "사이트 설정 삭제",
                    "siteSettingDeleteFailed": "사이트 설정 삭제에 실패했습니다",
                    "presetCreateFailed": "프리셋 생성 실패",
                    "invalidGlossaryFormat": "올바른 단어장 형식이 아닙니다",
                    "importedGlossaryName": "가져온 단어장",
                    "glossaryImportSuccess": "단어장을 성공적으로 가져왔습니다",
                    "glossaryImportFailed": "단어장 가져오기에 실패했습니다",
                    "noActivePresetsToExport": "활성 프리셋이 없습니다",
                    "info": "알림",
                    "exportFailed": "내보내기에 실패했습니다",
                    "activePresetExportFailed": "활성 프리셋 내보내기 실패",
                    "noPresetsToExport": "내보낼 프리셋이 없습니다",
                    "allPresetExportFailed": "모든 프리셋 내보내기 실패",
                    "resetAllSiteSettingsConfirm": "모든 사이트별 설정을 초기화하시겠습니까?",
                    "settingsReset": "설정 초기화",
                    "allSiteSettingsReset": "모든 사이트 설정이 초기화되었습니다",
                    "siteSettingsResetFailed": "사이트 설정 초기화 실패",
                    "resetFailed": "초기화에 실패했습니다",
                    "wordAddFailed": "단어 추가에 실패했습니다",
                    "deleteWordConfirm": "\"{source}\" 단어를 삭제하시겠습니까?",
                    "wordDelete": "단어 삭제",
                    "wordDeleteFailed": "단어 삭제에 실패했습니다",
                    "domainRequired": "도메인을 입력해주세요",
                    "siteSettingSaveFailed": "사이트 설정 저장 실패",
                    "noDataForPeriod": "선택한 기간에 사용량 데이터가 없습니다",
                    "statsLoadFailed": "통계 데이터를 불러오는데 실패했습니다",
                    "wordsEmpty": "단어가 없습니다",
                    "presetListLoadFailed": "프리셋을 불러오는데 실패했습니다",
                    "siteSettingsListLoadFailed": "사이트 설정을 불러오는데 실패했습니다",
                    "noSiteSettings": "아직 설정된 사이트가 없습니다",
                    "noPresetsCreated": "아직 생성된 프리셋이 없습니다",
                    "getUsageStatsMethodNotFound": "getUsageStats 메서드를 찾을 수 없습니다",
                    "requestsCount": "요청: {count}",
                    "tokensCount": "토큰: {count}",
                    "active": "(활성)",
                    "clickToEditHint": "클릭하여 편집"
                },
                
                // 영어
                "English": {
                    "settings": "Settings",
                    "glossary": "Glossary",
                    "apiKeyIssue": "Get Gemini API KEY",
                    "apiWarning": "※Charges may apply when linked to a paid account",
                    "apiKeyPlaceholder": "Enter your Gemini API key",
                    "save": "Save",
                    "modelSelectionTitle": "Select Translation Model",
                    "languageSelectionTitle": "Select Translation Language",
                    "apiKeySaved": "API key has been saved.",
                    "gemini20FlashDesc": "Very fast, decent performance",
                    "gemini25FlashDesc": "Normal speed, good performance",
                    "gemini25ProDesc": "Slightly slow, excellent performance",
                    "gpt5ChatDesc": "Normal speed, excellent performance",
                    "qwen3235bInstructDesc": "Ultra-fast translation",
                    "qwen3235bThinkingDesc": "Ultra-fast reasoning and translation",
                    
                    // OpenAI/Cerebras API Related
                    "openaiApiKeyIssue": "Get OpenAI API KEY",
                    "openaiApiWarning": "※OpenAI paid account required",
                    "openaiApiKeyPlaceholder": "Enter your OpenAI API key",
                    "cerebrasApiKeyIssue": "Get Cerebras API KEY",
                    "cerebrasApiWarning": "※1 million free tokens daily per model",
                    "cerebrasApiKeyPlaceholder": "Enter your Cerebras API key",
                    
                    // Token Usage/Cost Statistics Related
                    "usageStatisticsTitle": "Token Usage & Cost Statistics",
                    "periodToday": "Today",
                    "periodWeek": "This Week",
                    "periodMonth": "This Month",
                    "period3Months": "Last 3 Months",
                    "period6Months": "Last 6 Months",
                    "totalRequests": "Total Requests",
                    "totalTokens": "Total Tokens",
                    "totalCost": "Total Cost",
                    "modelBreakdown": "Model Breakdown",
                    "importGlossary": "Import Glossary",
                    "exportGlossary": "Export Glossary",
                    "sourceWordPlaceholder": "Source word",
                    "targetWordPlaceholder": "Target word",
                    "add": "Add",
                    "search": "Search",
                    "delete": "Delete",
                    "sortRecent": "Recent first",
                    "sortOld": "Oldest first",
                    "sortModified": "Recently modified",
                    "sortModifiedReverse": "Oldest modified",
                    "sortAsc": "A to Z",
                    "sortDesc": "Z to A",
                    
                    // 단어장 프리셋 관련
                    "glossaryPresets": "Glossary Presets",
                    "createPreset": "New Preset",
                    "editWords": "Edit Words",
                    "editingPreset": "Editing preset:",
                    "exportSelected": "Export Selected Presets",
                    "exportAll": "Export All Presets",
                    "presetEmpty": "No presets available. Please create a new preset.",
                    "selectPresetToEdit": "Please select a preset to edit.",
                    "presetNotFound": "Preset not found.",
                    "deletePresetConfirm": "Delete preset \"{name}\"?",
                    "selectPresetToAdd": "Please select a preset to add words to.",
                    "noActivePresets": "No active presets to export.",
                    "noPresetsToExport": "No presets to export.",
                    "presetsExported": "Exported {count} presets.",
                    "importedGlossary": "Imported Glossary",
                    "unsupportedFormat": "Unsupported format.",
                    "edit": "Edit",
                    "wordsCount": "{count} words",
                    
                    // 현재 사이트 단어장 관련
                    "currentSiteGlossaryTitle": "Current Site Glossary",
                    "configure": "Configure",
                    "useGlobalSettings": "Using Global Settings",
                    "noActiveTab": "No Active Tab",
                    "usingSiteSettings": "Using Site Settings ({count} presets)",
                    "siteNoPresets": "Using Site Settings (No presets)",
                    
                    // Site-specific settings
                    "siteSpecificSettings": "Site-specific Settings",
                    "resetToGlobalSettings": "Reset to global settings",
                    "resetSiteSettingsConfirm": "Reset site-specific settings for {domain}?\nGlobal settings will be used.",
                    "resetSiteSettingsError": "Failed to reset site settings.",
                    
                    // Options page
                    "optionsTitle": "Custom Translator Advanced Settings",
                    "optionsDescription": "Manage API keys, edit glossaries, view usage statistics, and configure advanced settings.",
                    "apiKeysTab": "API Keys",
                    "glossaryTab": "Glossary Editor",
                    "siteSettingsTab": "Site Settings", 
                    "usageTab": "Usage Statistics",
                    "backupTab": "Backup/Restore",
                    
                    // Glossary management
                    "glossaryManagementTitle": "Glossary Management",
                    "glossaryManagement": "Glossary Management",
                    "createNewPreset": "Create New Preset",
                    "exportOptions": "Export Options",
                    "exportActive": "Export Active Presets",
                    "exportAll": "Export All Presets", 
                    "editPreset": "Edit Preset",
                    "presetName": "Preset Name",
                    "enterPresetName": "Enter preset name",
                    "sourceWord": "Source Word",
                    "targetWord": "Target Word",
                    "wordsInPreset": "Words in Preset",
                    "sortByRecent": "Most Recent",
                    "sortByOld": "Oldest",
                    "sortByNameAsc": "Name A-Z",
                    "sortByNameDesc": "Name Z-A",
                    "cancel": "Cancel",
                    
                    // Site settings
                    "siteSettingsTitle": "Site-specific Settings",
                    "siteSettings": "Site Settings",
                    "siteSettingsDescription": "Configure glossary presets that will be automatically applied to specific websites.",
                    "addSiteSetting": "Add Site",
                    "clearAllSiteSettings": "Clear All Settings",
                    "siteSettingTitle": "Site Setting",
                    "domainName": "Domain",
                    "domainExample": "e.g., example.com",
                    "domainHelp": "Enter domain without protocol (http://).",
                    "selectedPresets": "Selected Presets",
                    
                    "glossaryLoaded": "Glossary has been loaded.",
                    "invalidGlossary": "Invalid glossary format.",
                    "apiKeyRequired": "API key is not set. Please open the popup and enter your API key.",
                    "dailyLimitExceeded": "Daily usage limit ({limit}) exceeded. Please try again tomorrow.",
                    "minuteLimitExceeded": "Per-minute usage limit ({limit}) exceeded. Please try again later.",
                    "noTranslationResult": "No translation result.",
                    "translateSelectedText": "Translate selected text",
                    "translateButton": "Translate",
                    "translating": "Translating...",
                    "thinkingProcess": "Thinking Process",
                    "thinking": "Thinking...",
                    "close": "Close",
                    "listen": "Listen",
                    "copy": "Copy",
                    "copied": "Copied",
                    "copyFailed": "Copy Failed",
                    
                    // 새로운 설정 페이지 관련
                    "settingsTitle": "Custom Translator Settings",
                    "apiSettings": "API Settings",
                    "usageStatistics": "Usage Statistics",
                    "advancedSettings": "Advanced Settings",
                    "quickSettings": "Quick Settings",
                    "advancedSettingsDesc": "Manage API keys, view usage statistics, backup data and more.",
                    
                    // API 설정 페이지
                    "apiSettingsTitle": "API Settings",
                    "apiKeyLabel": "API Key",
                    "openaiApiKeyLabel": "API Key",
                    "cerebrasApiKeyLabel": "API Key",
                    
                    // 사용량 통계 페이지
                    "periodLabel": "Period:",
                    
                    // 고급 설정 페이지
                    "advancedSettingsTitle": "Advanced Settings",
                    "dataManagement": "Data Management",
                    "exportAllData": "Export All Data",
                    "exportAllDataDesc": "Export all settings, glossary, and usage statistics.",
                    "importAllData": "Import Data",
                    "importAllDataDesc": "Restore data from backup file.",
                    "clearAllData": "Clear All Data",
                    "clearAllDataDesc": "Reset all settings and data. (Cannot be undone)",
                    "about": "About",
                    "version": "Version:",
                    "developer": "Developer:",
                    
                    // License related
                    "showLicenses": "Open Source Licenses",
                    "openSourceLicenses": "Open Source Licenses",
                    
                    // Additional required keys
                    "clickToEdit": "Click to edit",
                    "unsavedChanges": "Unsaved changes",
                    "unsavedChangesMessage": "Changes have not been saved. Are you sure you want to leave?",
                    "discardChanges": "Discard changes",
                    "saveChanges": "Save changes",
                    "getApiKey": "Get API KEY",
                    "requestsLabel": "Requests",
                    "tokensLabel": "Tokens",
                    "noPresetSelected": "Preset: None",
                    "presetSelected": "Preset: {name}",
                    "exactDomainMatchOption": "Match exact domain only",
                    "exactDomainHelp": "When checked, applies only to exact domains excluding subdomains",
                    "selectPresetsForSite": "Select glossary for this site:",
                    "apply": "Apply",
                    "reset": "Reset",
                    "confirm": "Confirm",
                    "confirmMessage": "Are you sure you want to proceed?",
                    "noPresetsAvailable": "No presets available.",
                    "noWords": "No words available.",
                    "resetConfirm": "Reset Confirmation",
                    "geminiApiSettingsTitle": "Gemini API Settings",
                    "openaiApiSettingsTitle": "OpenAI API Settings",
                    "cerebrasApiSettingsTitle": "Cerebras API Settings", 
                    "notification": "Notification",
                    "taskCompleted": "Task completed.",
                    "gemini20FlashFullDesc": "Gemini 2.0 Flash - Very fast, decent performance",
                    "gemini25FlashFullDesc": "Gemini 2.5 Flash - Fast, good performance",
                    "gemini25ProFullDesc": "Gemini 2.5 Pro - Slightly slow, excellent performance", 
                    "optionsPageTitle": "Custom Translator Settings",
                    "sourceWordPlaceholder": "Source word",
                    "targetWordPlaceholder": "Target word",
                    "wordsCount": "{count} words",
                    "active": "(active)",
                    "clickToEditHint": "Click to edit",
                    "noPresetsCreated": "No presets created yet.",
                    "wordsEmpty": "No words available.",
                    "presetsLabel": "Presets:",
                    "edit": "Edit",
                    
                    // Messages used in options.js
                    "hangulUtilsLoadFailed": "Cannot load Hangul search utilities",
                    "apiKeyLoadFailed": "API key loading failed",
                    "usageStatsUpdateFailed": "Usage statistics update failed",
                    "dataExportFailed": "Data export failed",
                    "error": "Error",
                    "invalidBackupFormat": "Invalid backup file format",
                    "overwriteDataConfirm": "Do you want to overwrite all existing data?\nThis operation cannot be undone",
                    "dataRestoreConfirm": "Data Restore Confirmation",
                    "warning": "Warning",
                    "dataRestoredSuccess": "Data has been successfully restored. The page will be refreshed",
                    "completed": "Completed",
                    "dataRestoreError": "Data restore error",
                    "partialRestoreFailed": "Some data restoration failed",
                    "dataImportFailed": "Data import failed",
                    "deleteAllDataConfirm": "Do you want to delete all data?\n- API Keys\n- Settings\n- Glossary\n- Usage Statistics\n\nThis operation cannot be undone",
                    "dataDeleteConfirm": "Data Deletion Confirmation",
                    "finalDeleteConfirm": "Do you really want to delete all data?",
                    "finalConfirm": "Final Confirmation",
                    "allDataDeleted": "All data has been deleted. The page will be refreshed",
                    "dataDeleteFailed": "Data deletion failed",
                    "manifestLoadFailed": "Manifest loading failed",
                    "unsavedChangesDialog": "There are unsaved changes. What would you like to do?",
                    "presetNameRequired": "Please enter preset name",
                    "saveFailed": "Save failed",
                    "presetSaveFailed": "Preset save failed",
                    "presetLoadFailed": "Preset load failed",
                    "presetNotFound": "Preset not found",
                    "modalOpenFailed": "Cannot open modal",
                    "editPreset": "Edit Preset",
                    "createNewPreset": "Create New Preset",
                    "wordListLoadFailed": "Word list load failed",
                    "deletePresetQuestion": "Delete preset \"{name}\"?",
                    "presetDelete": "Delete Preset",
                    "presetDeleteFailed": "Preset deletion failed",
                    "siteSettingsLoadFailed": "Site settings load failed",
                    "noPresets": "None",
                    "siteSettingsModalOpenFailed": "Site settings modal open failed",
                    "deleteSiteSettingConfirm": "Delete settings for {domain}?",
                    "siteSettingDelete": "Delete Site Setting",
                    "siteSettingDeleteFailed": "Site setting deletion failed",
                    "presetCreateFailed": "Preset creation failed",
                    "invalidGlossaryFormat": "Invalid glossary format",
                    "importedGlossaryName": "Imported Glossary",
                    "glossaryImportSuccess": "Glossary imported successfully",
                    "glossaryImportFailed": "Glossary import failed",
                    "noActivePresetsToExport": "No active presets",
                    "info": "Info",
                    "exportFailed": "Export failed",
                    "activePresetExportFailed": "Active preset export failed",
                    "noPresetsToExport": "No presets to export",
                    "allPresetExportFailed": "All preset export failed",
                    "resetAllSiteSettingsConfirm": "Reset all site-specific settings?",
                    "settingsReset": "Settings Reset",
                    "allSiteSettingsReset": "All site settings have been reset",
                    "siteSettingsResetFailed": "Site settings reset failed",
                    "resetFailed": "Reset failed",
                    "wordAddFailed": "Word addition failed",
                    "deleteWordConfirm": "Delete word \"{source}\"?",
                    "wordDelete": "Delete Word",
                    "wordDeleteFailed": "Word deletion failed",
                    "domainRequired": "Please enter domain",
                    "siteSettingSaveFailed": "Site setting save failed",
                    "noDataForPeriod": "No usage data for the selected period",
                    "statsLoadFailed": "Failed to load statistics data",
                    "wordsEmpty": "No words",
                    "presetListLoadFailed": "Failed to load presets",
                    "siteSettingsListLoadFailed": "Failed to load site settings",
                    "noSiteSettings": "No sites configured yet",
                    "noPresetsCreated": "No presets created yet",
                    "getUsageStatsMethodNotFound": "getUsageStats method not found",
                    "requestsCount": "Requests: {count}",
                    "tokensCount": "Tokens: {count}",
                    "active": "(active)",
                    "clickToEditHint": "Click to edit"
                },
                
                // 일본어
                "Japanese": {
                    "settings": "設定",
                    "glossary": "用語集",
                    "apiKeyIssue": "API KEY発行",
                    "apiWarning": "※有料アカウントに連動すると料金が発生します",
                    "apiKeyPlaceholder": "Gemini APIキーを入力してください",
                    "save": "保存",
                    "modelSelectionTitle": "翻訳モデルの選択",
                    "languageSelectionTitle": "翻訳言語の選択",
                    "apiKeySaved": "APIキーが保存されました。",
                    "gemini20FlashDesc": "非常に速い、適度な性能",
                    "gemini25FlashDesc": "普通の速さ、良い性能",
                    "gemini25ProDesc": "やや遅い、優れた性能",
                    "gpt5ChatDesc": "普通の速さ、優れた性能",
                    "qwen3235bInstructDesc": "超高速翻訳",
                    "qwen3235bThinkingDesc": "超高速推論と翻訳",
                    
                    // OpenAI/Cerebras API関連
                    "openaiApiKeyIssue": "OpenAI API KEY発行",
                    "openaiApiWarning": "※OpenAI有料アカウントが必要です",
                    "openaiApiKeyPlaceholder": "OpenAI APIキーを入力してください",
                    "cerebrasApiKeyIssue": "Cerebras API KEY発行",
                    "cerebrasApiWarning": "※モデル毎に毎日100万トークン無料サポート",
                    "cerebrasApiKeyPlaceholder": "Cerebras APIキーを入力してください",
                    
                    // トークン使用量/コスト統計関連
                    "usageStatisticsTitle": "トークン使用量とコスト統計",
                    "periodToday": "今日",
                    "periodWeek": "今週",
                    "periodMonth": "今月",
                    "period3Months": "過去3か月",
                    "period6Months": "過去6か月",
                    "totalRequests": "総リクエスト",
                    "totalTokens": "総トークン",
                    "totalCost": "総コスト",
                    "modelBreakdown": "モデル別使用量",
                    "importGlossary": "用語集のインポート",
                    "exportGlossary": "用語集のエクスポート",
                    "sourceWordPlaceholder": "原語",
                    "targetWordPlaceholder": "訳語",
                    "add": "追加",
                    "search": "検索",
                    "delete": "削除",
                    "sortRecent": "新しい順",
                    "sortOld": "古い順",
                    "sortModified": "編集順",
                    "sortModifiedReverse": "編集逆順",
                    "sortAsc": "名前順",
                    "sortDesc": "名前逆順",
                    
                    // 用語集プリセット関連
                    "glossaryPresets": "用語集プリセット",
                    "createPreset": "新しいプリセット",
                    "editWords": "単語編集",
                    "editingPreset": "編集中のプリセット:",
                    "exportSelected": "選択したプリセットをエクスポート",
                    "exportAll": "すべてのプリセットをエクスポート",
                    "presetEmpty": "プリセットがありません。新しいプリセットを作成してください。",
                    "selectPresetToEdit": "編集するプリセットを選択してください。",
                    "presetNotFound": "プリセットが見つかりません。",
                    "deletePresetConfirm": "プリセット\"{name}\"を削除しますか？",
                    "selectPresetToAdd": "単語を追加するプリセットを選択してください。",
                    "noActivePresets": "エクスポートするアクティブなプリセットがありません。",
                    "noPresetsToExport": "エクスポートするプリセットがありません。",
                    "presetsExported": "{count}個のプリセットをエクスポートしました。",
                    "importedGlossary": "インポートされた用語集",
                    "unsupportedFormat": "サポートされていない形式です。",
                    "edit": "編集",
                    "wordsCount": "{count}語",
                    
                    // 現在のサイト用語集関連
                    "currentSiteGlossaryTitle": "現在のサイト用語集",
                    "configure": "設定",
                    "useGlobalSettings": "グローバル設定を使用",
                    "noActiveTab": "アクティブなタブなし",
                    "usingSiteSettings": "サイト設定を使用（{count}個のプリセット）",
                    "siteNoPresets": "サイト設定を使用（プリセットなし）",
                    
                    // サイト固有設定
                    "siteSpecificSettings": "サイト固有設定",
                    "resetToGlobalSettings": "グローバル設定に戻す",
                    "resetSiteSettingsConfirm": "{domain}のサイト固有設定をリセットしますか？\nグローバル設定が使用されます。",
                    "resetSiteSettingsError": "サイト設定のリセットに失敗しました。",
                    
                    // オプションページ
                    "optionsTitle": "Custom Translator 詳細設定",
                    "optionsDescription": "APIキーの管理、用語集の編集、使用統計の確認、詳細設定を管理できます。",
                    "apiKeysTab": "APIキー",
                    "glossaryTab": "用語集エディタ",
                    "siteSettingsTab": "サイト設定",
                    "usageTab": "使用統計",
                    "backupTab": "バックアップ/復元",
                    
                    // 用語集管理
                    "glossaryManagementTitle": "用語集管理",
                    "glossaryManagement": "用語集管理",
                    "createNewPreset": "新しいプリセットを作成",
                    "exportOptions": "エクスポートオプション",
                    "exportActive": "アクティブなプリセットをエクスポート",
                    "exportAll": "すべてのプリセットをエクスポート",
                    "editPreset": "プリセットを編集",
                    "presetName": "プリセット名",
                    "enterPresetName": "プリセット名を入力してください",
                    "sourceWord": "元の単語",
                    "targetWord": "翻訳単語",
                    "wordsInPreset": "プリセット内の単語",
                    "sortByRecent": "最新順",
                    "sortByOld": "古い順",
                    "sortByNameAsc": "名前順",
                    "sortByNameDesc": "名前逆順",
                    "cancel": "キャンセル",
                    
                    // サイト設定
                    "siteSettingsTitle": "サイト固有設定",
                    "siteSettings": "サイト設定", 
                    "siteSettingsDescription": "特定のウェブサイトに自動的に適用される用語集プリセットを設定できます。",
                    "addSiteSetting": "サイトを追加",
                    "clearAllSiteSettings": "すべての設定をクリア",
                    "siteSettingTitle": "サイト設定",
                    "domainName": "ドメイン",
                    "domainExample": "例: example.com",
                    "domainHelp": "プロトコル（http://）を除いて入力してください。",
                    "selectedPresets": "選択されたプリセット",
                    
                    "glossaryLoaded": "用語集を読み込みました。",
                    "invalidGlossary": "正しい用語集の形式ではありません。",
                    "apiKeyRequired": "APIキーが設定されていません。ポップアップを開いてAPIキーを入力してください。",
                    "dailyLimitExceeded": "1日の使用量制限({limit}回)を超えました。明日再試行してください。",
                    "minuteLimitExceeded": "1分間の使用量制限({limit}回)を超えました。後ほど再試行してください。",
                    "noTranslationResult": "翻訳結果がありません。",
                    "translateSelectedText": "選択したテキストを翻訳",
                    "translateButton": "翻訳",
                    "translating": "翻訳中...",
                    "close": "閉じる",
                    "listen": "聞く",
                    "copy": "コピー",
                    "copied": "コピー完了",
                    "copyFailed": "コピー失敗"
                },
                
                // 중국어
                "Chinese": {
                    "settings": "设置",
                    "glossary": "词汇表",
                    "apiKeyIssue": "获取API密钥",
                    "apiWarning": "※链接到付费账户时将收取费用",
                    "apiKeyPlaceholder": "请输入Gemini API密钥",
                    "save": "保存",
                    "modelSelectionTitle": "选择翻译模型",
                    "languageSelectionTitle": "选择翻译语言",
                    "apiKeySaved": "API密钥已保存。",
                    "gemini20FlashDesc": "非常快，性能适中",
                    "gemini25FlashDesc": "普通速度，性能良好",
                    "gemini25ProDesc": "稍慢，性能出色",
                    "gpt5ChatDesc": "普通速度，性能出色",
                    "qwen3235bInstructDesc": "超高速翻译",
                    "qwen3235bThinkingDesc": "超高速推理与翻译",
                    
                    // OpenAI/Cerebras API相关
                    "openaiApiKeyIssue": "获取OpenAI API密钥",
                    "openaiApiWarning": "※需要OpenAI付费账户",
                    "openaiApiKeyPlaceholder": "请输入OpenAI API密钥",
                    "cerebrasApiKeyIssue": "获取Cerebras API密钥",
                    "cerebrasApiWarning": "※每个模型每日100万代币免费支持",
                    "cerebrasApiKeyPlaceholder": "请输入Cerebras API密钥",
                    
                    // 令牌使用量/成本统计相关
                    "usageStatisticsTitle": "令牌使用量和成本统计",
                    "periodToday": "今天",
                    "periodWeek": "本周",
                    "periodMonth": "本月",
                    "period3Months": "最近3个月",
                    "period6Months": "最近6个月",
                    "totalRequests": "总请求数",
                    "totalTokens": "总令牌数",
                    "totalCost": "总成本",
                    "modelBreakdown": "按模型细分",
                    "importGlossary": "导入词汇表",
                    "exportGlossary": "导出词汇表",
                    "sourceWordPlaceholder": "源词",
                    "targetWordPlaceholder": "目标词",
                    "add": "添加",
                    "search": "搜索",
                    "delete": "删除",
                    "sortRecent": "最新优先",
                    "sortOld": "最旧优先",
                    "sortModified": "最近修改",
                    "sortModifiedReverse": "最早修改",
                    "sortAsc": "按名称升序",
                    "sortDesc": "按名称降序",
                    "glossaryLoaded": "词汇表已加载。",
                    "invalidGlossary": "无效的词汇表格式。",
                    "apiKeyRequired": "API密钥未设置。请打开弹窗并输入您的API密钥。",
                    "dailyLimitExceeded": "超过每日使用限制({limit}次)。请明天再试。",
                    "minuteLimitExceeded": "超过每分钟使用限制({limit}次)。请稍后再试。",
                    "noTranslationResult": "没有翻译结果。",
                    "translateSelectedText": "翻译所选文本",
                    "translateButton": "翻译",
                    "translating": "翻译中...",
                    "close": "关闭",
                    "listen": "聆听",
                    "copy": "复制",
                    "copied": "已复制",
                    "copyFailed": "复制失败",
                    
                    // 当前站点词汇表相关
                    "currentSiteGlossaryTitle": "当前站点词汇表",
                    "configure": "配置",
                    "useGlobalSettings": "使用全局设置",
                    "noActiveTab": "无活动标签页",
                    "usingSiteSettings": "使用站点设置（{count}个预设）",
                    "siteNoPresets": "使用站点设置（无预设）"
                },
                
                // 스페인어
                "Spanish": {
                    "settings": "Configuración",
                    "glossary": "Glosario",
                    "apiKeyIssue": "Obtener clave API",
                    "apiWarning": "※Se pueden aplicar cargos al vincular con una cuenta de pago",
                    "apiKeyPlaceholder": "Introduce tu clave API de Gemini",
                    "save": "Guardar",
                    "modelSelectionTitle": "Seleccionar modelo de traducción",
                    "languageSelectionTitle": "Seleccionar idioma de traducción",
                    "apiKeySaved": "La clave API ha sido guardada.",
                    "gemini20FlashDesc": "Muy rápido, rendimiento decente",
                    "gemini25FlashDesc": "Velocidad normal, buen rendimiento",
                    "gemini25ProDesc": "Ligeramente lento, excelente rendimiento",
                    "gpt5ChatDesc": "Velocidad normal, excelente rendimiento",
                    "qwen3235bInstructDesc": "Traducción ultrarrápida",
                    "qwen3235bThinkingDesc": "Razonamiento y traducción ultrarrápidos",
                    
                    // Relacionado con API de OpenAI/Cerebras
                    "openaiApiKeyIssue": "Obtener clave API de OpenAI",
                    "openaiApiWarning": "※Se requiere cuenta de pago de OpenAI",
                    "openaiApiKeyPlaceholder": "Introduce tu clave API de OpenAI",
                    "cerebrasApiKeyIssue": "Obtener clave API de Cerebras",
                    "cerebrasApiWarning": "※1 millón de tokens gratuitos diarios por modelo",
                    "cerebrasApiKeyPlaceholder": "Introduce tu clave API de Cerebras",
                    
                    // Relacionado con estadísticas de uso de tokens/costos
                    "usageStatisticsTitle": "Estadísticas de uso de tokens y costos",
                    "periodToday": "Hoy",
                    "periodWeek": "Esta semana",
                    "periodMonth": "Este mes",
                    "period3Months": "Últimos 3 meses",
                    "period6Months": "Últimos 6 meses",
                    "totalRequests": "Total de solicitudes",
                    "totalTokens": "Total de tokens",
                    "totalCost": "Costo total",
                    "modelBreakdown": "Desglose por modelo",
                    "importGlossary": "Importar glosario",
                    "exportGlossary": "Exportar glosario",
                    "sourceWordPlaceholder": "Palabra origen",
                    "targetWordPlaceholder": "Palabra destino",
                    "add": "Añadir",
                    "search": "Buscar",
                    "delete": "Eliminar",
                    "sortRecent": "Más recientes",
                    "sortOld": "Más antiguos",
                    "sortModified": "Modificados recientemente",
                    "sortModifiedReverse": "Modificados hace tiempo",
                    "sortAsc": "A a Z",
                    "sortDesc": "Z a A",
                    "glossaryLoaded": "Glosario cargado.",
                    "invalidGlossary": "Formato de glosario no válido.",
                    "apiKeyRequired": "La clave API no está configurada. Abre la ventana emergente e introduce tu clave API.",
                    "dailyLimitExceeded": "Límite de uso diario ({limit}) excedido. Inténtalo de nuevo mañana.",
                    "minuteLimitExceeded": "Límite de uso por minuto ({limit}) excedido. Inténtalo más tarde.",
                    "noTranslationResult": "Sin resultado de traducción.",
                    "translateSelectedText": "Traducir texto seleccionado",
                    "translateButton": "Traducir",
                    "translating": "Traduciendo...",
                    "close": "Cerrar",
                    "listen": "Escuchar",
                    "copy": "Copiar",
                    "copied": "Copiado",
                    "copyFailed": "Error al copiar",
                    
                    // Glosario del sitio actual relacionado
                    "currentSiteGlossaryTitle": "Glosario del Sitio Actual",
                    "configure": "Configurar",
                    "useGlobalSettings": "Usar Configuración Global",
                    "noActiveTab": "Sin Pestaña Activa",
                    "usingSiteSettings": "Usar Configuración del Sitio ({count} presets)",
                    "siteNoPresets": "Usar Configuración del Sitio (Sin presets)"
                },
                
                // 프랑스어
                "French": {
                    "settings": "Paramètres",
                    "glossary": "Glossaire",
                    "apiKeyIssue": "Obtenir une clé API",
                    "apiWarning": "※Des frais peuvent s'appliquer lors de la liaison à un compte payant",
                    "apiKeyPlaceholder": "Entrez votre clé API Gemini",
                    "save": "Enregistrer",
                    "modelSelectionTitle": "Sélectionner le modèle de traduction",
                    "languageSelectionTitle": "Sélectionner la langue de traduction",
                    "apiKeySaved": "La clé API a été enregistrée.",
                    "gemini20FlashDesc": "Très rapide, performance correcte",
                    "gemini25FlashDesc": "Vitesse normale, bonne performance",
                    "gemini25ProDesc": "Légèrement lent, excellente performance",
                    "gpt5ChatDesc": "Vitesse normale, excellente performance",
                    "qwen3235bInstructDesc": "Traduction ultra-rapide",
                    "qwen3235bThinkingDesc": "Raisonnement et traduction ultra-rapides",
                    
                    // Lié à l'API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Obtenir une clé API OpenAI",
                    "openaiApiWarning": "※Compte payant OpenAI requis",
                    "openaiApiKeyPlaceholder": "Entrez votre clé API OpenAI",
                    "cerebrasApiKeyIssue": "Obtenir une clé API Cerebras",
                    "cerebrasApiWarning": "※1 million de tokens gratuits par jour par modèle",
                    "cerebrasApiKeyPlaceholder": "Entrez votre clé API Cerebras",
                    
                    // Lié aux statistiques d'utilisation de jetons/coûts
                    "usageStatisticsTitle": "Statistiques d'utilisation de jetons et de coûts",
                    "periodToday": "Aujourd'hui",
                    "periodWeek": "Cette semaine",
                    "periodMonth": "Ce mois",
                    "period3Months": "3 derniers mois",
                    "period6Months": "6 derniers mois",
                    "totalRequests": "Total des demandes",
                    "totalTokens": "Total des jetons",
                    "totalCost": "Coût total",
                    "modelBreakdown": "Répartition par modèle",
                    "importGlossary": "Importer le glossaire",
                    "exportGlossary": "Exporter le glossaire",
                    "sourceWordPlaceholder": "Mot source",
                    "targetWordPlaceholder": "Mot cible",
                    "add": "Ajouter",
                    "search": "Rechercher",
                    "delete": "Supprimer",
                    "sortRecent": "Plus récents",
                    "sortOld": "Plus anciens",
                    "sortModified": "Récemment modifiés",
                    "sortModifiedReverse": "Anciennement modifiés",
                    "sortAsc": "A à Z",
                    "sortDesc": "Z à A",
                    "glossaryLoaded": "Glossaire chargé.",
                    "invalidGlossary": "Format de glossaire invalide.",
                    "apiKeyRequired": "La clé API n'est pas définie. Veuillez ouvrir la fenêtre contextuelle et saisir votre clé API.",
                    "dailyLimitExceeded": "Limite d'utilisation quotidienne ({limit}) dépassée. Veuillez réessayer demain.",
                    "minuteLimitExceeded": "Limite d'utilisation par minute ({limit}) dépassée. Veuillez réessayer plus tard.",
                    "noTranslationResult": "Aucun résultat de traduction.",
                    "translateSelectedText": "Traduire le texte sélectionné",
                    "translateButton": "Traduire",
                    "translating": "Traduction en cours...",
                    "close": "Fermer",
                    "listen": "Écouter",
                    "copy": "Copier",
                    "copied": "Copié",
                    "copyFailed": "Échec de copie",
                    
                    // Glossaire du site actuel connexe
                    "currentSiteGlossaryTitle": "Glossaire du Site Actuel",
                    "configure": "Configurer",
                    "useGlobalSettings": "Utiliser les Paramètres Globaux",
                    "noActiveTab": "Aucun Onglet Actif",
                    "usingSiteSettings": "Utiliser les Paramètres du Site ({count} présets)",
                    "siteNoPresets": "Utiliser les Paramètres du Site (Aucun préset)"
                },
                
                // 독일어
                "German": {
                    "settings": "Einstellungen",
                    "glossary": "Glossar",
                    "apiKeyIssue": "API-Schlüssel erhalten",
                    "apiWarning": "※Bei Verknüpfung mit einem kostenpflichtigen Konto können Gebühren anfallen",
                    "apiKeyPlaceholder": "Geben Sie Ihren Gemini API-Schlüssel ein",
                    "save": "Speichern",
                    "modelSelectionTitle": "Übersetzungsmodell auswählen",
                    "languageSelectionTitle": "Übersetzungssprache auswählen",
                    "apiKeySaved": "API-Schlüssel wurde gespeichert.",
                    "gemini20FlashDesc": "Sehr schnell, angemessene Leistung",
                    "gemini25FlashDesc": "Normale Geschwindigkeit, gute Leistung",
                    "gemini25ProDesc": "Etwas langsam, hervorragende Leistung",
                    "gpt5ChatDesc": "Normale Geschwindigkeit, hervorragende Leistung",
                    "qwen3235bInstructDesc": "Blitzschnelle Übersetzung",
                    "qwen3235bThinkingDesc": "Blitzschnelles Denken und Übersetzen",
                    
                    // OpenAI/Cerebras API-bezogen
                    "openaiApiKeyIssue": "OpenAI API-Schlüssel erhalten",
                    "openaiApiWarning": "※OpenAI-Bezahlkonto erforderlich",
                    "openaiApiKeyPlaceholder": "Geben Sie Ihren OpenAI API-Schlüssel ein",
                    "cerebrasApiKeyIssue": "Cerebras API-Schlüssel erhalten",
                    "cerebrasApiWarning": "※1 Million kostenlose Token täglich pro Modell",
                    "cerebrasApiKeyPlaceholder": "Geben Sie Ihren Cerebras API-Schlüssel ein",
                    
                    // Token-Nutzung/Kosten-Statistiken-bezogen
                    "usageStatisticsTitle": "Token-Nutzung und Kostenstatistiken",
                    "periodToday": "Heute",
                    "periodWeek": "Diese Woche",
                    "periodMonth": "Dieser Monat",
                    "period3Months": "Letzte 3 Monate",
                    "period6Months": "Letzte 6 Monate",
                    "totalRequests": "Gesamtanfragen",
                    "totalTokens": "Gesamttokens",
                    "totalCost": "Gesamtkosten",
                    "modelBreakdown": "Aufschlüsselung nach Modell",
                    "importGlossary": "Glossar importieren",
                    "exportGlossary": "Glossar exportieren",
                    "sourceWordPlaceholder": "Quellwort",
                    "targetWordPlaceholder": "Zielwort",
                    "add": "Hinzufügen",
                    "search": "Suchen",
                    "delete": "Löschen",
                    "sortRecent": "Neueste zuerst",
                    "sortOld": "Älteste zuerst",
                    "sortModified": "Zuletzt bearbeitet",
                    "sortModifiedReverse": "Zuerst bearbeitet",
                    "sortAsc": "A bis Z",
                    "sortDesc": "Z bis A",
                    "glossaryLoaded": "Glossar wurde geladen.",
                    "invalidGlossary": "Ungültiges Glossarformat.",
                    "apiKeyRequired": "API-Schlüssel ist nicht festgelegt. Bitte öffnen Sie das Popup und geben Sie Ihren API-Schlüssel ein.",
                    "dailyLimitExceeded": "Tägliches Nutzungslimit ({limit}) überschritten. Bitte versuchen Sie es morgen erneut.",
                    "minuteLimitExceeded": "Nutzungslimit pro Minute ({limit}) überschritten. Bitte versuchen Sie es später erneut.",
                    "noTranslationResult": "Kein Übersetzungsergebnis.",
                    "translateSelectedText": "Ausgewählten Text übersetzen",
                    "translateButton": "Übersetzen",
                    "translating": "Übersetze...",
                    "close": "Schließen",
                    "listen": "Anhören",
                    "copy": "Kopieren",
                    "copied": "Kopiert",
                    "copyFailed": "Kopieren fehlgeschlagen",
                    
                    // Glossar der aktuellen Website bezogen
                    "currentSiteGlossaryTitle": "Aktuelles Website-Glossar",
                    "configure": "Konfigurieren",
                    "useGlobalSettings": "Globale Einstellungen verwenden",
                    "noActiveTab": "Kein aktiver Tab",
                    "usingSiteSettings": "Website-Einstellungen verwenden ({count} Vorlagen)",
                    "siteNoPresets": "Website-Einstellungen verwenden (Keine Vorlagen)"
                },
                
                // 이탈리아어
                "Italian": {
                    "settings": "Impostazioni",
                    "glossary": "Glossario",
                    "apiKeyIssue": "Ottieni chiave API",
                    "apiWarning": "※Potrebbero essere applicati costi quando collegato a un account a pagamento",
                    "apiKeyPlaceholder": "Inserisci la tua chiave API Gemini",
                    "save": "Salva",
                    "modelSelectionTitle": "Seleziona modello di traduzione",
                    "languageSelectionTitle": "Seleziona lingua di traduzione",
                    "apiKeySaved": "La chiave API è stata salvata.",
                    "gemini20FlashDesc": "Molto veloce, prestazioni discrete",
                    "gemini25FlashDesc": "Velocità normale, buone prestazioni",
                    "gemini25ProDesc": "Leggermente lento, prestazioni eccellenti",
                    "gpt5ChatDesc": "Velocità normale, prestazioni eccellenti",
                    "qwen3235bInstructDesc": "Traduzione ultra-veloce",
                    "qwen3235bThinkingDesc": "Ragionamento e traduzione ultra-veloci",
                    
                    // Relativo all'API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Ottieni chiave API OpenAI",
                    "openaiApiWarning": "※Account a pagamento OpenAI richiesto",
                    "openaiApiKeyPlaceholder": "Inserisci la tua chiave API OpenAI",
                    "cerebrasApiKeyIssue": "Ottieni chiave API Cerebras",
                    "cerebrasApiWarning": "※1 milione di token gratuiti al giorno per modello",
                    "cerebrasApiKeyPlaceholder": "Inserisci la tua chiave API Cerebras",
                    
                    // Relativo alle statistiche di utilizzo token/costi
                    "usageStatisticsTitle": "Statistiche di utilizzo token e costi",
                    "periodToday": "Oggi",
                    "periodWeek": "Questa settimana",
                    "periodMonth": "Questo mese",
                    "period3Months": "Ultimi 3 mesi",
                    "period6Months": "Ultimi 6 mesi",
                    "totalRequests": "Richieste totali",
                    "totalTokens": "Token totali",
                    "totalCost": "Costo totale",
                    "modelBreakdown": "Suddivisione per modello",
                    "importGlossary": "Importa glossario",
                    "exportGlossary": "Esporta glossario",
                    "sourceWordPlaceholder": "Parola origine",
                    "targetWordPlaceholder": "Parola destinazione",
                    "add": "Aggiungi",
                    "search": "Cerca",
                    "delete": "Elimina",
                    "sortRecent": "Più recenti",
                    "sortOld": "Più vecchi",
                    "sortModified": "Modificati di recente",
                    "sortModifiedReverse": "Modificati per primi",
                    "sortAsc": "Dalla A alla Z",
                    "sortDesc": "Dalla Z alla A",
                    "glossaryLoaded": "Glossario caricato.",
                    "invalidGlossary": "Formato glossario non valido.",
                    "apiKeyRequired": "La chiave API non è impostata. Apri il popup e inserisci la tua chiave API.",
                    "dailyLimitExceeded": "Limite di utilizzo giornaliero ({limit}) superato. Riprova domani.",
                    "minuteLimitExceeded": "Limite di utilizzo al minuto ({limit}) superato. Riprova più tardi.",
                    "noTranslationResult": "Nessun risultato di traduzione.",
                    "translateSelectedText": "Traduci testo selezionato",
                    "translateButton": "Traduci",
                    "translating": "Traduzione in corso...",
                    "close": "Chiudi",
                    "listen": "Ascolta",
                    "copy": "Copia",
                    "copied": "Copiato",
                    "copyFailed": "Copia fallita",
                    
                    // Glossario del sito corrente correlato
                    "currentSiteGlossaryTitle": "Glossario del Sito Corrente",
                    "configure": "Configura",
                    "useGlobalSettings": "Usa Impostazioni Globali",
                    "noActiveTab": "Nessuna Scheda Attiva",
                    "usingSiteSettings": "Usa Impostazioni del Sito ({count} preset)",
                    "siteNoPresets": "Usa Impostazioni del Sito (Nessun preset)"
                },
                
                // 러시아어
                "Russian": {
                    "settings": "Настройки",
                    "glossary": "Глоссарий",
                    "apiKeyIssue": "Получить ключ API",
                    "apiWarning": "※При подключении к платному аккаунту может взиматься плата",
                    "apiKeyPlaceholder": "Введите ваш ключ API Gemini",
                    "save": "Сохранить",
                    "modelSelectionTitle": "Выбрать модель перевода",
                    "languageSelectionTitle": "Выбрать язык перевода",
                    "apiKeySaved": "Ключ API сохранен.",
                    "gemini20FlashDesc": "Очень быстро, приемлемая производительность",
                    "gemini25FlashDesc": "Обычная скорость, хорошая производительность",
                    "gemini25ProDesc": "Немного медленно, отличная производительность",
                    "gpt5ChatDesc": "Обычная скорость, отличная производительность",
                    "qwen3235bInstructDesc": "Сверхбыстрый перевод",
                    "qwen3235bThinkingDesc": "Сверхбыстрые рассуждения и перевод",
                    
                    // Связанное с API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Получить ключ API OpenAI",
                    "openaiApiWarning": "※Требуется платный аккаунт OpenAI",
                    "openaiApiKeyPlaceholder": "Введите ваш ключ API OpenAI",
                    "cerebrasApiKeyIssue": "Получить ключ API Cerebras",
                    "cerebrasApiWarning": "※1 миллион бесплатных токенов в день на модель",
                    "cerebrasApiKeyPlaceholder": "Введите ваш ключ API Cerebras",
                    
                    // Связанное со статистикой использования токенов/затрат
                    "usageStatisticsTitle": "Статистика использования токенов и затрат",
                    "periodToday": "Сегодня",
                    "periodWeek": "На этой неделе",
                    "periodMonth": "В этом месяце",
                    "period3Months": "Последние 3 месяца",
                    "period6Months": "Последние 6 месяцев",
                    "totalRequests": "Всего запросов",
                    "totalTokens": "Всего токенов",
                    "totalCost": "Общая стоимость",
                    "modelBreakdown": "Разбивка по моделям",
                    "importGlossary": "Импорт глоссария",
                    "exportGlossary": "Экспорт глоссария",
                    "sourceWordPlaceholder": "Исходное слово",
                    "targetWordPlaceholder": "Целевое слово",
                    "add": "Добавить",
                    "search": "Поиск",
                    "delete": "Удалить",
                    "sortRecent": "Сначала новые",
                    "sortOld": "Сначала старые",
                    "sortModified": "Недавно измененные",
                    "sortModifiedReverse": "Давно измененные",
                    "sortAsc": "От А до Я",
                    "sortDesc": "От Я до А",
                    "glossaryLoaded": "Глоссарий загружен.",
                    "invalidGlossary": "Недействительный формат глоссария.",
                    "apiKeyRequired": "Ключ API не установлен. Откройте всплывающее окно и введите ваш ключ API.",
                    "dailyLimitExceeded": "Превышен дневной лимит использования ({limit}). Попробуйте завтра.",
                    "minuteLimitExceeded": "Превышен лимит использования в минуту ({limit}). Попробуйте позже.",
                    "noTranslationResult": "Нет результата перевода.",
                    "translateSelectedText": "Перевести выделенный текст",
                    "translateButton": "Перевести",
                    "translating": "Перевод...",
                    "close": "Закрыть",
                    "listen": "Прослушать",
                    "copy": "Копировать",
                    "copied": "Скопировано",
                    "copyFailed": "Ошибка копирования",
                    
                    // Глоссарий текущего сайта связанные
                    "currentSiteGlossaryTitle": "Глоссарий Текущего Сайта",
                    "configure": "Конфигурировать",
                    "useGlobalSettings": "Использовать Глобальные Настройки",
                    "noActiveTab": "Нет Активной Вкладки",
                    "usingSiteSettings": "Использовать Настройки Сайта ({count} пресетов)",
                    "siteNoPresets": "Использовать Настройки Сайта (Нет пресетов)"
                },
                
                // 포르투갈어
                "Portuguese": {
                    "settings": "Configurações",
                    "glossary": "Glossário",
                    "apiKeyIssue": "Obter chave API",
                    "apiWarning": "※Taxas podem ser aplicadas quando vinculado a uma conta paga",
                    "apiKeyPlaceholder": "Digite sua chave API do Gemini",
                    "save": "Salvar",
                    "modelSelectionTitle": "Selecionar modelo de tradução",
                    "languageSelectionTitle": "Selecionar idioma de tradução",
                    "apiKeySaved": "Chave API foi salva.",
                    "gemini20FlashDesc": "Muito rápido, desempenho razoável",
                    "gemini25FlashDesc": "Velocidade normal, bom desempenho",
                    "gemini25ProDesc": "Ligeiramente lento, excelente desempenho",
                    "gpt5ChatDesc": "Velocidade normal, excelente desempenho",
                    "qwen3235bInstructDesc": "Tradução ultra-rápida",
                    "qwen3235bThinkingDesc": "Raciocínio e tradução ultra-rápidos",
                    
                    // Relacionado à API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Obter chave API do OpenAI",
                    "openaiApiWarning": "※Conta paga do OpenAI necessária",
                    "openaiApiKeyPlaceholder": "Digite sua chave API do OpenAI",
                    "cerebrasApiKeyIssue": "Obter chave API do Cerebras",
                    "cerebrasApiWarning": "※1 milhão de tokens gratuitos por dia por modelo",
                    "cerebrasApiKeyPlaceholder": "Digite sua chave API do Cerebras",
                    
                    // Relacionado às estatísticas de uso de tokens/custos
                    "usageStatisticsTitle": "Estatísticas de uso de tokens e custos",
                    "periodToday": "Hoje",
                    "periodWeek": "Esta semana",
                    "periodMonth": "Este mês",
                    "period3Months": "Últimos 3 meses",
                    "period6Months": "Últimos 6 meses",
                    "totalRequests": "Total de solicitações",
                    "totalTokens": "Total de tokens",
                    "totalCost": "Custo total",
                    "modelBreakdown": "Detalhamento por modelo",
                    "importGlossary": "Importar glossário",
                    "exportGlossary": "Exportar glossário",
                    "sourceWordPlaceholder": "Palavra de origem",
                    "targetWordPlaceholder": "Palavra de destino",
                    "add": "Adicionar",
                    "search": "Pesquisar",
                    "delete": "Excluir",
                    "sortRecent": "Mais recentes",
                    "sortOld": "Mais antigos",
                    "sortModified": "Modificados recentemente",
                    "sortModifiedReverse": "Modificados há mais tempo",
                    "sortAsc": "A a Z",
                    "sortDesc": "Z a A",
                    "glossaryLoaded": "Glossário carregado.",
                    "invalidGlossary": "Formato de glossário inválido.",
                    "apiKeyRequired": "A chave API não está configurada. Abra o popup e digite sua chave API.",
                    "dailyLimitExceeded": "Limite de uso diário ({limit}) excedido. Tente novamente amanhã.",
                    "minuteLimitExceeded": "Limite de uso por minuto ({limit}) excedido. Tente novamente mais tarde.",
                    "noTranslationResult": "Sem resultado de tradução.",
                    "translateSelectedText": "Traduzir texto selecionado",
                    "translateButton": "Traduzir",
                    "translating": "Traduzindo...",
                    "close": "Fechar",
                    "listen": "Ouvir",
                    "copy": "Copiar",
                    "copied": "Copiado",
                    "copyFailed": "Falha ao copiar",
                    
                    // Glossário do site atual relacionado
                    "currentSiteGlossaryTitle": "Glossário do Site Atual",
                    "configure": "Configurar",
                    "useGlobalSettings": "Usar Configurações Globais",
                    "noActiveTab": "Nenhuma Aba Ativa",
                    "usingSiteSettings": "Usar Configurações do Site ({count} presets)",
                    "siteNoPresets": "Usar Configurações do Site (Nenhum preset)"
                },
                
                // 네덜란드어
                "Dutch": {
                    "settings": "Instellingen",
                    "glossary": "Woordenlijst",
                    "apiKeyIssue": "API-sleutel verkrijgen",
                    "apiWarning": "※Er kunnen kosten in rekening worden gebracht bij koppeling aan een betaald account",
                    "apiKeyPlaceholder": "Voer uw Gemini API-sleutel in",
                    "save": "Opslaan",
                    "modelSelectionTitle": "Vertaalmodel selecteren",
                    "languageSelectionTitle": "Vertaaltaal selecteren",
                    "apiKeySaved": "API-sleutel is opgeslagen.",
                    "gemini20FlashDesc": "Zeer snel, redelijke prestaties",
                    "gemini25FlashDesc": "Normale snelheid, goede prestaties",
                    "gemini25ProDesc": "Enigszins traag, uitstekende prestaties",
                    "gpt5ChatDesc": "Normale snelheid, uitstekende prestaties",
                    "qwen3235bInstructDesc": "Ultrasnelle vertaling",
                    "qwen3235bThinkingDesc": "Ultrasnel denken en vertalen",
                    
                    // Gerelateerd aan OpenAI/Cerebras API
                    "openaiApiKeyIssue": "OpenAI API-sleutel verkrijgen",
                    "openaiApiWarning": "※OpenAI betaalaccount vereist",
                    "openaiApiKeyPlaceholder": "Voer uw OpenAI API-sleutel in",
                    "cerebrasApiKeyIssue": "Cerebras API-sleutel verkrijgen",
                    "cerebrasApiWarning": "※1 miljoen gratis tokens per dag per model",
                    "cerebrasApiKeyPlaceholder": "Voer uw Cerebras API-sleutel in",
                    
                    // Gerelateerd aan token gebruik/kosten statistieken
                    "usageStatisticsTitle": "Token gebruik en kosten statistieken",
                    "periodToday": "Vandaag",
                    "periodWeek": "Deze week",
                    "periodMonth": "Deze maand",
                    "period3Months": "Laatste 3 maanden",
                    "period6Months": "Laatste 6 maanden",
                    "totalRequests": "Totaal verzoeken",
                    "totalTokens": "Totaal tokens",
                    "totalCost": "Totale kosten",
                    "modelBreakdown": "Uitsplitsing per model",
                    "importGlossary": "Woordenlijst importeren",
                    "exportGlossary": "Woordenlijst exporteren",
                    "sourceWordPlaceholder": "Bronwoord",
                    "targetWordPlaceholder": "Doelwoord",
                    "add": "Toevoegen",
                    "search": "Zoeken",
                    "delete": "Verwijderen",
                    "sortRecent": "Nieuwste eerst",
                    "sortOld": "Oudste eerst",
                    "sortModified": "Recent gewijzigd",
                    "sortModifiedReverse": "Oudst gewijzigd",
                    "sortAsc": "A tot Z",
                    "sortDesc": "Z tot A",
                    "glossaryLoaded": "Woordenlijst geladen.",
                    "invalidGlossary": "Ongeldig woordenlijstformaat.",
                    "apiKeyRequired": "API-sleutel is niet ingesteld. Open de popup en voer uw API-sleutel in.",
                    "dailyLimitExceeded": "Dagelijks gebruikslimiet ({limit}) overschreden. Probeer het morgen opnieuw.",
                    "minuteLimitExceeded": "Gebruikslimiet per minuut ({limit}) overschreden. Probeer het later opnieuw.",
                    "noTranslationResult": "Geen vertaalresultaat.",
                    "translateSelectedText": "Geselecteerde tekst vertalen",
                    "translateButton": "Vertalen",
                    "translating": "Vertalen...",
                    "close": "Sluiten",
                    "listen": "Luisteren",
                    "copy": "Kopiëren",
                    "copied": "Gekopieerd",
                    "copyFailed": "Kopiëren mislukt",
                    
                    // Huidige site glossarium gerelateerd
                    "currentSiteGlossaryTitle": "Huidige Site Glossarium",
                    "configure": "Configureren",
                    "useGlobalSettings": "Globale Instellingen Gebruiken",
                    "noActiveTab": "Geen Actief Tabblad",
                    "usingSiteSettings": "Site-instellingen Gebruiken ({count} presets)",
                    "siteNoPresets": "Site-instellingen Gebruiken (Geen presets)"
                },
                
                // 아랍어
                "Arabic": {
                    "settings": "الإعدادات",
                    "glossary": "المسرد",
                    "apiKeyIssue": "الحصول على مفتاح API",
                    "apiWarning": "※قد يتم تطبيق الرسوم عند الربط بحساب مدفوع",
                    "apiKeyPlaceholder": "أدخل مفتاح API الخاص بـ Gemini",
                    "save": "حفظ",
                    "modelSelectionTitle": "اختيار نموذج الترجمة",
                    "languageSelectionTitle": "اختيار لغة الترجمة",
                    "apiKeySaved": "تم حفظ مفتاح API.",
                    "gemini20FlashDesc": "سريع جدًا، أداء مقبول",
                    "gemini25FlashDesc": "سرعة عادية، أداء جيد",
                    "gemini25ProDesc": "بطيء قليلاً، أداء ممتاز",
                    "gpt5ChatDesc": "سرعة عادية، أداء ممتاز",
                    "qwen3235bInstructDesc": "ترجمة فائقة السرعة",
                    "qwen3235bThinkingDesc": "تفكير وترجمة فائقا السرعة",
                    
                    // متعلق بواجهة برمجة تطبيقات OpenAI/Cerebras
                    "openaiApiKeyIssue": "الحصول على مفتاح API لـ OpenAI",
                    "openaiApiWarning": "※يتطلب حساب مدفوع في OpenAI",
                    "openaiApiKeyPlaceholder": "أدخل مفتاح API الخاص بـ OpenAI",
                    "cerebrasApiKeyIssue": "الحصول على مفتاح API لـ Cerebras",
                    "cerebrasApiWarning": "※مليون رمز مجاني يومياً لكل نموذج",
                    "cerebrasApiKeyPlaceholder": "أدخل مفتاح API الخاص بـ Cerebras",
                    
                    // متعلق بإحصائيات استخدام الرموز/التكاليف
                    "usageStatisticsTitle": "إحصائيات استخدام الرموز والتكاليف",
                    "periodToday": "اليوم",
                    "periodWeek": "هذا الأسبوع",
                    "periodMonth": "هذا الشهر",
                    "period3Months": "آخر 3 أشهر",
                    "period6Months": "آخر 6 أشهر",
                    "totalRequests": "إجمالي الطلبات",
                    "totalTokens": "إجمالي الرموز",
                    "totalCost": "التكلفة الإجمالية",
                    "modelBreakdown": "التفصيل حسب النموذج",
                    "importGlossary": "استيراد المسرد",
                    "exportGlossary": "تصدير المسرد",
                    "sourceWordPlaceholder": "كلمة المصدر",
                    "targetWordPlaceholder": "كلمة الهدف",
                    "add": "إضافة",
                    "search": "بحث",
                    "delete": "حذف",
                    "sortRecent": "الأحدث أولاً",
                    "sortOld": "الأقدم أولاً",
                    "sortModified": "المعدلة مؤخرًا",
                    "sortModifiedReverse": "المعدلة قديمًا",
                    "sortAsc": "أ إلى ي",
                    "sortDesc": "ي إلى أ",
                    "glossaryLoaded": "تم تحميل المسرد.",
                    "invalidGlossary": "تنسيق مسرد غير صالح.",
                    "apiKeyRequired": "لم يتم تعيين مفتاح API. يرجى فتح النافذة المنبثقة وإدخال مفتاح API الخاص بك.",
                    "dailyLimitExceeded": "تم تجاوز الحد اليومي للاستخدام ({limit}). يرجى المحاولة مرة أخرى غدًا.",
                    "minuteLimitExceeded": "تم تجاوز حد الاستخدام في الدقيقة ({limit}). يرجى المحاولة مرة أخرى لاحقًا.",
                    "noTranslationResult": "لا توجد نتيجة للترجمة.",
                    "translateSelectedText": "ترجمة النص المحدد",
                    "translateButton": "ترجمة",
                    "translating": "جارٍ الترجمة...",
                    "close": "إغلاق",
                    "listen": "استماع",
                    "copy": "نسخ",
                    "copied": "تم النسخ",
                    "copyFailed": "فشل النسخ",
                    
                    // مسرد الموقع الحالي ذات الصلة
                    "currentSiteGlossaryTitle": "مسرد الموقع الحالي",
                    "configure": "تكوين",
                    "useGlobalSettings": "استخدام الإعدادات العامة",
                    "noActiveTab": "لا توجد علامة تبويب نشطة",
                    "usingSiteSettings": "استخدام إعدادات الموقع ({count} إعدادات مسبقة)",
                    "siteNoPresets": "استخدام إعدادات الموقع (لا توجد إعدادات مسبقة)"
                },
                
                // 힌디어
                "Hindi": {
                    "settings": "सेटिंग्स",
                    "glossary": "शब्दकोश",
                    "apiKeyIssue": "API कुंजी प्राप्त करें",
                    "apiWarning": "※पेड अकाउंट से जुड़ने पर शुल्क लग सकता है",
                    "apiKeyPlaceholder": "अपनी Gemini API कुंजी दर्ज करें",
                    "save": "सहेजें",
                    "modelSelectionTitle": "अनुवाद मॉडल चुनें",
                    "languageSelectionTitle": "अनुवाद भाषा चुनें",
                    "apiKeySaved": "API कुंजी सहेजी गई है।",
                    "gemini20FlashDesc": "बहुत तेज़, उचित प्रदर्शन",
                    "gemini25FlashDesc": "सामान्य गति, अच्छा प्रदर्शन",
                    "gemini25ProDesc": "थोड़ा धीमा, उत्कृष्ट प्रदर्शन",
                    "gpt5ChatDesc": "सामान्य गति, उत्कृष्ट प्रदर्शन",
                    "qwen3235bInstructDesc": "अति तीव्र अनुवाद",
                    "qwen3235bThinkingDesc": "अति तीव्र सोच और अनुवाद",
                    
                    // OpenAI/Cerebras API संबंधित
                    "openaiApiKeyIssue": "OpenAI API कुंजी प्राप्त करें",
                    "openaiApiWarning": "※OpenAI भुगतान खाता आवश्यक",
                    "openaiApiKeyPlaceholder": "अपनी OpenAI API कुंजी दर्ज करें",
                    "cerebrasApiKeyIssue": "Cerebras API कुंजी प्राप्त करें",
                    "cerebrasApiWarning": "※प्रति मॉडल दैनिक 10 लाख निःशुल्क टोकन",
                    "cerebrasApiKeyPlaceholder": "अपनी Cerebras API कुंजी दर्ज करें",
                    
                    // टोकन उपयोग/लागत आंकड़े संबंधित
                    "usageStatisticsTitle": "टोकन उपयोग और लागत आंकड़े",
                    "periodToday": "आज",
                    "periodWeek": "इस सप्ताह",
                    "periodMonth": "इस महीने",
                    "period3Months": "पिछले 3 महीने",
                    "period6Months": "पिछले 6 महीने",
                    "totalRequests": "कुल अनुरोध",
                    "totalTokens": "कुल टोकन",
                    "totalCost": "कुल लागत",
                    "modelBreakdown": "मॉडल के अनुसार विवरण",
                    "importGlossary": "शब्दकोश आयात करें",
                    "exportGlossary": "शब्दकोश निर्यात करें",
                    "sourceWordPlaceholder": "स्रोत शब्द",
                    "targetWordPlaceholder": "लक्ष्य शब्द",
                    "add": "जोड़ें",
                    "search": "खोजें",
                    "delete": "हटाएं",
                    "sortRecent": "नवीनतम पहले",
                    "sortOld": "पुरानी पहले",
                    "sortModified": "हाल ही में संशोधित",
                    "sortModifiedReverse": "पहले संशोधित",
                    "sortAsc": "A से Z",
                    "sortDesc": "Z से A",
                    "glossaryLoaded": "शब्दकोश लोड किया गया।",
                    "invalidGlossary": "अमान्य शब्दकोश प्रारूप।",
                    "apiKeyRequired": "API कुंजी सेट नहीं की गई है। कृपया पॉपअप खोलें और अपनी API कुंजी दर्ज करें।",
                    "dailyLimitExceeded": "दैनिक उपयोग सीमा ({limit}) पार हो गई। कृपया कल फिर से प्रयास करें।",
                    "minuteLimitExceeded": "प्रति मिनट उपयोग सीमा ({limit}) पार हो गई। कृपया बाद में फिर से प्रयास करें।",
                    "noTranslationResult": "कोई अनुवाद परिणाम नहीं।",
                    "translateSelectedText": "चयनित पाठ का अनुवाद करें",
                    "translateButton": "अनुवाद",
                    "translating": "अनुवाद कर रहा है...",
                    "close": "बंद करें",
                    "listen": "सुनें",
                    "copy": "कॉपी करें",
                    "copied": "कॉपी हो गया",
                    "copyFailed": "कॉपी विफल"
                },

                "Vietnamese": {
                    "settings": "Cài đặt",
                    "glossary": "Bảng thuật ngữ",
                    "apiKeyIssue": "Lấy khóa API",
                    "apiWarning": "※Có thể áp dụng phí khi liên kết với tài khoản trả phí",
                    "apiKeyPlaceholder": "Nhập khóa API Gemini của bạn",
                    "save": "Lưu",
                    "modelSelectionTitle": "Chọn mô hình dịch",
                    "languageSelectionTitle": "Chọn ngôn ngữ dịch",
                    "apiKeySaved": "Đã lưu khóa API.",
                    "gemini20FlashDesc": "Rất nhanh, hiệu suất khá",
                    "gemini25FlashDesc": "Tốc độ bình thường, hiệu suất tốt",
                    "gemini25ProDesc": "Hơi chậm, hiệu suất xuất sắc",
                    "gpt5ChatDesc": "Tốc độ bình thường, hiệu suất xuất sắc",
                    "qwen3235bInstructDesc": "Dịch siêu tốc",
                    "qwen3235bThinkingDesc": "Suy luận và dịch siêu tốc",
                    
                    // Liên quan đến API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Lấy khóa API OpenAI",
                    "openaiApiWarning": "※Yêu cầu tài khoản trả phí OpenAI",
                    "openaiApiKeyPlaceholder": "Nhập khóa API OpenAI của bạn",
                    "cerebrasApiKeyIssue": "Lấy khóa API Cerebras",
                    "cerebrasApiWarning": "※1 triệu token miễn phí hàng ngày mỗi mô hình",
                    "cerebrasApiKeyPlaceholder": "Nhập khóa API Cerebras của bạn",
                    
                    // Liên quan đến thống kê sử dụng token/chi phí
                    "usageStatisticsTitle": "Thống kê sử dụng token và chi phí",
                    "periodToday": "Hôm nay",
                    "periodWeek": "Tuần này",
                    "periodMonth": "Tháng này",
                    "period3Months": "3 tháng gần đây",
                    "period6Months": "6 tháng gần đây",
                    "totalRequests": "Tổng yêu cầu",
                    "totalTokens": "Tổng token",
                    "totalCost": "Tổng chi phí",
                    "modelBreakdown": "Chi tiết theo mô hình",
                    "importGlossary": "Nhập bảng thuật ngữ",
                    "exportGlossary": "Xuất bảng thuật ngữ",
                    "sourceWordPlaceholder": "Từ nguồn",
                    "targetWordPlaceholder": "Từ đích",
                    "add": "Thêm",
                    "search": "Tìm kiếm",
                    "delete": "Xóa",
                    "sortRecent": "Mới nhất trước",
                    "sortOld": "Cũ nhất trước",
                    "sortModified": "Sửa đổi gần đây",
                    "sortModifiedReverse": "Sửa đổi đầu tiên",
                    "sortAsc": "A đến Z",
                    "sortDesc": "Z đến A",
                    "glossaryLoaded": "Đã tải bảng thuật ngữ.",
                    "invalidGlossary": "Định dạng bảng thuật ngữ không hợp lệ.",
                    "apiKeyRequired": "Chưa đặt khóa API. Vui lòng mở cửa sổ bật lên và nhập khóa API của bạn.",
                    "dailyLimitExceeded": "Đã vượt quá giới hạn sử dụng hàng ngày ({limit}). Vui lòng thử lại vào ngày mai.",
                    "minuteLimitExceeded": "Đã vượt quá giới hạn sử dụng mỗi phút ({limit}). Vui lòng thử lại sau.",
                    "noTranslationResult": "Không có kết quả dịch.",
                    "translateSelectedText": "Dịch văn bản đã chọn",
                    "translateButton": "Dịch",
                    "translating": "Đang dịch...",
                    "close": "Đóng",
                    "listen": "Nghe",
                    "copy": "Sao chép",
                    "copied": "Đã sao chép",
                    "copyFailed": "Sao chép thất bại",
                    
                    // Bảng thuật ngữ trang web hiện tại liên quan
                    "currentSiteGlossaryTitle": "Bảng Thuật Ngữ Trang Web Hiện Tại",
                    "configure": "Cấu hình",
                    "useGlobalSettings": "Sử dụng Cài đặt Toàn cầu",
                    "noActiveTab": "Không có Tab Đang hoạt động",
                    "usingSiteSettings": "Sử dụng Cài đặt Trang web ({count} preset)",
                    "siteNoPresets": "Sử dụng Cài đặt Trang web (Không có preset)"
                },

                // 태국어
                "Thai": {
                    "settings": "การตั้งค่า",
                    "glossary": "อภิธานศัพท์",
                    "apiKeyIssue": "รับคีย์ API",
                    "apiWarning": "※อาจมีค่าใช้จ่ายเมื่อเชื่อมต่อกับบัญชีแบบชำระเงิน",
                    "apiKeyPlaceholder": "ป้อนคีย์ API Gemini ของคุณ",
                    "save": "บันทึก",
                    "modelSelectionTitle": "เลือกโมเดลการแปล",
                    "languageSelectionTitle": "เลือกภาษาการแปล",
                    "apiKeySaved": "บันทึกคีย์ API แล้ว",
                    "gemini20FlashDesc": "เร็วมาก, ประสิทธิภาพปานกลาง",
                    "gemini25FlashDesc": "ความเร็วปกติ, ประสิทธิภาพดี",
                    "gemini25ProDesc": "ช้าเล็กน้อย, ประสิทธิภาพยอดเยี่ยม",
                    "gpt5ChatDesc": "ความเร็วปกติ, ประสิทธิภาพยอดเยี่ยม",
                    "qwen3235bInstructDesc": "การแปลเร็วเหนือธรรมชาติ",
                    "qwen3235bThinkingDesc": "การคิดและแปลเร็วเหนือธรรมชาติ",
                    
                    // เกี่ยวกับ API OpenAI/Cerebras
                    "openaiApiKeyIssue": "รับคีย์ API OpenAI",
                    "openaiApiWarning": "※ต้องมีบัญชีแบบชำระเงิน OpenAI",
                    "openaiApiKeyPlaceholder": "ป้อนคีย์ API OpenAI ของคุณ",
                    "cerebrasApiKeyIssue": "รับคีย์ API Cerebras",
                    "cerebrasApiWarning": "※โทเค็นฟรี 1 ล้านรายต่อวันต่อโมเดล",
                    "cerebrasApiKeyPlaceholder": "ป้อนคีย์ API Cerebras ของคุณ",
                    
                    // เกี่ยวกับสถิติการใช้โทเค็น/ค่าใช้จ่าย
                    "usageStatisticsTitle": "สถิติการใช้โทเค็นและค่าใช้จ่าย",
                    "periodToday": "วันนี้",
                    "periodWeek": "สัปดาห์นี้",
                    "periodMonth": "เดือนนี้",
                    "period3Months": "3 เดือนที่ผ่านมา",
                    "period6Months": "6 เดือนที่ผ่านมา",
                    "totalRequests": "คำขอทั้งหมด",
                    "totalTokens": "โทเค็นทั้งหมด",
                    "totalCost": "ค่าใช้จ่ายรวม",
                    "modelBreakdown": "แยกตามโมเดล",
                    "importGlossary": "นำเข้าอภิธานศัพท์",
                    "exportGlossary": "ส่งออกอภิธานศัพท์",
                    "sourceWordPlaceholder": "คำต้นฉบับ",
                    "targetWordPlaceholder": "คำแปล",
                    "add": "เพิ่ม",
                    "search": "ค้นหา",
                    "delete": "ลบ",
                    "sortRecent": "ใหม่ล่าสุดก่อน",
                    "sortOld": "เก่าที่สุดก่อน",
                    "sortModified": "แก้ไขล่าสุด",
                    "sortModifiedReverse": "แก้ไขแรกสุด",
                    "sortAsc": "ก ถึง ฮ",
                    "sortDesc": "ฮ ถึง ก",
                    "glossaryLoaded": "โหลดอภิธานศัพท์แล้ว",
                    "invalidGlossary": "รูปแบบอภิธานศัพท์ไม่ถูกต้อง",
                    "apiKeyRequired": "ยังไม่ได้ตั้งค่าคีย์ API โปรดเปิดป๊อปอัพและป้อนคีย์ API ของคุณ",
                    "dailyLimitExceeded": "เกินขีดจำกัดการใช้งานรายวัน ({limit}) โปรดลองอีกครั้งในวันพรุ่งนี้",
                    "minuteLimitExceeded": "เกินขีดจำกัดการใช้งานต่อนาที ({limit}) โปรดลองอีกครั้งในภายหลัง",
                    "noTranslationResult": "ไม่มีผลการแปล",
                    "translateSelectedText": "แปลข้อความที่เลือก",
                    "translateButton": "แปล",
                    "translating": "กำลังแปล...",
                    "close": "ปิด",
                    "listen": "ฟัง",
                    "copy": "คัดลอก",
                    "copied": "คัดลอกแล้ว",
                    "copyFailed": "คัดลอกไม่สำเร็จ"
                },

                // 중국어 (번체)
                "Chinese_TW": {
                    "settings": "設定",
                    "glossary": "詞彙表",
                    "apiKeyIssue": "取得 API 金鑰",
                    "apiWarning": "※連結至付費帳戶時可能會產生費用",
                    "apiKeyPlaceholder": "請輸入您的 Gemini API 金鑰",
                    "save": "儲存",
                    "modelSelectionTitle": "選擇翻譯模型",
                    "languageSelectionTitle": "選擇翻譯語言",
                    "apiKeySaved": "API 金鑰已儲存。",
                    "gemini20FlashDesc": "非常快，效能尚可",
                    "gemini25FlashDesc": "速度普通，效能良好",
                    "gemini25ProDesc": "稍慢，效能優異",
                    "gpt5ChatDesc": "速度普通，效能優異",
                    "qwen3235bInstructDesc": "超高速翻譯",
                    "qwen3235bThinkingDesc": "超高速推理與翻譯",
                    
                    // OpenAI/Cerebras API 相關
                    "openaiApiKeyIssue": "取得 OpenAI API 金鑰",
                    "openaiApiWarning": "※需要 OpenAI 付費帳戶",
                    "openaiApiKeyPlaceholder": "請輸入您的 OpenAI API 金鑰",
                    "cerebrasApiKeyIssue": "取得 Cerebras API 金鑰",
                    "cerebrasApiWarning": "※每個模型每日100萬代幣免費支援",
                    "cerebrasApiKeyPlaceholder": "請輸入您的 Cerebras API 金鑰",
                    
                    // 代幣使用量/成本統計相關
                    "usageStatisticsTitle": "代幣使用量與成本統計",
                    "periodToday": "今天",
                    "periodWeek": "本週",
                    "periodMonth": "本月",
                    "period3Months": "最近 3 個月",
                    "period6Months": "最近 6 個月",
                    "totalRequests": "總請求數",
                    "totalTokens": "總代幣數",
                    "totalCost": "總成本",
                    "modelBreakdown": "按模型細分",
                    "importGlossary": "匯入詞彙表",
                    "exportGlossary": "匯出詞彙表",
                    "sourceWordPlaceholder": "來源詞",
                    "targetWordPlaceholder": "目標詞",
                    "add": "新增",
                    "search": "搜尋",
                    "delete": "刪除",
                    "sortRecent": "最新優先",
                    "sortOld": "最舊優先",
                    "sortModified": "最近修改",
                    "sortModifiedReverse": "最早修改",
                    "sortAsc": "按名稱升序",
                    "sortDesc": "按名稱降序",
                    "glossaryLoaded": "詞彙表已載入。",
                    "invalidGlossary": "無效的詞彙表格式。",
                    "apiKeyRequired": "未設定 API 金鑰。請開啟彈出視窗並輸入您的 API 金鑰。",
                    "dailyLimitExceeded": "超過每日使用限制 ({limit} 次)。請明天再試。",
                    "minuteLimitExceeded": "超過每分鐘使用限制 ({limit} 次)。請稍後再試。",
                    "noTranslationResult": "沒有翻譯結果。",
                    "translateSelectedText": "翻譯選取的文字",
                    "translateButton": "翻譯",
                    "translating": "翻譯中...",
                    "close": "關閉",
                    "listen": "聆聽",
                    "copy": "複製",
                    "copied": "已複製",
                    "copyFailed": "複製失敗"
                },

                // 인도네시아어
                "Indonesian": {
                    "settings": "Pengaturan",
                    "glossary": "Glosarium",
                    "apiKeyIssue": "Dapatkan Kunci API",
                    "apiWarning": "※Biaya mungkin berlaku saat ditautkan ke akun berbayar",
                    "apiKeyPlaceholder": "Masukkan kunci API Gemini Anda",
                    "save": "Simpan",
                    "modelSelectionTitle": "Pilih Model Terjemahan",
                    "languageSelectionTitle": "Pilih Bahasa Terjemahan",
                    "apiKeySaved": "Kunci API telah disimpan.",
                    "gemini20FlashDesc": "Sangat cepat, kinerja lumayan",
                    "gemini25FlashDesc": "Kecepatan normal, kinerja bagus",
                    "gemini25ProDesc": "Agak lambat, kinerja luar biasa",
                    "gpt5ChatDesc": "Kecepatan normal, kinerja luar biasa",
                    "qwen3235bInstructDesc": "Terjemahan sangat cepat",
                    "qwen3235bThinkingDesc": "Pemikiran dan terjemahan sangat cepat",
                    
                    // Terkait API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Dapatkan Kunci API OpenAI",
                    "openaiApiWarning": "※Diperlukan akun berbayar OpenAI",
                    "openaiApiKeyPlaceholder": "Masukkan kunci API OpenAI Anda",
                    "cerebrasApiKeyIssue": "Dapatkan Kunci API Cerebras",
                    "cerebrasApiWarning": "※1 juta token gratis harian per model",
                    "cerebrasApiKeyPlaceholder": "Masukkan kunci API Cerebras Anda",
                    
                    // Terkait statistik penggunaan token/biaya
                    "usageStatisticsTitle": "Statistik penggunaan token dan biaya",
                    "periodToday": "Hari ini",
                    "periodWeek": "Minggu ini",
                    "periodMonth": "Bulan ini",
                    "period3Months": "3 bulan terakhir",
                    "period6Months": "6 bulan terakhir",
                    "totalRequests": "Total permintaan",
                    "totalTokens": "Total token",
                    "totalCost": "Total biaya",
                    "modelBreakdown": "Rincian per model",
                    "importGlossary": "Impor Glosarium",
                    "exportGlossary": "Ekspor Glosarium",
                    "sourceWordPlaceholder": "Kata sumber",
                    "targetWordPlaceholder": "Kata target",
                    "add": "Tambah",
                    "search": "Cari",
                    "delete": "Hapus",
                    "sortRecent": "Terbaru dulu",
                    "sortOld": "Terlama dulu",
                    "sortModified": "Baru diubah",
                    "sortModifiedReverse": "Lama diubah",
                    "sortAsc": "A ke Z",
                    "sortDesc": "Z ke A",
                    "glossaryLoaded": "Glosarium telah dimuat.",
                    "invalidGlossary": "Format glosarium tidak valid.",
                    "apiKeyRequired": "Kunci API belum diatur. Silakan buka popup dan masukkan kunci API Anda.",
                    "dailyLimitExceeded": "Batas penggunaan harian ({limit}) terlampaui. Silakan coba lagi besok.",
                    "minuteLimitExceeded": "Batas penggunaan per menit ({limit}) terlampaui. Silakan coba lagi nanti.",
                    "noTranslationResult": "Tidak ada hasil terjemahan.",
                    "translateSelectedText": "Terjemahkan teks yang dipilih",
                    "translateButton": "Terjemah",
                    "translating": "Menerjemahkan...",
                    "close": "Tutup",
                    "listen": "Dengarkan",
                    "copy": "Salin",
                    "copied": "Disalin",
                    "copyFailed": "Gagal salin"
                },

                // 필리핀어
                "Filipino": {
                    "settings": "Mga Setting",
                    "glossary": "Glosaryo",
                    "apiKeyIssue": "Kumuha ng API Key",
                    "apiWarning": "※Maaaring may mga bayarin kapag na-link sa isang bayad na account",
                    "apiKeyPlaceholder": "Ilagay ang iyong Gemini API key",
                    "save": "I-save",
                    "modelSelectionTitle": "Pumili ng Modelo ng Pagsasalin",
                    "languageSelectionTitle": "Pumili ng Wika ng Pagsasalin",
                    "apiKeySaved": "Nai-save na ang API key.",
                    "gemini20FlashDesc": "Napakabilis, disenteng pagganap",
                    "gemini25FlashDesc": "Normal na bilis, magandang pagganap",
                    "gemini25ProDesc": "Medyo mabagal, mahusay na pagganap",
                    "gpt5ChatDesc": "Normal na bilis, mahusay na pagganap",
                    "qwen3235bInstructDesc": "Napakabilis na pagsasalin",
                    "qwen3235bThinkingDesc": "Napakabilis na pag-iisip at pagsasalin",
                    
                    // Kaugnay ng OpenAI/Cerebras API
                    "openaiApiKeyIssue": "Kumuha ng OpenAI API Key",
                    "openaiApiWarning": "※Kailangan ng bayad na OpenAI account",
                    "openaiApiKeyPlaceholder": "Ilagay ang inyong OpenAI API key",
                    "cerebrasApiKeyIssue": "Kumuha ng Cerebras API Key",
                    "cerebrasApiWarning": "※1 milyong libreng tokens araw-araw bawat modelo",
                    "cerebrasApiKeyPlaceholder": "Ilagay ang inyong Cerebras API key",
                    
                    // Kaugnay ng statistics ng paggamit ng token/gastos
                    "usageStatisticsTitle": "Statistics ng paggamit ng token at gastos",
                    "periodToday": "Ngayon",
                    "periodWeek": "Ngayong linggo",
                    "periodMonth": "Ngayong buwan",
                    "period3Months": "Nakaraang 3 buwan",
                    "period6Months": "Nakaraang 6 na buwan",
                    "totalRequests": "Kabuuang mga kahilingan",
                    "totalTokens": "Kabuuang mga token",
                    "totalCost": "Kabuuang gastos",
                    "modelBreakdown": "Pagkakahatiin ayon sa modelo",
                    "importGlossary": "Mag-import ng Glosaryo",
                    "exportGlossary": "Mag-export ng Glosaryo",
                    "sourceWordPlaceholder": "Pinagmulang salita",
                    "targetWordPlaceholder": "Target na salita",
                    "add": "Idagdag",
                    "search": "Maghanap",
                    "delete": "Tanggalin",
                    "sortRecent": "Pinakabago muna",
                    "sortOld": "Pinakaluma muna",
                    "sortModified": "Kamakailang binago",
                    "sortModifiedReverse": "Pinakamatagal na binago",
                    "sortAsc": "A hanggang Z",
                    "sortDesc": "Z hanggang A",
                    "glossaryLoaded": "Nai-load na ang glosaryo.",
                    "invalidGlossary": "Di-wastong format ng glosaryo.",
                    "apiKeyRequired": "Hindi nakatakda ang API key. Paki-buksan ang popup at ilagay ang iyong API key.",
                    "dailyLimitExceeded": "Lumagpas sa pang-araw-araw na limitasyon sa paggamit ({limit}). Pakisubukang muli bukas.",
                    "minuteLimitExceeded": "Lumagpas sa limitasyon sa paggamit bawat minuto ({limit}). Pakisubukang muli mamaya.",
                    "noTranslationResult": "Walang resulta ng pagsasalin.",
                    "translateSelectedText": "Isalin ang napiling teksto",
                    "translateButton": "Isalin",
                    "translating": "Nagsasalin...",
                    "close": "Isara",
                    "listen": "Makinig",
                    "copy": "Kopyahin",
                    "copied": "Nakopya",
                    "copyFailed": "Hindi nakopya"
                },

                // 말레이시아어
                "Malay": {
                    "settings": "Tetapan",
                    "glossary": "Glosari",
                    "apiKeyIssue": "Dapatkan Kunci API",
                    "apiWarning": "※Caj mungkin dikenakan apabila dipautkan ke akaun berbayar",
                    "apiKeyPlaceholder": "Masukkan kunci API Gemini anda",
                    "save": "Simpan",
                    "modelSelectionTitle": "Pilih Model Terjemahan",
                    "languageSelectionTitle": "Pilih Bahasa Terjemahan",
                    "apiKeySaved": "Kunci API telah disimpan.",
                    "gemini20FlashDesc": "Sangat pantas, prestasi memuaskan",
                    "gemini25FlashDesc": "Kelajuan biasa, prestasi baik",
                    "gemini25ProDesc": "Agak perlahan, prestasi cemerlang",
                    "gpt5ChatDesc": "Kelajuan biasa, prestasi cemerlang",
                    "qwen3235bInstructDesc": "Terjemahan sangat pantas",
                    "qwen3235bThinkingDesc": "Pemikiran dan terjemahan sangat pantas",
                    
                    // Berkaitan dengan API OpenAI/Cerebras
                    "openaiApiKeyIssue": "Dapatkan Kunci API OpenAI",
                    "openaiApiWarning": "※Akaun berbayar OpenAI diperlukan",
                    "openaiApiKeyPlaceholder": "Masukkan kunci API OpenAI anda",
                    "cerebrasApiKeyIssue": "Dapatkan Kunci API Cerebras",
                    "cerebrasApiWarning": "※1 juta token percuma setiap hari setiap model",
                    "cerebrasApiKeyPlaceholder": "Masukkan kunci API Cerebras anda",
                    
                    // Berkaitan dengan statistik penggunaan token/kos
                    "usageStatisticsTitle": "Statistik penggunaan token dan kos",
                    "periodToday": "Hari ini",
                    "periodWeek": "Minggu ini",
                    "periodMonth": "Bulan ini",
                    "period3Months": "3 bulan lepas",
                    "period6Months": "6 bulan lepas",
                    "totalRequests": "Jumlah permintaan",
                    "totalTokens": "Jumlah token",
                    "totalCost": "Jumlah kos",
                    "modelBreakdown": "Pecahan mengikut model",
                    "importGlossary": "Import Glosari",
                    "exportGlossary": "Eksport Glosari",
                    "sourceWordPlaceholder": "Perkataan sumber",
                    "targetWordPlaceholder": "Perkataan sasaran",
                    "add": "Tambah",
                    "search": "Cari",
                    "delete": "Padam",
                    "sortRecent": "Terkini dahulu",
                    "sortOld": "Terlama dahulu",
                    "sortModified": "Baru diubah suai",
                    "sortModifiedReverse": "Lama diubah suai",
                    "sortAsc": "A hingga Z",
                    "sortDesc": "Z hingga A",
                    "glossaryLoaded": "Glosari telah dimuatkan.",
                    "invalidGlossary": "Format glosari tidak sah.",
                    "apiKeyRequired": "Kunci API belum ditetapkan. Sila buka pop timbul dan masukkan kunci API anda.",
                    "dailyLimitExceeded": "Had penggunaan harian ({limit}) telah dilebihi. Sila cuba lagi esok.",
                    "minuteLimitExceeded": "Had penggunaan seminit ({limit}) telah dilebihi. Sila cuba lagi nanti.",
                    "noTranslationResult": "Tiada hasil terjemahan.",
                    "translateSelectedText": "Terjemah teks yang dipilih",
                    "translateButton": "Terjemah",
                    "translating": "Menterjemah...",
                    "close": "Tutup",
                    "listen": "Dengar",
                    "copy": "Salin",
                    "copied": "Disalin",
                    "copyFailed": "Gagal salin"
                }
            };
        }
        
        /**
         * @description 현재 언어 가져오기
         * @returns {Promise<string>} 언어 코드
         */
        async getCurrentLanguage() {
            return await this.storage.getTranslationLanguage();
        }
        
        /**
         * @description 텍스트 번역
         * @param {string} key 텍스트 키
         * @param {Object} [params={}] 치환할 파라미터
         * @returns {Promise<string>} 번역된 텍스트
         */
        async getText(key, params = {}) {
            const language = await this.getCurrentLanguage();
            let text = this.translations[language]?.[key] || this.translations["Korean"][key] || key;
            
            // 파라미터 치환
            if (params) {
                Object.keys(params).forEach(param => {
                    text = text.replace(new RegExp(`{${param}}`, "g"), params[param]);
                });
            }
            
            return text;
        }
        
        /**
         * @description HTML 요소의 텍스트 업데이트
         * @param {string} selector 선택자
         * @param {string} textKey 텍스트 키
         * @param {Object} [params={}] 치환할 파라미터
         */
        async updateElementText(selector, textKey, params = {}) {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = await this.getText(textKey, params);
            }
        }
        
        /**
         * @description HTML 요소의 속성 업데이트
         * @param {string} selector 선택자
         * @param {string} attribute 속성명
         * @param {string} textKey 텍스트 키
         * @param {Object} [params={}] 치환할 파라미터
         */
        async updateElementAttribute(selector, attribute, textKey, params = {}) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute(attribute, await this.getText(textKey, params));
            }
        }
        
        /**
         * @description data-i18n 속성을 가진 모든 요소 업데이트
         */
        async updateDataI18nElements() {
            const elements = document.querySelectorAll('[data-i18n]');
            for (const element of elements) {
                const key = element.getAttribute('data-i18n');
                if (key) {
                    element.textContent = await this.getText(key);
                }
            }
            
            // placeholder 속성 업데이트
            const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
            for (const element of placeholderElements) {
                const key = element.getAttribute('data-i18n-placeholder');
                if (key) {
                    element.placeholder = await this.getText(key);
                }
            }
            
            // select option 업데이트
            const optionElements = document.querySelectorAll('option[data-i18n]');
            for (const option of optionElements) {
                const key = option.getAttribute('data-i18n');
                if (key) {
                    option.textContent = await this.getText(key);
                }
            }
        }
        
        /**
         * @description 모든 UI 텍스트 업데이트 (레거시 지원)
         */
        async updateAllTexts() {
            // 새로운 data-i18n 방식으로 먼저 업데이트
            await this.updateDataI18nElements();
            // 네비게이션
            await this.updateElementText('.nav-btn[data-target="apiSection"]', "settings");
            await this.updateElementText('.nav-btn[data-target="glossarySection"]', "glossary");
            
            // 설정 탭
            await this.updateElementText('#apiKeyIssue', "apiKeyIssue");
            await this.updateElementText('#openaiKeyIssue', "openaiApiKeyIssue");
            await this.updateElementText('#cerebrasKeyIssue', "cerebrasApiKeyIssue");
            
            // API 경고 메시지
            const apiWarnings = document.querySelectorAll('.api-warning');
            if (apiWarnings.length >= 1) await this.updateElementText('.api-warning', "apiWarning");
            if (apiWarnings.length >= 2) await this.updateElementText('#openaiApiSection .api-warning', "openaiApiWarning");
            if (apiWarnings.length >= 3) await this.updateElementText('#cerebrasApiSection .api-warning', "cerebrasApiWarning");
            
            // API 키 입력 필드
            await this.updateElementAttribute('#apiKey', "placeholder", "apiKeyPlaceholder");
            await this.updateElementAttribute('#openaiApiKey', "placeholder", "openaiApiKeyPlaceholder");
            await this.updateElementAttribute('#cerebrasApiKey', "placeholder", "cerebrasApiKeyPlaceholder");
            
            // 저장 버튼
            await this.updateElementText('#saveApiKey', "save");
            await this.updateElementText('#saveOpenaiApiKey', "save");
            await this.updateElementText('#saveCerebrasApiKey', "save");
            
            await this.updateElementText('.model-selection h3', "modelSelectionTitle");
            await this.updateElementText('.language-selection h3', "languageSelectionTitle");
            
            // 모델 설명 업데이트
            const modelOptions = document.querySelectorAll('#modelSelect option');
            const modelDescKeys = {
                "gemini-2.0-flash": "gemini20FlashDesc",
                "gemini-2.5-flash": "gemini25FlashDesc",
                "gemini-2.5-pro": "gemini25ProDesc",
                "gpt-5-chat-latest": "gpt5ChatDesc",
                "qwen-3-235b-a22b-instruct-2507": "qwen3235bInstructDesc",
                "qwen-3-235b-a22b-thinking-2507": "qwen3235bThinkingDesc"
            };
            
            for (const option of modelOptions) {
                const descKey = modelDescKeys[option.value];
                if (descKey) {
                    // data-i18n 속성이 있는 경우 해당 키를 사용
                    const i18nKey = option.getAttribute('data-i18n');
                    const actualDescKey = i18nKey || descKey;
                    
                    let modelName;
                    if (option.value.startsWith("gemini-")) {
                        // Gemini 모델명 생성
                        const parts = option.value.split("-");
                        modelName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + " " + 
                                   parts[1] + " " + 
                                   parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                    } else if (option.value === "gpt-5-chat-latest") {
                        modelName = "GPT-5 Chat";
                    } else if (option.value === "qwen-3-235b-a22b-instruct-2507") {
                        modelName = "Qwen3 235B Instruct";
                    } else if (option.value === "qwen-3-235b-a22b-thinking-2507") {
                        modelName = "Qwen3 235B Thinking";
                    } else {
                        // 다른 모델의 경우 기본적으로 value에서 추출
                        modelName = option.value;
                    }
                    
                    const desc = await this.getText(actualDescKey);
                    option.textContent = `${modelName} - ${desc}`;
                }
            }
            
            // 단어장 탭
            await this.updateElementText('#importGlossary', "importGlossary");
            await this.updateElementText('#exportGlossary', "exportGlossary");
            await this.updateElementAttribute('#sourceWord', "placeholder", "sourceWordPlaceholder");
            await this.updateElementAttribute('#targetWord', "placeholder", "targetWordPlaceholder");
            await this.updateElementText('#addWord', "add");
            await this.updateElementAttribute('#searchGlossary', "placeholder", "search");
            
            // 정렬 옵션
            const sortOptions = {
                "recent": "sortRecent",
                "old": "sortOld",
                "modified": "sortModified",
                "modified_reverse": "sortModifiedReverse",
                "asc": "sortAsc",
                "desc": "sortDesc"
            };
            
            const sortSelect = document.querySelector('#sortOrder');
            if (sortSelect) {
                for (const option of sortSelect.options) {
                    const key = sortOptions[option.value];
                    if (key) {
                        option.textContent = await this.getText(key);
                    }
                }
            }
            
            // 토큰 사용량 통계 업데이트
            await this.updateElementText('.usage-statistics h3', "usageStatisticsTitle");
            await this.updateElementText('.usage-label[data-i18n="totalRequests"]', "totalRequests");
            await this.updateElementText('.usage-label[data-i18n="totalTokens"]', "totalTokens");
            await this.updateElementText('.usage-label[data-i18n="totalCost"]', "totalCost");
            await this.updateElementText('.model-breakdown h4', "modelBreakdown");
            
            // 기간 선택 옵션
            const periodOptions = {
                "today": "periodToday",
                "week": "periodWeek", 
                "month": "periodMonth",
                "3months": "period3Months",
                "6months": "period6Months"
            };
            
            const statsPeriodSelect = document.querySelector('#statsPeriod');
            if (statsPeriodSelect) {
                for (const option of statsPeriodSelect.options) {
                    const key = periodOptions[option.value];
                    if (key) {
                        option.textContent = await this.getText(key);
                    }
                }
            }
            
            // 단어장 항목 업데이트
            const deleteButtons = document.querySelectorAll('.glossary-delete-btn');
            for (const btn of deleteButtons) {
                btn.textContent = await this.getText("delete");
            }
        }
    };
} 