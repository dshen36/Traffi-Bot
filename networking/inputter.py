import sys, zerorpc

c = zerorpc.Client(heartbeat=None, timeout=None)
c.connect("tcp://127.0.0.1:4242")

def start():
    print('Start signal')
    global c
    c.start()

def end():
    print('End signal')
    global c
    c.end()

def change():
    print('Change signal')
    global c
    c.set_p_time(int(sys.argv[2]))
    c.set_v_time(int(sys.argv[3]))

def terminate():
    print('Terminate signal')
    global c
    c.terminate()


commands = {
    'on' : start,
    'off' : end,
    'change' : change,
    'terminate' : terminate
}

def main():
    global commands
    commands[sys.argv[1]]()

if __name__ == '__main__':
    main()