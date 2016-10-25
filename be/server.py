import redis
from models.dht11 import DHT11
from tornado import websocket, web, ioloop
from datetime import timedelta

REDIS_INSTANCE = redis.Redis()
clients = []


class WebSocketHandler(websocket.WebSocketHandler):
    def check_origin(self, origin):
        print("origin: " + origin)
        return True

    def open(self):
        print("New client connected")
        self.write_message("You are connected")
        clients.append(self)

    def on_message(self, message):
        print("message: " + message)
        self.write_message(message)

    def on_close(self):
        print("Client disconnected")
        clients.remove(self)


def send_message_to_clients():
    try:
        for client in clients:
            dht11 = DHT11(REDIS_INSTANCE)

            dht11.get()
            response = {
                "Temperature": dht11.Temperature,
                "Humidity": dht11.Humidity
            }

            client.write_message(response)
    finally:
        ioloop.IOLoop.instance().add_timeout(timedelta(seconds=3),
                                             send_message_to_clients)


socket = web.Application([(r"/ws", WebSocketHandler), ])
if __name__ == "__main__":
    socket.listen(9090)
    ioloop.IOLoop.instance().add_timeout(timedelta(seconds=3),
                                         send_message_to_clients)
    ioloop.IOLoop.instance().start()
