import serial
import redis
import re
from pymongo import MongoClient
import datetime


if __name__ == '__main__':
    mongo_inst = MongoClient()
    db = mongo_inst['IoT']
    instance = redis.Redis()
    s = serial.Serial('/dev/tty.usbmodem1411', 9600)
    # regex = re.compile('b\'Max:\s(\d\d?)\s\%\sMin:\s(\d\d?)\s\%\\\\tMax:\s(\d\d?)\s\*C\sMin:\s(\d\d)')
    regex = re.compile("b\'Humedad\srelativa:\s(\d\d?)\s\%\\\\tTemperatura:\s(\d\d?)")
    max_temp, min_temp, max_hume, min_hume = '', '', '', ''
    while True:
        mybytes = s.readline()
        text = str(mybytes)
        r = regex.search(text)
        if r:
            instance.set("Humidity", r.group(1))
            instance.set("Temperature", r.group(2))
            db.sensors.update({
                '_id': datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
            }, {"t": r.group(2), "h": r.group(1)}, True)

