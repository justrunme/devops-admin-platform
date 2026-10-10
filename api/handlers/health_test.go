package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()
	HealthHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}
	if body := rr.Body.String(); body != "OK" {
		t.Fatalf("expected body OK, got %q", body)
	}
}

func TestPingHandlerValidation(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/ping", strings.NewReader(`{}`))
	rr := httptest.NewRecorder()
	PingHandler(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400 for missing hostname, got %d", rr.Code)
	}
}
