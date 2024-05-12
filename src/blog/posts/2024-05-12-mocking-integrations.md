---
title: "Different ways to mock third-party integrations in Jest"
date: 2024-05-12
tags: ["node", "jest", "typescript", "testing"]
---

A few years back I got so bored of taking attendance for my choir that I wrote a Slack integration to do it for me (I got us on Slack in 2014). That evolved from a dodgy Python app triggered by slash commands into into a neat little Typescript suite called [Choirbot](https://github.com/sophiekoonin/choirbot) that triggers via cron job. It does everything from posting reminders about upcoming rehearsals to reporting on attendance stats, and this weekend I added a new feature: the ability to nominate someone to facilitate the rehearsal if nobody else volunteers by 5pm the day of rehearsal. 

I don't touch the code very much, so every time I go back to look at it I have to spend ages figuring out how everything works all over again. You know why that is? Because I was lazy and didn't write any tests.

You might think that a small side project isn't worth writing tests for, especially if it's just you contributing to it. But the odds of you breaking stuff increase exponentially the longer you leave it before adding a new feature, *especially* if that project involves libraries that get out of date, old versions of Node, and third party dependencies that involve arcane magic. 

So before I embarked upon building new functionality, I needed a full test suite that I could rely on to tell me if I'd broken anything, and that would show me a) what all the data structures look like and b) what the expected behaviour is across the whole app.

My Choirbot app has three major integrations: `googleapis/google` to read from Google Sheets, `@slack/web-api` to communicate with Slack, and `@google-cloud/firestore` as a document store. It also reads from the [gov.uk Bank Holidays API](https://gov.uk/bank-holidays.json), still one of my favourite APIs ever due to its inclusion of whether bunting is appropriate for each holiday. I'd need to mock out all of these deps if I wanted to test my app thoroughly. 

I leaned heavily on Jest's [manual mocks](https://jestjs.io/docs/manual-mocks) for all of these: library and file replacements stored in `__mocks__`.


## Mocking the Slack SDK
In my code wherever I'm interacting with the Slack API I'm actually doing it via a [client](https://github.com/sophiekoonin/shebot/blob/76da79727c6ce977982e55c01db974aa2c659367/src/slack/__mocks__/client.ts) that I've instantiated and exported. So rather than mocking the Slack SDK directly, I can mock my client. The mock for this one, then, lives in the same directory as the client: `src/slack`. 

I've defined all of the Slack API functions I use in my code, and set them as `jest.fn()` so I can assert on what's being called and override the individual method return values as and when I need to. If I add a new Slack method call in somewhere, I'll need to add it here as well.

```typescript
// src/slack/__mocks__/client.ts

export const SlackClient = {
  chat: {
    postMessage: jest.fn(() => {
      return {
        ok: true,
        ts: 'returnTimestamp'
      }
    }),
    update: jest.fn()
  },
  conversations: {
    history: jest.fn()
  },
  reactions: {
    add: jest.fn(),
    get: jest.fn(() => {
      return {
        ok: true,
        message: {
          reactions: [
            {
              name: 'thumbsup',
              count: 1
            },
            {
              name: 'thumbsdown',
              count: 1
            }
          ]
        }
      }
    })
  },
  users: {
    list: jest.fn()
  },
  channels: {
    join: jest.fn()
  },
  views: {
    open: jest.fn(),
    publish: jest.fn(),
    update: jest.fn()
  },
  oauth: {
    v2: {
      access: jest.fn()
    }
  }
}
```
Since these are all `jest.fn()` mocks, I can override the individual return types of each function in a test using `mockResolvedValue`:

```typescript
import { SlackClient } from '../slack/client'
jest.mock('../slack/client')

[...]
  test(`Persists the user ID of the person who volunteered and doesn't post`, async () => {
    SlackClient.reactions.get.mockResolvedValue({
      channel: 'test-channel',
      ok: true,
      message: {
        reactions: [
          {
            users: [testUserId],
            name: 'raised_hands'
          },
          {
            users: [testUser2, testUser3],
            name: '-1'
          }
        ]
      }
    })
// [rest of test logic]
  })

```
[See full test](https://github.com/sophiekoonin/choirbot/blob/731491bf8787fc381cbe9379f90f66b584308cda/src/rehearsals/rehearsals.test.ts)

## Mocking the Google Sheets SDK
This _is_ a mock for an external library, so it lives in `src/__mocks__` at the top level. 

I used `jest.createMockFromModule` to auto-generate a mock based on the whole module, and then overwrote its `google` export with my own mock. 

I wanted to be able to change the return value of the `batchGet` function to test different behaviour, but unlike with the Slack SDK, I can't use `mockResolvedValue` here because `google.sheets` is a function that returns an instance of the sheets client. Instead, to make sure the mock instance has the mock data I want it to, I've added a variable `mockBatchGetReturnValue` which I've added a setter for and exported as part of the mock. 


```typescript
// src/__mocks__/googleapis.ts
import { GoogleApis } from 'googleapis'
import { spreadsheetDateRows, testSpreadsheetData } from '../test/testData'

const googleapis = jest.createMockFromModule('googleapis') as GoogleApis

let mockBatchGetReturnValue = testSpreadsheetData

export const google = {
  auth: {
    getClient: jest.fn()
  },
  sheets: jest.fn(() => ({
    spreadsheets: {
      values: {
        get: jest.fn(async () => {
          return {
            data: {
              values: [spreadsheetDateRows]
            }
          }
        }),
        batchGet: jest.fn(async () => {
          return {
            data: {
              valueRanges: mockBatchGetReturnValue
            }
          }
        })
      }
    }
  }),
  setMockBatchGetReturnValue: (value: typeof mockBatchGetReturnValue) => {
    mockBatchGetReturnValue = value
  })
}

export default googleapis
```

Example usage of `setMockBatchGetReturnValue` in a test:

```typescript
import { google } from 'googleapis'
jest.mock('googleapis')

test('Posts a message if rehearsal is cancelled', async () => {
      // @ts-expect-error mock type
      google.setMockBatchGetReturnValue([
        {
          range: 'B1:I1',
          values: [testSpreadsheetHeaders]
        },
        {
          range: 'B4:I4',
          values: [
            'Rehearsal cancelled',
            'Run Through Title',
            'Blah blah blah',
            'main-song-link',
            'run-through-link'
          ]
        }
      ])

      // [rest of test]
})
```
[See full test](https://github.com/sophiekoonin/choirbot/blob/731491bf8787fc381cbe9379f90f66b584308cda/src/rehearsals/rehearsals.test.ts)

## Mocking Google Cloud firestore
This took AGES to figure out. I had found [`firestore-jest-mock`](https://github.com/sbatson5/firestore-jest-mock) and thought it'd solve all my problems, but I found that it just didn't work when I used it in the way the [docs recommended](https://github.com/sbatson5/firestore-jest-mock?tab=readme-ov-file#google-cloudfirestore-compatibility). The tests just timed out, which suggested they were still trying to connect to the real database.

I ended up going with the manual mock approach again, but exporting a class that had an instance of the Firestore stub from `firestore-jest-mock`. In order to change the DB data between tests, I had to reinstantiate the stub. Everything starts with the `collection()` function, so it was enough to just expose that function which then allows you to chain functions on the underlying stub. 

Like with Slack, my database instance is exported from a file, so I could mock that file instead of the entire SDK. 

I created a load of reusable test data, and imported that to use in the mock. I stored that elsewhere so I could import it in tests as well. 

```typescript
// src/db/__mocks__/db.ts

import { firestoreStub } from 'firestore-jest-mock/mocks/googleCloudFirestore'
import { Firestore as FirestoreT } from '@google-cloud/firestore' 
import {
  testAttendancePost,
  testTeamData,
  testTeamId
} from '../../test/testData'

type TestDataOverrides = {
  teamOverrides?: Partial<typeof testTeamData>
  attendanceOverrides?: Partial<typeof testAttendancePost>
  attendance?: Array<typeof testAttendancePost>
  teams?: Array<typeof testTeamData>
}

class DB {
  mockFirestore: FirestoreT

  constructor() {
    const { Firestore } = firestoreStub({
      database: {
        teams: [testTeamData],
        [`attendance-${testTeamId}`]: [testAttendancePost]
      }
    })
    this.mockFirestore = new Firestore()
  }

  collection(args: string) {
    return this.mockFirestore.collection(args)
  }

  setMockDbContents(testData: TestDataOverrides) {
    const { attendance, teams, teamOverrides, attendanceOverrides } = testData
    const teamData = {
      ...testTeamData,
      ...teamOverrides
    }

    const attendanceData = {
      ...testAttendancePost,
      ...attendanceOverrides
    }
    const { Firestore } = firestoreStub({
      database: {
        teams: teams ? teams : [teamData],
        [`attendance-${testTeamId}`]: attendance ? attendance : [attendanceData]
      }
    })
    this.mockFirestore = new Firestore()
  }
}

const testDB = new DB()

export const db = testDB
```

With `setMockDbContents` I added the ability to set overrides of individual data fields, or overwrite the entire table contents. I could then call `db.setMockDbContents` in a test when I needed to change what the database getters returned:

```typescript
  import { db } from '../db/db'
  jest.mock('../db/db')
  
  [...]

  test("Messages the person who installed if couldn't find a post", async () => {
    db.setMockDbContents({
      attendance: []
    })

    await updateAttendanceMessage({
      token,
      teamId
    })

    expect(SlackClient.chat.postMessage).toHaveBeenCalledWith({
      token,
      channel: testUserId,
      text: "Tried to update attendance message, but couldn't find the post to update."
    })
  })
```
[See full test](https://github.com/sophiekoonin/shebot/blob/e119f4d73329c8b1b234af44f56c31eeeb50c96f/src/attendance/attendance.test.ts)

### Mocking Node's native `fetch` with nock

Since Node 18, `fetch` has been supported natively in Node! [`nock`](https://github.com/nock/nock) is a HTTP mocking library for Node and version 14 (currently in beta at the time of writing) includes support for native `fetch`. While many API calls may work in a test, it speeds things up a lot to mock them out.

```typescript
import nock from 'nock'
import { isBankHoliday } from './utils'
nock('https://www.gov.uk')
  .get('/bank-holidays.json')
  .reply(200, {
    'england-and-wales': {
      events: [
        {
          title: 'New Year’s Day',
          date: '2024-01-01',
          notes: '',
          bunting: true
        }
      ]
    }
  })

describe('general utils', () => {
  test('isBankHoliday', async () => {
    expect(await isBankHoliday('2024-01-01')).toBe(true)
    expect(await isBankHoliday('2024-01-02')).toBe(false)
  })
})

```
[See full test](https://github.com/sophiekoonin/shebot/blob/638c1778e071fcc3a74ae7d387afe4e163d5404b/src/utils.test.ts)

A note here: if you're using `jest.useFakeTimers` it may cause the request mocked with `nock` to time out. I found a [relevant GitHub issue](https://github.com/nock/nock/issues/2200) that suggested excluding a couple of timing functions from `useFakeTimers` as a workaround until the problem is fixed:
```js
 jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] })
```

Happy testing!