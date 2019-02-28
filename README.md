# tt-api-client

* ContentV1
  - [search][#searchmediatype-parameters]
  - [stream][#streammediatype-parameters]
  - [notification][#notificationmediatype]
  - [addNotificationMobile][#addnotificationmobilemediatype-parameters]
  - [addNotificationEmail][#addnotificationemailmediatype-parameters]
  - [removeNotification][#removenotificationmediatype-id]
* UserV1
  - [agreement][#agreement]
  - [profile][#profile]
  - [updateProfile][#updateprofileprofile]
  - [profileByProperty][#profilebypropertyproperty]
  - [updateProfileByProperty][#updateprofilebypropertyproperty-profile]
  - [updateDevice][#updatedevicetoken-parameters]
  - [removeDevice][#removedevicetoken]
* CollectionV1
  - [collection][#collection]
  - [addCollection][#addcollectioncollection]
  - [collectionById][#collectionbyidid]
  - [updateCollection][#updatecollectionid-collection]
  - [removeCollection][#removecollectionid]
  - [addCollectionItems][#addcollectionitemsid-items]
  - [removeCollectionItems][#removecollectionitemsid-items]


## ContentV1

### search(mediaType, parameters)

Searching the TT archives.



#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`
 * parameters:
   - `q?: string` - A query string used for free text searching.
   - `p?: Array<string>` - A comma-separated list of product codes. We will only return items with the corresponding codes.
   - `agr?: Array<number>` - A comma-separated list of customer agreement IDs; we will only return items covered by any of these agreements. The agreemens must belong to the current user.
   - `tr?: "h" | "d" | "w" | "m" | "y"` - Time range: last hour, day, week, month, or year.

   - `trs?: string` - Start date
   - `tre?: string` - End date
   - `s?: number` - Size of search result.
   - `fr?: number` - Index into the search result. Used for pagination.

#### Returns
{:.no_toc}
 * `Promise<{
    'hits': Array<ttninjs>;}>`

### stream(mediaType, parameters)

Realtime delivery of content.

Long poll call that will wait for a specified time period (default: 60s, max 300s) until a matching item is published. The parameters are similar to those for `search`, with the exception that time ranges and pagination doesn't make sense in this context (we will always return the most recent item).

#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`
 * parameters:
   - `q?: string` - A query string used for free text searching.
   - `p?: Array<string>` - A comma-separated list of product codes. We will only return items with the corresponding codes.
   - `agr?: Array<number>` - A comma-separated list of customer agreement IDs; we will only return items covered by any of these agreements. The agreemens must belong to the current user.
   - `last?: string` - The uri of the last item received.
   - `wait?: number` - The time (in seconds) to wait for updates before returning an empty result.

#### Returns
{:.no_toc}
 * `Promise<{
    'hits': Array<ttninjs>;}>`

### notification(mediaType)

List all notifications



#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`

#### Returns
{:.no_toc}
 * `Promise<Array<notification>>`

### addNotificationMobile(mediaType, parameters)

Create a new mobile notification



#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`
 * parameters:
   - `q?: string` - A query string used for free text searching.
   - `p?: Array<string>` - A comma-separated list of product codes. We will only return items with the corresponding codes.
   - `agr?: Array<number>` - A comma-separated list of customer agreement IDs; we will only return items covered by any of these agreements. The agreemens must belong to the current user.
   - `title: string` - 

#### Returns
{:.no_toc}
 * `Promise<notification>`

### addNotificationEmail(mediaType, parameters)

Create a new email notification



#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`
 * parameters:
   - `q?: string` - A query string used for free text searching.
   - `p?: Array<string>` - A comma-separated list of product codes. We will only return items with the corresponding codes.
   - `agr?: Array<number>` - A comma-separated list of customer agreement IDs; we will only return items covered by any of these agreements. The agreemens must belong to the current user.
   - `title: string` - 
   - `email: string` - The email address to send emails to.

#### Returns
{:.no_toc}
 * `Promise<notification>`

### removeNotification(mediaType, id)

Remove an existing notification



#### Arguments
{:.no_toc}
 * mediaType: `"_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar"`
 * id: `string`

#### Returns
{:.no_toc}
 * `Promise<string>`


## UserV1

### agreement()

Get the current customer agreements.

Return a list of applicable customer agreements for the current user.

#### Arguments
{:.no_toc}

#### Returns
{:.no_toc}
 * `Promise<Array<agreement>>`

### profile()

Get the profile for the current user.

The user profile is an unstructured JSON object containing non-secret application data (settings and such). Web applications are free to access this information as they see fit.

#### Arguments
{:.no_toc}

#### Returns
{:.no_toc}
 * `Promise<{
}>`

### updateProfile(profile)

Update the profile for the current user.

Replaces the entire user profile with the object passed in the request body.

For more controlled updates of the user profile, use the `PUT /user/v1/profile/{property}` endpoint.

#### Arguments
{:.no_toc}
 * profile?: `{
}`

#### Returns
{:.no_toc}
 * `Promise<string>`

### profileByProperty(property)

Get selected properties of the profile for the current user.

The user profile is an unstructured JSON object containing non-secret application data (settings and such). Web applications are free to access this information as they see fit. <p/> Often, applications are not interested in the whole user profile. This endpoint returns only selected properties.

#### Arguments
{:.no_toc}
 * property: `Array<string>`

#### Returns
{:.no_toc}
 * `Promise<{
}>`

### updateProfileByProperty(property, profile)

Update selected properties of the profile for the current user.

Replaces selected properties, but doesn't modify the rest of the user profile. This is a more controlled version of the `PUT /user/v1/profile` endpoint.

Given a `profile` object like

    {
        "property1": { ... },
        "property2": { ... },
        ...
    }

and a `property` parameter like `property1,property2`, this endpoint will update the given properties, but leave the rest of the user profile intact.
Properties present in `profile` but not listed in `property` will not be written. Conversely, properties listed in `property` but not present in `profile` will not be overwritten with `null`.

#### Arguments
{:.no_toc}
 * property: `Array<string>`
 * profile?: `{
}`

#### Returns
{:.no_toc}
 * `Promise<string>`

### updateDevice(token, parameters)

Register a new mobile device.



#### Arguments
{:.no_toc}
 * token: `string`
 * parameters:
   - `type: "ios" | "ios-sandbox" | "android"` - The type of device:
  * `ios` (for the production environment)
  * `ios-sandbox` (for the APN sandbox)
  * `android`
   - `name?: string` - 
   - `model: string` - 

#### Returns
{:.no_toc}
 * `Promise<string>`

### removeDevice(token)

Unregister a mobile device.



#### Arguments
{:.no_toc}
 * token: `string`

#### Returns
{:.no_toc}
 * `Promise<string>`


## CollectionV1

### collection()

List all collections

Returns a list of all collections belonging to the current user.

#### Arguments
{:.no_toc}

#### Returns
{:.no_toc}
 * `Promise<Array<collection>>`

### addCollection(collection)

Create a new collection.

Creates an new named collection for the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.

#### Arguments
{:.no_toc}
 * collection: `{
    'name': string;}`

#### Returns
{:.no_toc}
 * `Promise<collection>`

### collectionById(id)

Get collection properties and contents

Returns all properties and contents of a single collection.

#### Arguments
{:.no_toc}
 * id: `string`

#### Returns
{:.no_toc}
 * `Promise<collectionItem>`

### updateCollection(id, collection)

Update collection properties

Updates an existing collection belonging to the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.

#### Arguments
{:.no_toc}
 * id: `string`
 * collection: `{
    'name': string;}`

#### Returns
{:.no_toc}
 * `Promise<collection>`

### removeCollection(id)

Remove an existing collection

Removes an existing collection belonging to the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.

#### Arguments
{:.no_toc}
 * id: `string`

#### Returns
{:.no_toc}
 * `Promise<string>`

### addCollectionItems(id, items)

Add items to collection

Adds any number of items to a given collection belonging to the current user. The items must exist in the content database and be visible for the user. If not, this call will still return successfully, but the collection remain unchanged.
This operation is asynchronous, and there may be a delay before changes are visible using the `GET /collection/v1/collection/{id}` endpoint.

#### Arguments
{:.no_toc}
 * id: `string`
 * items: `Array<{
    'uri': string;}>`

#### Returns
{:.no_toc}
 * `Promise<string>`

### removeCollectionItems(id, items)

Remove items from collection

Removes any number of items from a given collection belonging to the current user. If one or more items do not currently belong to the collection, this call will still return successfully, but those items will be ignored.
This operation is asynchronous, and there may be a delay before changes are visible using the `GET /collection/v1/collection/{id}` endpoint.

#### Arguments
{:.no_toc}
 * id: `string`
 * items: `Array<{
    'uri': string;}>`

#### Returns
{:.no_toc}
 * `Promise<string>`


