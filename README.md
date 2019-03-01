# @ttab/typescript-api-client

Browser-friendly TypeScript client for TT Nyhetsbyrån public APIs. The client
code (and this README file) has been automatically generated from the API
definition located at [https://api.tt.se/docs](https://api.tt.se/docs).

Instructions for building the client are [here](/BUILDING.md).

- [Getting started](#getting-started)
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

# Getting started

## Obtaining an OAuth2 token

TBA

## Anatomy of metadata items

TBA

## Searching

Searching the database for matching items is a very common operation. You supply
the `mediaType` (`image`, `text`, `video`, etc.) and an object with query
parameters, and get a result object with an array of search `hits`.

This is a basic query, looking for panda pictures:

```typescript
import { Api } from "@ttab/typescript-api-client";

let api = new Api({ token: process.env.TOKEN || "" });

api.content.search("image", { q: "panda" }).then(res => {
  console.log(res.hits[0].uri);
});
```

## Streaming data

TBA

[ttninjs]: https://tt.se/spec/ttninjs/ttninjs-schema_1.0.json

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

- `Promise<{ 'hits': Array<ttninjs>;}>`

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

- `Promise<{ 'hits': Array<ttninjs>;}>`

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

- `Promise<Array<notification>>`

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

- `Promise<notification>`

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

- `Promise<notification>`

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

- `Promise<string>`

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

- `Promise<Array<agreement>>`

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

- `Promise<{ }>`

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

- `Promise<string>`

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

- `Promise<{ }>`

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

- `Promise<string>`

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

- `Promise<string>`

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

- `Promise<string>`

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

- `Promise<Array<collection>>`

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

- `Promise<collection>`

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

- `Promise<collectionItem>`

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

- `Promise<collection>`

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

- `Promise<string>`

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

- `Promise<string>`

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

- `Promise<string>`

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
