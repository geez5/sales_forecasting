import json
from datetime import datetime, timedelta

def create_ascii_chart(data, width=50, height=10):
    if not data:
        return ""
    
    min_val = min(data)
    max_val = max(data)
    range_val = max_val - min_val
    
    if range_val == 0:
        range_val = 1
    
    chart = []
    for value in data:
        normalized = (value - min_val) / range_val
        bar_length = int(normalized * width)
        chart.append("█" * bar_length + "  " + str(value))
    
    return "\n".join(chart)

# Load predictions
with open('predictions.json', 'r') as f:
    data = json.load(f)

print("\n=== Sales Prediction Visualization ===")
print("\nPredicted Sales Chart:")
print(create_ascii_chart(data["predictions"]))

# Calculate basic statistics
avg_prediction = sum(data["predictions"]) / len(data["predictions"])
max_prediction = max(data["predictions"])
min_prediction = min(data["predictions"])

print("\nStatistical Analysis:")
print(f"Average Predicted Sales: {avg_prediction:.2f}")
print(f"Maximum Predicted Sales: {max_prediction}")
print(f"Minimum Predicted Sales: {min_prediction}")

# Trend analysis
trend = "Upward" if data["predictions"][-1] > data["predictions"][0] else "Downward"
print(f"Overall Trend: {trend}")