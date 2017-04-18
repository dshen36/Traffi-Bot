import socket, sys, string, time, threading, zerorpc, logging, gevent, signal

logging.basicConfig()

is_active = False

server = 0

#connecting to attach to the socket directly to the remote address
def main():
    IP_addr = sys.argv[1]
    port = int(sys.argv[2])
    tS = trafficServer(IP_addr, port)
    w = Wrapper(tS)
    global server
    server = zerorpc.Server(w, heartbeat=None)
    server.bind("tcp://0.0.0.0:4242")
    gevent.signal(signal.SIGTERM, server.stop)
    server.run()
    sys.exit(0)

class Wrapper(object):
    def __init__(self, server):
        self.s = server

    def start(self):
        self.s.start()

    def end(self):
        self.s.stop()

    def set_p_time(self, p):
        self.s.set_p_time(p)

    def set_v_time(self, v):
        self.s.set_v_time(v)

    def terminate(self):
        global server
        server.stop()

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
        self.lights = trafficLights()
        self.set_p_time(5)
        self.set_v_time(4)
        self.stop()

    def stop(self):
        self.is_active = False

    def set_p_time(self, p):
        self.p_time = p

    def set_v_time(self, v):
        self.v_time = v

    def start(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect((self.address, self.port))
        self.is_active = True
        self.signal_boot_up()
        self.signal_turn_on()
        self.socket.send('setup')
        self.socket.recv(128)
        counter = 1
        while self.is_active: 
            self.pedestrian_priority_algorithm(self.p_time, self.v_time)
            print 'Active?', self.is_active
            self.socket.send('break')
            self.socket.recv(128)
        self.socket.send('end')
        self.socket.recv(128)
        self.signal_turn_off()
        self.signal_shut_down()
        self.socket.close()

    def signal_state_change(self,iterations):
        for i in range(0,iterations):
            self.socket.sendall(self.lights.send_v_decelerate())
            self.socket.recv(128)
            gevent.sleep(1)

    # Blinks orange light 3 times before stopping
    def signal_boot_up(self):
        self.signal_state_change(6)

    def signal_shut_down(self):
        self.signal_state_change(6)
    
    # Starting the traffic light signalling now. start with vehicle_light = red, and pedestrian_light = green
    def signal_turn_on(self):
        self.socket.sendall(self.lights.send_v_stop())
        self.socket.recv(128)
        self.socket.sendall(self.lights.send_p_go())
        self.socket.recv(128)
        gevent.sleep(5)

    def signal_turn_off(self):
        if (self.lights.is_v_stop()):
            self.socket.sendall(self.lights.send_v_stop())
            self.socket.recv(128)
        if (self.lights.is_v_decelerate()):
            self.socket.sendall(self.lights.send_v_decelerate())
            self.socket.recv(128)
        if (self.lights.is_v_go()):
            self.socket.sendall(self.lights.send_v_go())
            self.socket.recv(128)
        if (self.lights.is_p_stop()):
            self.socket.sendall(self.lights.send_p_stop())
            self.socket.recv(128)
        if (self.lights.is_p_go()):
            self.socket.sendall(self.lights.send_p_go())
            self.socket.recv(128)
    # Assumes Pedestrian light is red, and vehicle light is green 
    def transition_to_pedestrian(self):
        self.socket.sendall(self.lights.send_v_go()) #turn off green
        self.socket.recv(128)
        self.socket.sendall(self.lights.send_v_decelerate()) #turn on yellow
        self.socket.recv(128)
        gevent.sleep(3)
        self.socket.sendall(self.lights.send_v_decelerate()) #turn off yellow
        self.socket.recv(128)
        self.socket.sendall(self.lights.send_v_stop()) #turn on red
        self.socket.recv(128)
        gevent.sleep(1)
        self.socket.sendall(self.lights.send_p_stop()) #turn off ped_red
        self.socket.recv(128)
        self.socket.sendall(self.lights.send_p_go()) #turn on ped_go
        self.socket.recv(128)

    # Assumes Pedestrian light is green, and vehicle light is red
    def transition_to_vehicle(self):
        self.socket.sendall(self.lights.send_p_go()) #turn off ped_go
        self.socket.recv(128)
        for i in range(0,11): #must be odd so it lands on red
            self.socket.sendall(self.lights.send_p_stop())
            self.socket.recv(128)
            gevent.sleep(0.5)
        gevent.sleep(1.5)
        self.socket.sendall(self.lights.send_v_stop()) #turn off red
        self.socket.recv(128)
        self.socket.sendall(self.lights.send_v_go()) #turn on green
        self.socket.recv(128)

    # Light patterns that focuses on getting pedestrians through the intersection
    def pedestrian_priority_algorithm(self, p_time, v_time):
        print 'p_time:', self.p_time, '- v_time:', self.v_time
        self.transition_to_vehicle()
        gevent.sleep(v_time)
        self.transition_to_pedestrian()
        gevent.sleep(p_time)


if __name__ == '__main__':
    main()