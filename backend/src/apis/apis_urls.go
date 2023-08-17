package apis

import (
	"learn_go/src/apis/views"

	"github.com/gin-gonic/gin"
)

// only the functions whose initial letter is upper case only those can be exportable from package
func InitApis(router *gin.RouterGroup) {
	router.POST("subscribe_to_notification/", views.SubscribeToNotification)
	router.GET("send_notification_to_myself/", views.SendNotificationToMySelf)
}
