CC = gcc

CFLAGS = -Wall -Wextra -std=c11 -Iinclude
LDFLAGS = -lsqlite3

TARGET = build/client

SRC = $(wildcard src/*.c)
OBJ = $(SRC:src/%.c=build/%.o)

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $(TARGET) $(LDFLAGS)

build/%.o: src/%.c
	@mkdir -p build
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf build

run: $(TARGET)
	@test -n "$(INPUT)" || (echo "Usage: make run INPUT=<input-file> DB=<database-path>"; exit 1)
	@test -n "$(DB)" || (echo "Usage: make run INPUT=<input-file> DB=<database-path>"; exit 1)
	./$(TARGET) "$(INPUT)" "$(DB)"