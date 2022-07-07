import { Task, TaskSchema } from '../hooks'
import datetime, { RRule, RRuleSet, rrulestr } from 'rrule'
const { DateTime, Duration } = require('luxon')
import * as chrono from 'chrono-node'
import { nanoid } from 'nanoid'

const keywords = ['every', 'takes', 'priority']

export function parseInput (str: string): Task | undefined {
  if (!str) {
    throw 'Undefined input'
  }

  const task = {} as Task

  const beginningRE = new RegExp(`^(.+?)(${keywords.join('|')}|$)+?`, 'i')

  const beginningStr = (beginningRE.exec(str) as RegExpExecArray)[1] as string
  const out = chrono.parse(beginningStr, new Date(), {
    forwardDate: true
  }) as chrono.ParsedResult[]

  const recurrenceOpts = parseRecurrence(str)

  if (recurrenceOpts) {
    task.recurrence = new RRule({ ...recurrenceOpts })
  } else {
    task.recurrence = undefined
  }

  if (out.length === 0) {
    
    if (recurrenceOpts){
      task.start = DateTime.now()
      recurrenceOpts.dtstart = task.start.toJSDate()
      task.recurrence = new RRule({ ...recurrenceOpts })
      task.end = DateTime.fromJSDate(task.recurrence.after(new Date()))
      task.title = beginningStr
    }else{
      return undefined
    }
  } else {
    const chronoResult = out[0] as chrono.ParsedResult

    if (chronoResult.end) {
      task.start = DateTime.fromJSDate(chronoResult.start.date())
      task.end = DateTime.fromJSDate(chronoResult.end.date())
    } else {
      task.start = DateTime.now()
      task.end = DateTime.fromJSDate(chronoResult.start.date())
    }

    if (recurrenceOpts){
      recurrenceOpts.dtstart = task.end.toJSDate()
      task.recurrence = new RRule({ ...recurrenceOpts })
    }

    task.title = beginningStr.replace(chronoResult.text, '')
  }

  const duration = parseDuration(str)
  if (duration) {
    task.duration = duration
  }

  task.id = nanoid()
  task.description = str
  return TaskSchema.parse(task)
}

function parseRecurrence (str: string): any {
  const recurrenceRE = new RegExp(
    `(every)(.+?)(${keywords.join('|')}|$)+?`,
    'i'
  )
  const recurrenceMatch = recurrenceRE.exec(str) as RegExpExecArray
  if (recurrenceMatch) {
    const recurrenceStr = 'every ' + recurrenceMatch[2]
    let options
    try {
      options = RRule.parseText(recurrenceStr)
    } catch (e) {
      console.log(e)
      return undefined
    }
    if (options) {
      return options
      const rule = new RRule({ ...options }) as datetime
      return rule
    }
  } else {
    return undefined
  }
}

function parseDuration (str: string): typeof Duration {
  const timeUnitsWords = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year'
  ]
  const durationObj: any = {}

  const durationRE = new RegExp(`(takes)(.+?)(${keywords.join('|')}|$)+?`, 'i')
  const durationMatch = durationRE.exec(str) as RegExpExecArray
  if (durationMatch) {
    const durationStr = durationMatch[2] as string
    console.log(durationStr)
    timeUnitsWords.map(timeUnit => {
      const timeUnitRE = new RegExp(`([\\d.]+)(\\s+)(${timeUnit}?)`, 'i')
      const timeUnitMatch = timeUnitRE.exec(durationStr) as RegExpExecArray
      console.log(timeUnitMatch) //
      if (timeUnitMatch) {
        console.log('bleep', timeUnitMatch)
        durationObj[timeUnit + 's'] = parseFloat(
          timeUnitMatch[1] as string
        ) as number
      }
    })
    return Duration.fromObject(durationObj)
  } else {
    return undefined
  }
}
