export class PredictionEngine {
  constructor() {
    this.alpha = 0.2;
    this.beta = 0.1;
  }

  exponentialSmoothing(data) {
    const result = [data[0]];
    for (let n = 1; n < data.length; n++) {
      result.push(this.alpha * data[n] + (1 - this.alpha) * result[n-1]);
    }
    return result;
  }

  doubleExponentialSmoothing(data) {
    const result = [data[0]];
    const trend = [data[1] - data[0]];
    
    for (let n = 1; n < data.length; n++) {
      if (n > 1) {
        trend.push(
          this.beta * (result[n-1] - result[n-2]) + 
          (1 - this.beta) * trend[n-1]
        );
      }
      
      result.push(
        this.alpha * data[n] + 
        (1 - this.alpha) * (result[n-1] + trend[n-1])
      );
    }
    
    return [result, trend];
  }

  predict(data, periods = 7) {
    const [result, trend] = this.doubleExponentialSmoothing(data);
    const predictions = [];
    
    const lastValue = result[result.length - 1];
    const lastTrend = trend[trend.length - 1];
    
    for (let i = 0; i < periods; i++) {
      const nextValue = lastValue + (i + 1) * lastTrend;
      predictions.push(Math.max(0, Number(nextValue.toFixed(2))));
    }

    const dates = Array.from({length: periods}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    return {
      predictions,
      dates
    };
  }
}