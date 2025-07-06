FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod ./
COPY . .
RUN go mod tidy && go build -o api-server

EXPOSE 8080

CMD ["./api-server"]
