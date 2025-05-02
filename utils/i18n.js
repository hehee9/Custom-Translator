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
                    "apiKeyIssue": "API KEY 발급",
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
                    "translating": "번역 중...",
                    "close": "닫기",
                    "listen": "듣기",
                    "copy": "복사"
                },
                
                // 영어
                "English": {
                    "settings": "Settings",
                    "glossary": "Glossary",
                    "apiKeyIssue": "Get API KEY",
                    "apiWarning": "※Charges may apply when linked to a paid account",
                    "apiKeyPlaceholder": "Enter your Gemini API key",
                    "save": "Save",
                    "modelSelectionTitle": "Select Translation Model",
                    "languageSelectionTitle": "Select Translation Language",
                    "apiKeySaved": "API key has been saved.",
                    "gemini20FlashDesc": "Very fast, decent performance",
                    "gemini25FlashDesc": "Normal speed, good performance",
                    "gemini25ProDesc": "Slightly slow, excellent performance",
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
                    "glossaryLoaded": "Glossary has been loaded.",
                    "invalidGlossary": "Invalid glossary format.",
                    "apiKeyRequired": "API key is not set. Please open the popup and enter your API key.",
                    "dailyLimitExceeded": "Daily usage limit ({limit}) exceeded. Please try again tomorrow.",
                    "minuteLimitExceeded": "Per-minute usage limit ({limit}) exceeded. Please try again later.",
                    "noTranslationResult": "No translation result.",
                    "translateSelectedText": "Translate selected text",
                    "translating": "Translating...",
                    "close": "Close",
                    "listen": "Listen",
                    "copy": "Copy"
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
                    "glossaryLoaded": "用語集を読み込みました。",
                    "invalidGlossary": "正しい用語集の形式ではありません。",
                    "apiKeyRequired": "APIキーが設定されていません。ポップアップを開いてAPIキーを入力してください。",
                    "dailyLimitExceeded": "1日の使用量制限({limit}回)を超えました。明日再試行してください。",
                    "minuteLimitExceeded": "1分間の使用量制限({limit}回)を超えました。後ほど再試行してください。",
                    "noTranslationResult": "翻訳結果がありません。",
                    "translateSelectedText": "選択したテキストを翻訳",
                    "translating": "翻訳中...",
                    "close": "閉じる",
                    "listen": "聞く",
                    "copy": "コピー"
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
                    "translating": "翻译中...",
                    "close": "关闭",
                    "listen": "聆听",
                    "copy": "复制"
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
                    "translating": "Traduciendo...",
                    "close": "Cerrar",
                    "listen": "Escuchar",
                    "copy": "Copiar"
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
                    "translating": "Traduction en cours...",
                    "close": "Fermer",
                    "listen": "Écouter",
                    "copy": "Copier"
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
                    "translating": "Übersetze...",
                    "close": "Schließen",
                    "listen": "Anhören",
                    "copy": "Kopieren"
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
                    "translating": "Traduzione in corso...",
                    "close": "Chiudi",
                    "listen": "Ascolta",
                    "copy": "Copia"
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
                    "translating": "Перевод...",
                    "close": "Закрыть",
                    "listen": "Прослушать",
                    "copy": "Копировать"
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
                    "translating": "Traduzindo...",
                    "close": "Fechar",
                    "listen": "Ouvir",
                    "copy": "Copiar"
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
                    "translating": "Vertalen...",
                    "close": "Sluiten",
                    "listen": "Luisteren",
                    "copy": "Kopiëren"
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
                    "translating": "جارٍ الترجمة...",
                    "close": "إغلاق",
                    "listen": "استماع",
                    "copy": "نسخ"
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
                    "translating": "अनुवाद कर रहा है...",
                    "close": "बंद करें",
                    "listen": "सुनें",
                    "copy": "कॉपी करें"
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
                    "translating": "Đang dịch...",
                    "close": "Đóng",
                    "listen": "Nghe",
                    "copy": "Sao chép"
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
                    "translating": "กำลังแปล...",
                    "close": "ปิด",
                    "listen": "ฟัง",
                    "copy": "คัดลอก"
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
                    "translating": "翻譯中...",
                    "close": "關閉",
                    "listen": "聆聽",
                    "copy": "複製"
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
                    "translating": "Menerjemahkan...",
                    "close": "Tutup",
                    "listen": "Dengarkan",
                    "copy": "Salin"
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
                    "translating": "Nagsasalin...",
                    "close": "Isara",
                    "listen": "Makinig",
                    "copy": "Kopyahin"
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
                    "translating": "Menterjemah...",
                    "close": "Tutup",
                    "listen": "Dengar",
                    "copy": "Salin"
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
         * @description 모든 UI 텍스트 업데이트
         */
        async updateAllTexts() {
            // 네비게이션
            await this.updateElementText('.nav-btn[data-target="apiSection"]', "settings");
            await this.updateElementText('.nav-btn[data-target="glossarySection"]', "glossary");
            
            // 설정 탭
            await this.updateElementText('#apiKeyIssue', "apiKeyIssue");
            await this.updateElementText('.api-warning', "apiWarning");
            await this.updateElementAttribute('#apiKey', "placeholder", "apiKeyPlaceholder");
            await this.updateElementText('#saveApiKey', "save");
            await this.updateElementText('.model-selection h3', "modelSelectionTitle");
            await this.updateElementText('.language-selection h3', "languageSelectionTitle");
            
            // 모델 설명 업데이트
            const modelOptions = document.querySelectorAll('#modelSelect option');
            const modelDescKeys = {
                "gemini-2.0-flash": "gemini20FlashDesc",
                "gemini-2.5-flash-preview-04-17": "gemini25FlashDesc",
                "gemini-2.5-pro-exp-03-25": "gemini25ProDesc"
            };
            
            for (const option of modelOptions) {
                const descKey = modelDescKeys[option.value];
                if (descKey) {
                    const modelName = option.value.split("-")[0].charAt(0).toUpperCase() + option.value.split("-")[0].slice(1) + " " + 
                                     option.value.split("-")[1] + " " + 
                                     option.value.split("-")[2].charAt(0).toUpperCase() + option.value.split("-")[2].slice(1);
                    const desc = await this.getText(descKey);
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
            
            // 단어장 항목 업데이트
            const deleteButtons = document.querySelectorAll('.glossary-delete-btn');
            for (const btn of deleteButtons) {
                btn.textContent = await this.getText("delete");
            }
        }
    };
} 