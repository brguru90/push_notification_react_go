package main

import (
	"fmt"
	"os"

	"learn_go/src/apis"

	"github.com/gin-gonic/gin"
)

var all_router *gin.Engine

var SERVER_PORT string = "8000"

func main() {
	all_router = gin.Default()
	{
		api_router := all_router.Group("/api")
		apis.InitApis(api_router)
	}

	if os.Getenv("SERVER_PORT") != "" {
		SERVER_PORT = os.Getenv("SERVER_PORT")
	}

	bind_to_host := fmt.Sprintf(":%s", SERVER_PORT) //formatted host string
	all_router.Run(bind_to_host)
}
