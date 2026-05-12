from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions.params import SecretParam
import json
import csv
import os
import base64

initialize_app()

# Gemini API 키 
GEMINI_API_KEY = SecretParam("GEMINI_API_KEY")


# ----------음식 영양 정보 API----------
# CSV 파일 경로
CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "gi_mapping.csv")

def load_food_database():
    """CSV 파일에서 음식 데이터를 읽어 딕셔너리로 반환"""
    food_db = {}
    
    try:
        with open(CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                food_id = row["food_id"]
                food_db[food_id] = {
                    "food_id": food_id,
                    "food_name_ko": row["food_name_ko"],
                    "food_name_en": row["food_name_en"],
                    "category": row["category"],
                    "subcategory": row.get("subcategory", ""),
                    "serving_size_g": int(row["serving_size_g"]) if row["serving_size_g"] else 0,
                    "serving_label": row.get("serving_label", ""),
                    "gi_value": int(row["gi_value"]) if row["gi_value"] else 0,
                    "gi_grade": row["gi_grade"],
                    "carbs_g": float(row["carbs_g"]) if row["carbs_g"] else 0.0,
                    "sugar_g": float(row["sugar_g"]) if row["sugar_g"] else 0.0,
                    "kcal": int(row["kcal"]) if row["kcal"] else 0,
                    "data_source": row.get("data_source", ""),
                    "notes": row.get("notes", "")
                }
        print(f" CSV 로드 성공: {len(food_db)}개 항목")
    except FileNotFoundError:
        print(f" CSV 파일을 찾을 수 없습니다: {CSV_PATH}")
        return {}
    except Exception as e:
        print(f" CSV 파일 읽기 오류: {type(e).__name__}: {e}")
        return {}
    
    return food_db

# 서버 시작 시 한 번 로드
FOOD_DATABASE = load_food_database()

@https_fn.on_request(invoker="public")
def nutrition(req: https_fn.Request) -> https_fn.Response:
    """음식 ID로 영양 정보 조회 API"""
    
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "POST 요청만 허용됩니다"}, ensure_ascii=False),
            status=405,
            mimetype="application/json"
        )
    
    try:
        data = req.get_json()
        food_id = data.get("food_id")
    except (TypeError, AttributeError):
        return https_fn.Response(
            json.dumps({"error": "잘못된 요청 형식입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    if not food_id:
        return https_fn.Response(
            json.dumps({"error": "food_id는 필수입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    food_data = FOOD_DATABASE.get(food_id)
    
    if not food_data:
        return https_fn.Response(
            json.dumps({
                "error": f"음식 ID '{food_id}'를 찾을 수 없습니다",
                "available_ids": list(FOOD_DATABASE.keys())[:10]  # 처음 10개만
            }, ensure_ascii=False),
            status=404,
            mimetype="application/json"
        )
    
    return https_fn.Response(
        json.dumps(food_data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )


# ----------대안 추천 API----------
@https_fn.on_request(invoker="public")
def recommend(req: https_fn.Request) -> https_fn.Response:
    """음식 ID로 더 건강한 대안 추천 API
    
    같은 subcategory 내에서 GI 값이 더 낮은 음식 3개 추천.
    
    Request body (JSON):
        {"food_id": "KR_RIC_001"}
    
    Response (JSON):
        {
            "original": {...},
            "alternatives": [...]
        }
    """
    
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "POST 요청만 허용됩니다"}, ensure_ascii=False),
            status=405,
            mimetype="application/json"
        )
    
    try:
        data = req.get_json()
        food_id = data.get("food_id")
    except (TypeError, AttributeError):
        return https_fn.Response(
            json.dumps({"error": "잘못된 요청 형식입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    if not food_id:
        return https_fn.Response(
            json.dumps({"error": "food_id는 필수입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    # 원본 음식 조회
    original = FOOD_DATABASE.get(food_id)
    if not original:
        return https_fn.Response(
            json.dumps({
                "error": f"음식 ID '{food_id}'를 찾을 수 없습니다"
            }, ensure_ascii=False),
            status=404,
            mimetype="application/json"
        )
    
    # 같은 subcategory에서 GI가 더 낮은 음식만 필터링
    target_subcategory = original["subcategory"]
    target_gi = original["gi_value"]
    
    alternatives = [
        food for food_id_iter, food in FOOD_DATABASE.items()
        if food["subcategory"] == target_subcategory
        and food["gi_value"] < target_gi
        and food_id_iter != food_id
    ]
    
    # GI 낮은 순으로 정렬 (가장 건강한 게 위로)
    alternatives.sort(key=lambda x: x["gi_value"])
    
    # 최대 3개만
    alternatives = alternatives[:3]
    
    response_data = {
        "original": original,
        "alternatives": alternatives,
        "alternative_count": len(alternatives)
    }
    
    return https_fn.Response(
        json.dumps(response_data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )


# ----------음식 인식 API----------
def find_food_id(food_name_ko: str) -> str:
    """Gemini가 인식한 음식명을 본인 CSV의 food_id로 매칭
    
    완전 일치 → 부분 일치(키워드 포함) 순으로 검색.
    못 찾으면 None 반환.
    """
    if not food_name_ko:
        return None
    
    # 1. 완전 일치
    for food_id, food in FOOD_DATABASE.items():
        if food["food_name_ko"] == food_name_ko:
            return food_id
    
    # 2. 부분 일치 (공백 제거 후 포함 관계 확인)
    cleaned = food_name_ko.replace(" ", "")
    for food_id, food in FOOD_DATABASE.items():
        db_name = food["food_name_ko"].replace(" ", "")
        if cleaned in db_name or db_name in cleaned:
            return food_id
    
    return None

@https_fn.on_request(
    invoker="public",
    secrets=[GEMINI_API_KEY],
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["GET", "POST", "OPTIONS"]
    )
)
def scan(req: https_fn.Request) -> https_fn.Response:
    """이미지 업로드 → 음식 인식 → 영양 정보 + 대안 추천
    
    Request body (JSON):
        {"image_base64": "iVBORw0KGgo..."}
    
    Response (JSON):
        {
            "recognized": {"food_name_ko": "흰쌀밥", "estimated_portion_g": 210, "confidence": "high"},
            "matched": true,
            "nutrition": {...},
            "alternatives": [...]
        }
    """
    
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "POST 요청만 허용됩니다"}, ensure_ascii=False),
            status=405,
            mimetype="application/json"
        )
    
    try:
        data = req.get_json()
        image_b64 = data.get("image_base64")
    except (TypeError, AttributeError):
        return https_fn.Response(
            json.dumps({"error": "잘못된 요청 형식입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    if not image_b64:
        return https_fn.Response(
            json.dumps({"error": "image_base64는 필수입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    # base64 → bytes
    try:
        image_bytes = base64.b64decode(image_b64)
    except Exception:
        return https_fn.Response(
            json.dumps({"error": "이미지 디코딩 실패. base64 형식인지 확인하세요."}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    # Gemini API 호출
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=GEMINI_API_KEY.value)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        prompt = """이 이미지에 담긴 음식을 분석해주세요.

다음 JSON 형식으로만 답하세요. 다른 설명 없이 JSON만 출력:
{
  "food_name_ko": "음식의 한국어 이름 (가능한 한 간단하게, 예: 흰쌀밥, 라면, 식빵)",
  "estimated_portion_g": 추정_양_그램_숫자,
  "confidence": "high"
}

음식이 아니거나 인식 불가능하면:
{
  "food_name_ko": null,
  "estimated_portion_g": 0,
  "confidence": "low"
}
"""
        
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        
        # Gemini 응답 파싱
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()
        
        gemini_result = json.loads(raw_text)
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({
                "error": "Gemini API 호출 실패",
                "details": f"{type(e).__name__}: {str(e)}"
            }, ensure_ascii=False),
            status=500,
            mimetype="application/json"
        )
    
    # 인식된 음식명 → CSV의 food_id 매칭
    food_name = gemini_result.get("food_name_ko")
    matched_food_id = find_food_id(food_name) if food_name else None
    
    response_data = {
        "recognized": {
            "food_name_ko": food_name,
            "estimated_portion_g": gemini_result.get("estimated_portion_g", 0),
            "confidence": gemini_result.get("confidence", "low")
        },
        "matched": matched_food_id is not None
    }
    
    if matched_food_id:
        nutrition_data = FOOD_DATABASE[matched_food_id]
        response_data["nutrition"] = nutrition_data
        
        # 대안 추천 로직
        target_subcategory = nutrition_data["subcategory"]
        target_gi = nutrition_data["gi_value"]
        
        alternatives = [
            food for fid, food in FOOD_DATABASE.items()
            if food["subcategory"] == target_subcategory
            and food["gi_value"] < target_gi
            and fid != matched_food_id
        ]
        alternatives.sort(key=lambda x: x["gi_value"])
        response_data["alternatives"] = alternatives[:3]
    else:
        response_data["nutrition"] = None
        response_data["alternatives"] = []
        response_data["message"] = "음식은 인식했지만 데이터베이스에 없습니다."
    
    return https_fn.Response(
        json.dumps(response_data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )


# ----------건강 정보 라이브러리 API(library_content.py 사용)----------
from library_content import LIBRARY_CONTENT

@https_fn.on_request(
    invoker="public",
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["GET", "POST", "OPTIONS"]
    )
)
def library(req: https_fn.Request) -> https_fn.Response:
    """건강 정보 라이브러리 조회 API
    
    LibraryDetailScreen에서 특정 카테고리의 콘텐츠를 조회하는 용도
    """
    
    if req.method != "GET":
        return https_fn.Response(
            json.dumps({"error": "GET 요청만 허용됩니다"}, ensure_ascii=False),
            status=405,
            mimetype="application/json"
        )
    
    # 카테고리별 데이터 구성
    response_data = {
        "categories": {
            "diabetes_management": {
                "title": "당뇨 관리",
                "content": LIBRARY_CONTENT.get("diabetes_management", [])
            },
            "low_gi_foods": {
                "title": "저GI 식품",
                "content": LIBRARY_CONTENT.get("low_gi_foods", [])
            },
            "lifestyle": {
                "title": "생활 습관",
                "content": LIBRARY_CONTENT.get("lifestyle", [])
            },
            "exercise": {
                "title": "운동 / 활동",
                "content": LIBRARY_CONTENT.get("exercise", [])
            }
        }
    }
    
    return https_fn.Response(
        json.dumps(response_data, ensure_ascii=False),
        status=200,
        mimetype="application/json"
    )


# ----------AI 챗봇 API----------
@https_fn.on_request(
    invoker="public", 
    secrets=[GEMINI_API_KEY],
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["GET", "POST", "OPTIONS"]
    )
)
def chatbot(req: https_fn.Request) -> https_fn.Response:
    """AI 챗봇 API - 당뇨 관리 전문 상담
    
    Request body (JSON):
        {
            "message": "당뇨에 좋은 음식 알려줘",
            "history": [
                {"role": "user", "content": "안녕"},
                {"role": "assistant", "content": "안녕하세요!"}
            ]
        }
    
    Response (JSON):
        {
            "response": "당뇨에 좋은 음식은...",
            "timestamp": "2024-05-03T12:00:00"
        }
    """
    
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "POST 요청만 허용됩니다"}, ensure_ascii=False),
            status=405,
            mimetype="application/json"
        )
    
    try:
        data = req.get_json()
        user_message = data.get("message", "")
        history = data.get("history", [])
    except (TypeError, AttributeError):
        return https_fn.Response(
            json.dumps({"error": "잘못된 요청 형식입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    if not user_message:
        return https_fn.Response(
            json.dumps({"error": "message는 필수입니다"}, ensure_ascii=False),
            status=400,
            mimetype="application/json"
        )
    
    try:
        import google.generativeai as genai
        from datetime import datetime
        
        genai.configure(api_key=GEMINI_API_KEY.value)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        # 시스템 프롬프트
        system_prompt = """당신은 Sugar Lens의 AI 건강 어시스턴트입니다.

역할:
- 당뇨 환자를 위한 친절하고 전문적인 건강 상담
- 음식 추천, 운동 조언, 혈당 관리 팁 제공
- 의학적 조언이 아닌 일반적인 건강 정보 제공

응답 원칙:
1. 친근하고 이해하기 쉽게 설명
2. 구체적인 예시와 함께 답변
3. 긍정적이고 격려하는 어조
4. 전문 의료진 상담이 필요한 경우 안내
5. 200자 이내로 간결하게 답변

금지사항:
- 진단이나 처방은 하지 않음
- "의사와 상담하세요"만 반복하지 않음
- 너무 전문적이거나 어려운 용어 사용 금지

가능한 주제:
- 저GI 음식 추천
- 식사 순서, 시간 조언
- 운동 방법과 시간
- 스트레스 관리
- 수면, 수분 섭취
- 일상 생활 습관
"""
        
        # 대화 히스토리 구성
        chat_history = []
        for msg in history[-10:]:  # 최근 10개만
            if msg["role"] == "user":
                chat_history.append({"role": "user", "parts": [msg["content"]]})
            elif msg["role"] == "assistant":
                chat_history.append({"role": "model", "parts": [msg["content"]]})
        
        # Gemini에 요청
        chat = model.start_chat(history=chat_history)
        
        full_prompt = f"{system_prompt}\n\n사용자 질문: {user_message}"
        response = chat.send_message(full_prompt)
        
        ai_response = response.text.strip()
        
        # 응답 데이터
        response_data = {
            "response": ai_response,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        return https_fn.Response(
            json.dumps(response_data, ensure_ascii=False),
            status=200,
            mimetype="application/json"
        )
        
    except Exception as e:
        return https_fn.Response(
            json.dumps({
                "error": "챗봇 응답 생성 실패",
                "details": f"{type(e).__name__}: {str(e)}"
            }, ensure_ascii=False),
            status=500,
            mimetype="application/json"
        )
