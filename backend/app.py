from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import requests
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Financial Modeling Prep API key
API_KEY = "pru6MU79VDKfOxFifSsK52BMY32vBUYc"
BASE_URL = "https://financialmodelingprep.com/api/v3"

# Function to get data from Financial Modeling Prep API
def get_api_data(endpoint, params=None):
    if params is None:
        params = {}
    params['apikey'] = API_KEY
    
    url = f"{BASE_URL}/{endpoint}"
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"API Error: {response.status_code}"}

# Get real stock data
def get_stock_data(ticker):
    try:
        # Get quote data
        quote_data = get_api_data(f"quote/{ticker}")
        
        if "error" in quote_data:
            return f"Error retrieving stock data: {quote_data['error']}"
        
        if not quote_data or len(quote_data) == 0:
            return f"No data found for ticker {ticker}"
        
        stock = quote_data[0]
        
        # Get company profile
        profile_data = get_api_data(f"profile/{ticker}")
        company_name = profile_data[0]['companyName'] if profile_data and len(profile_data) > 0 else ticker
        
        # Format the response
        response = f"## {company_name} ({ticker}) Stock Information\n\n"
        response += f"**Current Price**: ${stock['price']:.2f}\n"
        response += f"**Change**: ${stock['change']:.2f} ({stock['changesPercentage']:.2f}%)\n"
        response += f"**Day Range**: ${stock['dayLow']:.2f} - ${stock['dayHigh']:.2f}\n"
        response += f"**Year Range**: ${stock['yearLow']:.2f} - ${stock['yearHigh']:.2f}\n"
        response += f"**Market Cap**: ${stock['marketCap']:,}\n"
        
        if 'pe' in stock and stock['pe']:
            response += f"**P/E Ratio**: {stock['pe']:.2f}\n"
        
        if 'eps' in stock and stock['eps']:
            response += f"**EPS**: ${stock['eps']:.2f}\n"
        
        response += f"**Volume**: {stock['volume']:,} (Avg: {stock['avgVolume']:,})\n"
        
        # Get news for the company
        try:
            news_data = get_api_data(f"stock_news?tickers={ticker}&limit=3")
            if news_data and len(news_data) > 0:
                response += "\n## Recent News\n\n"
                for news in news_data:
                    response += f"**{news['title']}**\n"
                    response += f"*{news['publishedDate']}*\n"
                    response += f"{news['text'][:150]}...\n\n"
        except:
            pass
        
        return response
    except Exception as e:
        return f"Error retrieving stock data: {str(e)}"

# Function to predict stock performance based on user profile
def predict_stocks(age, risk_level):
    # Define stock tickers based on risk level
    low_risk_stocks = ["MSFT", "JNJ", "PG", "KO", "VZ"]
    medium_risk_stocks = ["AAPL", "GOOGL", "AMZN", "V", "MA"]
    high_risk_stocks = ["TSLA", "NVDA", "AMD", "SQ", "SHOP"]
    
    # Select stocks based on risk level
    if risk_level.lower() == "low":
        selected_stocks = low_risk_stocks
    elif risk_level.lower() == "high":
        selected_stocks = high_risk_stocks
    else:  # Medium risk is default
        selected_stocks = medium_risk_stocks
    
    # Adjust stock selection based on age
    if age < 30:
        # Younger investors can handle more risk
        if risk_level.lower() != "high":
            selected_stocks = selected_stocks + high_risk_stocks[:2]
    elif age > 60:
        # Older investors need more stability
        if risk_level.lower() != "low":
            selected_stocks = selected_stocks + low_risk_stocks[:2]
    
    # Get predictions for each stock
    predictions = []
    for ticker in selected_stocks[:5]:  # Limit to 5 stocks
        try:
            # Get stock data from API
            url = f"{BASE_URL}/quote/{ticker}?apikey={API_KEY}"
            response = requests.get(url)
            stock_data = response.json()[0]
            
            # Generate a prediction (simulated for now)
            current_price = stock_data['price']
            
            # Use model to predict growth factor (simplified)
            growth_factor = np.random.uniform(
                0.95 if risk_level.lower() == "low" else 0.90,
                1.15 if risk_level.lower() == "low" else (1.25 if risk_level.lower() == "medium" else 1.35)
            )
            
            predicted_price = current_price * growth_factor
            expected_return = ((predicted_price / current_price) - 1) * 100
            
            predictions.append({
                "ticker": ticker,
                "name": stock_data['name'],
                "current_price": current_price,
                "predicted_price": predicted_price,
                "expected_return": expected_return,
                "risk_level": risk_level
            })
        except Exception as e:
            print(f"Error predicting {ticker}: {e}")
    
    # Sort by expected return
    predictions.sort(key=lambda x: x['expected_return'], reverse=True)
    return predictions

# Format stock predictions into a readable response
def format_stock_predictions(predictions, age, risk_level, horizon):
    if not predictions:
        return "I couldn't generate stock predictions at this time. Please try again later."
    
    response = f"## Stock Recommendations\n\n"
    response += f"Based on your profile (Age: {age}, Risk Tolerance: {risk_level.capitalize()}, Horizon: {horizon}), here are my stock recommendations:\n\n"
    
    response += "| Stock | Current Price | Predicted Price | Expected Return | Risk |\n"
    response += "|-------|--------------|----------------|-----------------|------|\n"
    
    for pred in predictions:
        response += f"| {pred['ticker']} ({pred['name']}) | ${pred['current_price']:.2f} | ${pred['predicted_price']:.2f} | {pred['expected_return']:.2f}% | {pred['risk_level'].capitalize()} |\n"
    
    response += "\n### Investment Strategy\n\n"
    
    if age < 35:
        if risk_level.lower() == "high":
            response += "As a younger investor with high risk tolerance, you can allocate 80-90% of your portfolio to these growth-oriented stocks. Consider dollar-cost averaging to manage volatility."
        else:
            response += "At your age, you have time to recover from market downturns. Consider allocating 70-80% of your portfolio to these stocks, with the remainder in bonds or stable investments."
    elif age >= 35 and age < 55:
        if risk_level.lower() == "high":
            response += "With your moderate age and high risk tolerance, consider allocating 70-75% to these stocks. Begin building some stability with 25-30% in bonds or dividend stocks."
        else:
            response += "At this stage in life, balance growth and stability with a 60-65% allocation to these stocks and 35-40% in more conservative investments."
    else:
        if risk_level.lower() == "high":
            response += "Despite your high risk tolerance, at your age, consider limiting these stock picks to 50-60% of your portfolio, with the remainder in income-generating investments."
        else:
            response += "As you approach retirement, focus on capital preservation. Limit these stocks to 40-50% of your portfolio, with the remainder in bonds, dividend stocks, and cash equivalents."
    
    return response

# Process user queries
def process_query(query, user_profile=None):
    profile_context = ""
    if user_profile:
        age = user_profile.get('age', 'unknown')
        risk = user_profile.get('risk', 'unknown')
        horizon = user_profile.get('horizon', 'unknown')
        profile_context = f"Based on your profile (Age: {age}, Risk Tolerance: {risk}, Investment Horizon: {horizon}), "
    
    # For stock information queries
    if query.lower().startswith("stock:"):
        ticker = query[6:].strip().upper()
        return get_stock_data(ticker)
    
    # For stock predictions
    elif "predict" in query.lower() or "recommend stocks" in query.lower():
        if user_profile:
            age = user_profile.get('age', 30)
            risk_level = user_profile.get('risk', "Moderate").lower()
            horizon = user_profile.get('horizon', "3-5 years")
            
            predictions = predict_stocks(age, risk_level)
            return format_stock_predictions(predictions, age, risk_level, horizon)
        else:
            return "To provide stock predictions, I need your profile information. Please make sure your age and risk tolerance are set in the User Profile section."
    
    # For investment advice
    elif any(term in query.lower() for term in ["invest", "portfolio", "stock", "fund", "mutual", "bond"]):
        return profile_context + "Based on your profile, I recommend a diversified portfolio with a mix of stocks, bonds, and other assets. For specific investment advice, please consult with a financial advisor."
    
    # Fallback to Gemini API for other queries
    else:
        try:
            # Use Gemini API for general financial questions
            gemini_api_key = request.json.get('api_key', '')
            if not gemini_api_key:
                return "I'm a financial assistant that can help with investment advice, stock information, and general financial questions. Try asking about stocks, investment strategies, or financial concepts."
            
            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
            headers = {
                "Content-Type": "application/json",
                "x-goog-api-key": gemini_api_key
            }
            
            financial_context = """
            You are a helpful financial assistant. Your goal is to provide accurate, 
            helpful information about investments, financial planning, and market analysis.
            Always be professional, clear, and concise in your responses.
            """
            
            full_prompt = financial_context + "\n\nUser: " + query + "\n\nAssistant:"
            
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": full_prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1024,
                    "topK": 40,
                    "topP": 0.95
                }
            }
            
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code != 200:
                return "I'm sorry, I couldn't process your request at this time. Please try again later."
            
            response_data = response.json()
            return response_data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            return f"I'm sorry, I encountered an error: {str(e)}"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_profile = data.get('profile', {})
    api_key = data.get('api_key', '')
    
    try:
        response = process_query(user_message, user_profile)
        
        # Log the conversation
        log_dir = "conversation_logs"
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, f"conversation_log_{datetime.now().strftime('%Y-%m-%d')}.json")
        
        log_entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user_message": user_message,
            "bot_response": response
        }
        
        # Append to log file
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    logs = json.load(f)
            else:
                logs = []
            
            logs.append(log_entry)
            
            with open(log_file, 'w') as f:
                json.dump(logs, f, indent=2)
        except Exception as e:
            print(f"Error logging conversation: {e}")
        
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict_stock', methods=['POST'])
def predict_stock_endpoint():
    data = request.json
    ticker = data.get('ticker', '')
    age = data.get('age', 30)
    risk = data.get('risk', 'Moderate')
    
    try:
        # Call your existing predict_specific_stock function
        prediction = predict_specific_stock(ticker, age, risk.lower())
        return jsonify({"prediction": prediction})
    except Exception as e:
        print(f"Error predicting stock: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 