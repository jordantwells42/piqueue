import { Task, TaskSchema } from '../hooks'
import datetime, {RRule, RRuleSet, rrulestr } from 'rrule'
const { DateTime, Duration } = require('luxon')
import * as chrono from 'chrono-node'
import { nanoid } from 'nanoid';

const keywords = ['every', 'for', 'priority']

export function parseInput (str: string): Task | undefined {
  if (!str) {
    throw 'Undefined input'
  }

  const task = {} as Task

  

  const beginningRE = new RegExp(`^(.+?)(${keywords.join('|')}|$)+?`, "i")

  const beginningStr = (beginningRE.exec(str) as RegExpExecArray)[1] as string
  const out = chrono.parse(beginningStr, new Date, { forwardDate: true }) as chrono.ParsedResult[]

  if (out.length === 0) {
    return undefined
  }

  const chronoResult = out[0] as chrono.ParsedResult

  if (chronoResult.end) {
    task.start = DateTime.fromJSDate(chronoResult.start.date())
    task.end = DateTime.fromJSDate(chronoResult.end.date())
  } else {
    task.end = DateTime.fromJSDate(chronoResult.start.date())
  }

  task.title = beginningStr.replace(chronoResult.text, "")

  const recurrence = parseRecurrence(str)

  if (recurrence) {
    task.recurrence = recurrence
  } 

  task.id = nanoid()

  return TaskSchema.parse(task)
}

function parseRecurrence (str: string): any {
    const recurrenceRE = new RegExp(`(every)(.+?)(${keywords.join('|')}|$)+?`, "i")
    const recurrenceMatch = recurrenceRE.exec(str) as RegExpExecArray
    if (recurrenceMatch) {
      const recurrenceStr = "every " + recurrenceMatch[2]
      console.log(recurrenceStr)
      let options;
      try {
        options = RRule.parseText(recurrenceStr)
      } catch (e) {
        console.log(e)
        return undefined
      }
      if (options){
          const rule = (new RRule({...options})) as datetime
          return rule
      }
    } else {
        return undefined
    }
}

function parseDuration (str: string): typeof Duration {}

