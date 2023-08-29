# @ttab/api-client

Browser-friendly TypeScript client for TT Nyhetsbyrån public APIs. The client
code (and this README file) has been automatically generated from the API
definition located at [https://api.tt.se/docs](https://api.tt.se/docs).

![Version](http://img.shields.io/npm/v/@ttab/api-client.svg) &nbsp;
![License](http://img.shields.io/npm/l/@ttab/api-client.svg) &nbsp;
![Monthly downloads](http://img.shields.io/npm/dm/@ttab/api-client.svg) &nbsp;

Instructions for building the client are [here](/BUILDING.md).

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Obtaining an OAuth2 token](#obtaining-an-oauth2-token)
  - [Searching](#searching)
  - [Streaming data](#streaming-data)
    - [The ContentStream class](#the-contentstream-class)
- [API Reference](#api-reference)
  - ContentV1
    - [search](#searchmediatype-parameters)
    - [stream](#streammediatype-parameters)
    - [getNotifications](#getnotificationsmediatype)
    - [addNotificationMobile](#addnotificationmobilemediatype-parameters)
    - [addNotificationEmail](#addnotificationemailmediatype-parameters)
    - [addNotificationScheduledEmail](#addnotificationscheduledemailmediatype-parameters)
    - [updateNotificationMobile](#updatenotificationmobilemediatype-id-parameters)
    - [updateNotificationEmail](#updatenotificationemailmediatype-id-parameters)
    - [updateNotificationScheduledEmail](#updatenotificationscheduledemailmediatype-id-parameters)
    - [removeNotification](#removenotificationmediatype-id)
  - UserV1
    - [getAgreements](#getagreements)
    - [getOrder](#getorderparameters)
    - [updateOrder](#updateorderid-order)
    - [getProfile](#getprofile)
    - [updateProfile](#updateprofileprofile)
    - [getProfileByProperty](#getprofilebypropertyproperty)
    - [updateProfileByProperty](#updateprofilebypropertyproperty-profile)
    - [updateDevice](#updatedevicetoken-parameters)
    - [removeDevice](#removedevicetoken)
    - [getOrganization](#getorganization)
    - [getOrganizationUsers](#getorganizationusers)
    - [addOrganizationUser](#addorganizationuseruser)
    - [getOrganizationUser](#getorganizationuserid)
    - [updateOrganizationUser](#updateorganizationuserid-user)
    - [getUser](#getuser)
  - CollectionV1
    - [getCollections](#getcollections)
    - [addCollection](#addcollectioncollection)
    - [getCollection](#getcollectionid)
    - [updateCollection](#updatecollectionid-collection)
    - [removeCollection](#removecollectionid)
    - [addCollectionItems](#addcollectionitemsid-items)
    - [removeCollectionItems](#removecollectionitemsid-items)
  - [Exported types](#exported-types)
    - [ttninjs](#interface-ttninjs)
    - [access](#interface-access)
    - [address](#interface-address)
    - [agreement](#interface-agreement)
    - [agreement2](#interface-agreement2)
    - [agreementType](#interface-agreementType)
    - [collection](#interface-collection)
    - [collectionItem](#interface-collectionItem)
    - [error](#interface-error)
    - [errors](#interface-errors)
    - [facet](#interface-facet)
    - [license](#interface-license)
    - [monetaryAmount](#interface-monetaryAmount)
    - [order](#interface-order)
    - [notification](#interface-notification)
    - [organization](#interface-organization)
    - [phoneNumber](#interface-phoneNumber)
    - [phoneNumberDirect](#interface-phoneNumberDirect)
    - [product](#interface-product)
    - [product2](#interface-product2)
    - [user](#interface-user)
    - [userBase](#interface-userBase)

# Getting started

## Prerequisites

To access the APIs you need to have a registered user account at
[TT Nyhetsbyrån](https://tt.se).

The API uses OAuth2 token authentication. To be able to generate an OAuth2 token
you will need a OAuth2 client registered with TT Nyhetsbyrån. If you don't have
one, please contact [support@tt.se](mailto:support@tt.se).

## Obtaining an OAuth2 token

The OAuth2 endpoints are documented
[here](http://spec.tt.se/api.html#authentication). In short, to obtain a token
you call the `https://tt.se/o/oauth2/token` endpoint like this:

```sh
curl -XPOST -d username="<USERNAME>" \
  -d password="<PASSWORD>" \
  -d grant_type=password \
  -d scope="roles" \
  -d client_id="<CLIENT_ID>" \
  -d client_secret="<CLIENT_SECRET>" \
  https://tt.se/o/oauth2/token
```

You will get a JSON payload back. One of the properties is called `access_token`
and contains the the OAuth2 token you need to connect to the API. To run the
examples below it is handy to have this token exported as an environment
variable:

```sh
export TOKEN="a.DV_8caPCk7CVQs_jr4_MpqZSxj4e25N3GbTEGXk2w4MUwzB..."
```

## Searching

Searching the database for matching items is a common operation. You supply the
`mediaType` (`image`, `text`, `video`, etc.) and an object with query
parameters, and get a result object with an array of search `hits`.

This is a basic query, looking for panda pictures:

```typescript
import { Api } from '@ttab/api-client'

let api = new Api({ token: process.env.TOKEN || '' })

api.content.search('image', { q: 'panda' }).then((res) => {
  res.hits.forEach((hit) => {
    console.log(hit.uri, hit.product)
  })
})
```

The search result is restricted to only match items allowed by the customer
agreements linked to your user account. If you wish to further restrict the
search result to match a given agreement you can use the `agr` parameter:

```typescript
api.content.search('image', { q: 'panda', agr: [20031] }).then((res) => {
  res.hits.forEach((hit) => {
    console.log(hit.uri, hit.product)
  })
})
```

You can also restrict the search result to only contain items matching one or
more [product codes](https://tt.se/spec/product/1.0):

```typescript
api.content
  .search('image', { q: 'panda', p: ['FOGNRE', 'FOGNREEJ'] })
  .then((res) => {
    res.hits.forEach((hit) => {
      console.log(hit.uri, hit.product)
    })
  })
```

## Streaming data

While the [api.content.search()](#searchmediatype-parameters) method only
returns items that are already present in the database,
[api.content.stream()](#streammediatype-parameters) provides a way to get a near
real-time stream of new items as they are being indexed.

The [api.content.stream()](#streammediatype-parameters) method accepts roughly
the same arguments as [api.content.search()](#searchmediatype-parameters), with
the exception of arguments that affect time ranges and result pagination. They
don't make any sense while streaming data, as we will always return the latest
items added.

[api.content.stream()](#streammediatype-parameters) also accepts two additional
parameters. `wait` is the maximum time (in seconds) to wait for new items before
the call returns with an empty result. `last` is the `uri` of the last item that
the client received. The idea is that if items has been added to the database
since the client received the last result, the call will return immediately with
those new items.

Utilizing the `last` parameter you can write a simple loop like this, that
prints the uri, source and headline for each new image as it is added to the
database:

```typescript
import { Api } from '@ttab/api-client'

let api = new Api({ token: process.env.TOKEN || '' })

function loop(last?: string) {
  return api.content.stream('image', { last: last }).then((result) => {
    let _last = null
    result.hits.forEach((hit) => {
      console.log(hit.uri, hit.source, hit.headline)
      _last = hit.uri
    })
    return loop(_last)
  })
}

loop().catch((err) => {
  console.error(err)
})
```

### The ContentStream class

While you can handle stream loops yourself, the API client supplies a utility
class to make content streaming easier.

#### Methods

- `constructor(api, mediaType, parameters)` -
  - `api` - an `Api` instance
  - `mediaType` and `parameters` - the same arguments accepted by
    [api.content.stream()](#streammediatype-parameters)
- `stop()` - request that the content stream be stopped. When the stream has
  closed down and no more `data` events can be expected a final `close` event
  will be emitted.

#### Events

- `data` - emitted once for every hit.
- `error` - emitted on error. It is up to the user to decide how to handle this
  error and if/when to close the content stream.
- `close` - emitted when the content stream is closed. No more `data` events
  will be emitted.

#### Error handling

On errors which the client is unlikely to recover from by itself (i.e. HTTP
4XX), the stream will automatically emit a `close` event and stop.

When encountering other errors (HTTP 5xx, connections errors, etc.) the stream
uses an exponential backoff algorithm to determine an appropriate delay before
retrying the request. The initial delay is 50ms and doubles after each
consecutive error, up to 60s. The delay is reset to zero when a request
completes successfully.

#### Example

The following code is equivalent to the loop in the previous section. It prints
the `uri`, `source` and `headline` for each new image as it is added to the
database. It handles errors by printing a stack trace and closing down the
stream.

```typescript
import { Api, ContentStream } from '@ttab/api-client'

let api = new Api({ token: process.env.TOKEN || '' })
let stream = new ContentStream(api, 'image', {})

stream.on('data', (hit) => {
  console.log(hit.uri, hit.source, hit.headline)
})

stream.on('error', (err) => {
  console.log('err', err)
  stream.close()
})

stream.on('close', () => {
  console.log('closed')
})
```

## Errors

Errors reported by the API or caused by the HTTP connection have the type
`ApiError`.

# API Reference

## ContentV1

### search(mediaType, parameters)

Searching the TT archives.

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar" | "stockfoto"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `tr?: "h" | "d" | "w" | "m" | "y"` - Time range: last hour, day, week,
    month, or year.
  - `trs?: string` - Start date
  - `tre?: string` - End date
  - `pubstatus?: Array<"usable" | "replaced">` -
  - `s?: number` - Size of search result.
  - `fr?: number` - Index into the search result. Used for pagination. It is
    recommended to make this value a multiple of the search result size (`s`),
    as some media types do not support arbitrary values here.
  - `sort?: "default:desc" | "default:asc" | "date:desc" | "date:asc" | "versioncreated:desc" | "versioncreated:asc" | "versionstored:desc" | "versionstored:asc" | "relevance"` -
    Sort order for the result. Documentation on various date fields can be found
    [here](http://spec.tt.se/dates).
    - default:desc / default:asc - Sort on the internal field '\_tstamp' in
      descending or ascending order respectively.
    - date:desc / date:asc - Sort on the field 'date' in descending or ascending
      order respectively.
    - versioncreated:desc / versioncreated:asc - Sort on the field
      'versioncreated' in descending or ascending order respectively.
    - versionstored:desc / versionstored:asc - Sort on the field 'versionstored'
      in descending or ascending order respectively.
    - relevance - Sort on relevance. The most relevant matches first.
  - `facets?: Array<"copyrightholder" | "person.name" | "place.name" | "product.code" | "subject.code">` -
    Enable search facets; in addition to the regular search result the API will
    also return one or more additional facets which contain information about
    how many search results can be expected if the current query is narrowed
    down using popular subject codes, product codes, etc.
  - `layout?: "bare" | "full"` - By default the full TTNinjs document is
    returned for each search hit. This may be too cumbersome for some use cases;
    for example when the client requests a large search result to be displayed
    in a list form. This parameter allows the client to control the layout of
    the items in the search result:
    - full - (default) return the full TTNinjs document
    - bare - return only `headline`, `date`, `uri`, `renditions`,
      `associations`, `pubstatus`, `originaltransmissionreference`,
      `copyrightholder`. In addition, all `associations` except the first are
      stripped away, and `renditions` will only contain the thumbnail rendition.

#### Returns

- Promise&lt;{ 'hits'?: Array<[ttninjs](#interface-ttninjs)>; 'total'?: number;
  'facets'?: { 'subject.code'?: Array<[facet](#interface-facet)>;
  'product.code'?: Array<[facet](#interface-facet)>; 'place.name'?:
  Array<[facet](#interface-facet)>; 'person.name'?:
  Array<[facet](#interface-facet)>; 'copyrightholder'?:
  Array<[facet](#interface-facet)>;};}&gt;

#### Example

```typescript
api.content
  .search('image', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    tr: 'w',
    sort: 'date:asc',
  })
  .then((result) => {
    // do something with result
  })
```

### stream(mediaType, parameters)

Realtime delivery of content.

Long poll call that will wait for a specified time period (default: 60s, max
300s) until a matching item is published. The parameters are similar to those
for `search`, with the exception that time ranges and pagination doesn't make
sense in this context (we will always return the most recent item).

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `sort?: "default:desc" | "default:asc" | "date:desc" | "date:asc" | "versioncreated:desc" | "versioncreated:asc" | "versionstored:desc" | "versionstored:asc" | "relevance"` -
    Sort order for the result. Documentation on various date fields can be found
    [here](http://spec.tt.se/dates).
    - default:desc / default:asc - Sort on the internal field '\_tstamp' in
      descending or ascending order respectively.
    - date:desc / date:asc - Sort on the field 'date' in descending or ascending
      order respectively.
    - versioncreated:desc / versioncreated:asc - Sort on the field
      'versioncreated' in descending or ascending order respectively.
    - versionstored:desc / versionstored:asc - Sort on the field 'versionstored'
      in descending or ascending order respectively.
    - relevance - Sort on relevance. The most relevant matches first.
  - `layout?: "bare" | "full"` - By default the full TTNinjs document is
    returned for each search hit. This may be too cumbersome for some use cases;
    for example when the client requests a large search result to be displayed
    in a list form. This parameter allows the client to control the layout of
    the items in the search result:
    - full - (default) return the full TTNinjs document
    - bare - return only `headline`, `date`, `uri`, `renditions`,
      `associations`, `pubstatus`, `originaltransmissionreference`,
      `copyrightholder`. In addition, all `associations` except the first are
      stripped away, and `renditions` will only contain the thumbnail rendition.
  - `last?: string` - The uri of the last item received.
  - `wait?: number` - The time (in seconds) to wait for updates before returning
    an empty result.

#### Returns

- Promise&lt;{ 'hits': Array<[ttninjs](#interface-ttninjs)>;}&gt;

#### Example

```typescript
api.content
  .stream('image', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    sort: 'date:asc',
  })
  .then((result) => {
    // do something with result
  })
```

### getNotifications(mediaType)

List all notifications

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.

#### Returns

- Promise&lt;Array<[notification](#interface-notification)>&gt;

#### Example

```typescript
api.content.getNotifications('image').then((result) => {
  // do something with result
})
```

### addNotificationMobile(mediaType, parameters)

Create a new mobile notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `title: string` -

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .addNotificationMobile('image', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    title: 'my mobile notification',
  })
  .then((result) => {
    // do something with result
  })
```

### addNotificationEmail(mediaType, parameters)

Create a new email notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `title: string` -
  - `email: string` - The email address to send emails to.

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .addNotificationEmail('image', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    title: 'my email notification',
    email: 'my.email@address.com',
  })
  .then((result) => {
    // do something with result
  })
```

### addNotificationScheduledEmail(mediaType, parameters)

Create a new scheduled email notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `tr?: "h" | "d" | "w" | "m" | "y"` - Time range: last hour, day, week,
    month, or year.
  - `title: string` -
  - `email: string` - The email address to send emails to.
  - `schedule: string` - A cron expression.
  - `timezone?: string` - A valid time zone name

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .addNotificationScheduledEmail('image', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    tr: 'w',
    title: 'my scheduled email notification',
    email: 'my.email@address.com',
    schedule: '0 0 12 * * MON-FRI',
    timezone: 'Europe/Stockholm',
  })
  .then((result) => {
    // do something with result
  })
```

### updateNotificationMobile(mediaType, id, parameters)

Update an existing mobile notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- id: `string` - An notification UUID string.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `title: string` -

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .updateNotificationMobile('image', '4a37869c-808f-496f-b549-3da0821ce187', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    title: 'my mobile notification',
  })
  .then((result) => {
    // do something with result
  })
```

### updateNotificationEmail(mediaType, id, parameters)

Update an existing email notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- id: `string` - An notification UUID string.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `title: string` -
  - `email: string` - The email address to send emails to.

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .updateNotificationEmail('image', '4a37869c-808f-496f-b549-3da0821ce187', {
    q: 'panda',
    p: ['FOGNRE', '-FOGNREEJ'],
    agr: [20031, 20035],
    title: 'my email notification',
    email: 'my.email@address.com',
  })
  .then((result) => {
    // do something with result
  })
```

### updateNotificationScheduledEmail(mediaType, id, parameters)

Update an existing scheduled email notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- id: `string` - An notification UUID string.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0). Individual product codes may be
    prefixed with a '-' sign, indicating that the code should instead be
    excluded from the search result.
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `tr?: "h" | "d" | "w" | "m" | "y"` - Time range: last hour, day, week,
    month, or year.
  - `title: string` -
  - `email: string` - The email address to send emails to.
  - `schedule: string` - A cron expression.
  - `timezone?: string` - A valid time zone name

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .updateNotificationScheduledEmail(
    'image',
    '4a37869c-808f-496f-b549-3da0821ce187',
    {
      q: 'panda',
      p: ['FOGNRE', '-FOGNREEJ'],
      agr: [20031, 20035],
      tr: 'w',
      title: 'my scheduled email notification',
      email: 'my.email@address.com',
      schedule: '0 0 12 * * MON-FRI',
      timezone: 'Europe/Stockholm',
    }
  )
  .then((result) => {
    // do something with result
  })
```

### removeNotification(mediaType, id)

Remove an existing notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- id: `string` - An notification UUID string.

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.content
  .removeNotification('image', '4a37869c-808f-496f-b549-3da0821ce187')
  .then((result) => {
    // do something with result
  })
```

## UserV1

### getAgreements()

Get the current customer agreements.

Return a list of applicable customer agreements for the current user. An
agreement that has a truthy value of isSuperAgreement will override any
agreement of Subscription type.

_DEPRECATED_: This endpoint has been deprecated in favor of `/user/v1/user`

#### Arguments

#### Returns

- Promise&lt;Array<[agreement](#interface-agreement)>&gt;

#### Example

```typescript
api.user.getAgreements().then((result) => {
  // do something with result
})
```

### getOrder(parameters)

Get the order/license history for the current user. If the user has customer
admin privileges, include all orders for the whole organization.

#### Arguments

- parameters:
  - `size?: number` -
  - `start?: number` -
  - `status?: "reported" | "unreported" | "all"` -

#### Returns

- Promise&lt;{ 'orders'?: Array<[order](#interface-order)>;}&gt;

#### Example

```typescript
api.user.getOrder({}).then((result) => {
  // do something with result
})
```

### updateOrder(id, order)

Update an unreported order row.

#### Arguments

- id: `number` -
- order?:
  `{ 'license'?: { 'uuid': string;}; 'invoiceText'?: string; 'approve': boolean;}`

#### Returns

- Promise&lt;[order](#interface-order)&gt;

#### Example

```typescript
api.user.updateOrder().then((result) => {
  // do something with result
})
```

### getProfile()

Get the profile for the current user.

The user profile is an unstructured JSON object containing non-secret
application data (settings and such). Web applications are free to access this
information as they see fit.

#### Arguments

#### Returns

- Promise&lt;{ }&gt;

#### Example

```typescript
api.user.getProfile().then((result) => {
  // do something with result
})
```

### updateProfile(profile)

Update the profile for the current user.

Replaces the entire user profile with the object passed in the request body.

For more controlled updates of the user profile, use the
`PUT /user/v1/profile/{property}` endpoint.

#### Arguments

- profile?: `{ }`

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.user.updateProfile({ property1: 'customValue' }).then((result) => {
  // do something with result
})
```

### getProfileByProperty(property)

Get selected properties of the profile for the current user.

The user profile is an unstructured JSON object containing non-secret
application data (settings and such). Web applications are free to access this
information as they see fit. Often, applications are not interested in the whole
user profile. This endpoint returns only selected properties.

#### Arguments

- property: `Array<string>` - A list of property names.

#### Returns

- Promise&lt;{ }&gt;

#### Example

```typescript
api.user.getProfileByProperty(['property1', 'property2']).then((result) => {
  // do something with result
})
```

### updateProfileByProperty(property, profile)

Update selected properties of the profile for the current user.

Replaces selected properties, but doesn't modify the rest of the user profile.
This is a more controlled version of the `PUT /user/v1/profile` endpoint.

Given a `profile` object like

    {
        "property1": { ... },
        "property2": { ... },
        ...
    }

and a `property` parameter like `property1,property2`, this endpoint will update
the given properties, but leave the rest of the user profile intact. Properties
present in `profile` but not listed in `property` will not be written.
Conversely, properties listed in `property` but not present in `profile` will
not be overwritten with `null`.

#### Arguments

- property: `Array<string>` - A list of property names.
- profile?: `{ }`

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.user
  .updateProfileByProperty(['property1', 'property2'], {
    property1: 'customValue',
  })
  .then((result) => {
    // do something with result
  })
```

### updateDevice(token, parameters)

Register a new mobile device.

#### Arguments

- token: `string` -
- parameters:
  - `type: "ios" | "ios-sandbox" | "android"` - The type of device:
    - `ios` (for the production environment)
    - `ios-sandbox` (for the APN sandbox)
    - `android`
  - `name?: string` - The name of this mobile device.
  - `model: string` - The model of this mobile device.

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.user
  .updateDevice(
    '5a21a38a24857b344c66aadade0abf2a748fcacf2ddf466e83e4fcd1cefab66a',
    { type: 'ios', name: 'my iPhone', model: 'iPhone 8' }
  )
  .then((result) => {
    // do something with result
  })
```

### removeDevice(token)

Unregister a mobile device.

#### Arguments

- token: `string` -

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.user
  .removeDevice(
    '5a21a38a24857b344c66aadade0abf2a748fcacf2ddf466e83e4fcd1cefab66a'
  )
  .then((result) => {
    // do something with result
  })
```

### getOrganization()

Get information about the organization that the current user belongs to.

#### Arguments

#### Returns

- Promise&lt;[organization](#interface-organization)&gt;

#### Example

```typescript
api.user.getOrganization().then((result) => {
  // do something with result
})
```

### getOrganizationUsers()

List the users belonging to the same organzation as the current user. Requires
the user to have the `admin` access level, and the token to have the `admin`
scope.

#### Arguments

#### Returns

- Promise&lt;Array<[userBase](#interface-userBase)>&gt;

#### Example

```typescript
api.user.getOrganizationUsers().then((result) => {
  // do something with result
})
```

### addOrganizationUser(user)

Create a new user for the same organzation as the current user. Requires the
user to have the `admin` access level, and the token to have the `admin` scope.

#### Arguments

- user?:
  `{ 'firstName': string; 'lastName': string; 'emailAddress': string; 'phoneNumber'?: phoneNumber; 'department'?: string; 'access'?: access;}`

#### Returns

- Promise&lt;[user](#interface-user)&gt;

#### Example

```typescript
api.user.addOrganizationUser().then((result) => {
  // do something with result
})
```

### getOrganizationUser(id)

Get information about a user belonging to the same organization as the current
user. Requires the user to have the `admin` access level, and the token to have
the `admin` scope.

#### Arguments

- id: `number` - A user ID

#### Returns

- Promise&lt;[user](#interface-user)&gt;

#### Example

```typescript
api.user.getOrganizationUser(123).then((result) => {
  // do something with result
})
```

### updateOrganizationUser(id, user)

Update a user belonging to the same organzation as the current user. Requires
the user to have the `admin` access level, and the token to have the `admin`
scope.

#### Arguments

- id: `number` - A user ID
- user?:
  `{ 'firstName'?: string; 'lastName'?: string; 'emailAddress'?: string; 'phoneNumber'?: phoneNumber; 'department'?: string; 'access'?: access;}`

#### Returns

- Promise&lt;[user](#interface-user)&gt;

#### Example

```typescript
api.user.updateOrganizationUser(123).then((result) => {
  // do something with result
})
```

### getUser()

Get information about the current user.

#### Arguments

#### Returns

- Promise&lt;[user](#interface-user)&gt;

#### Example

```typescript
api.user.getUser().then((result) => {
  // do something with result
})
```

## CollectionV1

### getCollections()

List all collections

Returns a list of all collections belonging to the current user.

#### Arguments

#### Returns

- Promise&lt;Array<[collection](#interface-collection)>&gt;

#### Example

```typescript
api.collection.getCollections().then((result) => {
  // do something with result
})
```

### addCollection(collection)

Create a new collection.

Creates an new named collection for the current user. This operation is
asynchronous, and there may be a delay before the change is visible using the
`GET /collection/v1/collection` endpoint.

#### Arguments

- collection: `{ 'name': string; 'public'?: boolean;}`

#### Returns

- Promise&lt;[collection](#interface-collection)&gt;

#### Example

```typescript
api.collection.addCollection({ name: 'my collection' }).then((result) => {
  // do something with result
})
```

### getCollection(id)

Get collection properties and contents

Returns all properties and contents of a single collection.

#### Arguments

- id: `string` - ID of a collection.

#### Returns

- Promise&lt;[collectionItem](#interface-collectionItem)&gt;

#### Example

```typescript
api.collection.getCollection('123').then((result) => {
  // do something with result
})
```

### updateCollection(id, collection)

Update collection properties

Updates an existing collection belonging to the current user. This operation is
asynchronous, and there may be a delay before the change is visible using the
`GET /collection/v1/collection` endpoint.

#### Arguments

- id: `string` - ID of a collection.
- collection: `{ 'name': string; 'public'?: boolean;}`

#### Returns

- Promise&lt;[collection](#interface-collection)&gt;

#### Example

```typescript
api.collection
  .updateCollection('123', { name: 'my collection' })
  .then((result) => {
    // do something with result
  })
```

### removeCollection(id)

Remove an existing collection

Removes an existing collection belonging to the current user. This operation is
asynchronous, and there may be a delay before the change is visible using the
`GET /collection/v1/collection` endpoint.

#### Arguments

- id: `string` - ID of a collection.

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.collection.removeCollection('123').then((result) => {
  // do something with result
})
```

### addCollectionItems(id, items)

Add items to collection

Adds any number of items to a given collection belonging to the current user.
The items must exist in the content database and be visible for the user. If
not, this call will still return successfully, but the collection remain
unchanged. This operation is asynchronous, and there may be a delay before
changes are visible using the `GET /collection/v1/collection/{id}` endpoint.

#### Arguments

- id: `string` - ID of a collection.
- items: `Array<{ 'uri': string;}>`

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.collection
  .addCollectionItems('123', [{ uri: 'http://tt.se/media/image/sdltd8f4d87' }])
  .then((result) => {
    // do something with result
  })
```

### removeCollectionItems(id, items)

Remove items from collection

Removes any number of items from a given collection belonging to the current
user. If one or more items do not currently belong to the collection, this call
will still return successfully, but those items will be ignored. This operation
is asynchronous, and there may be a delay before changes are visible using the
`GET /collection/v1/collection/{id}` endpoint.

#### Arguments

- id: `string` - ID of a collection.
- items: `Array<{ 'uri': string;}>`

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.collection
  .removeCollectionItems('123', [
    { uri: 'http://tt.se/media/image/sdltd8f4d87' },
  ])
  .then((result) => {
    // do something with result
  })
```

## Exported types

### Interface ttninjs

```typescript
interface ttninjs {
  uri: string
  type?:
    | 'text'
    | 'audio'
    | 'video'
    | 'picture'
    | 'graphic'
    | 'composite'
    | 'planning'
    | 'component'
    | 'event'
  mimetype?: string
  representationtype?: 'complete' | 'incomplete' | 'associated'
  profile?: 'PUBL' | 'DATA' | 'INFO' | 'RAW'
  version?: string
  firstcreated?: string
  versioncreated?: string
  versionstored?: string
  embargoed?: string
  embargoedreason?: string
  date?: string
  datetime?: string
  enddate?: string
  enddatetime?: string
  job?: string
  pubstatus?: 'usable' | 'withheld' | 'canceled' | 'replaced' | 'commissioned'
  urgency?: number
  copyrightholder?: string
  copyrightnotice?: string
  usageterms?: string
  ednote?: string
  language?: string
  week?: number
  webprio?: number
  source?: string
  commissioncode?: string
  description_text?: string
  description_usage?: string
  body_text?: string
  body_html5?: string
  body_richhtml5?: string
  body_event?: {
    arena?: string
    city?: string
    address?: string
    country?: string
    eventurl?: string
    eventphone?: string
    eventweb?: string
    organizer?: string
    organizeraddress?: string
    organizercity?: string
    organizercountry?: string
    organizerurl?: string
    organizerphone?: string
    organizermail?: string
    eventstatus?: string
    eventstatus_text?: string
    region?: string
    region_text?: string
    municipality?: string
    municipality_text?: string
    eventtags?: string
    eventtype?: string
    eventtype_text?: string
    note_extra?: string
    note_pm?: string
    accreditation?: string
    extraurl?: string
    createddate?: string
    createdby?: string
    changeddate?: string
    changedby?: string
    courtcasenumber?: string
  }
  body_sportsml?: string
  body_pages?: {}
  commissionedby?: Array<string>
  person?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  organisation?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
    symbols?: Array<{
      ticker?: string
      exchange?: string
    }>
  }>
  place?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
    geometry_geojson?: {
      type?: 'Point'
      coordinates?: Array<number>
    }
  }>
  subject?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  event?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  object?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  infosource?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  title?: string
  byline?: string
  bylines?: Array<{
    byline?: string
    firstname?: string
    lastname?: string
    role?: string
    email?: string
    jobtitle?: string
    internal?: string
    phone?: string
    initials?: string
    affiliation?: string
  }>
  headline?: string
  slug?: string
  slugline?: string
  located?: string
  charcount?: number
  wordcount?: number
  renditions?: {}
  associations?: {}
  altids?: {
    originaltransmissionreference?: string
  }
  originaltransmissionreference?: string
  trustindicator?: Array<{
    scheme?: string
    code?: string
    title?: string
    href?: string
  }>
  $standard?: {
    name?: string
    version?: string
    schema?: string
  }
  genre?: Array<{
    name?: string
    scheme?: string
    code?: string
  }>
  signals?: {
    pageproduct?: string
    multipagecount?: number
    paginae?: Array<string>
    pagecode?: string
    pagevariant?: string
  }
  product?: Array<{
    name?: string
    scheme?: string
    code?: string
  }>
  replacing?: Array<string>
  replacedby?: string
  assignments?: {}
  revisions?: Array<{
    uri: string
    slug?: string
    replacing?: Array<string>
  }>
  sector?: 'INR' | 'UTR' | 'EKO' | 'KLT' | 'SPT' | 'FEA' | 'NOJ' | 'PRM'
  fixture?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  advice?: Array<{
    role?: 'publish'
    environment?: Array<{
      code?: string
      scheme?: string
    }>
    importance?: {
      code?: string
      scheme?: string
    }
    lifetime?: {
      code?: string
      scheme?: string
    }
  }>
}
```

### Interface access

```typescript
interface access {
  admin?: boolean
  mediebank?: boolean
}
```

### Interface address

```typescript
interface address {
  street?: string
  box?: string
  zipCode?: string
  city?: string
  country?: string
}
```

### Interface agreement

```typescript
interface agreement {
  id?: number
  description?: {}
  type?: 'Subscription' | 'Direct' | 'Normal' | 'Sketch'
  isSuperAgreement?: boolean
  products?: Array<product>
}
```

### Interface agreement2

```typescript
interface agreement2 {
  id: number
  name?: string
  type: agreementType
  description?: string
  expires?: string
  superAgreement: boolean
  products: Array<product2>
}
```

### Interface agreementType

```typescript
interface agreementType "Subscription" | "Direct" | "Normal";
```

### Interface collection

```typescript
interface collection {
  accessed: string
  content: Array<string>
  removedContent?: Array<{
    uri?: string
    headline?: string
    description_text?: string
    timestamp?: string
  }>
  created: string
  id: string
  modified?: string
  name: string
  owner: string
  public: boolean
}
```

### Interface collectionItem

```typescript
interface collectionItem {
  accessed: string
  content: Array<string>
  removedContent?: Array<{
    uri?: string
    headline?: string
    description_text?: string
    timestamp?: string
  }>
  created: string
  id: string
  modified?: string
  name: string
  owner: string
  public: boolean
  items: Array<ttninjs>
}
```

### Interface error

```typescript
interface error {
  errorCode?: string
  location?: string
  message?: string
  path?: string
}
```

### Interface errors

```typescript
interface errors {
  errors?: Array<error>
}
```

### Interface facet

```typescript
interface facet {
  key?: string
  count?: number
}
```

### Interface license

```typescript
interface license {
  uuid?: string
  period?: 'Year' | 'Month' | 'Single'
  volume?: string
  price?: monetaryAmount
  description?: string
  product: product
}
```

### Interface monetaryAmount

```typescript
interface monetaryAmount string;
```

### Interface order

```typescript
interface order {
  id: number
  item: {
    uri?: string
    headline?: string
    byline?: string
    source?: string
  }
  price: {
    name: string
    description?: string
    license: license
    agreement: {
      id: number
      name?: string
      type: agreementType
    }
  }
  invoiceText?: string
  created: string
  downloadableUntil: string
  reportingDeadline?: string
  reported?: string
  approved?: boolean
  manual?: boolean
}
```

### Interface notification

```typescript
interface notification {
  id: string
  title: string
  type: 'mobile' | 'email' | 'scheduled-email'
  mediaType:
    | '_all'
    | 'image'
    | 'video'
    | 'graphic'
    | 'text'
    | 'feature'
    | 'page'
    | 'planning'
    | 'calendar'
  q?: string
  p?: Array<string>
  agr?: Array<number>
  schedule?: string
  timezone?: string
  email?: string
}
```

### Interface organization

```typescript
interface organization {
  id: number
  name?: string
  currency?: string
  country?: string
  address: {
    visit?: address
    postal?: address
    billing?: address
  }
  phoneNumber: phoneNumberDirect
}
```

### Interface phoneNumber

```typescript
interface phoneNumber {
  direct?: string
  mobile?: string
}
```

### Interface phoneNumberDirect

```typescript
interface phoneNumberDirect {
  direct?: string
}
```

### Interface product

```typescript
interface product {
  name?: string
  description?: {}
  code?: string
}
```

### Interface product2

```typescript
interface product2 {
  id: number
  name?: string
  description?: string
  code: string
}
```

### Interface user

```typescript
interface user {
  id: number
  customerId?: number
  userName: string
  firstName?: string
  lastName?: string
  emailAddress?: string
  department?: string
  phoneNumber: phoneNumber
  agreements: Array<agreement2>
  access: access
  active: boolean
}
```

### Interface userBase

```typescript
interface userBase {
  id: number
  customerId?: number
  userName: string
  firstName?: string
  lastName?: string
  emailAddress?: string
  department?: string
  active: boolean
}
```
