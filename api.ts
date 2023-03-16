import { ApiBase } from './runtime'

  
  export interface ttninjs {
    'uri': string;    'type'?: "text" | "audio" | "video" | "picture" | "graphic" | "composite" | "planning" | "component" | "event";    'mimetype'?: string;    'representationtype'?: "complete" | "incomplete" | "associated";    'profile'?: "PUBL" | "DATA" | "INFO" | "RAW";    'version'?: string;    'firstcreated'?: string;    'versioncreated'?: string;    'versionstored'?: string;    'embargoed'?: string;    'embargoedreason'?: string;    'date'?: string;    'datetime'?: string;    'enddate'?: string;    'enddatetime'?: string;    'job'?: string;    'pubstatus'?: "usable" | "withheld" | "canceled" | "replaced" | "commissioned";    'urgency'?: number;    'copyrightholder'?: string;    'copyrightnotice'?: string;    'usageterms'?: string;    'ednote'?: string;    'language'?: string;    'week'?: number;    'webprio'?: number;    'source'?: string;    'commissioncode'?: string;    'description_text'?: string;    'description_usage'?: string;    'body_text'?: string;    'body_html5'?: string;    'body_richhtml5'?: string;    'body_event'?: {
    'arena'?: string;    'city'?: string;    'address'?: string;    'country'?: string;    'eventurl'?: string;    'eventphone'?: string;    'eventweb'?: string;    'organizer'?: string;    'organizeraddress'?: string;    'organizercity'?: string;    'organizercountry'?: string;    'organizerurl'?: string;    'organizerphone'?: string;    'organizermail'?: string;    'eventstatus'?: string;    'eventstatus_text'?: string;    'region'?: string;    'region_text'?: string;    'municipality'?: string;    'municipality_text'?: string;    'eventtags'?: string;    'eventtype'?: string;    'eventtype_text'?: string;    'note_extra'?: string;    'note_pm'?: string;    'accreditation'?: string;    'extraurl'?: string;    'createddate'?: string;    'createdby'?: string;    'changeddate'?: string;    'changedby'?: string;    'courtcasenumber'?: string;};    'body_sportsml'?: string;    'body_pages'?: {
};    'commissionedby'?: Array<string>;    'person'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'organisation'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;    'symbols'?: Array<{
    'ticker'?: string;    'exchange'?: string;}>;}>;    'place'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;    'geometry_geojson'?: {
    'type'?: "Point";    'coordinates'?: Array<number>;};}>;    'subject'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'event'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'object'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'infosource'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'title'?: string;    'byline'?: string;    'bylines'?: Array<{
    'byline'?: string;    'firstname'?: string;    'lastname'?: string;    'role'?: string;    'email'?: string;    'jobtitle'?: string;    'internal'?: string;    'phone'?: string;    'initials'?: string;    'affiliation'?: string;}>;    'headline'?: string;    'slug'?: string;    'slugline'?: string;    'located'?: string;    'charcount'?: number;    'wordcount'?: number;    'renditions'?: {
};    'associations'?: {
};    'altids'?: {
    'originaltransmissionreference'?: string;};    'originaltransmissionreference'?: string;    'trustindicator'?: Array<{
    'scheme'?: string;    'code'?: string;    'title'?: string;    'href'?: string;}>;    '$standard'?: {
    'name'?: string;    'version'?: string;    'schema'?: string;};    'genre'?: Array<{
    'name'?: string;    'scheme'?: string;    'code'?: string;}>;    'signals'?: {
    'pageproduct'?: string;    'multipagecount'?: number;    'paginae'?: Array<string>;    'pagecode'?: string;    'pagevariant'?: string;};    'product'?: Array<{
    'name'?: string;    'scheme'?: string;    'code'?: string;}>;    'replacing'?: Array<string>;    'replacedby'?: string;    'assignments'?: {
};    'revisions'?: Array<{
    'uri': string;    'slug'?: string;    'replacing'?: Array<string>;}>;    'sector'?: "INR" | "UTR" | "EKO" | "KLT" | "SPT" | "FEA" | "NOJ" | "PRM";    'fixture'?: Array<{
    'name'?: string;    'rel'?: string;    'scheme'?: string;    'code'?: string;}>;    'advice'?: Array<{
    'role'?: "publish";    'environment'?: Array<{
    'code'?: string;    'scheme'?: string;}>;    'importance'?: {
    'code'?: string;    'scheme'?: string;};    'lifetime'?: {
    'code'?: string;    'scheme'?: string;};}>;}
  ;
  
  export interface address {
    'street'?: string;    'box'?: string;    'zipCode'?: string;    'city'?: string;    'country'?: string;}
  ;
  
  export interface agreement {
    'id'?: number;    'description'?: {
};    'type'?: "Subscription" | "Direct" | "Normal" | "Sketch";    'isSuperAgreement'?: boolean;    'products'?: Array<product>;}
  ;
  
  export interface agreement2 {
    'id': number;    'name'?: string;    'type': agreementType;    'description'?: string;    'expires'?: string;    'superAgreement': boolean;    'products': Array<product2>;}
  ;
  export type agreementType = "Subscription" | "Direct" | "Normal"
  
  ;
  
  export interface collection {
    'accessed': string;    'content': Array<string>;    'removedContent'?: Array<{
    'uri'?: string;    'headline'?: string;    'description_text'?: string;    'timestamp'?: string;}>;    'created': string;    'id': string;    'modified'?: string;    'name': string;    'owner': string;    'public': boolean;}
  ;
  
  export interface collectionItem {
    'accessed': string;    'content': Array<string>;    'removedContent'?: Array<{
    'uri'?: string;    'headline'?: string;    'description_text'?: string;    'timestamp'?: string;}>;    'created': string;    'id': string;    'modified'?: string;    'name': string;    'owner': string;    'public': boolean;    'items': Array<ttninjs>;}
  ;
  
  export interface facet {
    'key'?: string;    'count'?: number;}
  ;
  
  export interface license {
    'uuid'?: string;    'period'?: "Year" | "Month" | "Single";    'volume'?: string;    'price'?: monetaryAmount;    'description'?: string;    'product': product;}
  ;
  
  export interface monetaryAmount string
  ;
  
  export interface order {
    'item': {
    'uri'?: string;    'headline'?: string;    'byline'?: string;    'source'?: string;};    'price': {
    'name': string;    'description'?: string;    'license': license;    'agreement': {
    'id': number;    'name'?: string;    'type': agreementType;};};    'invoiceText'?: string;    'created': string;    'downloadableUntil': string;    'reportingDeadline'?: string;}
  ;
  
  export interface notification {
    'id': string;    'title': string;    'type': "mobile" | "email" | "scheduled-email";    'mediaType': "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar";    'q'?: string;    'p'?: Array<string>;    'agr'?: Array<number>;    'schedule'?: string;    'timezone'?: string;    'email'?: string;}
  ;
  
  export interface organization {
    'id': number;    'name'?: string;    'currency'?: string;    'country'?: string;    'address': {
    'visit'?: address;    'postal'?: address;    'billing'?: address;};    'phoneNumber': phoneNumberDirect;}
  ;
  
  export interface phoneNumber {
    'direct'?: string;    'mobile'?: string;}
  ;
  
  export interface phoneNumberDirect {
    'direct'?: string;}
  ;
  
  export interface product {
    'name'?: string;    'description'?: {
};    'code'?: string;}
  ;
  
  export interface product2 {
    'id': number;    'name'?: string;    'description'?: string;    'code': string;}
  ;
  
  export interface user {
    'id': number;    'customerId'?: number;    'userName': string;    'firstName'?: string;    'lastName'?: string;    'emailAddress'?: string;    'department'?: string;    'phoneNumber': phoneNumber;    'agreements': Array<agreement2>;}
  ;

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
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} tr - Time range: last hour, day, week, month, or year.
    * @param {string} trs - Start date
    * @param {string} tre - End date
    * @param {array} pubstatus - 
    * @param {integer} s - Size of search result.
    * @param {integer} fr - Index into the search result. Used for pagination. It is recommended to make this value a multiple of the search result size (`s`), as some media types do not support arbitrary values here.
    * @param {string} sort - Sort order for the result. Documentation on various date fields can be found [here](http://spec.tt.se/dates).
  * default:desc / default:asc - Sort on the internal field '_tstamp' in descending or ascending order respectively.
  * date:desc / date:asc - Sort on the field 'date' in descending or ascending order respectively.
  * versioncreated:desc / versioncreated:asc - Sort on the field 'versioncreated' in descending or ascending order respectively.
  * versionstored:desc / versionstored:asc - Sort on the field 'versionstored' in descending or ascending order respectively.
  * relevance - Sort on relevance. The most relevant matches first.
    * @param {array} facets - Enable search facets; in addition to the regular search result the API will also return one or more additional facets which contain information about how many search results can be expected if the current query is narrowed down using popular subject codes, product codes, etc.
    * @param {string} layout - By default the full TTNinjs document is returned for each search hit. This may be too cumbersome for some use cases; for example when the client requests a large search result to be displayed in a list form.
This parameter allows the client to control the layout of the items in the search result:
* full - (default) return the full TTNinjs document
* bare - return only `headline`, `date`, `uri`, `renditions`, `associations`, `pubstatus`, `originaltransmissionreference`, `copyrightholder`. In addition, all `associations` except the first are stripped away, and `renditions` will only contain the thumbnail rendition.
    */
    search (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar" | "stockfoto",
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        tr?: "h" | "d" | "w" | "m" | "y",
        trs?: string,
        tre?: string,
        pubstatus?: Array<"usable" | "replaced">,
        s?: number,
        fr?: number,
        sort?: "default:desc" | "default:asc" | "date:desc" | "date:asc" | "versioncreated:desc" | "versioncreated:asc" | "versionstored:desc" | "versionstored:asc" | "relevance",
        facets?: Array<"copyrightholder" | "person.name" | "place.name" | "product.code" | "subject.code">,
        layout?: "bare" | "full",
      },
    ): Promise<
{
    'hits': Array<ttninjs>;    'total': number;    'facets'?: {
    'subject.code'?: Array<facet>;    'product.code'?: Array<facet>;    'place.name'?: Array<facet>;    'person.name'?: Array<facet>;    'copyrightholder'?: Array<facet>;};}    > {
    let path = `/content/v1/${mediaType}/search`
    return super.call('get', path,
      parameters
,
      undefined
    , {
    })
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
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} sort - Sort order for the result. Documentation on various date fields can be found [here](http://spec.tt.se/dates).
  * default:desc / default:asc - Sort on the internal field '_tstamp' in descending or ascending order respectively.
  * date:desc / date:asc - Sort on the field 'date' in descending or ascending order respectively.
  * versioncreated:desc / versioncreated:asc - Sort on the field 'versioncreated' in descending or ascending order respectively.
  * versionstored:desc / versionstored:asc - Sort on the field 'versionstored' in descending or ascending order respectively.
  * relevance - Sort on relevance. The most relevant matches first.
    * @param {string} layout - By default the full TTNinjs document is returned for each search hit. This may be too cumbersome for some use cases; for example when the client requests a large search result to be displayed in a list form.
This parameter allows the client to control the layout of the items in the search result:
* full - (default) return the full TTNinjs document
* bare - return only `headline`, `date`, `uri`, `renditions`, `associations`, `pubstatus`, `originaltransmissionreference`, `copyrightholder`. In addition, all `associations` except the first are stripped away, and `renditions` will only contain the thumbnail rendition.
    * @param {string} last - The uri of the last item received.
    * @param {integer} wait - The time (in seconds) to wait for updates before returning an empty result.
    */
    stream (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        sort?: "default:desc" | "default:asc" | "date:desc" | "date:asc" | "versioncreated:desc" | "versioncreated:asc" | "versionstored:desc" | "versionstored:asc" | "relevance",
        layout?: "bare" | "full",
        last?: string,
        wait?: number,
      },
    ): Promise<
{
    'hits': Array<ttninjs>;}    > {
    let path = `/content/v1/${mediaType}/stream`
    return super.call('get', path,
      parameters
,
      undefined
    , {
      timeout: parameters.wait ? parameters.wait * 1000 + 5000 : 60 * 1000 + 5000
    })
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
    getNotifications (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
    ): Promise<
Array<notification>    > {
    let path = `/content/v1/${mediaType}/notification`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} title - 
    */
    addNotificationMobile (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        title: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/mobile`
    return super.call('post', path,
      parameters
,
      undefined
    , {
    })
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
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} title - 
    * @param {string} email - The email address to send emails to.
    */
    addNotificationEmail (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        title: string,
        email: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/email`
    return super.call('post', path,
      parameters
,
      undefined
    , {
    })
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
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} tr - Time range: last hour, day, week, month, or year.
    * @param {string} title - 
    * @param {string} email - The email address to send emails to.
    * @param {string} schedule - A cron expression.
    * @param {string} timezone - A valid time zone name
    */
    addNotificationScheduledEmail (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        tr?: "h" | "d" | "w" | "m" | "y",
        title: string,
        email: string,
        schedule: string,
        timezone?: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/scheduled-email`
    return super.call('post', path,
      parameters
,
      undefined
    , {
    })
    }
    /**
    * Update an existing mobile notification
    *
    * 
    *
    * @method
    * @name ContentV1#updateNotificationMobile
    * @param {string} mediaType - Only return items of this media type.
    * @param {string} id - An notification UUID string.
    * @param {string} q - A query string used for free text searching.
    * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} title - 
    */
    updateNotificationMobile (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      id: string,
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        title: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/${id}/mobile`
    return super.call('put', path,
      parameters
,
      undefined
    , {
    })
    }
    /**
    * Update an existing email notification
    *
    * 
    *
    * @method
    * @name ContentV1#updateNotificationEmail
    * @param {string} mediaType - Only return items of this media type.
    * @param {string} id - An notification UUID string.
    * @param {string} q - A query string used for free text searching.
    * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} title - 
    * @param {string} email - The email address to send emails to.
    */
    updateNotificationEmail (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      id: string,
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        title: string,
        email: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/${id}/email`
    return super.call('put', path,
      parameters
,
      undefined
    , {
    })
    }
    /**
    * Update an existing scheduled email notification
    *
    * 
    *
    * @method
    * @name ContentV1#updateNotificationScheduledEmail
    * @param {string} mediaType - Only return items of this media type.
    * @param {string} id - An notification UUID string.
    * @param {string} q - A query string used for free text searching.
    * @param {array} p - A list of product codes. Only items matching at least one of these codes will be returned. The list of current product codes is [here](https://tt.se/spec/product/1.0).
Individual product codes may be prefixed with a '-' sign, indicating that the code should instead be excluded from the search result.
    * @param {array} agr - A list of customer agreement IDs belonging to the current user. Only items covered by at least one of there agreements will be returned.
    * @param {string} tr - Time range: last hour, day, week, month, or year.
    * @param {string} title - 
    * @param {string} email - The email address to send emails to.
    * @param {string} schedule - A cron expression.
    * @param {string} timezone - A valid time zone name
    */
    updateNotificationScheduledEmail (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      id: string,
      parameters: {
        q?: string,
        p?: Array<string>,
        agr?: Array<number>,
        tr?: "h" | "d" | "w" | "m" | "y",
        title: string,
        email: string,
        schedule: string,
        timezone?: string,
      },
    ): Promise<
notification    > {
    let path = `/content/v1/${mediaType}/notification/${id}/scheduled-email`
    return super.call('put', path,
      parameters
,
      undefined
    , {
    })
    }
    /**
    * Remove an existing notification
    *
    * 
    *
    * @method
    * @name ContentV1#removeNotification
    * @param {string} mediaType - Only return items of this media type.
    * @param {string} id - An notification UUID string.
    */
    removeNotification (
      mediaType: "_all" | "image" | "video" | "graphic" | "text" | "feature" | "page" | "planning" | "calendar",
      id: string,
    ): Promise<
string    > {
    let path = `/content/v1/${mediaType}/notification/${id}`
    return super.call('delete', path,
      undefined
    ,
      undefined
    , {
    })
    }
  }
  class UserV1 extends ApiBase {

    /**
    * Get the current customer agreements.
    *
    * Return a list of applicable customer agreements for the current user. An agreement that has a truthy value of isSuperAgreement will override any agreement of Subscription type.

*DEPRECATED*: This endpoint has been deprecated in favor of `/user/v1/user`
    *
    * @method
    * @name UserV1#getAgreements
    */
    getAgreements (
    ): Promise<
Array<agreement>    > {
    let path = `/user/v1/agreement`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
    }
    /**
    * Get the order/license history for the current user. If the user has customer admin privileges, include all orders for the whole organization.
    *
    * 
    *
    * @method
    * @name UserV1#getOrder
    * @param {number} size - 
    * @param {number} start - 
    */
    getOrder (
      parameters: {
        size?: number,
        start?: number,
      },
    ): Promise<
{
    'orders'?: Array<order>;}    > {
    let path = `/user/v1/order`
    return super.call('get', path,
      parameters
,
      undefined
    , {
    })
    }
    /**
    * Get the profile for the current user.
    *
    * The user profile is an unstructured JSON object containing non-secret application data (settings and such). Web applications are free to access this information as they see fit.
    *
    * @method
    * @name UserV1#getProfile
    */
    getProfile (
    ): Promise<
{
}    > {
    let path = `/user/v1/profile`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
    updateProfile (
      profile?: {
},
    ): Promise<
string    > {
    let path = `/user/v1/profile`
    return super.call('put', path,
      undefined
    ,
        profile
    , {
    })
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
    getProfileByProperty (
      property: Array<string>,
    ): Promise<
{
}    > {
    let path = `/user/v1/profile/${property}`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
    updateProfileByProperty (
      property: Array<string>,
      profile?: {
},
    ): Promise<
string    > {
    let path = `/user/v1/profile/${property}`
    return super.call('put', path,
      undefined
    ,
        profile
    , {
    })
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
    updateDevice (
      token: string,
      parameters: {
        type: "ios" | "ios-sandbox" | "android",
        name?: string,
        model: string,
      },
    ): Promise<
string    > {
    let path = `/user/v1/device/${token}`
    return super.call('put', path,
      parameters
,
      undefined
    , {
    })
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
    removeDevice (
      token: string,
    ): Promise<
string    > {
    let path = `/user/v1/device/${token}`
    return super.call('delete', path,
      undefined
    ,
      undefined
    , {
    })
    }
    /**
    * Get information about the organization that the current user belongs to.

    *
    * 
    *
    * @method
    * @name UserV1#getOrganization
    */
    getOrganization (
    ): Promise<
organization    > {
    let path = `/user/v1/organization`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
    }
    /**
    * Get information about the current user.
    *
    * 
    *
    * @method
    * @name UserV1#getUser
    */
    getUser (
    ): Promise<
user    > {
    let path = `/user/v1/user`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
    getCollections (
    ): Promise<
Array<collection>    > {
    let path = `/collection/v1/collection`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
    addCollection (
      collection: {
    'name': string;    'public'?: boolean;},
    ): Promise<
collection    > {
    let path = `/collection/v1/collection`
    return super.call('post', path,
      undefined
    ,
        collection
    , {
    })
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
    getCollection (
      id: string,
    ): Promise<
collectionItem    > {
    let path = `/collection/v1/collection/${id}`
    return super.call('get', path,
      undefined
    ,
      undefined
    , {
    })
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
    updateCollection (
      id: string,
      collection: {
    'name': string;    'public'?: boolean;},
    ): Promise<
collection    > {
    let path = `/collection/v1/collection/${id}`
    return super.call('put', path,
      undefined
    ,
        collection
    , {
    })
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
    removeCollection (
      id: string,
    ): Promise<
string    > {
    let path = `/collection/v1/collection/${id}`
    return super.call('delete', path,
      undefined
    ,
      undefined
    , {
    })
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
    addCollectionItems (
      id: string,
      items: Array<{
    'uri': string;}>,
    ): Promise<
string    > {
    let path = `/collection/v1/collection/${id}/items`
    return super.call('post', path,
      undefined
    ,
        items
    , {
    })
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
    removeCollectionItems (
      id: string,
      items: Array<{
    'uri': string;}>,
    ): Promise<
string    > {
    let path = `/collection/v1/collection/${id}/items`
    return super.call('delete', path,
      undefined
    ,
        items
    , {
    })
    }
  }

export class Api {

  content: ContentV1
  user: UserV1
  collection: CollectionV1

/**
* @param {object} options
* + token - OAuth2 token
* + host - API endpoint to connect to. The default is https://api.tt.se
* + timeout - HTTP timeout in ms. The default is 1000ms. Note that the `content.stream()` method will ignore this and always use timeout based on the `wait` parameter.
*/
constructor(options: { token?: string, host? :string, timeout?: number }) {
  this.content = new ContentV1({ host: 'https://api.tt.se', timeout: 1000, ...options })
  this.user = new UserV1({ host: 'https://api.tt.se', timeout: 1000, ...options })
  this.collection = new CollectionV1({ host: 'https://api.tt.se', timeout: 1000, ...options })
}

}
