import socket, sys, string, time

#connecting to attach to the socket directly to the remote address
server = (IP_addr,port)
def main():
    IP_addr = sys.argv[1]
    port = int(sys.argv[2])
    # content = sys.argv[3]

class trafficLights(object):
    def __init__(self, address, port):
        self.vehicle_stop = False
        self.vehicle_decelerate = False
        self.vehicle_go = False
        self.pedestrian_stop = False
        self.pedestrian_go = False

    # Vehicle Lights
    def send_v_stop(self):
        self.vehicle_stop = not self.vehicle_stop
        return "1"

    def send_v_decelerate(self):
        self.vehicle_decelerate = not self.vehicle_decelerate
        return "2"

    def send_v_go(self):
        self.vehicle_go = not self.vehicle_go
        return "3"

    # Pedestrian lights
    def send_p_stop(self):
        self.pedestrian_stop = not self.pedestrian_stop
        return "4"

    def send_p_go(self):
        self.pedestrian_go = not self.pedestrian_go
        return "5"

    # Getter Methods
    def is_v_stop(self):
        return self.vehicle_stop

    def is_v_decelerate(self):
        return self.vehicle_decelerate

    def is_v_go(self):
        return self.vehicle_go

    def is_p_stop(self):
        return self.pedestrian_stop

    def is_p_go(self):
        return self.pedestrian_go

class trafficServer(object):
    def __init__(self, address, port):
        self.address = address
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.lights = trafficLights()

    def start(self):
        self.socket.connect((self.address, self.port))
        self.signal_boot_up()
        self.signal_turn_on()
        while True: 
            self.pedestrian_priority_algorithm()
            # data = sock.recv(1024)

    # Blinks orange light 3 times before stopping
    def signal_boot_up(self):
        for i in range(0,6)
            self.socket.sendall(self.lights.send_v_decelerate())
            time.sleep(1)

    # Starting the traffic light signalling now. start with vehicle_light = red, and pedestrian_light = green
    def signal_turn_on(self):
        self.socket.sendall(self.lights.send_v_stop())
        self.socket.sendall(self.lights.send_p_go())

    # Assumes Pedestrian light is red, and vehicle light is green 
    def transition_to_pedestrian(self):
        self.socket.sendall(self.lights.send_v_go()) #turn off green
        self.socket.sendall(self.lights.send_v_decelerate()) #turn on yellow
        time.sleep(3)
        self.socket.sendall(self.lights.send_v_decelerate()) #turn off yellow
        self.socket.sendall(self.lights.send_v_stop()) #turn on red
        time.sleep(1)
        self.socket.sendall(self.lights.send_p_stop()) #turn off ped_red
        self.socket.sendall(self.lights.send_p_go()) #turn on ped_go

    # Assumes Pedestrian light is green, and vehicle light is red
    def transition_to_vehicle(self):
        self.socket.sendall(self.lights.send_p_go()) #turn off ped_go
        for i in range(0,11): #must be odd so it lands on red
            self.socket.sendall(self.lights.send_p_stop())
            time.sleep(0.5)
        time.sleep(1.5)
        self.socket.sendall(self.lights.send_v_stop()) #turn off red
        self.socket.sendall(self.lights.send_v_go()) #turn on green

    # Light patterns that focuses on getting pedestrians through the intersection
    def pedestrian_priority_algorithm(self, p_time, v_time):
        self.transition_to_vehicle()
        time.sleep(v_time)
        self.transition_to_pedestrian()
        time.sleep(p_time)

# #attempting to send data
# try:
#     sock.connect(server)
#     sock.sendall(content)
#     data = sock.recv(1024) #would this be big enough? WCS = 1000(max size) + 5(3 decimal,.,0/1) + 4(100) + 2 (seperating spaces)
#     print("Response from server:")
#     print(data)

# # if the server is not on, then it will throw an error
# except socket.error as e:
#     print("Unable to connect to the server. Please check that it is on before connecting.")
#     sys.exit(0)

# finally:
#     print("closing socket")
#     sock.close()

if __name__ == '__main__':
    main()