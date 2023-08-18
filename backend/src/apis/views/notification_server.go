package views

import (
	"encoding/json"
	"fmt"
	mymodule "learn_go/src/my_module"
	"net/http"
	"time"

	"github.com/SherClockHolmes/webpush-go"
	"github.com/gin-gonic/gin"
)

// currently the subscription in memory
// but in particle application it should be in database
var notification_subscriptions map[string][]byte = make(map[string][]byte)

func SubscribeToNotification(c *gin.Context) {
	uid, err := c.Cookie("uid")
	if err != nil && err == http.ErrNoCookie {
		if _rand, r_err := mymodule.RandomBytes(100); r_err == nil {
			uid = string(_rand)
			mymodule.SetCookie(c,
				"uid",
				uid,
				time.Now().UnixMilli()+10*60*1000,
				true,
			)
		}
	}

	post_body, err := c.GetRawData()
	if err == nil {
		notification_subscriptions[uid] = post_body

		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"uid":    uid,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "error",
		"uid":    uid,
	})
}

func SendNotificationToMySelf(c *gin.Context) {
	// privateKey, publicKey, err := webpush.GenerateVAPIDKeys()
	uid, uid_err := c.Cookie("uid")
	if uid_err != nil {
		c.String(http.StatusInternalServerError, "not yet subscribed")
		return
	}

	s := &webpush.Subscription{}
	json.Unmarshal(notification_subscriptions[uid], s)

	// Send Notification
	resp, err := webpush.SendNotification([]byte(c.DefaultQuery("msg", "Its default message")), s, &webpush.Options{
		Subscriber:      "example@example.com",
		VAPIDPublicKey:  "BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk",
		VAPIDPrivateKey: "ERIZmc5T5uWGeRxedxu92k3HnpVwy_RCnQfgek1x2Y4",
		TTL:             30,
	})
	if err != nil {
		fmt.Println(err)
		c.String(http.StatusInternalServerError, "error in sending notification")
		return
	}
	// go func() {
	// 	for i := 0; i < 10; i++ {
	// 		webpush.SendNotification([]byte(c.DefaultQuery("msg", "Its default message")), s, &webpush.Options{
	// 			Subscriber:      "example@example.com",
	// 			VAPIDPublicKey:  "BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk",
	// 			VAPIDPrivateKey: "ERIZmc5T5uWGeRxedxu92k3HnpVwy_RCnQfgek1x2Y4",
	// 			TTL:             30,
	// 		})
	// 		time.Sleep(time.Second * 5)
	// 	}
	// }()
	defer resp.Body.Close()
	c.String(http.StatusOK, "sent")
}
