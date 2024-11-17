import math
import json
from datetime import datetime, timedelta

class SimplePredictor:
    def __init__(self):
        self.alpha = 0.2  # Smoothing factor
        self.beta = 0.1   # Trend smoothing factor
        
    def exponential_smoothing(self, data):
        result = [data[0]]
        for n in range(1, len(data)):
            result.append(self.alpha * data[n] + (1 - self.alpha) * result[n-1])
        return result
    
    def double_exponential_smoothing(self, data):
        result = [data[0]]
        trend = [data[1] - data[0]]
        
        for n in range(1, len(data)):
            if n > 1:
                trend.append(self.beta * (result[n-1] - result[n-2]) + 
                           (1 - self.beta) * trend[n-1])
            
            result.append(self.alpha * data[n] + 
                         (1 - self.alpha) * (result[n-1] + trend[n-1]))
            
        return result, trend
    
    def predict_next(self, data, periods=7):
        result, trend = self.double_exponential_smoothing(data)
        predictions = []
        
        last_value = result[-1]
        last_trend = trend[-1]
        
        for i in range(periods):
            next_value = last_value + (i + 1) * last_trend
            predictions.append(max(0, round(next_value, 2)))
            
        return predictions

# Sample historical sales data
historical_sales = [
    120, 132, 145, 130, 128, 142, 138,  # Week 1
    145, 148, 152, 138, 142, 150, 156,  # Week 2
    160, 162, 158, 152, 148, 154, 160   # Week 3
]

# Create predictor instance
predictor = SimplePredictor()

# Make predictions for next week
future_predictions = predictor.predict_next(historical_sales)

# Prepare results
results = {
    "historical_data": historical_sales,
    "predictions": future_predictions,
    "dates": [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') 
             for i in range(len(future_predictions))]
}

# Print results
print("\n=== Sales Prediction Forecast ===")
print("\nHistorical Data (Last 3 Weeks):")
print(historical_sales)
print("\nPredictions for Next Week:")
for date, prediction in zip(results["dates"], results["predictions"]):
    print(f"{date}: {prediction} units")

# Save results to JSON
with open('predictions.json', 'w') as f:
    json.dump(results, f, indent=2)