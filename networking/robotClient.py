import socket, sys, ctypes, string, serial

# arguments = input('Enter port number and text-file name: \n')


#-------------------Helper MEthods-----------------------


#------------------------------------------------------------------
port = int(sys.argv[1])

spam_score = 0.0
spam_words = ""
port2 = "com4"
ser = serial.Serial(port2, 9600)
command = ""

#TCP socket
sock =  socket.socket(socket.AF_INET, socket.SOCK_STREAM) 

#binding socket to appropriate port
server = ('',port) #replace with actual port later
sock.bind(server)
print("binded socket")


# listen for incoming connection, and puts into server mode
sock.listen(1)
while True:
    # if not command:
    #     command = raw_input()
    #     connection.sendall(command.strip())

    # waits for an incoming connection
    connection, client_address = sock.accept()
    print("waiting...")

    try:
        if not command:
            command = raw_input()
            # connection.sendall(command.strip())
        print("found connection")
        while True:
            data = connection.recv(1024)
            if data:
                x = ser.write(data)
                # connection.sendall('HI DAN')
            #no more data, then exits
            else:
                print("no more data")
                break

    #closes the connection
    finally:
        print("sent data")
        #sys.exit(0)
        #connection.close()
        #ser.close()

print("done")
