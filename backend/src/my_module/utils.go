package mymodule

import (
	"crypto/rand"
	"net/http"
	"net/url"
	"time"

	"github.com/gin-gonic/gin"
)

func SetCookie(c *gin.Context, key string, value string, expires int64, httpOnly bool) {
	// c.SetSameSite(http.SameSiteStrictMode)
	// c.SetCookie(key, value, int(expires), "/", "", false, httpOnly)
	_time := time.UnixMilli(expires)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     key,
		Value:    url.QueryEscape(value),
		Expires:  _time,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Secure:   false,
		HttpOnly: httpOnly,
	})
}

func DeleteCookie(c *gin.Context, key string) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     key,
		MaxAge:   -1,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Secure:   false,
	})
}

func RandomBytes(size int) (blk []byte, err error) {
	blk = make([]byte, size)
	_, err = rand.Read(blk)
	return
}
