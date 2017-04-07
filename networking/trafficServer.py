import socket, sys, string, time

#connecting to attach to the socket directly to the remote address
def main():
    IP_addr = sys.argv[1]
    port = int(sys.argv[2])
    server = trafficServer(IP_addr,port)
    server.start()
    # content = sys.argv[3]

class trafficLights(object):
    def __init__(self):
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
        self.is_active = False

    def start(self):
        self.socket.connect((self.address, self.port))
        self.is_active = True
        self.signal_boot_up()
        self.signal_turn_on()
        counter = 0
        while self.is_active: 
            self.pedestrian_priority_algorithm(5,4)
            counter = counter + 1
            if counter == 2: 
                self.is_active = False
        self.signal_turn_off()
        self.signal_shut_down()


    def signal_state_change(self,iterations):
        for i in range(0,iterations):
            self.socket.sendall(self.lights.send_v_decelerate())
            time.sleep(1)

    # Blinks orange light 3 times before stopping
    def signal_boot_up(self):
        self.signal_state_change(6)

    def signal_shut_down(self):
        self.signal_state_change(6)
    
    # Starting the traffic light signalling now. start with vehicle_light = red, and pedestrian_light = green
    def signal_turn_on(self):
        self.socket.sendall(self.lights.send_v_stop())
        self.socket.sendall(self.lights.send_p_go())
        time.sleep(5)

    def signal_turn_off(self):
        if (self.lights.is_v_stop()):
            self.socket.sendall(self.lights.send_v_stop())
        if (self.lights.is_v_decelerate()):
            self.socket.sendall(self.lights.send_v_decelerate())
        if (self.lights.is_v_go()):
            self.socket.sendall(self.lights.send_v_go())
        if (self.lights.is_p_stop()):
            self.socket.sendall(self.lights.send_p_stop())
        if (self.lights.is_p_go()):
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


if __name__ == '__main__':
    main()