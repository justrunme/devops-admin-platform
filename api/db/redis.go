package db

import (
	"context"
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
)

var RDB *redis.Client
var ctx = context.Background()

func ConnectRedis() error {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://:supersecurepassword@redis-master:6379"
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return fmt.Errorf("Failed to parse Redis URL: %v", err)
	}

	RDB = redis.NewClient(opt)

	if _, err := RDB.Ping(ctx).Result(); err != nil {
		return fmt.Errorf("Redis ping failed: %v", err)
	}

	return nil
}
