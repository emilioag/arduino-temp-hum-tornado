import time

class DHT11:
    def __init__(self, redis):
        self.redis = redis
        self.Temperature = 0
        self.Humidity = 0

    def get(self):
        self.Temperature = int(self.redis.get("Temperature"))
        self.Humidity = int(self.redis.get("Humidity"))