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
    - [notification](#notificationmediatype)
    - [addNotificationMobile](#addnotificationmobilemediatype-parameters)
    - [addNotificationEmail](#addnotificationemailmediatype-parameters)
    - [removeNotification](#removenotificationmediatype-id)
  - UserV1
    - [agreement](#agreement)
    - [profile](#profile)
    - [updateProfile](#updateprofileprofile)
    - [profileByProperty](#profilebypropertyproperty)
    - [updateProfileByProperty](#updateprofilebypropertyproperty-profile)
    - [updateDevice](#updatedevicetoken-parameters)
    - [removeDevice](#removedevicetoken)
  - CollectionV1
    - [collection](#collection)
    - [addCollection](#addcollectioncollection)
    - [collectionById](#collectionbyidid)
    - [updateCollection](#updatecollectionid-collection)
    - [removeCollection](#removecollectionid)
    - [addCollectionItems](#addcollectionitemsid-items)
    - [removeCollectionItems](#removecollectionitemsid-items)
  - [Exported types](#exported-types)
    - [ttninjs](#interface-ttninjs)
    - [agreement](#interface-agreement)
    - [collection](#interface-collection)
    - [collectionItem](#interface-collectionItem)
    - [product](#interface-product)
    - [notification](#interface-notification)

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
import { Api } from "@ttab/api-client";

let api = new Api({ token: process.env.TOKEN || "" });

api.content.search("image", { q: "panda" }).then(res => {
  res.hits.forEach(hit => {
    console.log(hit.uri, hit.product);
  });
});
```

The search result is restricted to only match items allowed by the customer
agreements linked to your user account. If you wish to further restrict the
search result to match a given agreement you can use the `agr` parameter:

```typescript
api.content.search("image", { q: "panda", agr: [20031] }).then(res => {
  res.hits.forEach(hit => {
    console.log(hit.uri, hit.product);
  });
});
```

You can also restrict the search result to only contain items matching one or
more [product codes](https://tt.se/spec/product/1.0):

```typescript
api.content
  .search("image", { q: "panda", p: ["FOGNRE", "FOGNREEJ"] })
  .then(res => {
    res.hits.forEach(hit => {
      console.log(hit.uri, hit.product);
    });
  });
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
import { Api } from "@ttab/api-client";

let api = new Api({ token: process.env.TOKEN || "" });

function loop(last?: string) {
  return api.content.stream("image", { last: last }).then(result => {
    let _last = null;
    result.hits.forEach(hit => {
      console.log(hit.uri, hit.source, hit.headline);
      _last = hit.uri;
    });
    return loop(_last);
  });
}

loop().catch(err => {
  console.error(err);
});
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

#### Example

The following code is equivalent to the loop in the previous section. It prints
the `uri`, `source` and `headline` for each new image as it is added to the
database. It handles errors by printing a stack trace and closing down the
stream.

```typescript
import { Api, ContentStream } from "@ttab/api-client";

let api = new Api({ token: process.env.TOKEN || "" });
let stream = new ContentStream(api, "image", {});

stream.on("data", hit => {
  console.log(hit.uri, hit.source, hit.headline);
});

stream.on("error", err => {
  console.log("err", err);
  stream.close();
});

stream.on("close", () => {
  console.log("closed");
});
```

# API Reference

## ContentV1

### search(mediaType, parameters)

Searching the TT archives.

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- parameters:
  - `q?: string` - A query string used for free text searching.
  - `p?: Array<string>` - A list of product codes. Only items matching at least
    one of these codes will be returned. The list of current product codes is
    [here](https://tt.se/spec/product/1.0).
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `tr?: "h" | "d" | "w" | "m" | "y"` - Time range: last hour, day, week,
    month, or year.
  - `trs?: string` - Start date
  - `tre?: string` - End date
  - `s?: number` - Size of search result.
  - `fr?: number` - Index into the search result. Used for pagination.

#### Returns

- Promise&lt;{ 'hits': Array<[ttninjs](#interface-ttninjs)>;}&gt;

#### Example

```typescript
api.content
  .search("image", {
    q: "panda",
    p: ["FOGNRE", "FOGNREEJ"],
    agr: [20031, 20035],
    tr: "w"
  })
  .then(result => {
    // do something with result
  });
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
    [here](https://tt.se/spec/product/1.0).
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `last?: string` - The uri of the last item received.
  - `wait?: number` - The time (in seconds) to wait for updates before returning
    an empty result.

#### Returns

- Promise&lt;{ 'hits': Array<[ttninjs](#interface-ttninjs)>;}&gt;

#### Example

```typescript
api.content
  .stream("image", {
    q: "panda",
    p: ["FOGNRE", "FOGNREEJ"],
    agr: [20031, 20035]
  })
  .then(result => {
    // do something with result
  });
```

### notification(mediaType)

List all notifications

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.

#### Returns

- Promise&lt;Array<[notification](#interface-notification)>&gt;

#### Example

```typescript
api.content.notification("image").then(result => {
  // do something with result
});
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
    [here](https://tt.se/spec/product/1.0).
  - `agr?: Array<number>` - A list of customer agreement IDs belonging to the
    current user. Only items covered by at least one of there agreements will be
    returned.
  - `title: string` -

#### Returns

- Promise&lt;[notification](#interface-notification)&gt;

#### Example

```typescript
api.content
  .addNotificationMobile("image", {
    q: "panda",
    p: ["FOGNRE", "FOGNREEJ"],
    agr: [20031, 20035],
    title: "my mobile notification"
  })
  .then(result => {
    // do something with result
  });
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
    [here](https://tt.se/spec/product/1.0).
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
  .addNotificationEmail("image", {
    q: "panda",
    p: ["FOGNRE", "FOGNREEJ"],
    agr: [20031, 20035],
    title: "my email notification",
    email: "my.email@address.com"
  })
  .then(result => {
    // do something with result
  });
```

### removeNotification(mediaType, id)

Remove an existing notification

#### Arguments

- mediaType:
  `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"` -
  Only return items of this media type.
- id: `string` - An UUID string.

#### Returns

- Promise&lt;string&gt;

#### Example

```typescript
api.content.removeNotification("image", "123").then(result => {
  // do something with result
});
```

## UserV1

### agreement()

Get the current customer agreements.

Return a list of applicable customer agreements for the current user.

#### Arguments

#### Returns

- Promise&lt;Array<[agreement](#interface-agreement)>&gt;

#### Example

```typescript
api.user.agreement().then(result => {
  // do something with result
});
```

### profile()

Get the profile for the current user.

The user profile is an unstructured JSON object containing non-secret
application data (settings and such). Web applications are free to access this
information as they see fit.

#### Arguments

#### Returns

- Promise&lt;{ }&gt;

#### Example

```typescript
api.user.profile().then(result => {
  // do something with result
});
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
api.user.updateProfile({ property1: "customValue" }).then(result => {
  // do something with result
});
```

### profileByProperty(property)

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
api.user.profileByProperty(["property1", "property2"]).then(result => {
  // do something with result
});
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
  .updateProfileByProperty(["property1", "property2"], {
    property1: "customValue"
  })
  .then(result => {
    // do something with result
  });
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
    "5a21a38a24857b344c66aadade0abf2a748fcacf2ddf466e83e4fcd1cefab66a",
    { type: "ios", name: "my iPhone", model: "iPhone 8" }
  )
  .then(result => {
    // do something with result
  });
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
    "5a21a38a24857b344c66aadade0abf2a748fcacf2ddf466e83e4fcd1cefab66a"
  )
  .then(result => {
    // do something with result
  });
```

## CollectionV1

### collection()

List all collections

Returns a list of all collections belonging to the current user.

#### Arguments

#### Returns

- Promise&lt;Array<[collection](#interface-collection)>&gt;

#### Example

```typescript
api.collection.collection().then(result => {
  // do something with result
});
```

### addCollection(collection)

Create a new collection.

Creates an new named collection for the current user. This operation is
asynchronous, and there may be a delay before the change is visible using the
`GET /collection/v1/collection` endpoint.

#### Arguments

- collection: `{ 'name': string;}`

#### Returns

- Promise&lt;[collection](#interface-collection)&gt;

#### Example

```typescript
api.collection.addCollection({ name: "my collection" }).then(result => {
  // do something with result
});
```

### collectionById(id)

Get collection properties and contents

Returns all properties and contents of a single collection.

#### Arguments

- id: `string` - ID of a collection.

#### Returns

- Promise&lt;[collectionItem](#interface-collectionItem)&gt;

#### Example

```typescript
api.collection.collectionById("123").then(result => {
  // do something with result
});
```

### updateCollection(id, collection)

Update collection properties

Updates an existing collection belonging to the current user. This operation is
asynchronous, and there may be a delay before the change is visible using the
`GET /collection/v1/collection` endpoint.

#### Arguments

- id: `string` - ID of a collection.
- collection: `{ 'name': string;}`

#### Returns

- Promise&lt;[collection](#interface-collection)&gt;

#### Example

```typescript
api.collection
  .updateCollection("123", { name: "my collection" })
  .then(result => {
    // do something with result
  });
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
api.collection.removeCollection("123").then(result => {
  // do something with result
});
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
  .addCollectionItems("123", [{ uri: "http://tt.se/media/image/sdltd8f4d87" }])
  .then(result => {
    // do something with result
  });
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
  .removeCollectionItems("123", [
    { uri: "http://tt.se/media/image/sdltd8f4d87" }
  ])
  .then(result => {
    // do something with result
  });
```

## Exported types

### Interface ttninjs

```typescript
interface ttninjs {
  uri: string;
  type?:
    | "text"
    | "audio"
    | "video"
    | "picture"
    | "graphic"
    | "composite"
    | "planning"
    | "component"
    | "event";
  mimetype?: string;
  representationtype?: "complete" | "incomplete" | "associated";
  profile?: "PUBL" | "DATA" | "INFO" | "RAW";
  version?: string;
  versioncreated?: string;
  versionstored?: string;
  embargoed?: string;
  date?: string;
  datetime?: string;
  enddate?: string;
  enddatetime?: string;
  embargoedreason?: string;
  job?: string;
  pubstatus?: "usable" | "withheld" | "canceled" | "replaced" | "commissioned";
  copyrightholder?: string;
  copyrightnotice?: string;
  language?: string;
  week?: number;
  urgency?: number;
  webprio?: number;
  source?: string;
  commissioncode?: string;
  description_text?: string;
  description_usage?: string;
  usageterms?: string;
  body_text?: string;
  body_html5?: string;
  body_event?: {
    arena?: string;
    city?: string;
    address?: string;
    country?: string;
    eventurl?: string;
    eventphone?: string;
    eventweb?: string;
    organizer?: string;
    organizerurl?: string;
    organizerphone?: string;
    organizermail?: string;
    eventstatus?: string;
    eventstatus_text?: string;
    region?: string;
    region_text?: string;
    municipality?: string;
    municipality_text?: string;
    eventtags?: string;
    eventtype?: string;
    eventtype_text?: string;
    note_extra?: string;
    note_pm?: string;
    accreditation?: string;
    extraurl?: string;
    createddate?: string;
    createdby?: string;
    changeddate?: string;
    changedby?: string;
    courtcasenumber?: string;
  };
  body_sportsml?: string;
  body_pages?: {};
  commissionedby?: Array<string>;
  charcount?: number;
  originaltransmissionreference?: string;
  signals?: {
    pageproduct?: string;
    multipagecount?: number;
    paginae?: Array<string>;
    pagecode?: string;
    pagevariant?: string;
  };
  product?: Array<{ [key: string]: {} }>;
  person?: Array<{ [key: string]: {} }>;
  organisation?: Array<{ [key: string]: {} }>;
  place?: Array<{ [key: string]: {} }>;
  subject?: Array<{ [key: string]: {} }>;
  event?: Array<{ [key: string]: {} }>;
  object?: Array<{ [key: string]: {} }>;
  byline?: string;
  bylines?: Array<{
    byline?: string;
    firstname?: string;
    lastname?: string;
    role?: string;
    email?: string;
    jobtitle?: string;
    internal?: string;
    phone?: string;
    initials?: string;
    affiliation?: string;
  }>;
  headline?: string;
  slug?: string;
  located?: string;
  renditions?: {};
  replacing?: Array<string>;
  replacedby?: string;
  associations?: {};
  revisions?: Array<{ [key: string]: {} }>;
  sector?: "INR" | "UTR" | "EKO" | "KLT" | "SPT" | "PRM";
}
```

### Interface agreement

```typescript
interface agreement {
  id?: number;
  description?: {};
  type?: "Subscription" | "Direct" | "Normal" | "Sketch";
  products?: Array<product>;
}
```

### Interface collection

```typescript
interface collection {
  id: string;
  owner: string;
  name: string;
  colldate: string;
}
```

### Interface collectionItem

```typescript
interface collectionItem {
  id: string;
  owner: string;
  name: string;
  colldate: string;
  items: Array<ttninjs>;
}
```

### Interface product

```typescript
interface product {
  name?: string;
  description?: {};
  code?: string;
}
```

### Interface notification

```typescript
interface notification {
  id: string;
  title: string;
  type: "mobile" | "email";
  mediaType:
    | "_all"
    | "image"
    | "video"
    | "graphic"
    | "text"
    | "feature"
    | "page"
    | "planning"
    | "calendar";
  q?: string;
  p?: Array<string>;
  agr?: Array<number>;
}
```
