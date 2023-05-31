# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.7.0] - 2023-05-31
### Added
- Support for new endpoints for user management within the current user's
  organization. Requires the user to have the `admin` access level, and the
  OAuth2 token to have the `admin` scope.

## [2.6.0] - 2023-03-01
### Added
- Support new endpoints for accessing user and organization information.
### Changed
- The `ContentStream` class now uses an exponential backoff algorithm
  when retrying a request after errors are encountered. Errors from
  which the client is unlikely to recover (i.e. HTTP 4xx) now result
  in stream closure.
### Deprecated
- The `/user/v1/agreement` is being deprecated in favor of `/user/v1/user`

## [2.5.1] - 2021-09-03
### Added
- The `public` property was missing on the collection response object.

## [2.5.0] - 2021-09-01
### Added
- Support the `public` property on collections.

## [2.4.0] - 2021-06-02
### Changed
- Various dependency upgrades.
- The `agreement` definition now includes the `isSuperAgreement` property.
- The `token` argument is no longer required when creating the Api
  client. Without a token clients can still use the `content.stream()`
  and `content.search()` methods to access image metadata, but nothing
  else.

## [2.3.1] - 2020-10-16
### Changed
- Increased the default timeout for ContentStream.

## [2.3.0] - 2020-10-13
### Added

- [TTNinjs 1.3](https://tt.se/spec/ttninjs/ttninjs-schema_1.3.json) support

## [2.2.0] - 2020-10-07
### Added

- Support for updating existing notifications.
- Support for the `layout` parameter for `content.search()` and
  `content.stream()` endpoints.

## [2.1.0] - 2020-06-16
### Added
- Added an HTTP timeout parameter for the `Api` constructor. All API calls will
  use this timeout, except for the `content.stream()` call, which will use a
  value based on the `wait` parameter.
- Added support for search facets.
### Changed
- The `collDate` parameter is now camelCased.

## [2.0.1] - 2019-12-16
### Added
- We now export the ApiError class
### Changed
- Bug fix: the `content.stream()` call didn't respect the `last` parameter.

## [2.0.0] - 2019-12-05
### Added
- Support for associations
