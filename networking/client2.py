import socket, sys, string

#TCP socket
IP_addr = sys.argv[1]
port = int(sys.argv[2])
content = sys.argv[3]

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # AF_INET6

#connecting to attach to the socket directly to the remote address
server = (IP_addr,port)

#attempting to send data
try:
	sock.connect(server)
	sock.sendall(content)
	data = sock.recv(1024) #would this be big enough? WCS = 1000(max size) + 5(3 decimal,.,0/1) + 4(100) + 2 (seperating spaces)
	print("Response from server:")
	print(data)

# if the server is not on, then it will throw an error
except socket.error as e:
	print("Unable to connect to the server. Please check that it is on before connecting.")
	sys.exit(0)

finally:
	print("closing socket")
	sock.close()