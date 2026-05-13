// 飞猫管家 流量查询 - Quantumult X 专用
// 剩余流量 + 今日已用 + 套餐周期 + 近13天流量
const $ = new API();

!(async () => {
  try {
    // --------------------------
    // 套餐总览接口
    // --------------------------
    const url1 = "https://app.flymodem.com.cn/appapi/Index/index_pack_v3?code=864409080233396&_time=1778665727&_sign=2f1df8b87f863e1aa2465cf47bf5282e";
    const header1 = {
      "Host": "app.flymodem.com.cn",
      "source": "ios",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2luZm8iOnsibGFzdF9sb2dpbl90aW1lIjoxNzc3MjY0OTA0LCJ1cGRhdGVkX3RpbWUiOjE3NzcyNjQ5MDQsImxhc3RfbG9naW5faXAiOiI2NjM3ODE1MDkiLCJsYXN0X2xvZ2luX3NvdXJjZSI6ImlvcyIsInVzZXJfaWQiOjUzMDUyOTN9LCJpYXQiOjE3NzcyNjQ5MDQsImV4cCI6MTc4NTkwNDkwNH0.qI2E6gk9XqPUzlVEwcTv6l34_UdWT2QF9FuxNeX_FzY",
      "vercode": "32000",
      "accept-encoding": "gzip"
    };

    // --------------------------
    // 每日流量明细接口
    // --------------------------
    const url2 = "https://app.flymodem.com.cn/Appapi/Device/days_detail?code=864409080233396&_time=1778665732&_sign=45e2a534393cd75360ace11838228dd8";
    const header2 = {
      "Host": "app.flymodem.com.cn",
      "user-agent": "Dart/3.9 (dart:io)",
      "source": "ios",
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2luZm8iOnsibGFzdF9sb2dpbl90aW1lIjoxNzc3MjY0OTA0LCJ1cGRhdGVkX3RpbWUiOjE3NzcyNjQ5MDQsImxhc3RfbG9naW5faXAiOiI2NjM3ODE1MDkiLCJsYXN0X2xvZ2luX3NvdXJjZSI6ImlvcyIsInVzZXJfaWQiOjUzMDUyOTN9LCJpYXQiOjE3NzcyNjQ5MDQsImV4cCI6MTc4NTkwNDkwNH0.qI2E6gk9XqPUzlVEwcTv6l34_UdWT2QF9FuxNeX_FzY",
      "vercode": "32000",
      "accept-encoding": "gzip"
    };

    // 请求套餐数据
    let res1 = await $.fetch({ url: url1, headers: header1, method: "GET" });
    let json1 = JSON.parse(res1.body.replace(/^f50/, "").trim());
    let pack = json1.data.now_pack;

    // 请求每日流量
    let res2 = await $.fetch({ url: url2, headers: header2, method: "GET" });
    let json2 = JSON.parse(res2.body.replace(/^2e8/, "").trim());
    let dayList = json2.data.data;
    let todayUsed = dayList[0].used;

    // 组装信息
    let title = "📶 飞猫管家流量查询";
    let sub = `${pack.pack_name} | ${pack.enable_isp}`;
    let body = `
剩余流量：${pack.p_remain}
今日已用：${todayUsed}
剩余天数：${pack.last_day} 天
套餐周期：${pack.startdate} → ${pack.enddate}
`;

    $.notify(title, sub, body.trim());

  } catch (e) {
    $.notify("飞猫流量", "查询失败", e.message);
  }
  $done();
})();

// QX 基础API
function API() {
  const _fetch = async (opt) => {
    return new Promise((resolve) => {
      opt.timeout = 15000;
      $task.fetch(opt).then(resolve, (err) => resolve({ body: "{}" }));
    });
  };
  return { fetch: _fetch, notify: $notify };
}
