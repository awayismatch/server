# 基本原则

api设计时，要尽量达到的：
1. 采用RESTful规范
2. api返回时，使用http状态码初步确认错误类型
3. 若api调用出现了错误，在返回结果中使用error code及error message进一步说明错误所在。

