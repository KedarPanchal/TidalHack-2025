.PHONY: build run all clean stop

make build:
	docker build -t tidalhack-backend ./backend

make run:
	docker run -d --rm -p 8000:8000 tidalhack-backend

make clean:
	docker rmi tidalhack-backend

make stop:
	docker stop $(shell docker ps -q --filter ancestor=tidalhack-backend)

make all: stop clean build run