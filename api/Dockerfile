FROM golang:1.27-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o api-server .

FROM alpine:3.24
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/api-server /app/api-server

EXPOSE 8080
CMD ["./api-server"]
