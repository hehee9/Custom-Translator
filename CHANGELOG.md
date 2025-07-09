# Changelog


## v1.2.0 (2025.07.09)

### Changed
* 모델 업데이트 (Gemini 2.5 Flash, Gemini 2.5 Pro를 Preview 모델에서 정식 모델로 변경)
* 기본 모델을 Gemini 2.5 Flash로 변경

### Fixed
* `TypeError: Failed to construct 'Translator': Illegal constructor` 오류 수정
* `(sendTranslationMessage): [object Object]` 오류 수정


## v1.1.0 (2025.05.02)

### Added
* "API 키" 탭을 "설정" 탭으로 변경
* 번역 모델 선택 기능 추가
  - Gemini 2.0 Flash (매우 빠름, 준수한 성능)
  - Gemini 2.5 Flash (속도 보통, 좋은 성능)
  - Gemini 2.5 Pro (약간 느림, 뛰어난 성능)
* 모델별 사용량 한도 관리 가능
* 번역 결과 팝업 최대 높이 제한 및 스크롤 기능 추가
* 다양한 언어 지원 확장


## v1.0.2 (2025.02.15)

### Fixed
* 확장 프로그램 관리 페이지에는 스크립트를 주입하지 않도록 수정해, 에러 발생을 줄임


## v1.0.1 (2025.02.14)

### Fixed
* `<canvas>` 영역 클릭 시 팝업창이 사라지지 않는 버그 수정 (구글 지도 등)


## v1.0.0 (2025.02.14)

### 릴리즈

* 주요 기능:
	- 드래그로 번역
	- 단어장 단어 추가 / 삭제
	- 단어장 파일(json) 불러오기 / 내보내기