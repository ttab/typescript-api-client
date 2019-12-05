import { ApiBase } from './runtime'

export interface ttninjs {
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
  copyrightholder?: string
  copyrightnotice?: string
  language?: string
  week?: number
  urgency?: number
  webprio?: number
  source?: string
  commissioncode?: string
  description_text?: string
  description_usage?: string
  usageterms?: string
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
  charcount?: number
  originaltransmissionreference?: string
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
    geometry_geojson?: {}
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
  located?: string
  renditions?: {}
  replacing?: Array<string>
  replacedby?: string
  associations?: {}
  assignments?: {}
  revisions?: Array<{
    uri: string
    slug?: string
    replacing?: Array<string>
  }>
  sector?: 'INR' | 'UTR' | 'EKO' | 'KLT' | 'SPT' | 'PRM'
  fixture?: Array<{
    name?: string
    rel?: string
    scheme?: string
    code?: string
  }>
  advice?: {
    lifetime?: {
      period?: string
      enddatetime?: string
    }
  }
}

export interface agreement {
  id?: number
  description?: {}
  type?: 'Subscription' | 'Direct' | 'Normal' | 'Sketch'
  products?: Array<product>
}

export interface collection {
  id: string
  owner: string
  name: string
  colldate: string
}

export interface collectionItem {
  id: string
  owner: string
  name: string
  colldate: string
  items: Array<ttninjs>
}

export interface product {
  name?: string
  description?: {}
  code?: string
}

export interface notification {
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
}

class ContentV1 extends ApiBase {
  /**
   * Searching the TT archives.
   *
   *
   *
   * @method
   * @name ContentV1#search
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} q - A query string used for free text searching.
   * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
   * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
   * @param {string} tr - Time range: last hour, day, week, month, or year.
   * @param {string} trs - Start date
   * @param {string} tre - End date
   * @param {integer} s - Size of search result.
   * @param {integer} fr - Index into the search result. Used for pagination. It is recommended to make this value a multiple of the search result size (`s`), as some media types do not support arbitrary values here.
   * @param {string} sort - Sort order for the result. Documentation on various date fields can be found [here](http://spec.tt.se/dates).
   * default:desc / default:asc - Sort on the internal field '_tstamp' in descending or ascending order respectively.
   * date:desc / date:asc - Sort on the field 'date' in descending or ascending order respectively.
   * versioncreated:desc / versioncreated:asc - Sort on the field 'versioncreated' in descending or ascending order respectively.
   * versionstored:desc / versionstored:asc - Sort on the field 'versionstored' in descending or ascending order respectively.
   * relevance - Sort on relevance. The most relevant matches first.
   */
  search(
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
      | 'stockfoto',
    parameters: {
      q?: string
      p?: Array<string>
      agr?: Array<number>
      tr?: 'h' | 'd' | 'w' | 'm' | 'y'
      trs?: string
      tre?: string
      s?: number
      fr?: number
      sort?:
        | 'default:desc'
        | 'default:asc'
        | 'date:desc'
        | 'date:asc'
        | 'versioncreated:desc'
        | 'versioncreated:asc'
        | 'versionstored:desc'
        | 'versionstored:asc'
        | 'relevance'
    }
  ): Promise<{
    hits: Array<ttninjs>
  }> {
    let path = `/content/v1/${mediaType}/search`
    return super.call('get', path, parameters, undefined)
  }
  /**
   * Realtime delivery of content.
   *
   * Long poll call that will wait for a specified time period (default: 60s, max 300s) until a matching item is published. The parameters are similar to those for `search`, with the exception that time ranges and pagination doesn't make sense in this context (we will always return the most recent item).
   *
   * @method
   * @name ContentV1#stream
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} q - A query string used for free text searching.
   * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
   * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
   * @param {string} sort - Sort order for the result. Documentation on various date fields can be found [here](http://spec.tt.se/dates).
   * default:desc / default:asc - Sort on the internal field '_tstamp' in descending or ascending order respectively.
   * date:desc / date:asc - Sort on the field 'date' in descending or ascending order respectively.
   * versioncreated:desc / versioncreated:asc - Sort on the field 'versioncreated' in descending or ascending order respectively.
   * versionstored:desc / versionstored:asc - Sort on the field 'versionstored' in descending or ascending order respectively.
   * relevance - Sort on relevance. The most relevant matches first.
   * @param {string} last - The uri of the last item received.
   * @param {integer} wait - The time (in seconds) to wait for updates before returning an empty result.
   */
  stream(
    mediaType:
      | '_all'
      | 'image'
      | 'video'
      | 'graphic'
      | 'text'
      | 'feature'
      | 'page'
      | 'planning'
      | 'calendar',
    parameters: {
      q?: string
      p?: Array<string>
      agr?: Array<number>
      sort?:
        | 'default:desc'
        | 'default:asc'
        | 'date:desc'
        | 'date:asc'
        | 'versioncreated:desc'
        | 'versioncreated:asc'
        | 'versionstored:desc'
        | 'versionstored:asc'
        | 'relevance'
      last?: string
      wait?: number
    }
  ): Promise<{
    hits: Array<ttninjs>
  }> {
    let path = `/content/v1/${mediaType}/stream`
    return super.call('get', path, parameters, undefined)
  }
  /**
   * List all notifications
   *
   *
   *
   * @method
   * @name ContentV1#getNotifications
   * @param {string} mediaType - Only return items of this media type.
   */
  getNotifications(
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
  ): Promise<Array<notification>> {
    let path = `/content/v1/${mediaType}/notification`
    return super.call('get', path, undefined, undefined)
  }
  /**
   * Create a new mobile notification
   *
   *
   *
   * @method
   * @name ContentV1#addNotificationMobile
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} q - A query string used for free text searching.
   * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
   * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
   * @param {string} title -
   */
  addNotificationMobile(
    mediaType:
      | '_all'
      | 'image'
      | 'video'
      | 'graphic'
      | 'text'
      | 'feature'
      | 'page'
      | 'planning'
      | 'calendar',
    parameters: {
      q?: string
      p?: Array<string>
      agr?: Array<number>
      title: string
    }
  ): Promise<notification> {
    let path = `/content/v1/${mediaType}/notification/mobile`
    return super.call('post', path, parameters, undefined)
  }
  /**
   * Create a new email notification
   *
   *
   *
   * @method
   * @name ContentV1#addNotificationEmail
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} q - A query string used for free text searching.
   * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
   * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
   * @param {string} title -
   * @param {string} email - The email address to send emails to.
   */
  addNotificationEmail(
    mediaType:
      | '_all'
      | 'image'
      | 'video'
      | 'graphic'
      | 'text'
      | 'feature'
      | 'page'
      | 'planning'
      | 'calendar',
    parameters: {
      q?: string
      p?: Array<string>
      agr?: Array<number>
      title: string
      email: string
    }
  ): Promise<notification> {
    let path = `/content/v1/${mediaType}/notification/email`
    return super.call('post', path, parameters, undefined)
  }
  /**
   * Create a new scheduled email notification
   *
   *
   *
   * @method
   * @name ContentV1#addNotificationScheduledEmail
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} q - A query string used for free text searching.
   * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
   * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
   * @param {string} tr - Time range: last hour, day, week, month, or year.
   * @param {string} title -
   * @param {string} email - The email address to send emails to.
   * @param {string} schedule - A cron expression.
   */
  addNotificationScheduledEmail(
    mediaType:
      | '_all'
      | 'image'
      | 'video'
      | 'graphic'
      | 'text'
      | 'feature'
      | 'page'
      | 'planning'
      | 'calendar',
    parameters: {
      q?: string
      p?: Array<string>
      agr?: Array<number>
      tr?: 'h' | 'd' | 'w' | 'm' | 'y'
      title: string
      email: string
      schedule: string
    }
  ): Promise<notification> {
    let path = `/content/v1/${mediaType}/notification/scheduled-email`
    return super.call('post', path, parameters, undefined)
  }
  /**
   * Remove an existing notification
   *
   *
   *
   * @method
   * @name ContentV1#removeNotification
   * @param {string} mediaType - Only return items of this media type.
   * @param {string} id - An UUID string.
   */
  removeNotification(
    mediaType:
      | '_all'
      | 'image'
      | 'video'
      | 'graphic'
      | 'text'
      | 'feature'
      | 'page'
      | 'planning'
      | 'calendar',
    id: string
  ): Promise<string> {
    let path = `/content/v1/${mediaType}/notification/${id}`
    return super.call('delete', path, undefined, undefined)
  }
}
class UserV1 extends ApiBase {
  /**
   * Get the current customer agreements.
   *
   * Return a list of applicable customer agreements for the current user.
   *
   * @method
   * @name UserV1#getAgreements
   */
  getAgreements(): Promise<Array<agreement>> {
    let path = `/user/v1/agreement`
    return super.call('get', path, undefined, undefined)
  }
  /**
   * Get the profile for the current user.
   *
   * The user profile is an unstructured JSON object containing non-secret application data (settings and such). Web applications are free to access this information as they see fit.
   *
   * @method
   * @name UserV1#getProfile
   */
  getProfile(): Promise<{}> {
    let path = `/user/v1/profile`
    return super.call('get', path, undefined, undefined)
  }
  /**
    * Update the profile for the current user.
    *
    * Replaces the entire user profile with the object passed in the request body.

For more controlled updates of the user profile, use the `PUT /user/v1/profile/{property}` endpoint.
    *
    * @method
    * @name UserV1#updateProfile
    * @param {} profile - 
    */
  updateProfile(profile?: {}): Promise<string> {
    let path = `/user/v1/profile`
    return super.call('put', path, undefined, profile)
  }
  /**
    * Get selected properties of the profile for the current user.
    *
    * The user profile is an unstructured JSON object containing non-secret application data (settings and such). Web applications are free to access this information as they see fit.
Often, applications are not interested in the whole user profile. This endpoint returns only selected properties.
    *
    * @method
    * @name UserV1#getProfileByProperty
    * @param {array} property - A list of property names.
    */
  getProfileByProperty(property: Array<string>): Promise<{}> {
    let path = `/user/v1/profile/${property}`
    return super.call('get', path, undefined, undefined)
  }
  /**
    * Update selected properties of the profile for the current user.
    *
    * Replaces selected properties, but doesn't modify the rest of the user profile. This is a more controlled version of the `PUT /user/v1/profile` endpoint.

Given a `profile` object like

    {
        "property1": { ... },
        "property2": { ... },
        ...
    }

and a `property` parameter like `property1,property2`, this endpoint will update the given properties, but leave the rest of the user profile intact.
Properties present in `profile` but not listed in `property` will not be written. Conversely, properties listed in `property` but not present in `profile` will not be overwritten with `null`.
    *
    * @method
    * @name UserV1#updateProfileByProperty
    * @param {array} property - A list of property names.
    * @param {} profile - 
    */
  updateProfileByProperty(
    property: Array<string>,
    profile?: {}
  ): Promise<string> {
    let path = `/user/v1/profile/${property}`
    return super.call('put', path, undefined, profile)
  }
  /**
   * Register a new mobile device.
   *
   *
   *
   * @method
   * @name UserV1#updateDevice
   * @param {string} token -
   * @param {string} type - The type of device:
   * `ios` (for the production environment)
   * `ios-sandbox` (for the APN sandbox)
   * `android`
   * @param {string} name - The name of this mobile device.
   * @param {string} model - The model of this mobile device.
   */
  updateDevice(
    token: string,
    parameters: {
      type: 'ios' | 'ios-sandbox' | 'android'
      name?: string
      model: string
    }
  ): Promise<string> {
    let path = `/user/v1/device/${token}`
    return super.call('put', path, parameters, undefined)
  }
  /**
   * Unregister a mobile device.
   *
   *
   *
   * @method
   * @name UserV1#removeDevice
   * @param {string} token -
   */
  removeDevice(token: string): Promise<string> {
    let path = `/user/v1/device/${token}`
    return super.call('delete', path, undefined, undefined)
  }
}
class CollectionV1 extends ApiBase {
  /**
   * List all collections
   *
   * Returns a list of all collections belonging to the current user.
   *
   * @method
   * @name CollectionV1#getCollections
   */
  getCollections(): Promise<Array<collection>> {
    let path = `/collection/v1/collection`
    return super.call('get', path, undefined, undefined)
  }
  /**
   * Create a new collection.
   *
   * Creates an new named collection for the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.
   *
   * @method
   * @name CollectionV1#addCollection
   * @param {} collection -
   */
  addCollection(collection: { name: string }): Promise<collection> {
    let path = `/collection/v1/collection`
    return super.call('post', path, undefined, collection)
  }
  /**
   * Get collection properties and contents
   *
   * Returns all properties and contents of a single collection.
   *
   * @method
   * @name CollectionV1#getCollection
   * @param {string} id - ID of a collection.
   */
  getCollection(id: string): Promise<collectionItem> {
    let path = `/collection/v1/collection/${id}`
    return super.call('get', path, undefined, undefined)
  }
  /**
   * Update collection properties
   *
   * Updates an existing collection belonging to the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.
   *
   * @method
   * @name CollectionV1#updateCollection
   * @param {string} id - ID of a collection.
   * @param {} collection -
   */
  updateCollection(
    id: string,
    collection: {
      name: string
    }
  ): Promise<collection> {
    let path = `/collection/v1/collection/${id}`
    return super.call('put', path, undefined, collection)
  }
  /**
   * Remove an existing collection
   *
   * Removes an existing collection belonging to the current user. This operation is asynchronous, and there may be a delay before the change is visible using the `GET /collection/v1/collection` endpoint.
   *
   * @method
   * @name CollectionV1#removeCollection
   * @param {string} id - ID of a collection.
   */
  removeCollection(id: string): Promise<string> {
    let path = `/collection/v1/collection/${id}`
    return super.call('delete', path, undefined, undefined)
  }
  /**
    * Add items to collection
    *
    * Adds any number of items to a given collection belonging to the current user. The items must exist in the content database and be visible for the user. If not, this call will still return successfully, but the collection remain unchanged.
This operation is asynchronous, and there may be a delay before changes are visible using the `GET /collection/v1/collection/{id}` endpoint.
    *
    * @method
    * @name CollectionV1#addCollectionItems
    * @param {string} id - ID of a collection.
    * @param {} items - 
    */
  addCollectionItems(
    id: string,
    items: Array<{
      uri: string
    }>
  ): Promise<string> {
    let path = `/collection/v1/collection/${id}/items`
    return super.call('post', path, undefined, items)
  }
  /**
    * Remove items from collection
    *
    * Removes any number of items from a given collection belonging to the current user. If one or more items do not currently belong to the collection, this call will still return successfully, but those items will be ignored.
This operation is asynchronous, and there may be a delay before changes are visible using the `GET /collection/v1/collection/{id}` endpoint.
    *
    * @method
    * @name CollectionV1#removeCollectionItems
    * @param {string} id - ID of a collection.
    * @param {} items - 
    */
  removeCollectionItems(
    id: string,
    items: Array<{
      uri: string
    }>
  ): Promise<string> {
    let path = `/collection/v1/collection/${id}/items`
    return super.call('delete', path, undefined, items)
  }
}

export class Api {
  content: ContentV1
  user: UserV1
  collection: CollectionV1

  constructor(options: { token: string; host?: string }) {
    this.content = new ContentV1({ host: 'https://api.tt.se', ...options })
    this.user = new UserV1({ host: 'https://api.tt.se', ...options })
    this.collection = new CollectionV1({
      host: 'https://api.tt.se',
      ...options
    })
  }
}
