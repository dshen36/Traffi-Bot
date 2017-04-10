import socket, sys, ctypes, string, time, threading

# arguments = input('Enter port number and text-file name: \n')


#-------------------Helper MEthods-----------------------


#------------------------------------------------------------------
port = int(sys.argv[1])

spam_score = 0.0
spam_words = ""
port2 = "com4"
# ser = serial.Serial(port2, 9600)
command = ""

#TCP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

#binding socket to appropriate port
server = ('',port) #replace with actual port later
sock.bind(server)
print("binded socket")

# listen for incoming connection, and puts into server mode
sock.listen(1)

while True:
    # waits for an incoming connection
    print("waiting...")
    connection, client_address = sock.accept()
    print("connected")

    try:
        while True:
            data = connection.recv(128)
            if data == 'setup':
                print('setup done')
                connection.send('ok')
            elif data == 'break':
                print('cycle finished')
                connection.send('ok')
            elif data == 'end':
                print('cycles done')
                connection.send('ok')
            elif data:
                x = ser.write(data)
                # print(data)
                connection.send('ok')
            #no more data, then exits
            else:
                print("no more data")
                break
    #closes the connection
    finally:
        print("-----Finished-----")