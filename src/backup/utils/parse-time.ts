import moment from "moment"

const justNow = "刚刚"
const byMin = /^(\d+)分钟前/
const byHour = /^(\d+)小时前/
const yesterday = /昨天 (\d+):(\d+)$/ // Chinese time, "昨天 00:51"
const thisYear = /^(\d+)-(\d+)$/ // Chinese time, "03-24"
const beforeThisYear = /^(\d+)-(\d+)-(\d+)$/ // Chinese time

export const parseTime = (text: string) => {
  if (text === justNow) {
    return moment()
  }
  let match = text.match(byMin)
  if (match) {
    return moment().subtract(match[1], "minutes")
  }
  match = text.match(byHour)
  if (match) {
    return moment().subtract(match[1], "hours")
  }
  match = text.match(yesterday)
  if (match) {
    return moment()
      .utcOffset(8)
      .subtract(1, "days")
      .hour(parseInt(match[1], 10))
      .minute(parseInt(match[2], 10))
  }
  match = text.match(thisYear)
  if (match) {
    return moment()
      .utcOffset(8)
      .month(parseInt(match[1], 10) - 1)
      .date(parseInt(match[2], 10))
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
  }
  match = text.match(beforeThisYear)
  if (match) {
    return moment(`${text} +0800`, "YYYY-MM-DD Z")
  }
  throw new Error(`Unexpected Time Format: ${text}`)
}
